import React from 'react'
import Containers from  'layouts/components/Containers'
import ComponentFactory from 'layouts/ComponentFactory'

export default ({ Component, ...rest }) =>
  (typeof Component === "function") ?
    <Component { ...rest }/>
  :
    <ComponentFactory config={ Component } { ...rest }/>
