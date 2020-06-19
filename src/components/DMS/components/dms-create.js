import React from "react"

import { DmsButton } from "./parts"
import Editor from "./editor"

import { Input, TextArea, ArrayInput, Select } from "components/avl-components/components/Inputs"
import { verifyValue, hasValue } from "components/avl-components/components/Inputs/utils"

import { prettyKey, hasBeenUpdated } from "../utils"

import { get } from "lodash"

class ImgInput extends React.Component {
  state = {
    value: "",
    draggingOver: false,
    message: ""
  }
  dragOver(e) {
    this.stopIt(e);

    this.setState(state => ({ draggingOver: true }));
  }
  onDragExit(e) {
    this.stopIt(e);

    this.setState(state => ({ draggingOver: false }));
  }
  stopIt(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  async dropIt(e) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({ draggingOver: false });

    await this.loadImage(get(e, ["dataTransfer", "files", 0], null));
  }
  async handleChange(e) {
    e.preventDefault();
    e.stopPropagation();

    await this.loadImage(get(e, ["target", "files", 0], null));
  }
  async loadImage(file) {
    if (!file) return;
    if (!/^image[/]/.test(file.type)) {
      this.setState({ message: "File was not an image." });
      this.props.onChange(null);
      return;
    }
    if (file.size > 250000) {
      this.setState({ message: "File was too large." });
      this.props.onChange(null);
      return;
    }

    this.setState({ message: "" });

    const reader = new FileReader();
    reader.readAsDataURL(file);

    const result = await new Promise(resolve => {
      reader.addEventListener("load", (...args) => {
        resolve(reader.result);
      })
    })
    this.props.onChange(result);
  }
  removeImage(e) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({ message: "" });
    this.props.onChange(null);
  }
  render() {
    const { value } = this.props;

    return (
      <div className={ `
          w-full h-64 border-2 rounded p-2 border-dashed
          flex items-center justify-center relative
          ${ this.state.draggingOver ? "border-gray-500" : "" }
          hoverable
        ` }
        onDragOver={ e => this.dragOver(e) }
        onDragLeave={ e => this.onDragExit(e) }
        onDrop={ e => this.dropIt(e) }>

        { value ?
            <img src={ value } alt={ value  }className="max-w-full max-h-full"/>
          : this.state.draggingOver ?
            <span className="far fa-image fa-9x pointer-events-none opacity-50"/>
          :
            <div className="flex flex-col items-center">
              <div>
                <label className={ null }
                  htmlFor={ this.props.id }>Select an image file...</label>
                <input className="py-1 px-2 w-full rounded hidden" id={ this.props.id }
                  type="file" accept="image/*" placeholder="..."
                  onChange={ e => this.handleChange(e) }/>
              </div>
              <div>...or drag and drop.</div>
              <div>{ this.state.message }</div>
            </div>
        }
        { !value ? null :
          <div className={ `
              absolute right-2 top-2 z-10
              rounded bg-red-500 p-1
              cursor-pointer
              show-on-hover
            ` }
            onClick={ e => this.removeImage(e) }>
            <svg width="20" height="20">
              <line x2="20" y2="20" style={ { stroke: "#fff", strokeWidth: 4 } }/>
              <line y1="20" x2="20" style={ { stroke: "#fff", strokeWidth: 4 } }/>
            </svg>
          </div>
        }
      </div>
    )
  }
}

