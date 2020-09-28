import React from "react"

import Header from "components/avl-components/components/Header/HeaderComponent"

export default ({ title, shadowed = true , children }) =>
  <Header title={ title } shadowed={ shadowed }/>
