import React from "react"

export default ({ active, disabled, children, ...props }) =>
  <button { ...props } disabled={ disabled }
    onMouseDown={ e => e.preventDefault() }
    className={ `p-1 first:rounded-l last:rounded-r
      ${ active ? "bg-gray-300" : "bg-gray-100" }
      ${ disabled ? "bg-red-300 cursor-not-allowed" : "hover:bg-gray-300 cursor-pointer" }
    ` }>
    { children }
  </button>
