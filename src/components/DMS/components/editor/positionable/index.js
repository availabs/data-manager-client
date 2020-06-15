import React from "react"

import { EditorState, AtomicBlockUtils } from 'draft-js';

import positionable from "./positionable"

export default () => {
  const store = {};

  const adjustPosition = (block, contentState, position) => {
    const entityKey = block.getEntityAt(0),
      editorState = store.getEditorState();
    contentState.mergeEntityData(entityKey, { position });
    store.setEditorState(
      EditorState.forceSelection(
        editorState,
        editorState.getSelection()
      )
    )
  }

  return {
    initialize: ({ getEditorState, setEditorState }) => {
      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
    },
    blockRendererFn: (block, { getEditorState }) => {
      if (block.getType() === "atomic") {
        const contentState = getEditorState().getCurrentContent(),
          entityKey = block.getEntityAt(0);

        if (!entityKey) return null;

        const { position } = contentState.getEntity(entityKey).getData();

        return {
          props: {
            adjustPosition,
            position
          }
        };
      }
      return null;
    },
    positionable
  }
}
