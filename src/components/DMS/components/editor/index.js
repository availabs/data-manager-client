import React from "react"

import { ScalableLoading } from "components/avl-components/components/Loading/LoadingPage"

import deepequal from "deep-equal"
import get from "lodash.get"
import debounce from "lodash.debounce"
import throttle from "lodash.throttle"

import { useTheme } from "components/avl-components/wrappers/with-theme"
import imgLoader from "components/avl-components/wrappers/img-loader"
import showLoading from "components/avl-components/wrappers/show-loading"

import {
  EditorState,
  // ContentState,
  convertToRaw,
  convertFromRaw
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
    JustifyAlignButton,
    RightAlignButton,
    TextIndentButton,
    TextOutdentButton
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
    disabled: false,
    autoFocus: false
  }
  editor = null;
  state = {
    editorState: EditorState.createEmpty(),
    loading: false,
    hasFocus: false,
    loadedFromSavedState: false
  }
  componentDidMount() {
    this.loadFromLocalStorage();
    if (this.props.autoFocus) {
      setTimeout(() => this.focusEditor(), 25);
    }
  }
  componentWillUnmount() {
    this.editor = null;
    this.updateProps.cancel();
  }
  componentDidUpdate() {
    if (!this.state.loadedFromSavedState && this.props.value) {
      this.loadFromSavedState(this.props.value);
    }
    this.saveToLocalStorage(this.state.editorState);
  }
  loadFromLocalStorage() {
    if (window.localStorage) {
      const saved = window.localStorage.getItem("saved-editor-state-" + this.props.id);
      if (saved) {
        this.loadFromSavedState(JSON.parse(saved));
      }
    }
  }
  loadFromSavedState(content) {
    const editorState = EditorState.createWithContent(convertFromRaw(content));
    // this.handleChange(editorState);
    this.setState({ loadedFromSavedState: true, editorState });
  }
  _saveToLocalStorage(editorState) {
    if (window.localStorage) {
      const currentContent = editorState.getCurrentContent(),
        hasText = currentContent.hasText();
      if (hasText) {
        const saved = convertToRaw(currentContent);
        if (!deepequal(saved, this.props.value)) {
          window.localStorage.setItem("saved-editor-state-" + this.props.id, JSON.stringify(saved));
        }
      }
      else {
        window.localStorage.removeItem("saved-editor-state-" + this.props.id);
      }
    }
  }
  saveToLocalStorage = throttle(this._saveToLocalStorage, 1000);

  _updateProps(editorState) {
    const currentContent = editorState.getCurrentContent(),
      hasText = currentContent.hasText();
    if (hasText) {
      this.props.onChange(convertToRaw(currentContent));
    }
    else {
      this.props.onChange(null);
    }
  }
  updateProps = debounce(this._updateProps, 250);

  focusEditor() {
    this.editor && this.editor.focus();
  }
  handleChange(editorState) {
    this.setState(state => ({ editorState }));
    this.updateProps(editorState);
  }
  dropIt(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.disabled) return;

    const file = get(e, ["dataTransfer", "files", 0], null);

    this.props.uploadImage(file)
      .then(({ filename, url }) => {
        this.handleChange(addImage(url, this.state.editorState));
      });
  }

  render() {
    const { editorState, loading, hasFocus } = this.state;

    return (
      <EditorWrapper id={ this.props.id } hasFocus={ hasFocus }
        onDrop={ e => this.dropIt(e) }>

        { !loading ? null : <LoadingIndicator /> }

        <div className="px-2 pb-2 clearfix">
          <Editor ref={ n => this.editor = n } placeholder="Type a value..."
            editorState={ editorState }
            onChange={ editorState => this.handleChange(editorState) }
            plugins={ plugins }
            readOnly={ loading || this.props.disabled }
            spellCheck={ true }
            onFocus={ e => this.setState(state => ({ hasFocus: true })) }
            onBlur={ e => this.setState(state => ({ hasFocus: false })) }/>
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
          <JustifyAlignButton />
          <RightAlignButton />

          <Separator />

          <TextOutdentButton />
          <TextIndentButton />
        </Toolbar>

      </EditorWrapper>
    );
  }
}
const LoadingOptions = {
  position: "absolute",
  className: "rounded"
}
export default imgLoader(showLoading(MyEditor, LoadingOptions));

const EditorWrapper = ({ children, hasFocus, id, ...props }) => {
  const theme = useTheme();
  return (
    <div className={ `pt-15 relative rounded draft-js-editor ${ theme.inputBg }
        ${ hasFocus ? theme.inputBorderFocus : theme.inputBorder }
    ` } { ...props } tabIndex="0">
      { children }
    </div>
  )
}

const LoadingIndicator = () =>
  <div className={ `
    absolute top-0 bottom-0 left-0 right-0
    bg-black opacity-50 z-30 rounded
    flex items-center justify-center
  ` }>
    <ScalableLoading />
  </div>
