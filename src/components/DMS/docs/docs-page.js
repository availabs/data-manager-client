import React from "react"

import { Title } from "../components/parts"

export default ({ title, chapter, body, footer, ...props }) =>
  <div>
    <Title>{ title }</Title>
    <div>{ body }</div>
    <div>{ footer }</div>
  </div>
