import React from "react"

import { RichUtils } from 'draft-js';

import Button from "./button"

export default (buttonType, child) =>
  ({ editorState, ...props }) => {
    const click = e => {
      e.preventDefault();
      props.setEditorState(
        RichUtils.toggleInlineStyle(editorState, buttonType)
      );
    }
    const isActive = () =>
      editorState
        .getCurrentInlineStyle()
        .has(buttonType)

    return (
      <Button active={ isActive() } onClick={ click }>
        { child }
      </Button>
    )
  }
