import React from "react"

const Separator = ({ ...props }) =>
  <div className="border-r border-l mx-2" style={ { borderColor: "currentColor" } }/>

export default (options = {}) => {
  const {
    position = "top",
    direction = "row"
  } = options;

  const store = {};

  const Toolbar = ({ children }) =>
    <div className={ `absolute ${ position }-0 left-0 w-full p-2` }>
      <div className={ `flex flex-${ direction } p-1 shadow-md rounded bg-gray-100 w-full` }>
        { children }
      </div>
    </div>

  return {
    initialize: ({ getEditorState, setEditorState, getProps }) => {
      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
    },
    Toolbar,
    Separator
  }
}
