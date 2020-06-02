import React from "react"

import { DmsButton, Title } from "./parts"

import get from "lodash.get"

import { makeFilter } from "../wrappers/dms-falcor"

export default class DmsList extends React.Component {
  static defaultProps = {
    dmsAction: "list",
    dataItems: [],
    attributes: [],
    format: {},
    filter: false
  }
  getAttributeName(att) {
    return get(this.props, ["format", "attributes"], [])
      .reduce((a, c) => c.key === att ? (c.name || c.key) : a, att)
  }
  render() {
    const attributes = this.props.attributes
      .filter(a => (typeof a === "string") && !/^(dms|api):(.+)$/.test(a));

    const actions = this.props.attributes.filter(a => !attributes.includes(a));

    const filter = makeFilter(this.props),
      dataItems = filter ? this.props.dataItems.filter(filter) : this.props.dataItems;

    return !this.props.dataItems.length ? null : (
      <div className={ this.props.className }>
        { this.props.title ? <Title>{ this.props.title }</Title> : null }
        <table className="w-full text-left">
          <thead>
            <tr>
              { attributes.map(a =>
                  <th key={ a } className="px-1 border-b-2">
                    { this.getAttributeName(a) }
                  </th>
                )
              }
              { actions.map(a => <th key={ get(a, "action", a) } className="px-1 border-b-2"/>) }
            </tr>
          </thead>
          <tbody>
            { dataItems.map(d =>
                <tr key={ d.id }>
                  { attributes.map(a =>
                      <td key={ a } className="p-1">
                        { d.data[a] }
                      </td>
                    )
                  }
                  { actions.map(a =>
                      <td key={ get(a, "action", a) } className="text-center p-1">
                        <DmsButton action={ a } item={ d } small/>
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
