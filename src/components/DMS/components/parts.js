import React, { useState, useEffect } from "react"

import {  ButtonContext } from "../contexts"

import { useMakeInteraction } from "../wrappers/dms-provider"

import { Button, LinkButton } from "components/avl-components/components/Button"

import get from "lodash.get"

export const Title = ({ children, ...props }) =>
  <div className={ `
      font-bold mb-1
      ${ props.large ? "text-3xl" : "text-xl" }
      ${ get(props, "className", "") }
    ` }>
    { children }
  </div>

const cleanAction = action =>
  action.replace(/^(dms|api):(.+)$/, (m, c1, c2) => c2);

const BUTTON_THEMES = {
  create: "button",
  back: "button",
  edit: "button",
  delete: "buttonDanger",
  cancel: "button"
}

const getButtonTheme = (themes, action, small, large, block)=> {
  action = cleanAction(action);
  let button = get(themes, action) || get(BUTTON_THEMES, action, undefined);
  small && (button += "Small");
  large && (button += "Large");
  block && (button += "Block");
  return button;
}

export const ActionButton = ({ action, label, buttonTheme, small, large, block, ...props }) => {
  label = label || cleanAction(action);
  return (
    <ButtonContext.Consumer>
      { ({ buttonThemes }) => {
          buttonTheme = buttonTheme || getButtonTheme(buttonThemes, action, small, large, block);
          return (
            <Button { ...props } buttonTheme={ buttonTheme }>
              { label }
            </Button>
          )
        }
      }
    </ButtonContext.Consumer>
  )
}

export const ActionLink = ({ action, label, buttonTheme, small, large, block, ...props }) => {
  label = label || cleanAction(action);
  return (
    <ButtonContext.Consumer>
      { ({ buttonThemes }) => {
          buttonTheme = buttonTheme || getButtonTheme(buttonThemes, action, small, large, block);
          return (
            <LinkButton { ...props } buttonTheme={ buttonTheme }>
              { label  }
            </LinkButton>
          )
        }
      }
    </ButtonContext.Consumer>
  )
}

const OpenConfirm = ({ Button, interaction, ...props }) => {
  const OpenedAndWating = ({ setOpen }) => {
    const [waiting, setWaiting] = useState(true);
    useEffect(() => {
      const timeout = waiting && setTimeout(setWaiting, 2000, false);
      return () => clearTimeout(timeout);
    }, [waiting])
    return (
      <div className="btn-group-horizontal">
        <Button waiting={ waiting }/>
        <ActionButton { ...props } action="cancel"
          onClick={ e => {
            e.stopPropagation();
            setOpen(false);
          } }/>
      </div>
    )
  }
  const [openConfirm, setOpen] = useState(false);
  return openConfirm ? <OpenedAndWating setOpen={ setOpen }/> :
    <ActionButton { ...props } { ...interaction }
      onClick={ e => { e.stopPropagation(); setOpen(true); } }/>
}

export const DmsButton = ({ action, item, props = {}, disabled = false, ...others }) => {
  const { type, showConfirm, ...interaction } = useMakeInteraction(action, item, props);

  const RenderButton = ({ waiting }) => {
    switch (type) {
      case "link":
        return <ActionLink { ...interaction } { ...others }
          disabled={ waiting || disabled }/>
      default:
        return <ActionButton { ...interaction } { ...others }
          disabled={ waiting || disabled } type={ type }/>
    }
  }

  if (showConfirm) {
    return <OpenConfirm Button={ RenderButton }
              interaction={ interaction } { ...others }/>
  }
  return <RenderButton />;
}
