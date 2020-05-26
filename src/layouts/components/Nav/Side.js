import React from "react"
import SidebarItem from './Item'
import { withRouter } from "react-router";


const MobileSidebar = ({open, toggle, menuItems=[], theme, location}) => (
	<div style={{display: open ? 'block' : 'none' }} className="md:hidden">
	    <div className="fixed inset-0 z-20 transition-opacity ease-linear duration-300">
	      <div className="absolute inset-0 bg-gray-600 opacity-75" />
	    </div>
	    <div  className="fixed inset-0 flex z-40">
	      <div  className="flex-1 flex flex-col max-w-xs w-full transform ease-in-out duration-300">
	        <div className="absolute top-0 right-0 -mr-14 p-1">
	          <button onClick={toggle} className="flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:bg-gray-600">
	            <svg className="h-6 w-6 text-gray-900" stroke="currentColor" fill="none" viewBox="0 0 24 24">
	              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
	            </svg>
	          </button>
	        </div>
	        <div className={`flex-1 h-0 pt-2 pb-4 overflow-y-auto ${theme.menuBg}`}>
	          <div className='px-6 pt-4 pb-8 logo-text gray-900' >Logo{/* Logo Goes Here */}</div>
	          <nav className="">
	            {menuItems.map((page,i) => {
            		return (
            			<SidebarItem key={i} to={page.path} icon={page.icon} theme={theme} active={page.path === location.pathname}>
        					{page.name}
      					</SidebarItem>
            		)
           		})}
	          </nav>
	        </div>
	       
	      </div>
	      <div className="flex-shrink-0 w-14">
	        {/* Force sidebar to shrink to fit close icon */}
	      </div>
	    </div>
  </div>
) 

const DesktopSidebar = ({menuItems=[], fixed, theme, location}) => (
	<div className={`hidden md:flex md:flex-shrink-0 z-20 ${theme.menuBg} ${fixed ? 'fixed top-0 h-screen' : ''} ${theme.sidebarBorder}`}>
      <div className={`flex flex-col w-${theme.sidebarW}`}>
        <div className={`w-${theme.sidebarW} flex-1 flex flex-col pb-4 overflow-y-auto`}>
          <div className='px-6 pt-4 pb-8 logo-text gray-900' >Logo{/* Logo Goes Here */}</div>
          <nav className="flex-1">
            {menuItems.map((page,i) => {
            	return (
            		<SidebarItem key={i} to={page.path} icon={page.icon} theme={theme} active={page.path === location.pathname}>
        				{page.name}
      				</SidebarItem>
            	)
           	})}
          </nav>
        </div>
       
      </div>
    </div>
)


const SideNav = (props) => (
	<React.Fragment>
		<MobileSidebar {...props} />
		<DesktopSidebar {...props} />
	</React.Fragment>
)


export default withRouter(SideNav)