import React, { Component } from 'react';


class Test extends Component {
  render () {
    return (
    	<div className='mn-h-screen'>
        <div className=" mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Test Page</h1>
        </div>
        <div className="mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <div className="border-4 border-dashed border-gray-200 rounded-lg">
              <pre className='text-xs'>
                {JSON.stringify(this.props, null, 4)}
              </pre>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default
{
  path: '/test',
  name: 'Test',
  mainNav: true,
  layoutSettings: {
    fixed: true,
    //maxWidth: 'max-w-7xl',
    headerBar: true,
    theme: 'light'

  },
  component: Test
}
