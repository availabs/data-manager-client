import React from "react"

import { Button, DmsButton, getButtonClassName } from "./parts"

import deepequal from "deep-equal"
import get from "lodash.get"

import "./style.css"

const ArrayItem = ({ children, onClick, ...props }) =>
  <div className="flex pl-4 mt-1">
    <div className="py-1 px-2 mr-1 bg-white rounded inline-block flex-grow"
      { ...props }>
      { children }
    </div>
    <Button onClick={ onClick }>
      remove
    </Button>
  </div>

class ArrayInput extends React.Component {
  state = {
    value: ""
  }
  addToArray() {
    const value = Array.isArray(this.props.value) ? this.props.value : [];
    if (!value.includes(this.state.value)) {
      this.props.onChange([...value, this.state.value]);
    }
    this.setState({ value: "" });
    document.getElementById(`att:${ this.props.att.key }`).focus();
  }
  removeFromArray(v) {
    let value = Array.isArray(this.props.value) ? this.props.value : [];
    if (value.includes(v)) {
      value = value.filter(vv => vv !== v);
    }
    if (value.length === 0) {
      value = null;
    }
    this.props.onChange(value);
  }
  render() {
    const { att, value, children, ...props } = this.props,
      type = att.type.slice(6);

    return (
      <div className="w-full">
        <div className="flex">
          <input className="p-1 px-2 rounded mr-1 w-full" { ...props }
            id={ `att:${ att.key }` } type={ type }
            value={ this.state.value }
            onChange={ e => this.setState({ value: e.target.value })}>
            { children }
          </input>
          <Button onClick={ e => this.addToArray() }
            disabled={ !this.state.value }>
            add
          </Button>
        </div>
        <div className="flex flex-col">
          { !value ? null : value.map((v, i) =>
              <ArrayItem key={ v }
                onClick={ e => this.removeFromArray(v) }>
                { v }
              </ArrayItem>
            )
          }
        </div>
      </div>
    )
  }
}

class ImgInput extends React.Component {
  state = {
    value: "",
    hovering: false,
    message: ""
  }
  dragEnter(e) {
    this.stopIt(e);

    this.setState({ hovering: true });
  }
  onDragExit(e) {
    this.stopIt(e);

    this.setState({ hovering: false });
  }
  stopIt(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  async dropIt(e) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({ hovering: false });

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
      return;
    }
    if (file.size > 10000000) {
      this.setState({ message: "File was too large." });
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
    const { att, onChange, value, ...props } = this.props;

    return (
      <div className={ `
          w-full h-64 border-2 rounded p-2 border-dashed
          flex items-center justify-center relative
          ${ this.state.hovering ? "border-gray-500" : "" }
          load-image-input
        ` }
        onDragEnter={ e => this.dragEnter(e) }
        onDragLeave={ e => this.onDragExit(e) }
        onDragOver={ e => this.stopIt(e) }
        onDrop={ e => this.dropIt(e) }>

        { value ?
            <img src={ value } className="max-w-full max-h-full"/>
          :
            <div className="flex flex-col items-center">
              <div>
                <label className={ getButtonClassName({}) }
                  htmlFor="choose-image">Select an image file...</label>
                <input className="py-1 px-2 w-full rounded hidden" id="choose-image"
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
              flex justify-center items-center
              remove-image-button
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

const InputRow = ({ att, children, onChange, ...props }) =>
  <tr>
    <td className="align-top py-1 pl-1 pr-5"
      onClick={ e => document.getElementById(`att:${ att.key }`).focus() }>
      <div className="w-full py-1">
        { att.name || att.key }
      </div>
    </td>
    <td className="p-1">
      { att.type === "textarea" ?
          <textarea className="block w-full py-1 px-2 rounded" { ...props }
            id={ `att:${ att.key }` }
            onChange={ e => onChange(e.target.value) }>
            { children }
          </textarea>
        : att.type === "img" ?
          <ImgInput { ...props } att={ att } onChange={ v => onChange(v) }/>
        : att.type.includes("array:") ?
          <ArrayInput { ...props } att={ att } onChange={ v => onChange(v) }>
              { children }
          </ArrayInput>
        : <input className="py-1 px-2 w-full rounded" { ...props }
            id={ `att:${ att.key }` } type={ att.type }
            onChange={ e => onChange(e.target.value) }>
            { children }
          </input>
      }
    </td>
  </tr>

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
      data = get(item, "data");

    return get(this.props, ["format", "attributes"], [])
      .filter(att => att.editable !== false)
      .reduce((a, c) => {
        if (!c.required) return a;
        return a && Boolean(this.state[c.key]);
      }, !deepequal(data, this.state))
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
    get(this.props, ["format", "attributes"], [])
      .forEach(att => {
        if (("default" in att) && !(att.key in values)) {
          values[att.key] = this.getDefaultValue(att);
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

    return (
      <div>
        <form onSubmit={ e => e.preventDefault() }>
          <table>
            <tbody>
              { get(this.props, ["format", "attributes"], [])
                  .map((att, i) =>
                    <InputRow key={ att.key } autoFocus={ i === 0 }
                      disabled={ att.editable === false }
                      att={ att }
                      value={ getValue(att.key) }
                      onChange={ value => this.handleChange(att.key, value) }/>
                  )
              }
              <tr>
                <td colSpan={ 2 } className="p-1">
                  <DmsButton large block disabled={ !this.verify() } type="submit"
                    label={ this.props.dmsAction } item={ item }
                    action={ this.getButtonAction(values) }/>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    )
  }
}
