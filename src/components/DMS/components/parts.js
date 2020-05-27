import React from "react"

export const Title = ({ children, ...props }) =>
  <div className={ `
    font-bold mb-1
    ${ props.large ? "text-3xl" : "text-xl" }` }>
    { children }
  </div>

export const Button = ({ children, ...props }) =>
  <button { ...props } disabled={ Boolean(props.disabled) }
    className={
      `inline-flex
        bg-blue-500
        text-white
        font-bold
        py-1 px-4
        rounded
        ${ props.disabled ? "cursor-not-allowed opacity-50" : "hover:bg-blue-700" }`
    }>
    { children }
  </button>
