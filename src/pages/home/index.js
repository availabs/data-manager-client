import React from "react"

export default {
  path: "/",
  exact: true,
  auth: false,
  component: () => (
    <div className="text-3xl bold flex justify-center items-center h-full">HOME SWEET HOME</div>
  ),
  layoutSettings: {
    fixed: true,
    headerBar: true,
    theme: 'light',
    nav: "side"
  }
}
