import React from "react"

import { Button, ActionButton } from "./parts"

import deepequal from "deep-equal"
import get from "lodash.get"

const ArrayItem = ({ children, onClick, ...props }) =>
  <div className="flex pl-4 mt-1">
    <div className="py-1 px-2 mr-2 bg-white rounded inline-block flex-grow"
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
      <div>
        <div className="flex">
          <input className="py-1 px-2 rounded mr-2" { ...props }
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
        <div className="flex-col">
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

const InputRow = ({ att, children, onChange, ...props }) =>
  <tr>
    <td className="align-top p-1"
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

const getValue = (values, key) => {
  const value = get(values, key, null);
  return value || "";
}

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
  render() {
    const values = this.getValues();
    return (
      <div>
        <table>
          <tbody>
            { get(this.props, ["format", "attributes"], [])
                .map((att, i) =>
                  <InputRow key={ att.key } autoFocus={ i === 0 }
                    disabled={ att.editable === false }
                    att={ att }
                    value={ getValue(values, att.key) }
                    onChange={ value => this.handleChange(att.key, value) }/>
                )
            }
            <tr>
              <td colSpan="2" className="p-1">
                <ActionButton large block disabled={ !this.verify() }
                  onClick={ e => this.create() }
                  action={ this.props.dmsAction }/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
