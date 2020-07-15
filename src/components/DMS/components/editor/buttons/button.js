import React from "react"

import { useTheme } from "components/avl-components/wrappers/with-theme"

export default ({ active, disabled, children, ...props }) => {
  const theme = useTheme();
  return (
    <button { ...props } disabled={ disabled } tabIndex={ -1 }
      onMouseDown={ e => e.preventDefault() }
      className={ `px-1 first:rounded-l last:rounded-r ${ theme.text } focus:border-none focus:outline-none
        ${ active ? `${ theme.menuBgActive } ${ theme.menuBgActiveHover }` : theme.menuBg }
        ${ disabled ? "bg-red-300 cursor-not-allowed" : `${ theme.menuBgHover } cursor-pointer` }
      ` }>
      { children }
    </button>
  )
}
