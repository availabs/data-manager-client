import React from "react"

import { ScalableLoading } from "components/avl-components/components/Loading/LoadingPage"

import throttle from "lodash.throttle"
import get from "lodash.get"
import debounce from "lodash.debounce"

import { useTheme } from "components/avl-components/wrappers/with-theme"

import {
  EditorState,
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
  }
  editor = React.createRef();
  state = {
    editorState: EditorState.createEmpty(),
    loading: false,
    hasFocus: false
  }
  componentDidMount() {
    this.loadFromLocalStorage();
    if (this.props.autoFocus) {
      this.focusEditor();
    }
  }
  componentDidUpdate() {
    this.updateProps();
    this.saveToLocalStorage();
  }
  loadFromLocalStorage() {
    if (window.localStorage) {
      const saved = window.localStorage.getItem("saved-editor-state");
      if (saved) {
        const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(saved)));
        this.setState(state => ({ editorState }));
        this.updateProps();
      }
    }
  }
  _saveToLocalStorage() {
    if (window.localStorage) {
      const saved = convertToRaw(this.state.editorState.getCurrentContent());
      window.localStorage.setItem("saved-editor-state", JSON.stringify(saved));
    }
  }
  saveToLocalStorage = throttle(this._saveToLocalStorage, 500);

  _updateProps() {
    const currentContent = this.state.editorState.getCurrentContent(),
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
    // e.preventDefault();
    this.editor.current.focus();
  }
  handleChange(editorState) {
    this.setState(state => ({ editorState }));
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
        this.handleChange(addImage(URL.createObjectURL(file), this.state.editorState));
        this.setState({ loading: false });
      });
    }
  }
  render() {
    const { editorState, loading, hasFocus } = this.state;
    return (
      <EditorWrapper id={ this.props.id } hasFocus={ hasFocus }
        onClick={ e => this.focusEditor() }
        onDrop={ e => this.dropIt(e) }>

        { !loading ? null : <LoadingIndicator /> }

        <div className="px-2 pb-1 relative">
          <Editor ref={ this.editor } placeholder="Type a value..."
            editorState={ editorState }
            onChange={ editorState => this.handleChange(editorState) }
            plugins={ plugins }
            readOnly={ loading }
            spellCheck={ true }
            onFocus={ e => this.setState({ hasFocus: true }) }
            onBlur={ e => this.setState({ hasFocus: false }) }/>
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
export default MyEditor;

const EditorWrapper = ({ children, hasFocus, id, ...props }) => {
  const theme = useTheme();
  return (
    <div className={ `pt-14 relative rounded draft-js-editor
        ${ hasFocus ? theme.inputFocus : theme.inputBg }
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
