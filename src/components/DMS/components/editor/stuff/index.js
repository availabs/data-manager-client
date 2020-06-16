import React from "react"
import { EditorState, DefaultDraftBlockRenderMap } from "draft-js"

import Immutable from "draft-js/node_modules/immutable"

const customStyleMap = {
  'STRIKETHROUGH': {
    textDecoration: 'line-through',
  }
};

const blockStyleFn = block => {
  switch (block.getType()) {
    case "blockquote":
      return "rounded bg-gray-200 py-2 px-3 m-2"
    default:
      return null;
  }
}

const myBlockRenderMap = Immutable.Map({
  "blockquote": {
    element: "blockquote",
    wrapper: <div className="rounded bg-gray-100 p-2 my-2"/>
  },
  "code-block": {
    element: "pre",
    wrapper: <pre className="border font-momo py-2 px-3 rounded bg-gray-50 my-2"/>
  }
})
const blockRenderMap = DefaultDraftBlockRenderMap.merge(myBlockRenderMap);

const onTab = (store, e) => {
  e.preventDefault();

  let found = false;
  const direction = e.shiftKey ? -1 : 1,

    editorState = store.getEditorState(),

    contentState = editorState.getCurrentContent(),
    blockMap = contentState.getBlockMap(),

    selection = editorState.getSelection(),
    startKey = selection.getStartKey(),
    endKey = selection.getEndKey(),

    newBlockMap = blockMap.reduce((a, block) => {
      const depth = block.getDepth(),
        key = block.getKey();
      if (key === startKey) {
        found = true;
      }
      if (found) {
        block = block.set("depth", Math.max(0, Math.min(4, depth + direction)));
      }
      if (key === endKey) {
        found = false;
      }
      return a.set(block.getKey(), block);
    }, blockMap);

  store.setEditorState(
    EditorState.forceSelection(
      EditorState.push(
        editorState,
        contentState.merge({ blockMap: newBlockMap }),
        'adjust-depth'
      ),
      selection
    )
  );
}

export default () => {
  const store = {};

  return {
    initialize: ({ getEditorState, setEditorState, ...rest }) => {
      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
    },
    onTab: onTab.bind(null, store),
    customStyleMap,
    blockStyleFn,
    blockRenderMap
  }
}
