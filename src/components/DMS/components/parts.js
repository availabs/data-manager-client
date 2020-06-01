import React from "react"

import { AuthContext } from "./auth-context"

import get from "lodash.get"

export const Title = ({ children, ...props }) =>
  <div className={ `
    font-bold mb-1
    ${ props.large ? "text-3xl" : "text-xl" }` }>
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
    seedProps: () => ({})
  };
  if (typeof arg === "string") {
    response.action = arg.replace(/^action:(.+)$/, (m, p) => p);
  }
  else {
    response = { ...response, ...arg };
  }
  return response;
}

export const ButtonColorContext = React.createContext({});

const BUTTON_COLORS = {
  create: "green",
  back: "teal",
  edit: "purple",
  delete: "red"
}

const getButtonColor = (action, colors) =>
  get(colors, action, get(BUTTON_COLORS, action))

export const ActionButton = ({ action, ...props }) =>
  <ButtonColorContext.Consumer>
    { buttonColors =>
      <Button { ...props } color={ getButtonColor(action, buttonColors) }>
        { action }
      </Button>
    }
  </ButtonColorContext.Consumer>

export const DmsButton = ({ action: arg, item, ...props }) =>
  <AuthContext.Consumer>
    {
      ({ authRules, user, interact }) => {
        const { action, seedProps } = processAction(arg),
          hasAuth = checkAuth(authRules[action], { user, ...props }, item);
        return (
          <ActionButton { ...props } disabled={ !hasAuth } action={ action }
            onClick={ !hasAuth ? null :
              e => (e.stopPropagation(),
                interact(action, get(item, "id"), seedProps({ user, ...props }))
              )
            }/>
        )
      }
    }
  </AuthContext.Consumer>
