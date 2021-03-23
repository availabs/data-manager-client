const parser = require("csv-parser")

const fs = require("fs")
const { pipeline, Readable } = require("stream");

const { rollup } = require("d3-array")

const roller = group =>
  group.reduce((a, c) => {
    a.coordinates.push([c.lon, c.lat])
    return a;
  }, { type: "LineString", coordinates: [] })

const parseFiles = async () => {

  const trips = [],
    locations = [];

  await new Promise((resolve, reject) => {
    pipeline(
      fs.createReadStream("./location.csv"),
      parser(),
      err => {
        if (err) { reject(err); }
        else { resolve() }
      }
    ).on("data", data => locations.push(data))
  })

  const geometries = rollup(locations, roller, d => d.trip_id)

  await new Promise((resolve, reject) => {
    pipeline(
      fs.createReadStream("./trip.csv"),
      parser(),
      err => {
        if (err) { reject(err); }
        else { resolve() }
      }
    ).on("data", data => trips.push(data))
  })

  const features = trips.map(trip => ({
    type: "Feature",
    id: trip.trip_id,
    properties: {
      trip_id: trip.trip_id,
      trip_mode: trip.mode_1,
      o_purpose: trip.o_purpose,
      d_purpose: trip.d_purpose
    },
    geometry: geometries.get(trip.trip_id)
  }))

  await new Promise((resolve, reject) => {
    pipeline(
      Readable.from(JSON.stringify({ type: "FeatureCollection", features })),
      fs.createWriteStream("./trips.json"),
      err => {
        if (err) { reject(err); }
        else { resolve() }
      }
    )
  })
}

parseFiles();
