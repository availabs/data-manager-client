import React from "react"

import { EditorState, AtomicBlockUtils } from 'draft-js';

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
      const contentState = editorState.getCurrentContent(),
        newContentState = contentState.createEntity(
          'IMAGE',
          'IMMUTABLE',
          { src }
        ),
        entityKey = newContentState.getLastCreatedEntityKey(),
        newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, 'IMAGE-BLOCK');
      return EditorState.forceSelection(
        newEditorState,
        newEditorState.getCurrentContent().getSelectionAfter()
      );
    }
  }
}
