import React from "react"

import DmsComponents from "./components"

import { AuthContext, ButtonContext } from "./contexts"
import { DmsButton, Title } from "./components/parts"

import { Header } from 'components/avl-components/components'

import get from "lodash.get"

import { checkAuth } from "./utils"

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

  constructor(...args) {
    super(...args);
    this.state = {
      stack: [{
        dmsAction: this.props.defaultAction,
        id: null,
        props: null
      }],
      initialized: false
    }
    this.interact = this.interact.bind(this);
  }

  componentDidMount() {
    const { action, id } = get(this.props, "params", {});
    if (action) {
      this.pushAction(action, id, null);
    }
  }

  interact(dmsAction, id, props) {
    if (/^(dms:)*back$/.test(dmsAction)) {
      this.popAction();
    }
    else if (/^(dms:)*home$/.test(dmsAction)) {
      this.clearStack();
    }
    else if (/^api:/.test(dmsAction)) {
      return this.props.apiInteract(dmsAction, id, props);
    }
    else {
      this.pushAction(dmsAction, id, props);
    }
  }

  compareActions(action1 = "", action2 = "") {
    return action1.replace("dms:", "") === action2.replace("dms:", "");
  }

  pushAction(dmsAction, id, props) {
    const stack = [...this.state.stack];
    stack.push({ dmsAction, id, props });
    this.setState({ stack });
  }
  popAction() {
    if (this.state.stack.length > 1) {
      const stack = [...this.state.stack];
      stack.pop();
      this.setState({ stack });
    }
  }
  clearStack() {
    const stack = [...this.state.stack].slice(0, 1);
    this.setState({ stack });
  }
  getTop() {
    const { stack } = this.state;
    return stack[stack.length - 1];
  }

  renderChildren(dmsAction, id, props) {
    if (!this.props.format) return <NoFormat />;

    const child = React.Children.toArray(this.props.children)
      .reduce((a, c) => this.compareActions(get(c, ["props", "dmsAction"], ""), dmsAction) ? c : a, null);

    if (child === null) return null;

    if (/^(dms:)*list$/.test(dmsAction)) {
      return React.cloneElement(child,
        { ...child.props,
          ...props,
          app: this.props.app,
          type: this.props.type,
          format: this.props.format,
          dataItems: this.props.dataItems,
          [this.props.type]: null
        }
      );
    }

    const item = this.props.dataItems.reduce((a, c) => c.id === id ? c : a, null);

    const hasAuth = checkAuth(this.props.authRules, dmsAction, { user: this.props.user }, item);
    if (!hasAuth) return <NoAuth />;

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
    const { dmsAction, id, props } = this.getTop(),
      { authRules, user, buttonColors, showHome } = this.props;

    console.log('dms manager theme', this.props)
    if(!this.props.format) {
      return <div> No Format </div>
    }

    let actions = []
    if(this.state.stack.length > 1) {
      // this should always be the same as home ??? 
      // actions.push(<DmsButton action="dms:back"/>)
    }                          
    if ((this.state.stack.length > 1) && showHome ){
       //actions.push({href:`/${this.props.location.pathname.split('/')[1]}`, name:'Home', type: 'button'})   
       actions.push(<DmsButton action="dms:home"/>)     
    }
    if( dmsAction === "list"){
      //actions.push({href:`${this.props.location.pathname}/create`, name:'Create', type: 'buttonPrimary'})
      actions.push(<DmsButton action="dms:create"/>)
    }     
                  
    return (
        <AuthContext.Provider value={ { authRules, user } }>
          <ButtonContext.Provider value={ { buttonColors, interact: this.interact } }>
            <Header title= { this.props.title || `${ this.props.app } Manager` } theme={this.props.theme} actions={actions}/>
            <main>{ this.renderChildren(dmsAction, id, props) }</main>
          </ButtonContext.Provider>
        </AuthContext.Provider>
    )
  }
}

const NoFormat = () => <div large className="p-5">No format supplied!!!</div>;
const NoAuth = () => <div large className="p-5">You do not have authorization for this action!!!</div>;

export default {
  ...DmsComponents,
  "dms-manager": DmsManager
}
