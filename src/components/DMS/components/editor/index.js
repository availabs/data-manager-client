import React from "react"

import AvlModal from "components/avl-components/components/Modal/avl-modal"

import get from "lodash.get"
import debounce from "lodash.debounce"
import throttle from "lodash.throttle"

import { useTheme } from "components/avl-components/wrappers/with-theme"
import imgLoader from "components/avl-components/wrappers/img-loader"
import showLoading from "components/avl-components/wrappers/show-loading"

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

const getSavedStateId = props =>
  `saved-editor-state-${ props.id }-${ props.itemId }`;

class MyEditor extends React.Component {
  static defaultProps = {
    disabled: false,
    autoFocus: false,
    id: "draft-js-editor",
    itemId: "",
    showModal: false
  }
  editor = null;
  state = {
    editorState: EditorState.createEmpty(),
    hasFocus: false,
    loadedFromSavedState: false,
    saved: null,
    showModal: false
  }
  componentDidMount() {
    if (this.props.value) {
      this.loadFromSavedState(convertFromRaw(this.props.value));
    }
    else {
      this.loadFromLocalStorage();
    }
  }
  componentWillUnmount() {
    this.editor = null;
    this.updateProps.flush();
    this.saveToLocalStorage.flush();
  }
  componentDidUpdate(oldProps) {
    if (!this.props.loading && !this.state.loadedFromSavedState &&
        !oldProps.value && this.props.value &&
        !this.state.editorState.getCurrentContent().hasText()) {
      this.loadFromSavedState(convertFromRaw(this.props.value));
    }
    this.saveToLocalStorage();
  }
  loadFromLocalStorage() {
    if (window.localStorage) {
      let saved = JSON.parse(window.localStorage.getItem(getSavedStateId(this.props)));
      if (saved) {
        if ((saved = convertFromRaw(saved)).hasText()) {
          this.setState({ showModal: true, saved });
        }
        else {
          window.localStorage.removeItem(getSavedStateId(this.props));
          this.focusEditor();
        }
      }
      else {
        this.focusEditor();
      }
    }
  }
  loadFromSavedState(content) {
    const editorState = EditorState.createWithContent(content);
    this.setState(
      state => ({ loadedFromSavedState: true, editorState, saved: null }),
      () => this.focusEditor()
    );
  }
  _saveToLocalStorage() {
    if (window.localStorage) {
      const currentContent = this.state.editorState.getCurrentContent(),
        saved = convertToRaw(currentContent);
      window.localStorage.setItem(getSavedStateId(this.props), JSON.stringify(saved));
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
    this.editor && this.editor.focus();
  }
  handleChange(editorState) {
    this.setState(state => ({ editorState }));
    this.updateProps();
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
    const { editorState, hasFocus } = this.state;

    return (
      <EditorWrapper id={ this.props.id } hasFocus={ hasFocus }
        onDrop={ e => this.dropIt(e) }>

        <div className="px-2 pb-2 clearfix">
          <Editor ref={ n => this.editor = n } placeholder="Type a value..."
            editorState={ editorState }
            onChange={ editorState => this.handleChange(editorState) }
            plugins={ plugins }
            readOnly={ this.props.disabled }
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

        { this.props.children }

        <AvlModal show={ this.state.showModal }
          onHide={ e => {
            window.localStorage.removeItem(getSavedStateId(this.props));
            this.setState({ showModal: false, saved: null }, () => this.focusEditor());
          } }
          actions={ [
            { label: "Load From Local Storage",
              action: e => this.loadFromSavedState(this.state.saved)
            }
          ] }>
          <div style={ { width: "32rem" } }>
            <div>Found saved editor data in local storage. Do you wish to load this saved data?</div>
            <div>Data will deleted if not loaded.</div>
          </div>
        </AvlModal>

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
