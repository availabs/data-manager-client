import React, { Component } from 'react';
import CasesGraph from './components/CasesGraph'

class Test extends Component {
  render () {
    return (
    	<div className='mn-h-screen'>
        <div class=" mx-auto px-4 sm:px-6 md:px-8">
          <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        <div class="mx-auto px-4 sm:px-6 md:px-8">
        
          <div class="py-4">
            <CasesGraph />
          </div>
         
        </div>        
      </div>

    )
  }
}

export default
{
  path: '/',
  mainNav: true,
  name: 'Home',
  icon: 'HomeOutline',
  exact: true,
  layoutSettings: {
    fixed: true,
    // maxWidth: 'max-w-7xl',
    headerBar: true,
    theme: 'flat'
    
  },
  component: Test
}