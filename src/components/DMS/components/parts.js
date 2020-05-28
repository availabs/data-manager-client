import React from "react"

import { AuthContext } from "./auth-context"

import get from "lodash.get"

export const Title = ({ children, ...props }) =>
  <div className={ `
    font-bold mb-1
    ${ props.large ? "text-3xl" : "text-xl" }` }>
    { children }
  </div>

export const Button = ({ children, ...props }) =>
  <button { ...props } disabled={ props.disabled }
    className={
      `inline-flex
        bg-${ props.color || "blue" }-500
        text-white
        font-bold
        py-1 px-4
        rounded
        ${ props.disabled ?
          "cursor-not-allowed opacity-50" :
          `hover:bg-${ props.color || "blue" }-700` }
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

const BUTTON_COLORS = {
  create: "green",
  back: "teal",
  edit: "purple",
  delete: "red"
}

export const ButtonColorContext = React.createContext({});

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

export const DmsButton = ({ action: arg, item, interact, ...props }) =>
  <AuthContext.Consumer>
    {
      ({ authRules, user }) => {
        props = { user, ...props };
        const { action, seedProps } = processAction(arg),
          hasAuth = checkAuth(authRules[action], props, item);
        return (
          <ActionButton { ...props } disabled={ !hasAuth } action={ action }
            onClick={ e => (e.stopPropagation(), interact(action, get(item, "id"), seedProps(props))) }/>
        )
      }
    }
  </AuthContext.Consumer>
