import React, { useState, useEffect } from "react"

import {
  EditorState,
  AtomicBlockUtils,
  RichUtils,
  convertToRaw,
  convertFromRaw
} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import 'draft-js/dist/Draft.css';

import makeToolbarPlugin, { Separator } from "./toolbar"
import {
  BlockQuoteButton,
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
  UnderlineButton
} from './buttons';

import makeImagePlugin from "./image"
import makeLinkItPlugin from "./linkify-it"
import makeSuperSubScriptPlugin from "./super-sub-script"
import makePositionablePlugin from "./positionable"

import { debounce, get } from "lodash"

const toolbarPlugin = makeToolbarPlugin(),
  { Toolbar } = toolbarPlugin;

const positionablePlugin = makePositionablePlugin(),
  { positionable } = positionablePlugin;

const imagePlugin = makeImagePlugin({ wrapper: positionable }),
  { addImage } = imagePlugin;

const plugins = [
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
  focus(e) {
    e.preventDefault();
    this.editor.current.focus();
  }
  addNewBlock(blockfunc) {
    this.setState(state => {
      const editorState = blockfunc(state.editorState)
      return { editorState };
    });
  }
  handleChange(editorState) {
    this.setState(state => ({ editorState }));
    // this.saveToLocalStorage()
  }
  _saveToLocalStorage() {
    if (window.localStorage) {
      const saved = convertToRaw(this.state.editorState.getCurrentContent());
      window.localStorage.setItem("saved-editor-state", JSON.stringify(saved));
    }
  }
  saveToLocalStorage = debounce(this._saveToLocalStorage, 250);
  dropIt(e) {
    e.preventDefault();

    const file = get(e, ["dataTransfer", "files", 0], null);

    if (file) {
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
        onDrop={ e => this.dropIt(e) } spellCheck={ true }>
        <Editor ref={ this.editor } placeholder="Type a value..."
          customStyleMap={ styleMap }
          editorState={ editorState }
          onChange={ editorState => this.handleChange(editorState) }
          plugins={ plugins }
          readOnly={ false }
          spellCheck={ true }/>

        <Toolbar editorState={ editorState }>
          {
            toolbarProps => (
              <>
                <BoldButton { ...toolbarProps }/>
                <ItalicButton { ...toolbarProps }/>
                <StrikeThroughButton { ...toolbarProps }/>
                <UnderlineButton { ...toolbarProps }/>
                <SubScriptButton { ...toolbarProps }/>
                <SuperScriptButton { ...toolbarProps }/>
                <CodeButton { ...toolbarProps }/>

                <Separator />

                <HeaderOneButton { ...toolbarProps }/>
                <HeaderTwoButton { ...toolbarProps }/>
                <HeaderThreeButton { ...toolbarProps }/>

                <Separator />

                <BlockQuoteButton { ...toolbarProps }/>
                <CodeBlockButton { ...toolbarProps }/>
                <OrderedListButton { ...toolbarProps }/>
                <UnorderedListButton { ...toolbarProps }/>
              </>
            )
          }
        </Toolbar>

      </div>
    );
  }
}
export default MyEditor;
