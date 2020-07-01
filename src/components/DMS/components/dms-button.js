import React, { useState, useEffect } from "react"

import {  ButtonContext } from "../contexts"

import { useMakeInteraction } from "../wrappers/dms-provider"

import { Button, LinkButton } from "components/avl-components/components/Button"

import get from "lodash.get"

const cleanAction = action =>
  action.replace(/^(dms|api):(.+)$/, (m, c1, c2) => c2);

const DEFAULT_BUTTON_THEMES = {
  // create: "button",
  // back: "button",
  // edit: "button",
  delete: "buttonDanger",
  cancel: "buttonInfo"
}

const getButtonTheme = (theme, themes, action)=> {
  action = cleanAction(action);
  return theme || get(themes, action, get(DEFAULT_BUTTON_THEMES, action, "button"));
}

const ActionButton = ({ action, label, buttonTheme, ...props }) => {
  label = label || cleanAction(action);
  return (
    <ButtonContext.Consumer>
      { ({ buttonThemes }) =>
        <Button { ...props } buttonTheme={ getButtonTheme(buttonTheme, buttonThemes, action) }>
          { label }
        </Button>
      }
    </ButtonContext.Consumer>
  )
}

const ActionLink = ({ action, label, buttonTheme, ...props }) => {
  label = label || cleanAction(action);
  return (
    <ButtonContext.Consumer>
      { ({ buttonThemes }) =>
        <LinkButton { ...props } buttonTheme={ getButtonTheme(buttonTheme, buttonThemes, action) }>
          { label  }
        </LinkButton>
      }
    </ButtonContext.Consumer>
  )
}

const OpenConfirm = ({ Button, interaction, ...props }) => {
  const OpenedAndWating = ({ setOpen }) => {
    const [waiting, setWaiting] = useState(true);
    useEffect(() => {
      const timeout = waiting && setTimeout(setWaiting, 1000, false);
      return () => clearTimeout(timeout);
    }, [waiting])
    return (
      <div>
        <Button waiting={ waiting }/>
        <ActionButton action="cancel"
          className="ml-1"
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

export const DmsButton = ({ action: arg, item, props = {}, disabled = false, ...others }) => {
  const { action, type, to, ...interaction } = useMakeInteraction(arg, item, props),
    { showConfirm, isDisabled, ...dms } = action;

  const RenderButton = ({ waiting }) => {
    if (waiting) {
      return <ActionButton { ...interaction } { ...dms } { ...others }
        disabled={ true }/>
    }
    switch (type) {
      case "link":
        return <ActionLink { ...interaction } { ...dms } { ...others } to={ to }
          disabled={ waiting || disabled || isDisabled }/>
      default:
        return <ActionButton { ...interaction } { ...dms } { ...others }
          disabled={ waiting || disabled || isDisabled }/>
    }
  }

  if (showConfirm) {
    return <OpenConfirm Button={ RenderButton }
              interaction={ interaction } { ...dms } { ...others }/>
  }
  return <RenderButton />;
}
