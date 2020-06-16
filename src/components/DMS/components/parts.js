import React, { useState, useEffect } from "react"
import ReactDOM from "react-dom"

import { Link } from "react-router-dom"
import { useLocation, useHistory } from "react-router-dom"

import { AuthContext, ButtonContext, RouterContext } from "../contexts"
import { checkAuth } from "../utils"

import get from "lodash.get"

export const Input = ({ large, small, className, disabled, children, ...props }) =>
  <input { ...props } disabled={ disabled }
    className={ `
      w-full block
      ${ large ? "py-2 px-4" : small ? "py-0 px-1" : "py-1 px-2" }
      ${ large ? "text-lg" : small ? "text-sm" : "" }
      ${ large ? "rounded-lg" : "rounded" }
      ${ disabled ? "cursor-not-allowed" : `cursor-pointer` }
      ${ className }
    ` }>
    { children }
  </input>

export const TextArea = ({ large, small, className, disabled, children, ...props }) =>
  <textarea { ...props } disabled={ disabled }
    className={ `
      w-full block
      ${ large ? "py-2 px-4" : small ? "py-0 px-1" : "py-1 px-2" }
      ${ large ? "text-lg" : small ? "text-sm" : "" }
      ${ large ? "rounded-lg" : "rounded" }
      ${ disabled ? "cursor-not-allowed" : `cursor-pointer` }
      ${ className }
    ` }>
    { children }
  </textarea>

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

const BUTTON_COLORS = {
  create: "green",
  back: "teal",
  edit: "purple",
  delete: "red"
}

const getButtonColor = (label, colors) =>
  get(colors, label, get(BUTTON_COLORS, label))

export const ActionButton = ({ action, label, color, waiting, ...props }) => {
  label = label || getLabel(action);
  return (
    <ButtonContext.Consumer>
      { ({ buttonColors }) =>
        <Button { ...props } color={ color || getButtonColor(label, buttonColors) }>
          { label }
        </Button>
      }
    </ButtonContext.Consumer>
  )
}

export const ActionLink = ({ action, label, color, ...props }) => {
  label = label || getLabel(action);
  return (
    <ButtonContext.Consumer>
      { ({ buttonColors }) =>
        <LinkButton { ...props } color={ color || getButtonColor(label, buttonColors) }>
          { label  }
        </LinkButton>
      }
    </ButtonContext.Consumer>
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
  let { pathname, state } = useLocation(),
    { push } = useHistory();
  state = state || [];
  const length = state.length,

    itemId = get(item, "id", null),

    { action, seedProps, showConfirm, ...fromAction } = processAction(arg);

// RENDER BUTTON START
  const RenderButton = ({ waiting = false }) =>
    <AuthContext.Consumer>

      { ({ authRules, user, interact, useRouter, basePath }) => {

          const hasAuth = checkAuth(authRules, action, { user, ...props }, item);

          const DISABLED = !hasAuth || disabled || waiting;

          return useRouter && !DISABLED ?
            // ( ["back", "dms:back"].includes(action) ?
            ( /^(dms:)*back$/.test(action) ?
                <ActionLink { ...rest } action={ action } { ...fromAction }
                  to={ {
                    pathname: get(state, [length - 1], basePath),
                    state: state.slice(0, length - 1)
                  } }/>
              : /^(dms:)*home$/.test(action) ?
                <ActionLink { ...rest } action={ action } { ...fromAction }
                  to={ {
                    pathname: basePath,
                    state: []
                  } }/>
              : /^api:/.test(action) ?
                <ActionButton { ...rest } action={ action } { ...fromAction }
                  onClick={ e => {
                      e.stopPropagation()
                      Promise.resolve(interact(action, itemId, seedProps({ user, ...props })))
                      .then(() => push({
                        pathname: get(state, [length - 1], basePath),
                        state: state.slice(0, length - 1)
                      }))
                    }
                  }/>
              : <ActionLink { ...rest } action={ action } { ...fromAction }
                  to={ {
                    pathname: itemId ? `${ basePath }/${ action }/${ itemId }` : `${ basePath }/${ action }`,
                    state: [...state, pathname]
                  } }/>
            ) :
            ( <ActionButton { ...rest } disabled={ DISABLED } action={ action } { ...fromAction }
                onClick={ DISABLED ? null :
                  e => {
                    e.stopPropagation()
                    console.log('what is interact ?', interact)
                    Promise.resolve(interact(action, itemId, seedProps({ user, ...props })))
                      .then(() => /^api:/.test(action) && interact("dms:back"))
                  }
                }/>
            )
        }
      }
    </AuthContext.Consumer>
// RENDER BUTTON END

  const Opened = ({ setOpen }) => {
    const [waiting, setWaiting] = useState(2000);
    useEffect(() => {
      const timeout = waiting && setTimeout(setWaiting, 20, waiting - 20);
      return () => clearTimeout(timeout);
    })
    return (
      <div className="btn-group-horizontal">
        <RenderButton waiting={ waiting }/>
        <ActionButton { ...rest } action="cancel"
          onClick={ e => (e.stopPropagation(), setOpen(false)) }/>
      </div>
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
  let { pathname, state } = useLocation(),
    { push } = useHistory();
  state = state || [];
  const length = state.length,

    itemId = get(item, "id", null),

    { action, seedProps, showConfirm, ...fromAction } = processAction(arg);

  return (
    <AuthContext.Consumer>
      { ({ authRules, user }) =>
        <ButtonContext.Consumer>
          { ({ interact }) =>
            <RouterContext.Consumer>
              { ({ useRouter, basePath }) => {

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
            </RouterContext.Consumer>
          }
        </ButtonContext.Consumer>
      }
    </AuthContext.Consumer>
  )
}
