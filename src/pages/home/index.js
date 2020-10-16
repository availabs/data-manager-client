import React from "react"

export default {
  path: "/",
  exact: true,
  auth: false,
  component: () => (
    <div className="text-3xl bold flex justify-center mt-32 mb-20">HOME SWEET HOME</div>
  ),
  layoutSettings: {
    fixed: true,
    headerBar: true,
    theme: 'light'
  }
}
