import React, { useState, useEffect } from "react"

import { Link } from "react-router-dom"
import { useLocation, useHistory } from "react-router-dom"

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

export const getButtonClassName = ({ color = "blue", large, small, block, className, disabled }) =>
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
      `cursor-pointer hover:bg-${ color }-700`
    }
    ${ className }
  `

export const Button = ({ children, large, small, block, color = "blue", className = "", disabled = false, type = "button", ...props }) =>
  <button { ...props } type={ type } disabled={ disabled }
    className={ getButtonClassName({ color, large, small, block, className, disabled })}>
    { children }
  </button>

const LinkButton = ({ children, href, large, small, block, color = "blue", className = "", disabled = false, ...props }) =>
  <Link { ...props } disabled={ disabled } onClick={ e => e.stopPropagation() }
    className={ getButtonClassName({ color, large, small, block, className, disabled })}>
    { children }
  </Link>

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

export const ActionButton = ({ action, label, color, ...props }) => {
  label = label || getLabel(action);
  return (
    <ButtonColorContext.Consumer>
      { buttonColors =>
        <Button { ...props } color={ color || getButtonColor(label, buttonColors) }>
          { label }
        </Button>
      }
    </ButtonColorContext.Consumer>
  )
}

export const ActionLink = ({ action, label, color, ...props }) => {
  label = label || getLabel(action);
  return (
    <ButtonColorContext.Consumer>
      { buttonColors =>
        <LinkButton { ...props } color={ color || getButtonColor(label, buttonColors) }>
          { label  }
        </LinkButton>
      }
    </ButtonColorContext.Consumer>
  )
}

const processAction = arg => {
  let response = {
    action: "unknown",
    seedProps: () => null,
    showConfirm: false,
    label: null,
    color: null
  };
  if (typeof arg === "string") {
    response.action = arg;
  }
  else {
    response = { ...response, ...arg };
  }
  return response;
}

export const DmsButton = ({ action: arg, item, props = {}, disabled = false, ...rest }) => {
  const { pathname, state = [] } = useLocation(),
    { push } = useHistory(),
    length = state.length,

    itemId = get(item, "id", null),

    { action, seedProps, showConfirm, ...fromAction } = processAction(arg);

// RENDER BUTTON START
  const RenderButton = ({ waiting = false }) =>
    <AuthContext.Consumer>
      { ({ authRules, user, interact, useRouter, basePath }) => {

          const hasAuth = checkAuth(authRules, action, { user, ...props }, item);

          const DISABLED = !hasAuth || disabled || waiting;

          return useRouter && !DISABLED ?
            ( ["back", "dms:back"].includes(action) ?
                <ActionLink { ...rest } action={ action } { ...fromAction }
                  to={ {
                    pathname: get(state, [length - 1], basePath),
                    state: state.slice(0, length - 1)
                  } }/>
              : /^api:/.test(action) ?
                <ActionButton { ...rest } action={ action } { ...fromAction }
                  onClick={ e => (e.stopPropagation(),
                    Promise.resolve(interact(action, itemId, seedProps({ user, ...props })))
                      .then(() => push({
                        pathname: get(state, [length - 1], basePath),
                        state: state.slice(0, length - 1)
                      })))
                  }/>
              : <ActionLink { ...rest } action={ action } { ...fromAction }
                  to={ {
                    pathname: itemId ? `${ basePath }/${ action }/${ itemId }` : `${ basePath }/${ action }`,
                    state: [...state, pathname]
                  } }/>
            ) :
            ( <ActionButton { ...rest } disabled={ DISABLED } action={ action } { ...fromAction }
                onClick={ DISABLED ? null :
                  e => (e.stopPropagation(),
                    Promise.resolve(interact(action, itemId, seedProps({ user, ...props })))
                      .then(() => /^api:/.test(action) && interact("dms:back"))
                  )
                }/>
            )
        }
      }
    </AuthContext.Consumer>
// RENDER BUTTON END

  const Opened = ({ setOpen }) => {
    const [waiting, setWaiting] = useState(true);
    useEffect(() => {
      const timeout = setTimeout(setWaiting, 2000, false);
      return () => clearTimeout(timeout);
    })
    return (
      <>
        <RenderButton waiting={ waiting }/>
        <ActionButton className="ml-1" { ...rest } action="cancel"
          onClick={ e => (e.stopPropagation(), setOpen(false)) }/>
      </>
    )
  }

  const [openConfirm, setOpen] = useState(!showConfirm)

  if (showConfirm) {
    return openConfirm ? <Opened setOpen={ setOpen }/> :
      <ActionButton { ...rest } action={ action } { ...fromAction }
        onClick={ e => (e.stopPropagation(), setOpen(true)) }/>
  }
  return <RenderButton />;
}

export const DmsListRow = ({ action: arg, item, props = {}, disabled = false, children, className = "", ...rest }) => {
  const { pathname, state = [] } = useLocation(),
    { push } = useHistory(),
    length = state.length,

    itemId = get(item, "id", null),

    { action, seedProps, showConfirm, ...fromAction } = processAction(arg);

  return (
    <AuthContext.Consumer>
      { ({ authRules, user, interact, useRouter, basePath }) => {

        const hasAuth = checkAuth(authRules, action, { user, ...props }, item);

        return useRouter && hasAuth && !disabled ?
          (
            <tr { ...rest } className={ `${ className } cursor-pointer` }
              onClick={ e => (
                  e.stopPropagation(),
                  push({
                    pathname: itemId ? `${ basePath }/${ action }/${ itemId }` : `${ basePath }/${ action }`,
                    state: [...state, pathname]
                  })
                )
              }>
              { children }
            </tr>
          ) : (
            <tr { ...rest } className={ `${ className } cursor-pointer` }
              onClick={ (!hasAuth || disabled) ? null :
                e => (e.stopPropagation(),
                  Promise.resolve(interact(action, itemId, seedProps({ user, ...props })))
                    .then(() => /^api:/.test(action) && interact("dms:back"))
                )
              }>
              { children }
            </tr>
          )
        }
      }
    </AuthContext.Consumer>
  )
}
