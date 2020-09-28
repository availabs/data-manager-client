import React from "react"

import AmsComps from "./components"

import amsManager  from "./wrappers/ams-manager"

const AmsManager = ({ children }) =>
  <div>{ children }</div>

export default {
  ...AmsComps,
  "ams-manager": amsManager(AmsManager)
};
