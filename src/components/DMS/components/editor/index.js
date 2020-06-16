import React, { useState, useEffect } from "react"

import { debounce, get } from "lodash"

// import Immutable from "immutable"

import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  DefaultDraftBlockRenderMap,
  // RichUtils
} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import 'draft-js/dist/Draft.css';

import Immutable from "draft-js/node_modules/immutable"

import makeButtonPlugin from './buttons';
import makeToolbarPlugin, { Separator } from "./toolbar"
import makeImagePlugin from "./image"
import makeLinkItPlugin from "./linkify-it"
import makeSuperSubScriptPlugin from "./super-sub-script"
import makePositionablePlugin from "./positionable"

const buttonPlugin = makeButtonPlugin(),
  { BlockQuoteButton,
    CodeBlockButton,
    HeaderOneButton,
    HeaderTwoButton,
    HeaderThreeButton,
    OrderedListButton,
    UnorderedListButton,
    BoldButton,
    CodeButton,
    ItalicButton,
    StrikeThroughButton,
    SubScriptButton,
    SuperScriptButton,
    UnderlineButton,
    LeftAlignButton,
    CenterAlignButton,
    RightAlignButton
  } = buttonPlugin;

const toolbarPlugin = makeToolbarPlugin(),
  { Toolbar } = toolbarPlugin;

const positionablePlugin = makePositionablePlugin(),
  { positionable } = positionablePlugin;

const imagePlugin = makeImagePlugin({ wrapper: positionable }),
  { addImage } = imagePlugin;

const plugins = [
  buttonPlugin,
  toolbarPlugin,
  imagePlugin,
  makeLinkItPlugin(),
  makeSuperSubScriptPlugin(),
  positionablePlugin
];

const styleMap = {
  'STRIKETHROUGH': {
    textDecoration: 'line-through',
  }
};

// const OrderedListWrapper = ({ children, ...props }) =>
//   <div className="my-list-wrapper">
//     <ol { ...props } className="m-auto">
//       { children }
//     </ol>
//   </div>
// const UnorderedListWrapper = ({ children, ...props }) =>
//   <div className="my-list-wrapper">
//     <ul { ...props } className="m-auto">
//       { children }
//     </ul>
//   </div>
//
const myBlockRenderMap = Immutable.Map({
  // "ordered-list-item": {
  //   element: "li",
  //   wrapper: <OrderedListWrapper />
  // },
  // "unordered-list-item": {
  //   element: "li",
  //   wrapper: <UnorderedListWrapper />
  // }
  // "atomic": {
  //   element: props => <figure { ...props } className="relative z-10">{ props.children }</figure>
  // }
})
const blockRenderMap = DefaultDraftBlockRenderMap.merge(myBlockRenderMap);

class MyEditor extends React.Component {
  editor = React.createRef();
  state = {
    editorState: EditorState.createEmpty()
  }
  componentDidMount() {
//     if (window.localStorage) {
//       const saved = window.localStorage.getItem("saved-editor-state");
//       if (saved) {
//         const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(saved)));
// console.log("EDITOR STATE:", editorState)
//         this.setState({ editorState });
//       }
//     }
  }
  _saveToLocalStorage() {
    if (window.localStorage) {
      const saved = convertToRaw(this.state.editorState.getCurrentContent());
      window.localStorage.setItem("saved-editor-state", JSON.stringify(saved));
    }
  }
  saveToLocalStorage = debounce(this._saveToLocalStorage, 250);

  focus(e) {
    e.preventDefault();
    this.editor.current.focus();
  }
  handleChange(editorState) {
    this.setState(state => ({ editorState }));
    // this.saveToLocalStorage()
  }
  dropIt(e) {
    e.preventDefault();

    const file = get(e, ["dataTransfer", "files", 0], null);

    if (file && /^image\/\w+$/.test(file.type)) {
      this.setState({
        editorState: addImage(URL.createObjectURL(file), this.state.editorState)
      });
    }
  }
  render() {
    const { editorState } = this.state;
    return (
      <div id={ this.props.id } onClick={ e => this.focus(e) }
        className={ `pt-14 relative bg-white rounded draft-js-editor clearfix` }
        onDrop={ e => this.dropIt(e) }>
        <Editor ref={ this.editor } placeholder="Type a value..."
          customStyleMap={ styleMap }
          editorState={ editorState }
          onChange={ editorState => this.handleChange(editorState) }
          plugins={ plugins }
          readOnly={ false }
          blockRenderMap={ blockRenderMap }
          spellCheck={ true }/>

        <Toolbar>
          <BoldButton />
          <ItalicButton />
          <StrikeThroughButton />
          <UnderlineButton />
          <SubScriptButton />
          <SuperScriptButton />
          <CodeButton />

          <Separator />

          <HeaderOneButton />
          <HeaderTwoButton />
          <HeaderThreeButton />

          <Separator />

          <BlockQuoteButton />
          <CodeBlockButton />
          <OrderedListButton />
          <UnorderedListButton />

          <Separator />

          <LeftAlignButton />
          <CenterAlignButton />
          <RightAlignButton />
        </Toolbar>

      </div>
    );
  }
}
export default MyEditor;
