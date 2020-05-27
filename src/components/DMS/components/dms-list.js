import React from "react"

import { Button, Title } from "./parts"

import get from "lodash.get"

const makeAuthRule = (rule, props, item) => {
  let { path, args, comparator } = rule;
  args = args.map(a => {
    if ((typeof a === "string") && a.includes("from:")) {
      return get(props, a.slice(5));
    }
    return a;
  })
  return comparator(get(item, path, item), ...args);
}

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
    const { attributes, authRules } = this.props;

    return !this.props.dataItems.length ? null : (
      <div className={ this.props.className }>
        { this.props.title ? <Title>{ this.props.title }</Title> : null }
        <table className="w-full text-left">
          <thead>
            <tr>
              { attributes.filter(a => !/action:/.test(a))
                  .map(a => <th key={ a }>{ this.getAttributeName(a) }</th>)
              }
              { attributes.filter(a => /action:/.test(a))
                  .map(a => <th key={ a }/>)
              }
            </tr>
          </thead>
          <tbody>
            { this.props.dataItems.map(d =>
                <tr key={ d.id }>
                  { attributes.filter(a => !/action:/.test(a))
                      .map(a =>
                        <td key={ a }>
                          { d.data[a] }
                        </td>
                      )
                  }
                  { attributes.filter(a => /action:/.test(a))
                      .map(a => a.replace("action:", ""))
                      .map(a =>
                        <td key={ a }>
                          <Button onClick={ e => this.props.interact(a, d.id) }
                            disabled={ a in authRules ? !makeAuthRule(authRules[a], this.props, d) : false }>
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
      </div>
    )
  }
}
