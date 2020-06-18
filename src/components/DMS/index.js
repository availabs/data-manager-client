import React from "react"

import DmsComponents from "./components"

import { ButtonContext } from "./contexts"
import { DmsButton } from "./components/parts"

import { Header } from 'components/avl-components/components'

import get from "lodash.get"

import { checkAuth, compareActions } from "./utils"

import "./styles.css"

class DmsManager extends React.Component {
  static defaultProps = {
    showHome: true,
    defaultAction: "list",
    dataItems: [],
    app: "app-name",
    type: "format-type",
    format: null,
    className: "border-2 p-5 rounded-lg",
    authRules: {},
    buttonColors: {},
    apiInteract: () => Promise.resolve()
  }

  renderChildren(dmsAction, item, props) {
    if (!this.props.format) return <NoFormat />;

    const hasAuth = checkAuth(this.props.authRules, dmsAction, { user: this.props.user }, item);
    if (!hasAuth) return <NoAuth />;

    const child = React.Children.toArray(this.props.children)
      .reduce((a, c) => compareActions(get(c, ["props", "dmsAction"], ""), dmsAction) ? c : a, null);

    if (child === null) return null;

    if (/^(dms:)*list$/.test(dmsAction)) {
      return React.cloneElement(child,
        { ...props,
          app: this.props.app,
          type: this.props.type,
          format: this.props.format,
          dataItems: this.props.dataItems,
          makeInteraction: this.props.makeInteraction,
          makeOnClick: this.props.makeOnClick,
          interact: this.props.interact,
          [this.props.type]: null
        }
      );
    }

    return React.cloneElement(child,
      { ...child.props,
        ...props,
        app: this.props.app,
        type: this.props.type,
        format: this.props.format,
        dataItems: this.props.dataItems,
        [this.props.type]: item
      }
    );
  }

  render() {
    const { buttonColors, showHome, stack, top, item } = this.props,
      { dmsAction, props } = top;

    if (!this.props.format) {
      return <div> No Format </div>
    }


    const actions = [];
    if (stack.length > 1) {
      // actions.push(<DmsButton action="dms:back" key="back"/>)
      actions.push({
        comp: DmsButton,
        action: "dms:back",
        // ...this.props.makeInteraction("dms:back"),
        // children: "back"
      })
    }
    if ((stack.length > 1) && showHome) {
       // actions.push(<DmsButton action="dms:home" key="home"/>)
       actions.push({
         comp: DmsButton,
         action: "dms:home",
         // ...this.props.makeInteraction("dms:home"),
         // children: "home"
       })
    }
    if (dmsAction === "list") {
      // actions.push(<DmsButton action="dms:create" key="create"/>)
      actions.push({
        comp: DmsButton,
        action: "dms:create",
        // ...this.props.makeInteraction("dms:create"),
        // children: "create"
      })
    }

    return (
      <ButtonContext.Provider value={ { buttonColors } }>
        <Header title= { this.props.title || `${ this.props.app } Manager` } actions={ actions }/>
        <main>{ this.renderChildren(dmsAction, item, props) }</main>
      </ButtonContext.Provider>
    )
  }
}

const NoFormat = () => <div large className="p-5">No format supplied!!!</div>;
const NoAuth = () => <div large className="p-5">You do not have authorization for this action!!!</div>;

export default {
  ...DmsComponents,
  "dms-manager": DmsManager
}
