import React, { useState, useEffect } from "react"

import { ScalableLoading } from "components/avl-components/components/Loading/LoadingPage"

import { throttle, get } from "lodash"

import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  // RichUtils
} from 'draft-js';
import Editor from 'draft-js-plugins-editor';

import 'draft-js/dist/Draft.css';
import './styles.css'

import makeButtonPlugin from './buttons';
import makeToolbarPlugin from "./toolbar"
import makeImagePlugin from "./image"
import makeLinkItPlugin from "./linkify-it"
import makeSuperSubScriptPlugin from "./super-sub-script"
import makePositionablePlugin from "./positionable"
import makeStuffPlugin from "./stuff"

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
  { Toolbar, Separator } = toolbarPlugin;

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
  positionablePlugin,
  makeStuffPlugin()
];

class MyEditor extends React.Component {
  static defaultProps = {
  }
  editor = React.createRef();
  state = {
    editorState: EditorState.createEmpty(),
    loading: false
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
    // if (window.localStorage) {
    //   const saved = convertToRaw(this.state.editorState.getCurrentContent());
    //   window.localStorage.setItem("saved-editor-state", JSON.stringify(saved));
    // }
  }
  saveToLocalStorage = throttle(this._saveToLocalStorage, 500);

  focus(e) {
    e.preventDefault();
    this.editor.current.focus();
  }
  handleChange(editorState) {
    this.setState(state => ({ editorState }));
    this.saveToLocalStorage()
  }
  dropIt(e) {
    e.preventDefault();

    const file = get(e, ["dataTransfer", "files", 0], null);

    if (file && /^image\/\w+$/.test(file.type)) {
      this.setState({ loading: true });
      new Promise(resolve => {
        setTimeout(resolve, 2000)
      })
      .then(() => {
        this.setState({
          editorState: addImage(URL.createObjectURL(file), this.state.editorState),
          loading: false
        });
      });
    }
  }
  render() {
    const { editorState, loading } = this.state;
    return (
      <div id={ this.props.id }
        className={ `pt-14 relative bg-white rounded draft-js-editor clearfix` }
        onClick={ e => this.focus(e) }
        onDrop={ e => this.dropIt(e) }>

        { !loading ? null :
          <div className={ `
            absolute top-0 bottom-0 left-0 right-0
            bg-black opacity-50 z-30 rounded
            flex items-center justify-center
          ` }>
            <ScalableLoading />
          </div>
        }

        <div className="px-2 pb-1 relative">
          <Editor ref={ this.editor } placeholder="Type a value..."
            editorState={ editorState }
            onChange={ editorState => this.handleChange(editorState) }
            plugins={ plugins }
            readOnly={ loading }
            spellCheck={ true }/>
        </div>

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
