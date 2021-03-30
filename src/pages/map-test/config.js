import { AvlMap } from "components/avl-map/src"

import { MAPBOX_TOKEN } from "config.private"

import tripsFactory from "./components/trips.layer"

const Config = {
  type: AvlMap,
  props: {
    accessToken: MAPBOX_TOKEN,
    layers: [tripsFactory()]
  }
}
export default Config;
