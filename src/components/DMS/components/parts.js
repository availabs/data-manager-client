import React from "react"

import { AuthContext } from "./auth-context"

import get from "lodash.get"

export const Title = ({ children, ...props }) =>
  <div className={ `
    font-bold mb-1
    ${ props.large ? "text-3xl" : "text-xl" }` }>
    { children }
  </div>

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

export const Button = ({ children, ...props }) =>
  <button { ...props } disabled={ props.disabled }
    className={
      `inline-flex
        bg-blue-500
        text-white
        font-bold
        py-1 px-4
        rounded
        ${ props.disabled ? "cursor-not-allowed opacity-50" : "hover:bg-blue-700" }`
    }>
    { children }
  </button>

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

export const DmsButton = ({ action: arg, item = {}, interact, ...props }) =>
  <AuthContext.Consumer>
    {
      ({ authRules, user }) => {
        props = { user, ...props };
        const { action, seedProps } = processAction(arg),
          hasAuth = checkAuth(authRules[action], props, item);
        return (
          <Button { ...props } disabled={ !hasAuth }
            onClick={ e => interact(action, item.id, seedProps(props)) }>
            { action }
          </Button>
        )
      }
    }
  </AuthContext.Consumer>
