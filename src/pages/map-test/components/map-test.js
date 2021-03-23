import React from "react"

import { AvlMap } from "components/avl-map/src"

import tripsFactory from "./trips.layer"

const MapTest = ({ accessToken }) => {
  const tripsLayer = React.useMemo(() => {
    return tripsFactory();
  }, [])
  return (
    <div className="w-full h-full relative">
      <AvlMap accessToken={ accessToken }
        layers={ [tripsLayer] }/>
    </div>
  )
}
export default MapTest;
