import React from "react"

import {
  Button,
  Title
} from "./parts"

import get from "lodash.get"

const DmsInput = ({ att, children, ...props }) =>
  <tr>
    <td className="align-top p-1">
      <label htmlFor={ `att:${ att.key }` }
        className="w-10">{ att.name || att.key }</label>
    </td>
    <td className="p-1">
      { att.type === "textarea" ?
          <textarea className="py-1 px-2 rounded" { ...props } id={ `att:${ att.key }` }>
            { children }
          </textarea>
        : <input className="py-1 px-2 rounded" { ...props } id={ `att:${ att.key }` } type={ att.type }>
            { children }
          </input>
      }
    </td>
  </tr>

export default class DmsCreate extends React.Component {
  static defaultProps = {
    action: "create"
  }
  state = {}
  handleChange(key, value) {
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
    return (
      <div>
        <table>
          <tbody>
            { get(this.props, ["format", "attributes"], [])
                .map((att, i) =>
                  <DmsInput key={ att.key } autoFocus={ i === 0 }
                    disabled={ att.editable === false }
                    att={ att }
                    value={ values[att.key] === null ? "" : values[att.key] }
                    onChange={ e => this.handleChange(att.key, e.target.value) }/>
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
