import React from "react"

import { Button } from "./parts"

import get from "lodash.get"

export default class DmsList extends React.Component {
  static defaultProps = {
    action: "list",
    attributes: [],
    format: {}
  }
  getAttributeName(att) {
    return get(this.props, ["format", "attributes"], [])
      .reduce((a, c) => c.key === att ? (c.name || c.key) : a, att)
  }
  render() {
    return (
      <table style={ { width: "100%", textAlign: "left" } }>
        <thead>
          <tr>
            { this.props.attributes
                .filter(a => !/action:/.test(a))
                .map(a => <th key={ a }>{ this.getAttributeName(a) }</th>)
            }
            { this.props.attributes
                .filter(a => /action:/.test(a))
                .map(a => <th key={ a }/>)
            }
          </tr>
        </thead>
        <tbody>
          { this.props.dataItems.map(d =>
              <tr key={ d.id }>
                { this.props.attributes
                    .filter(a => !/action:/.test(a))
                    .map(a =>
                      <td key={ a }>
                        { d[a] }
                      </td>
                    )
                }
                { this.props.attributes
                    .filter(a => /action:/.test(a))
                    .map(a => a.replace("action:", ""))
                    .map(a =>
                      <td key={ a }>
                        <Button onClick={ e => this.props.interact(a, d.id) }>
                          { a }
                        </Button>
                      </td>
                    )
                }
              </tr>
            )
          }
        </tbody>
      </table>
    )
  }
}
