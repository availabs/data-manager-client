import React from "react"
import 'styles/tailwind.css';
const noop = ()=> {}

export default  ({children, open, toggle=noop}) => (
  <div style={{display: open ? 'flex' : 'none'}} className="fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
  <div  className="fixed inset-0 transition-opacity">
    <div className="absolute inset-0 bg-gray-500 opacity-75" />
  </div>
  <div style={{display: open ? 'block' : 'none'}} className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-5xl sm:w-full" style={{maxHeight: '95vh', overflow: 'auto'}}>
    <div className="bg-white">
      {children}
    </div>
  </div>
</div>
)


