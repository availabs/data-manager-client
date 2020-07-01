import React from "react"

import { useTheme } from "components/avl-components/wrappers/with-theme"
import { useDms } from "../contexts/dms-context"
import { useMessenger } from "../contexts/messenger-context"

import { DmsButton } from "./dms-button"

export default ({ title, showHome = true, dmsActions = [], ...props }) => {
  const { stack, top, item } = useDms(),
    { pageMessages, attributeMessages } = useMessenger();

  if (stack.length > 1) {
    dmsActions.unshift({
      action: "dms:back",
      showConfirm: Boolean(pageMessages.length)
    });
  }
  if ((stack.length > 1) && showHome) {
     dmsActions.unshift({
       action: "dms:home",
       showConfirm: Boolean(pageMessages.length)
     });
  }
  if (top.dmsAction === "list") {
    dmsActions.unshift({ action: "dms:create" });
  }
  const theme = useTheme();
  
  return (
    <div className={ `fixed pr-8 top-0 md:ml-${ theme.sidebarW } left-0 right-0 py-3 z-50 ${ theme.headerBg } ` }
      style={ { boxShadow: "0px 6px 3px -3px rgba(0, 0, 0, 0.25)" } }>
      <div className="absolute top-0 text-4xl font-bold w-full pointer-events-none ml-8">
        { title || `${ props.app } Manager` }
      </div>
      <div className="w-full flex flex-row justify-end">
        { !pageMessages.length ? null :
          <Warning warnings={ pageMessages }/>
        }
        { !attributeMessages.length ? null :
          <Warning warnings={ attributeMessages }/>
        }
        { dmsActions.map(a =>
            <DmsButton className="ml-2" key={ a.action || a } action={ a } item={ item }/>
          )
        }
      </div>
    </div>
  )
}

const Warning = ({ warnings }) => {
  const theme = useTheme();
  return (
    <div className={ `
      ${ theme.textDanger } hover:${ theme.textContrast } hover:${ theme.bgDanger }
      px-3 flex items-center rounded cursor-pointer ${ theme.transition }
      relative hoverable ml-2
    ` }>
      <span className="fas fa-lg fa-exclamation"/>
      <div className="show-on-hover show-on-bottom pt-1 bg-transparent absolute right-0 cursor-default">
        <div className={ `
          px-4 py-1 rounded ${ theme.accent2 } ${ theme.text }
        ` }>
          { warnings.map(msg =>
              <div key={ msg.id } className={ `my-1 whitespace-no-wrap rounded ${ theme.text }` }>
                { msg.msg }
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
