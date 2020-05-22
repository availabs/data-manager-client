import React from "react"
//import SidebarItem from './SideBarItem'



const MobileMenu = ({open, toggle, menuItems=[], theme}) => (
  <div className={`${open ? 'sm:hidden' : 'hidden'}`}>
      <div className="pt-2 pb-3">
      <a href="#" className="block pl-3 pr-4 py-2 border-l-4 border-indigo-500 text-base font-medium text-indigo-700 bg-indigo-50 focus:outline-none focus:text-indigo-800 focus:bg-indigo-100 focus:border-indigo-700 transition duration-150 ease-in-out">Dashboard</a>
      <a href="#" className="mt-1 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out">Team</a>
      <a href="#" className="mt-1 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out">Projects</a>
      <a href="#" className="mt-1 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out">Calendar</a>
    </div>
    <div className="pt-4 pb-3 border-t border-gray-200">
      {/* bottom menu */}
      <div className="mt-3" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
        <a href="#" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:text-gray-800 focus:bg-gray-100 transition duration-150 ease-in-out" role="menuitem">Your Profile</a>
        <a href="#" className="mt-1 block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:text-gray-800 focus:bg-gray-100 transition duration-150 ease-in-out" role="menuitem">Settings</a>
        <a href="#" className="mt-1 block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:text-gray-800 focus:bg-gray-100 transition duration-150 ease-in-out" role="menuitem">Sign out</a>
      </div>
    </div>
  </div>
) 

const DesktopMenu = ({menuItems=[], open, toggle, fixed, theme}) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 h-16 ${theme.sidebarBg} ${fixed ? 'fixed top-0' : ''} ${theme.topMenuBorder}`}>
    <div className="flex justify-between h-16">
      <div className="flex">
        <div className="flex-shrink-0 flex items-center">
          Logo
        </div>
        <div className="hidden sm:-my-px sm:ml-6 sm:flex">
          <a href="#" className="inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium leading-5 text-gray-900 focus:outline-none focus:border-indigo-700 transition duration-150 ease-in-out">
            Dashboard
          </a>
          <a href="#" className="ml-8 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out">
            Team
          </a>
          <a href="#" className="ml-8 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out">
            Projects
          </a>
          <a href="#" className="ml-8 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out">
            Calendar
          </a>
        </div>
      </div>
      
      <div className="-mr-2 flex items-center sm:hidden">
        {/* Mobile menu button */}
        <button onClick={toggle} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
          {/* Menu open: "hidden", Menu closed: "block" */}
          <svg className={`${open ? 'hidden' : 'block'} h-6 w-6`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path strokelinecap="round" strokelinejoin="round" strokewidth="{2}" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {/* Menu open: "block", Menu closed: "hidden" */}
          <svg className={`${open ? 'block' : 'hidden'} h-6 w-6`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path strokelinecap="round" strokelinejoin="round" strokewidth="{2}" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
)



export default (props) => (
  <nav className={`${props.theme.menuBg} ${props.fixed ? 'fixed top-0 z-20 w-full' : ''} ${props.theme.sidebarBorder}`}>
    <DesktopMenu {...props} />
    <MobileMenu {...props} />
  </nav>
)
