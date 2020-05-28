import React from "react"

import { DmsButton, Title } from "./parts"

import get from "lodash.get"

export default class DmsList extends React.Component {
  static defaultProps = {
    action: "list",
    dataItems: [],
    attributes: [],
    format: {}
  }
  getAttributeName(att) {
    return get(this.props, ["format", "attributes"], [])
      .reduce((a, c) => c.key === att ? (c.name || c.key) : a, att)
  }
  render() {
    const attributes = this.props.attributes
      .filter(a => (typeof a === "string") && !/^action:(.+)$/.test(a));

    const actions = this.props.attributes.filter(a => !attributes.includes(a));

    return !this.props.dataItems.length ? null : (
      <div className={ this.props.className }>
        { this.props.title ? <Title>{ this.props.title }</Title> : null }
        <table className="w-full text-left">
          <thead>
            <tr>
              { attributes.map(a => <th key={ a }>{ this.getAttributeName(a) }</th>) }
              { actions.map(a => <th key={ get(a, "action", a) }/>) }
            </tr>
          </thead>
          <tbody>
            { this.props.dataItems.map(d =>
                <tr key={ d.id }>
                  { attributes.map(a =>
                      <td key={ a }>
                        { d.data[a] }
                      </td>
                    )
                  }
                  { actions.map(a =>
                      <td key={ get(a, "action", a) }>
                        <DmsButton action={ a } item={ d }
                          interact={ this.props.interact }/>
                      </td>
                    )
                  }
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    )
  }
}