const InputRow = ({ att, onChange, ...props }) =>
  <div className="my-2">
    <div>
      <label className="block w-full py-1" htmlFor={ `att:${ att.key }` }>
        { att.name || prettyKey(att.key) }
      </label>
    </div>
    <div>
      { /^(.+?)-array$/.test(att.type) && att.domain ?
        <div className="max-w-xl">
          <Select { ...props } id={ `att:${ att.key }` }
            multi={ true } domain={ att.domain }
            onChange={ v => onChange(v) } searchable={ att.searchable }/>
        </div>
      : /^(.+?)-array$/.test(att.type) ?
        <div className="max-w-xl">
          <ArrayInput id={ `att:${ att.key }` } { ...props }
            type={  att.type.replace("-array", "") }
            onChange={ v => onChange(v) } placeholder={ `Type a value...`}/>
        </div>
      : att.type === "rich-text" ?
        <Editor { ...props } id={ `att:${ att.key }` }
          onChange={ v => onChange(v) }/>
      : att.type === "textarea" ?
          <div className="max-w-xl">
            <TextArea { ...props } id={ `att:${ att.key }` } rows="6"
              onChange={ v => onChange(v) }
              placeholder={ `Type a value...`}/>
          </div>
        : att.type === "img" ?
          <div className="max-w-xl">
            <ImgInput { ...props } id={ `att:${ att.key }` }
              onChange={ v => onChange(v) }/>
          </div>
        : att.domain ?
          <div className="max-w-xl">
            <Select domain={ att.domain } { ...props }  id={ `att:${ att.key }` }
              onChange={ v => onChange(v) } multi={ false } searchable={ att.searchable }/>
          </div>
        :
          <div className="max-w-xl">
            <Input { ...props } id={ `att:${ att.key }` } type={ att.type }
              min={ att.min } max={ att.max } placeholder={ `Type a value...`}
              onChange={ v => onChange(v) } required={ att.required }/>
          </div>
      }
    </div>
  </div>

export default class DmsCreate extends React.Component {
  static defaultProps = {
    dmsAction: "create"
  }
  state = {}
  handleChange(key, value) {
    this.setState({ [key]: value });
  }
  verify() {
    const item = get(this.props, this.props.type, null),
      data = get(item, "data", {});

    return get(this.props, ["format", "attributes"], [])
      .filter(att => att.editable !== false)
      .reduce((a, c) => {
        const value = this.state[c.key],
          asArray = !Array.isArray(value) ? [value] : value,
          has = hasValue(value);

        if (c.type !== "rich-text") {
          if (!asArray.reduce((a, v) =>
            has ? a && verifyValue(v, c.type, c.verify) : a
          , true)) return false;

          if (has && (c.type === "number")) {
            const { min, max } = c;
            if ((min !== undefined) && (+value < min)) return false;
            if ((max !== undefined) && (+value > max)) return false;
          }
        }

        return !c.required ? a : (a && Boolean(value));
      }, hasBeenUpdated(data, this.state))
  }
  getDefaultValue(att) {
    const _default = att.default;

    if (_default.includes("from:")) {
      const path = _default.slice(5);
      return get(this.props, path, null);
    }
    return _default;
  }
  getValues() {
    const values = {
      ...this.state
    }
    let attributes = get(this.props, ["format", "attributes"], [])
    attributes
      .forEach(att => {
        if (("default" in att) && !(att.key in values)) {
          values[att.key] = this.getDefaultValue(att);
        }
        else if (!hasValue(values[att.key])) {
          delete values[att.key];
        }
      })
    return values;
  }
  create() {
    const values = this.getValues();
    this.props.interact(`api:create`, null, values);
  }
  getButtonAction(values) {
    return {
      action: "api:create",
      seedProps: () => values
    }
  }
  render() {
    const values = this.getValues(),
      item = get(this.props, this.props.type, null);

    const getValue = key => {
      const value = get(values, key, null);
      return value || "";
    }
    const attributes = get(this.props, ["format", "attributes"], []);

    return (
      <div className="flex w-full justify-center">
        <form onSubmit={ e => e.preventDefault() } className="w-full">
          { attributes.map((att, i) =>
              <InputRow key={ att.key } autoFocus={ i === 0 }
                disabled={ att.editable === false }
                att={ att }
                value={ getValue(att.key) }
                onChange={ value => this.handleChange(att.key, value) }/>
            )
          }
          <div className="flex justify-end max-w-xl">
            <DmsButton className="w-full max-w-xs" buttonTheme="buttonLargeSuccess" disabled={ !this.verify() } type="submit"
              label={ this.props.dmsAction } item={ item }
              action={ this.getButtonAction(values) }/>
          </div>
        </form>
      </div>
    )
  }
}
