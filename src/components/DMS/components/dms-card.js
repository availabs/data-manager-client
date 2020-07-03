import React from "react"

import { Title } from "./parts"
import { useTheme } from "components/avl-components/wrappers/with-theme"

export default ({ title, body, footer }) => {
  const theme = useTheme();
  return (
    <div>
      { title ? <Title>{ title }</Title> : null }
      <div className={ `${ theme.contentBg } rounded px-8 py-4 mb-3 shadow` }>
        { body }
      </div>
      <div className={ `rounded py-2 px-4 ${ theme.contentBg } shadow` }>{ footer }</div>
    </div>
  )
}
