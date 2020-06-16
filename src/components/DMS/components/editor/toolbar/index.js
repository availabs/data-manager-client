import React from "react"

export default () => {
  const store = {};

  const Toolbar = ({ children }) =>
    <div className="absolute top-0 left-0 w-full p-2">
      <div className="flex flex-row p-1 shadow-md rounded bg-gray-100 w-full">
        { children }
      </div>
    </div>

  return {
    initialize: ({ getEditorState, setEditorState, getProps }) => {
      // store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
    },
    Toolbar
  }
}

export const Separator = ({ ...props }) =>
  <div className="border-r border-l mx-2"
    style={ { borderColor: "currentColor" } }/>
