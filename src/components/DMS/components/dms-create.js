import React from "react"

import { Button } from "./parts"

import get from "lodash.get"

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
    const value = Array.isArray(this.props.value) ? this.props.value : [];
    if (value.includes(v)) {
      this.props.onChange(value.filter(vv => vv !== v));
    }
  }
  render() {
    let { att, value, children, ...props } = this.props,
      type = att.type.slice(6);

    value = Array.isArray(value) ? value : [];

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
          { value.map((v, i) =>
              <div key={ v } onClick={ e => this.removeFromArray(v) }
                className="ml-5 mt-1 mb-1">
                { v }
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

const InputRow = ({ att, children, onChange, ...props }) =>
  <tr>
    <td className="align-top p-1">
      <label htmlFor={ `att:${ att.key }` }>{ att.name || att.key }</label>
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
    action: "create"
  }
  state = {}
  handleChange(key, type, value) {
    this.setState({ [key]: value });
  }
  verify() {
    return get(this.props, ["format", "attributes"], [])
      .filter(att => att.editable !== false)
      .reduce((a, c) => {
        if (!c.required) return a;
        return a && Boolean(this.state[c.key]);
      }, true)
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
        if (("default" in att) && !(att in values)) {
          values[att.key] = this.getDefaultValue(att);
        }
      })
    return values;
  }
  create() {
    const values = this.getValues();
window.alert("CREATING: " + JSON.stringify(values))
console.log("VALUES:", values)
    this.props.interact("back");
  }
  render() {
    const values = this.getValues();
console.log("THEME:", this.props.theme)
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
                    onChange={ value => this.handleChange(att.key, att.type, value) }/>
                )
            }
          </tbody>
        </table>
        <div>
          <Button disabled={ !this.verify() }
            onClick={ e => this.create() }>
            { this.props.action }
          </Button>
        </div>
      </div>
    )
  }
}
