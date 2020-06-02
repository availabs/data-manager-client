import React from "react"

import { Title } from "./parts"

export default ({ title = "", body = null }) =>
  <div>
    { title ? <Title>{ title }</Title> : null }
    { body }
  </div>
