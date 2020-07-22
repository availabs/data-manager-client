import React from "react"
import doc from "./doc.type"
import { Link } from 'react-router-dom'
import * as d3timeFormat from "d3-time-format"

let dateFormat = d3timeFormat.timeFormat("%B %d, %Y");

const Card = ({id, Title='', Tags=[], Preview='', User='',Updated='', ReadTime=false, to='/admin/view/' }) => (
      <div className="flex flex-col  rounded-lg shadow-lg overflow-hidden ">
        <div className="flex-shrink-0 h-48  bg-blue-600">
          {/*<h3 className="mt-2 text-4xl  leading-7 font-semibold text-blue-100 p-8 uppercase ">
            {Title}
          </h3>*/} 
        </div>
        <div className="flex-1 bg-white p-6 flex flex-col justify-between">
          <div className="flex-1">
            {Tags ? 
            (<p className="text-sm leading-5 font-medium text-indigo-600">
              <div className="hover:underline cursor-pointer">
                {Tags.join(',')}
              </div>
            </p>) : ''}
            <Link to={`${to}${id}`} className="block">
              <h3 className="mt-2 text-xl  leading-7 font-semibold text-gray-900 uppercase ">
                {Title}
              </h3>
              <p className="mt-3 text-base leading-6 text-gray-500 h-32 overflow-hidden">
                {Preview}
              </p>
            </Link>
          </div>
          <div className="mt-6 flex items-center">
            <div className="flex-shrink-0">
              <div>
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt='test'
                />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm leading-5 font-medium text-gray-900">
                <div className="hover:underline">
                  {User}
                </div>
              </p>
              <div className="flex text-sm leading-5 text-gray-500">
                <time dateTime="2020-03-16">{Updated}</time>
                <span className="mx-1">·</span>
                {ReadTime ? <span>{ReadTime} min read</span> : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
)


const Content = ({dataItems}) =>
  <div className=''>
    <div className="relative pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl leading-9 tracking-tight font-extrabold text-gray-900 sm:text-4xl sm:leading-10">
            From the blog
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl leading-7 text-gray-500 sm:mt-4">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsa libero
            labore natus atque, ducimus sed.
          </p>
        </div>

        <div className="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
        { 
          dataItems.map(item => {
          
          const Words = item.data.body.blocks.reduce((a,c) => {  return a + +c.text.split(' ').length },0)
          const ReadTime = Math.max(1, Math.round(Words / 200))
          const Preview = item.data.body.blocks[0].text.split(' ').filter((d,i) => i < 30).join(' ')
        
          return <Card 
            Title={item.data.title} 
            Preview={Preview}
            Tags={['Blog']}
            User={item.data.userId}
            ReadTime={ReadTime}
            Updated={dateFormat(new Date(item.updated_at))}
            key={item.id}
            id={item.id}
          />
          })
        }
        </div>
        
      </div>
    </div>
  {/*
    <pre>
      Hello world
      {JSON.stringify(dataItems, null, 4)}
    </pre>
  */}
  </div>

export default {
  path: '/landing',
  exact: true,
  auth: false,
  mainNav: true,
  name: 'Landing',
  layoutSettings: {
    fixed: true,
    headerBar: false,
    theme: 'flat',
    maxWidth: ''
  },
  component: {
    type: "dms-manager", // top level component for managing data items
    wrappers: [
      "dms-provider",
      "dms-falcor",
    ],
    props: {
      format: doc,
      title: " ",
      className: 'h-full',
      noHeader: true
    },
    children: [
      Content
    ]
  }
}