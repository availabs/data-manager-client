import React from "react"
import NavItem from './Item'
import { withRouter } from "react-router";
//import NavItem from './NavItem'



const MobileMenu = ({open, toggle, menuItems=[], theme, location}) => (
  <div className={`${open ? 'sm:hidden' : 'hidden'} ${theme.menuBg}`}>
      <div className="pt-2 pb-3">
        {menuItems.map((page,i) => {
                return (
                  <NavItem key={i} to={page.path} icon={page.icon} theme={theme} active={page.path === location.pathname}>
                  {page.name}
                </NavItem>
                )
          })}
    </div>
    <div className="pt-4 pb-3 border-t border-gray-200">
      {/* bottom menu */}
      <div className="mt-3" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
       {/* iterate over bottom nav items here */}
      </div>
    </div>
  </div>
)


const DesktopMenu = ({menuItems=[], open, toggle, fixed, theme, location}) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 h-16  ${theme.sidebarBg}  ${theme.topMenuBorder}`}>
    <div className="flex justify-between h-16">
      <div className="flex">
        <div className="flex-shrink-0 flex items-center">
          Logo
        </div>
        <div className="hidden sm:-my-px sm:ml-6 sm:flex">
          {menuItems.map((page,i) => {
            return (
              <NavItem key={i} to={page.path} icon={page.icon} theme={theme} active={page.path === location.pathname} type={'top'}>
                {page.name}
              </NavItem>
            )
          })}
        </div>
      </div>

      <div className="-mr-2 flex items-center sm:hidden">
        {/* Mobile menu button */}
        <button onClick={toggle} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
          {/* Menu open: "hidden", Menu closed: "block" */}
          <svg className={`${open ? 'hidden' : 'block'} h-6 w-6`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="{2}" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {/* Menu open: "block", Menu closed: "hidden" */}
          <svg className={`${open ? 'block' : 'hidden'} h-6 w-6`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="{2}" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
)



const TopMenu =  (props) => (
  <nav className={`${props.theme.menuBg} h-16  ${props.theme.sidebarBorder}`}>
    <DesktopMenu {...props} />
    <MobileMenu {...props} />
  </nav>
)


export default withRouter(TopMenu)
