import React from "react"

import { Title } from "../components/parts"

export default ({ title, chapter, body, footer, ...props }) =>
  <div className="max-w-md">
    <Title>{ title }</Title>
    <div>{ body }</div>
    <div>{ footer }</div>
  </div>
