import React from "react"

import { DmsButton, Title } from "./parts"

import get from "lodash.get"

import { makeFilter } from "../wrappers/dms-falcor"

const DmsList = ({ theme = {}, ...props }) => {
  const attributes = props.attributes
    .filter(a => (typeof a === "string") && !/^(dms|api):(.+)$/.test(a));

  const actions = props.attributes.filter(a => !attributes.includes(a));

  const filter = makeFilter(props),
    dataItems = filter ? props.dataItems.filter(filter) : props.dataItems;

  const getAttributeName = att =>
    get(props, ["format", "attributes"], [])
      .reduce((a, c) => c.key === att ? (c.name || c.key) : a, att)

  return !props.dataItems.length ? null : (
    <div className={ props.className }>
      { props.title ? <Title>{ props.title }</Title> : null }
      <table className="w-full text-left">
        <thead>
          <tr>
            { attributes.map(a =>
                <th key={ a } className="px-1 border-b-2">
                  { getAttributeName(a) }
                </th>
              )
            }
            { actions.map(a => <th key={ get(a, "action", a) } className="px-1 border-b-2"/>) }
          </tr>
        </thead>
        <tbody>
          { dataItems
              .sort((a, b) => new Date(b.updated_at).valueOf() - new Date(a.updated_at).valueOf())
              .map(d =>
                <tr key={ d.id } className={  theme.contentBgHover }>
                  { attributes.map(a =>
                      <td key={ a } className="p-1">
                        { d.data[a] }
                      </td>
                    )
                  }
                  { actions.map(a =>
                      <td key={ get(a, "action", a) } className="text-right p-1">
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
DmsList.defaultProps = {
  dmsAction: "list",
  dataItems: [],
  attributes: [],
  format: {},
  filter: false
}
export default DmsList;
