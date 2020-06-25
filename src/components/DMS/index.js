import React from "react"

import DmsComponents from "./components"

import { DmsButton } from "./components/dms-button"

import { Header } from 'components/avl-components/components'

import dmsManager from "./wrappers/dms-manager"

import "./styles.css"

const DmsManager = ({ showHome = true, stack, top = {}, ...props }) => {
  if (!props.format) {
    return <NoFormat />
  }

  const { dmsAction } = top, actions = [];

  if ((stack.length > 1) && showHome) {
     actions.push({
       comp: DmsButton,
       action: "dms:home"
     })
  }
  if (stack.length > 1) {
    actions.push({
      comp: DmsButton,
      action: "dms:back"
    })
  }
  if (dmsAction === "list") {
    actions.push({
      comp: DmsButton,
      action: "dms:create"
    })
  }

  return (
    <div className={ props.className }>
      <Header title={ props.title || `${ props.app } Manager` } actions={ actions }/>
      <main>{ props.children }</main>
    </div>
  )
}
const NoFormat = () => <div large className="p-5">No format supplied!!!</div>;
// const NoAuth = () => <div large className="p-5">You do not have authorization for this action!!!</div>;

export default {
  ...DmsComponents,
  "dms-manager": dmsManager(DmsManager)
}
