import React from "react"

import { AuthContext } from "./auth-context"

import get from "lodash.get"

export const Title = ({ children, ...props }) =>
  <div className={ `
      font-bold mb-1
      ${ props.large ? "text-3xl" : "text-xl" }
      ${ get(props, "className", "") }
    ` }>
    { children }
  </div>

export const Button = ({ children, color = "blue", large, small, block, ...props }) =>
  <button { ...props }
    className={
      ` focus:outline-none
        bg-${ color }-500
        justify-center
        items-center
        inline-flex
        text-white
        font-bold
        ${ large ? "py-2 px-6" : small ? "py-0 px-2" : "py-1 px-4" }
        ${ large ? "text-lg" : small ? "text-sm" : "" }
        ${ large ? "rounded-lg" : "rounded" }
        ${ block ? "w-full" : "" }
        ${ props.disabled ?
          "cursor-not-allowed opacity-50" :
          `hover:bg-${ color }-700`
        }
        ${ get(props, "className", "") }
      `
    }>
    { children }
  </button>

const checkAuth = (rule, props, item) => {
  if (!rule) return true;

  let { args, comparator } = rule;

  args = args.map(a => {
    if (typeof a === "string") {
      if (a.includes("props:")) {
        return get(props, a.slice(6));
      }
      if (a.includes("item:")) {
        return get(item, a.slice(5));
      }
    }
    return a;
  })
  return comparator(...args);
}

const processAction = arg => {
  let response = {
    action: "unknown",
    label: "unknown",
    seedProps: () => null
  };
  if (typeof arg === "string") {
    response.action = arg;
  }
  else {
    response = { ...response, ...arg };
  }
  response.action = response.action.replace(/^(dms):(.+)$/, (m, c1, c2) => c2);
  response.label = response.action.replace(/^(dms|api):(.+)$/, (m, c1, c2) => c2);
  return response;
}

export const ButtonColorContext = React.createContext({});

const BUTTON_COLORS = {
  create: "green",
  back: "teal",
  edit: "purple",
  delete: "red"
}

const getButtonColor = (label, colors) =>
  get(colors, label, get(BUTTON_COLORS, label))

export const ActionButton = ({ action, label, ...props }) =>
  <ButtonColorContext.Consumer>
    { buttonColors =>
      <Button { ...props } color={ getButtonColor(label, buttonColors) }>
        { label || action }
      </Button>
    }
  </ButtonColorContext.Consumer>

export const DmsButton = ({ action: arg, item, props = {}, ...rest }) =>
  <AuthContext.Consumer>
    {
      ({ authRules, user, interact }) => {
        const { action, seedProps, label } = processAction(arg),
          hasAuth = checkAuth(authRules[action], { user, ...props }, item);
        return (
          <ActionButton { ...rest } disabled={ !hasAuth }
            action={ action } label={ label }
            onClick={ !hasAuth ? null :
              e => (e.stopPropagation(),
                interact(action, get(item, "id"), seedProps({ user, ...props }))
              )
            }/>
        )
      }
    }
  </AuthContext.Consumer>
