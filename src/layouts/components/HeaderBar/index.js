import React, { useEffect, useState, useRef } from "react";
import { Link } from 'react-router-dom'
import HeaderMenu from './HeaderMenu'


 
const HeaderBar = (props) => {
  const node = useRef();
  const [open, setOpen] = useState(false);

  const handleClick = e => {
    if (node.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setOpen(false);
  };

  const toggleMenu = selectedValue => {
    setOpen(!open);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <div className={`relative z-0 flex-shrink-0 flex h-16 ${props.theme.headerBg} ${props.theme.headerShadow}`}>
      <button onClick={props.toggle} className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-600 md:hidden">
        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>
      <div className="flex-1 px-3 flex justify-between">
        <div className="flex-1 flex">
             {props.menu ? <HeaderMenu menu={props.menu} /> : '' }
        </div>
       
        <div className="ml-4 flex items-center md:ml-6">
          <button className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:shadow-outline focus:text-gray-500">
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div  className="ml-3 relative" x-data="{ open: false }">
            <div>
              <button onClick={toggleMenu} className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:shadow-outline">
                <span className="inline-block h-6 w-6 rounded-full overflow-hidden bg-gray-100">
                  <svg className="h-full w-full text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              </button>
            </div>
            <div style={{display: open ? 'block' : 'none'}} ref={node} x-transition_enter="transition ease-out duration-100" x-transition_enter-start="transform opacity-0 scale-95" x-transition_enter-end="transform opacity-100 scale-100" x-transition_leave="transition ease-in duration-75" x-transition_leave-start="transform opacity-100 scale-100" x-transition_leave-end="transform opacity-0 scale-95" className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg">
              <div className="py-1 rounded-md bg-white shadow-xs">
                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150">Your Profile</button>
                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150">Settings</button>
                <Link onClick={toggleMenu} to={'/logout'} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150">Sign out</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  
}

export default HeaderBar