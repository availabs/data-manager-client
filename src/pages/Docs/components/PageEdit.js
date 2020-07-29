import React, { useState, useEffect }  from "react"
import { useTheme } from "components/avl-components/wrappers/with-theme"

import { List, ListItemAction, Input } from 'components/avl-components/components'
import { Link } from 'react-router-dom'

import { DmsButton } from "components/DMS/components/dms-button"



export const Create = ({ createState, setValues, item, ...props }) => {
  const theme = useTheme();
  console.log('Page Edit', createState)
  let Title = createState.sections[0].attributes[4]
  let Content = createState.sections[0].attributes[5]
  // let UserID = createState.sections[0].attributes[2]

  return (
    <div className='max-w-2xl mx-auto'>
      <form onSubmit={ e => e.preventDefault() }>
        <div className="w-full flex flex-col justify-centerhasValue h-min-screen">
          <div
            className={`text-3xl text-3xl font-bold leading-7`}>
            <Title.Input
              className={`p-4 border-none active:border-none focus:outline-none custom-bg ${theme.text}`}
              autoFocus={ true }
              value={ Title.value }
              placeholder={'Untilted'}
              onChange={ Title.onChange }
            />
          </div>
          {/*<div
            className={`hidden`}>
            <div>{UserID.name} | {UserID.key} | {UserID.value}</div>
            <UserID.Input
              className={`border-none active:border-none focus:outline-none custom-bg h-full ${theme.text}`}
              value={ UserID.value }

            />
          </div>*/}
          <div
            className={`p-2 font-thin overflow-hidden`}>
            <Content.Input
              className={`p-4 border-none active:border-none focus:outline-none custom-bg h-full ${theme.text}`}
              value={ Content.value }
              onChange={ Content.onChange }
            />
          </div>

        </div>
        <div className="mt-2 mb-4 max-w-2xl">
          <DmsButton className="w-1/2" large  type="submit"
            action={ createState.dmsAction } item={ item } props={ props }/>
        </div>
      </form>
    </div>
  )
}

export default Create