import React from "react"

export default {
  path: "/",
  exact: true,
  component: () => <div className="text-3xl bold flex justify-center my-20">HOME SWEET HOME</div>,
  layoutSettings: {
    fixed: true,
    headerBar: true,
    theme: 'light'
  }
}
