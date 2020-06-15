import React from "react"

export default ({ active, children, ...props }) =>
  <button { ...props } onMouseDown={ e => e.preventDefault() }
    className={ `
      ${ active ? "bg-gray-300" : "bg-gray-100" }
      hover:bg-gray-300 editor-button
    ` }>
    { children }
  </button>
