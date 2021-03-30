import React from "react"

import { useTheme } from "@availabs/avl-components"

import { LayerContainer } from "components/avl-map/src"

import collection from "../utils/trips.json"

const HoverComp = ({ data, layer, pinned }) => {
  const theme = useTheme();
  return (
    <div className="grid grid-cols-1 gap-y-1">
      { data.map((tables, iii) => (
          <div key={ iii }
            className={ `${ theme.bg } rounded relative px-1` }>
            { tables.map((row, i) =>
                <div key={ i } className="flex">
                  { row.map((d, ii) =>
                      <div key={ ii }
                        className={ `
                          ${ ii === 0 ? "flex-1 font-bold" : "flex-0" }
                          ${ row.length > 1 && ii === 0 ? "mr-4" : "" }
                          ${ row.length === 1 && ii === 0 ? `border-b-2 text-lg ${ i > 0 ? "mt-1" : "" }` : "" }
                        ` }>
                        { d }
                      </div>
                    )
                  }
                </div>
              )
            }
          </div>
        ))
      }
    </div>
  )
}

class TripsLayer extends LayerContainer {
  name = "Trips Layer"

  init() {
    const oPurposes = new Set(),
      dPurposes = new Set(),
      tripModes = new Set();

    collection.features.forEach(f => {
      const { o_purpose, d_purpose, trip_mode } = f.properties;
      oPurposes.add(o_purpose);
      dPurposes.add(d_purpose);
      tripModes.add(trip_mode);
    })

    this.filters.tripModes.domain = [...tripModes].sort((a, b) => +a - +b);
    this.filters.oPurposes.domain = [...oPurposes].sort((a, b) => +a - +b);
    this.filters.dPurposes.domain = [...dPurposes].sort((a, b) => +a - +b);
  }

  render(map) {
    const tripModes = this.filters.tripModes.value,
      oPurposes = this.filters.oPurposes.value,
      dPurposes = this.filters.dPurposes.value;

    if (!tripModes.length && !oPurposes.length && !dPurposes.length) {
      map.setFilter("trips", ["boolean", true]);
      return;
    }

    const filter = ["any"]

    if (tripModes.length) {
      filter.push(["in", ["get", "trip_mode"], ["literal", tripModes]]);
    }
    if (oPurposes.length) {
      filter.push(["in", ["get", "o_purpose"], ["literal", oPurposes]]);
    }
    if (dPurposes.length) {
      filter.push(["in", ["get", "d_purpose"], ["literal", dPurposes]]);
    }

    map.setFilter("trips", filter);
  }

  filters = {
    tripModes: {
      name: "Trip Mode",
      domain: [],
      value: [],
      type: "select",
      multi: true
    },
    oPurposes: {
      name: "Origin Purpose",
      domain: [],
      value: [],
      type: "select",
      multi: true
    },
    dPurposes: {
      name: "Destination Purpose",
      domain: [],
      value: [],
      type: "select",
      multi: true
    }
  }

  toolbar = [
    "toggle-visibility",
    { tooltip: "Save as .png",
      icon: "fa-camera",
      action: ({ saveMapAsImage }) => saveMapAsImage("trips.png")
    }
  ]

  onHover = {
    layers: ["trips"],
    callback: (layerId, features, lngLat) => {
      return features.map(f => [
        [f.properties.trip_id],
        ["Trip Mode", f.properties.trip_mode],
        ["Origin Purpose", f.properties.o_purpose],
        ["Destiniation Purpose", f.properties.d_purpose]
      ]);
    },
    HoverComp
  }

  sources = [
    { id: "trips",
      source: {
        type: "geojson",
        data: collection
      }
    }
  ]
  layers = [
    { id: "trips",
      source: "trips",
      type: "line",
      paint: {
        "line-width": 4,
        "line-color": "#900",
        "line-opacity": 0.5
      }
    }
  ]
}

const factory = (...args) => new TripsLayer(...args);

export default factory;
