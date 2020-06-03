import React from "react"

import { Link } from "react-router-dom"
import { useLocation, useHistory } from "react-router"

import { AuthContext, checkAuth } from "./auth-context"

import get from "lodash.get"

export const Title = ({ children, ...props }) =>
  <div className={ `
      font-bold mb-1
      ${ props.large ? "text-3xl" : "text-xl" }
      ${ get(props, "className", "") }
    ` }>
    { children }
  </div>

const getButtonClassName = ({ color, large, small, block, className, disabled }) =>
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
    ${ disabled ?
      "cursor-not-allowed opacity-50" :
      `hover:bg-${ color }-700`
    }
    ${ className }
  `

export const Button = ({ children, large, small, block, color = "blue", className = "", disabled = false, ...props }) =>
  <button { ...props }
    className={ getButtonClassName({ color, large, small, block, className, disabled })}>
    { children }
  </button>

const LinkButton = ({ children, href, large, small, block, color = "blue", className = "", disabled = false, ...props }) =>
  <Link { ...props }
    className={ getButtonClassName({ color, large, small, block, className, disabled })}>
    { children }
  </Link>

const processAction = arg => {
  let response = {
    action: "unknown",
    seedProps: () => null,
    baseAction: "unknown"
  };
  if (typeof arg === "string") {
    response.action = arg;
  }
  else {
    response = { ...response, ...arg };
  }
  response.baseAction = response.action.replace(/^(dms|api):(.+)$/, (m, c1, c2) => c2);
  return response;
}
const getLabel = action =>
  action.replace(/^(dms|api):(.+)$/, (m, c1, c2) => c2);

export const ButtonColorContext = React.createContext({});

const BUTTON_COLORS = {
  create: "green",
  back: "teal",
  edit: "purple",
  delete: "red"
}

const getButtonColor = (label, colors) =>
  get(colors, label, get(BUTTON_COLORS, label))

export const ActionButton = ({ action, ...props }) =>
  <ButtonColorContext.Consumer>
    { buttonColors =>
      <Button { ...props } color={ getButtonColor(getLabel(action), buttonColors) }>
        { getLabel(action) }
      </Button>
    }
  </ButtonColorContext.Consumer>

export const ActionLink = ({ action, ...props }) =>
  <ButtonColorContext.Consumer>
    { buttonColors =>
      <LinkButton { ...props } color={ getButtonColor(getLabel(action), buttonColors) }>
        { getLabel(action) }
      </LinkButton>
    }
  </ButtonColorContext.Consumer>

export const DmsButton = ({ action: arg, item, props = {}, ...rest }) => {
  const { pathname, state } = useLocation(),
    { goBack } = useHistory();
  return (
    <AuthContext.Consumer>
      { ({ authRules, user, interact, useRouter, basePath }) => {
          const { action, seedProps, baseAction } = processAction(arg),
            hasAuth = checkAuth(authRules[baseAction], { user, ...props }, item),
            id = get(item, "id", null);
          return useRouter && hasAuth ?
            ( action.includes("back") ?
                <ActionButton { ...rest } action={ action }
                  onClick={ e => (e.stopPropagation(), goBack()) }/>
              :
                <ActionLink { ...rest }  disabled={ !hasAuth } action={ action }
                  to={ {
                    pathname: id ? `${ basePath }/${ action }/${ id }` : `${ basePath }/${ action }`,
                    state: { from: pathname }
                  } }/>
            ) :
            (
              <ActionButton { ...rest } disabled={ !hasAuth } action={ action }
                onClick={ !hasAuth ? null :
                  e => (e.stopPropagation(),
                    interact(action, id, seedProps({ user, ...props }))
                  )
                }/>
            )
        }
      }
    </AuthContext.Consumer>
  )
}
