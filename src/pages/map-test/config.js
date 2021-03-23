import MapTest from "./components/map-test"

import { MAPBOX_TOKEN } from "config.private"

const Config = {
  type: MapTest,
  props: {
    accessToken: MAPBOX_TOKEN
  }
}
export default Config;
