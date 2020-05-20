import React from "react";
import { Link } from 'react-router-dom'
import 'styles/tailwind.css';
 


const HeaderMenu = ({menu}) => {
  const {title, items=[]}  = menu
  return (
    <div className="sm:ml-56 sm:flex">
      {title ? 
        (<span href="#" className={`
            hidden sm:ml-56 mr-2 md:mr-8 inline-flex items-center px-1 pt-1 
            text-3xl font-medium leading-5 text-gray-800
          `}>
          Campaign
        </span>) : ''
      }
      {items.map((item, i)=> (
        <Link key={i} to={item.to} 
            className={`
              mr-2 md:mr-8  inline-flex items-center px-1 pt-1 
              border-b-2 
              ${item.active ? 
                `border-indigo-500 focus:border-indigo-700 text-gray-900` :
                `border-transparent hover:text-gray-700 hover:border-gray-300 
                 text-gray-500 focus:text-gray-700 focus:border-gray-300`  
              }
              text-sm font-medium leading-5  
              focus:outline-none  
              transition duration-150 ease-in-out
              `}
          >
          {item.name}
        </Link>)
      )}
    </div>

  )
  
}

export default HeaderMenu