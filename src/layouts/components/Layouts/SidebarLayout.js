import React, { Component } from 'react';
import 'styles/tailwind.css';
import * as themes from 'layouts/components/Themes'

import Sidebar from 'layouts/components/Sidebar'
import HeaderBar from 'layouts/components/HeaderBar'


class Layout extends Component {
  state = {
    sidebarOpen: false
  }
  static defaultProps = {
      fixed: false,
      maxWidth: '',
      headerBar: true,
      theme: 'light'
  }

  toggleSidebar = () => {
    this.setState({sidebarOpen: !this.state.sidebarOpen})
  } 

  render () {
   
    const theme = themes[this.props.theme] || themes['light']
    return (
      <div className={`${theme.bg}`}>
        {this.props.headerBar ? (
          <div className={this.props.fixed ? `fixed left-0 top-0 w-full z-10` : ''}> 
            <div className={`${this.props.maxWidth} mx-auto`} >
              <HeaderBar 
                toggle={this.toggleSidebar} 
                menu={this.props.headerMenu}
                fixed={this.props.fixed}
                theme={theme}
              />
            </div>
          </div>
        ) : '' } 
      	<div className={`mx-auto min-h-screen ${this.props.maxWidth} ${this.props.fixed ? '' : '-m-16'}`} >
          <div className="flex">
            <Sidebar 
              open={this.state.sidebarOpen} 
              toggle={this.toggleSidebar}
              menuItems={this.props.menus}
              fixed={this.props.fixed}
              theme={theme}
            />
            <div className="w-0 flex-1 ">
              <main className={`
                  flex-1 relative z-0 pt-2 pb-6 focus:outline-none md:py-6
                  ${theme.contentBg}
                  ${this.props.headerBar ? 'mt-16' : ''} 
                  ${this.props.fixed ?  `md:ml-${theme.sidebarW}` : '' }`
                }
              >
                <div >
                  {this.props.children}
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Layout