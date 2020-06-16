import React from "react"

import { EditorState, AtomicBlockUtils, Modifier, SelectionState } from 'draft-js';

export default (options = {}) => {
  const {
    maxHeight = "15rem",
    wrapper
  } = options

  const ImageBlock = ({ blockProps }) =>
    <img className="block" src={ blockProps.src } style={ { maxHeight } }/>

  return {
    blockRendererFn: (block, { getEditorState }) => {
      if (block.getType() === "atomic") {
        const contentState = getEditorState().getCurrentContent(),
          entityKey = block.getEntityAt(0);

        if (!entityKey) return null;

        const entity = contentState.getEntity(entityKey),
          type = entity.getType();

        if (type === "IMAGE") {
          return {
            component: wrapper ? wrapper(ImageBlock) : ImageBlock,
            editable: false,
            props: {
              src: entity.getData().src
            }
          };
        }
      }
      return null;
    },
    addImage: (src, editorState) => {
      const contentState = editorState.getCurrentContent()
          .createEntity(
            'IMAGE',
            'IMMUTABLE',
            { src }
          ),
        entityKey = contentState.getLastCreatedEntityKey(),
        newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, 'IMAGE-BLOCK');

const selection = editorState.getSelection(),
  startKey = selection.getStartKey();
const test = Modifier.replaceWithFragment(
  newEditorState.getCurrentContent(),
  newEditorState.getCurrentContent().getSelectionBefore(),
  newEditorState.getCurrentContent().getBlockMap().filter(b => b.getKey() !== startKey)
)
console.log("TEST:", test.getBlockMap(), newEditorState.getCurrentContent().getBlockMap(),
  newEditorState.getCurrentContent().getBlockMap().filter(b => b.getKey() !== startKey)
);

      return newEditorState;

      // return EditorState.forceSelection(
      //   newEditorState,
      //   newEditorState.getCurrentContent().getSelectionAfter()
      // );
    }
  }
}
