import React from "react"

import get from "lodash.get"

import { Button, useTheme, getColorRange } from "@availabs/avl-components"

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
const InfoBox = ({ layer, MapActions }) => {
  const onClick = React.useCallback(e => {
    layer.updateState({ selection: [] });
    get(layer, ["onBoxSelect", "selectedValues"], [])
      .forEach(value => {
        MapActions.mapboxMap.setFeatureState(value, { select: false });
      });
  }, [layer, MapActions.mapboxMap]);
  return (
    <div className="pt-1 px-1">
      <Button block showConfirm
        onClick={ onClick }>
        clear
      </Button>
      <div className="mt-2">
        { get(layer, ["state", "selection"], [])
            .map(feature =>
              <div key={ feature.id }>
                { feature.properties.trip_id }
              </div>
            )
        }
      </div>
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

  legend = {
    Title: ({ layer }) => <div>{ layer.name } Legend</div>,
    domain: [0, 5, 10, 10, 20, 20, 40, 40, 40, 40, 40, 40, 80, 80, 80, 80, 160, 160, 160, 320],
    range: getColorRange(5, "BrBG"),
    types: ["quantile", "quantize"],
    type: "quantize",
    show: true,
    format: ",.1f"
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

  infoBoxes = [{
    Header: "Trip IDs",
    Component: InfoBox,
// The show key can now be a function. It can still be a boolean.
    show: layer => Boolean(get(layer, ["state", "selection", "length"], 0))
  }]

  onHover = {
    layers: ["trips"],
    property: "trip_mode",
// Supplying property is the same as the following filterFunc.
// The filterFunc allows for more advanced filters to be applied onHover.
    // filterFunc: (layerId, features, lngLat, point) => {
    //   return [
    //     "in",
    //     ["get", "trip_mode"],
    //     ["literal", features.map(f => f.properties.trip_mode)]
    //   ]
    // },
    callback: (layerId, features, lngLat, point) => {
      return features.map(f => [
        [f.properties.trip_id],
        ["Trip Mode", f.properties.trip_mode],
        ["Origin Purpose", f.properties.o_purpose],
        ["Destiniation Purpose", f.properties.d_purpose]
      ]);
    },
    HoverComp
  }

  onBoxSelect = {
    layers: ["trips"],
// This filter is optional. It might not be useful but was easy to implement...
    filter: ["==", ["get", "trip_mode"], "6"],
    className: "bg-blueGray-800 bg-opacity-50 border-blueGray-900 border-2"
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
        "line-color": [
          "case",
          ["all",
            ["boolean", ["feature-state", "select"], false],
            ["boolean", ["feature-state", "hover"], false]
          ],
          "#909",
          ["boolean", ["feature-state", "select"], false],
          "#009",
          ["boolean", ["feature-state", "hover"], false],
          "#900",
          "#090"
        ],
        "line-opacity": 0.5
      }
    }
  ]
}

const factory = (...args) => new TripsLayer(...args);

export default factory;
