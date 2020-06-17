import React from "react"

import { Modifier, EditorState } from 'draft-js';

import Button from "./button"
import ICONS from "./icons"

export default (buttonType, store) =>
  () => {
    const {
      getEditorState,
      setEditorState
    } = store;
    const editorState = getEditorState();

    const getStartData = contentState =>
      contentState
        .getBlockForKey(editorState.getSelection().getStartKey())
        .getData()

    const isActive = () => {
      const data = getStartData(editorState.getCurrentContent());
      return data.get("textAlign") === buttonType;
    }

    const click = e => {
      e.preventDefault();
      const contentState = editorState.getCurrentContent(),
        selectionState = editorState.getSelection(),
        blockData = getStartData(contentState),

        newContentState = Modifier.setBlockData(
          contentState,
          selectionState,
          isActive() ? blockData.delete("textAlign") : blockData.set("textAlign", buttonType)
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
        { ICONS[buttonType] }
      </Button>
    )
  }