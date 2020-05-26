import React, { Component } from 'react';
import 'styles/tailwind.css';
import * as themes from 'layouts/components/Themes'

import SideNav from 'layouts/components/Nav/Side'
import TopNav from 'layouts/components/Nav/Top'
import HeaderBar from 'layouts/components/HeaderBar'


class Layout extends Component {
  state = {
    menuOpen: false
  }
  static defaultProps = {
      fixed: false,
      maxWidth: '',
      headerBar: true,
      nav: 'side',
      theme: 'light'
  }

  toggleMenu = () => {
    this.setState({menuOpen: !this.state.menuOpen})
  } 

  render () {
   
    const theme = themes[this.props.theme]
    return (
      <div className={`${theme.bg}`}>
        {this.props.nav === 'top' ? (
          <div className={this.props.fixed ? `fixed left-0 top-0 w-full z-10` : ''}> 
            
              <TopNav 
                open={this.state.menuOpen} 
                toggle={this.toggleMenu}
                menuItems={this.props.menus}
                fixed={this.props.fixed}
                theme={theme}
              />
            
          </div>
          ) : ''}
        {this.props.headerBar ? (
          <div className={`${this.props.fixed ? `fixed left-0 top-0 w-full z-10 ${this.props.nav === 'top' ? 'mt-16' : '' }` : ''}`}> 
            <div className={`${this.props.maxWidth} mx-auto`} >
              <HeaderBar 
                toggle={this.toggleMenu} 
                menu={this.props.headerMenu}
                fixed={this.props.fixed}
                theme={theme}
              />
            </div>
          </div>
        ) : '' } 
      	<div className={`mx-auto min-h-screen ${this.props.maxWidth} ${this.props.nav === 'top' && this.props.fixed ? 'mt-16' : ''}`} >
          <div className="flex">
          {this.props.nav === 'side' ? (
            <SideNav 
              open={this.state.menuOpen} 
              toggle={this.toggleMenu}
              menuItems={this.props.menus}
              fixed={this.props.fixed}
              theme={theme}
            />) :''}
            <div className="w-0 flex-1 ">
              <main className={`
                  flex-1 relative z-0 pt-2 pb-6 focus:outline-none
                  ${theme.contentBg}
                  ${this.props.headerBar ? 'mt-16' : ''} 
                  ${this.props.fixed && this.props.nav === 'side' ?  `md:ml-${theme.sidebarW}` : '' }`
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