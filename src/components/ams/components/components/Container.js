import React from "react"

export default ({ title, children }) =>
  <div className="flex justify-center p-40">
    <div className="m-auto inline-block rounded px-20 py-10 shadow-lg">
      { !title ? null :
        <div className="text-3xl font-bold">{ title }</div>
      }
      <div>
        { children }
      </div>
    </div>
  </div>
