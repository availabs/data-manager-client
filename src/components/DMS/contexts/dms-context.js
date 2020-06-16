import React from "react"

export default React.createContext({
  app: "unknown",
  type: "unknown",
  dataItems: [],
  item: null,
  dmsAction: "unknown",
  interact: () => {}
});
