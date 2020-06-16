import React from "react"

import { Modifier, EditorState } from 'draft-js';

import Button from "./button"

export default (buttonType, child, store) =>
  () => {
    const {
      getEditorState,
      setEditorState
    } = store;
    const editorState = getEditorState();

    const isActive = () => {
      const data = editorState
        .getCurrentContent()
        .getBlockForKey(editorState.getSelection().getStartKey())
        .getData();
      return data.get("textAlign") === buttonType;
    }
    const click = e => {
      e.preventDefault();
      const contentState = editorState.getCurrentContent(),
        selectionState = editorState.getSelection(),
        newContentState = Modifier.setBlockData(
          contentState,
          selectionState,
          isActive() ? {} : { textAlign: buttonType }
        );

      setEditorState(
        EditorState.set(
          editorState,
          { currentContent: newContentState }
        )
      );
    }

    return (
      <Button active={ isActive() } onClick={ click }>
        { child }
      </Button>
    )
  }
