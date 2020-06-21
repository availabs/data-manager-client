import React from "react"

import { DmsButton } from "./dms-button"
import Editor from "./editor"

import { Button } from "components/avl-components/components/Button"
import { Input, TextArea, ArrayInput, Select } from "components/avl-components/components/Inputs"
import { verifyValue, hasValue } from "components/avl-components/components/Inputs/utils"

import { prettyKey, hasBeenUpdated, getValue } from "../utils"

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

const InputRow = ({ att, onChange, domain, ...props }) =>
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
            multi={ true } domain={ domain }
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
            <Select domain={ domain } { ...props }  id={ `att:${ att.key }` }
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

const BadAttributeRow = ({ format = {}, onDelete, onReassign, ...props }) => {
  const [reassign, setReassign] = React.useState({});
  return (
    <div className="inline-block">
      <div className="rounded border p-3 pt-1 mt-3">
        <InputRow { ...props } disabled={ true }/>
        <Button onClick={ onDelete } className="w-full">
          Remove Attribute
        </Button>
      </div>
      <div className="rounded border p-3 pt-1 mt-3">
        <Select domain={ format.attributes }
          multi={ false }
          searchable={ false }
          onChange={ setReassign }
          accessor={ d => d.key }
          value={ reassign }/>
        <Button disabled={ !reassign.key } className="w-full"
          onClick={ e => onReassign(reassign.key) }>
          Reassign Attribute { reassign.key ? `to ${ reassign.key }` : "" }
        </Button>
      </div>
    </div>
  )
}
export default class DmsCreate extends React.Component {
  static defaultProps = {
    dmsAction: "create"
  }
  INITIALIZED = false
  state = {}
  componentDidMount() {
    this.INITIALIZED = false;
    this.initState();
  }
  componentDidUpdate(oldProps) {
    !this.INITIALIZED && this.initState();
  }
  initState() {
    this.INITIALIZED = this.initDefaults();
  }
  initDefaults() {
    const newState = {},
      attributes = get(this.props, ["format", "attributes"], []);

    let hasDefaults = false;

    attributes.forEach(att => {
      if (att.default) {
        hasDefaults = true;
        const value = this.getDefaultValue(att);
        hasValue(value) && (newState[att.key] = value);
      }
    })
    const hasData = Object.keys(newState).length;
    hasData && this.setState(state => newState);
    return hasDefaults ? hasData : true;
  }
  handleChange(key, value) {
    this.setState(state => ({ [key]: value }));
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
      }, hasBeenUpdated(data, this.getValues()))
  }
  getDefaultValue(att) {
    const _default = att.default;

    if (/^(from|item|props):/.test(_default)) {
      return getValue(_default, { props: this.props });
    }
    return _default;
  }
  getValues() {
    const values = {
      ...this.state
    }
    let attributes = get(this.props, ["format", "attributes"], [])
    attributes.forEach(att => {
      if (!hasValue(values[att.key])) {
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
  getDomain(att) {
    if (att.domain) {
      if (typeof att.domain === "string") {
        return getValue(att.domain, { props: this.props }) || [];
      }
      return att.domain;
    }
    return null;
  }
  render() {
    const values = this.getValues(),
      item = get(this.props, this.props.type, null);

    const getValue = key => {
      const value = get(values, key, null);
      return value || "";
    }
    const attributes = get(this.props, ["format", "attributes"], []),
      badAttributes = [];

    for (const att in this.state) {
      if (!attributes.some(d => d.key === att) && hasValue(this.state[att])) {
        badAttributes.push(att);
      }
    }
    return (
      <div className="flex w-full justify-center">
        <form onSubmit={ e => e.preventDefault() } className="w-full">
          <div>
            { attributes.map((att, i) =>
                <InputRow key={ att.key } autoFocus={ i === 0 }
                  disabled={ att.editable === false }
                  att={ att } domain={ this.getDomain(att) }
                  value={ getValue(att.key) }
                  onChange={ value => this.handleChange(att.key, value) }/>
              )
            }
          </div>
          { !badAttributes.length ? null :
            <div className="my-4 py-4 border-t-2 border-b-2">
              { badAttributes.map((att, i) =>
                  <BadAttributeRow key={ att }
                    att={ { key: att } }
                    value={ this.state[att] }
                    onDelete={ () => this.handleChange(att, null) }
                    onReassign={ to => {
                      this.handleChange(to, this.state[att]);
                      this.handleChange(att, null);
                    } }
                    format={ this.props.format }/>
                )
              }
            </div>
          }
          <div className="flex justify-end max-w-xl">
            <DmsButton className="w-full max-w-xs" buttonTheme="buttonLargeSuccess"
              disabled={ !this.verify() } type="submit"
              label={ this.props.dmsAction } item={ item }
              action={ this.getButtonAction(values) }/>
          </div>
        </form>
      </div>
    )
  }
}
