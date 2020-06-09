import React from "react"

import { DmsButton, Title, DmsListRow } from "./parts"

import get from "lodash.get"

import { makeFilter } from "../wrappers/dms-falcor"

const DmsList = ({ ...props }) => {
  const attributes = props.attributes
    .filter(a => (typeof a === "string") && !/^(dms|api):(.+)$/.test(a));

  const actions = props.attributes.filter(a => !attributes.includes(a)),
    span = actions.reduce((a, c) => a + (c.showConfirm ? 2 : 1), 0);

  const filter = makeFilter(props),
    dataItems = filter ? props.dataItems.filter(filter) : props.dataItems;

  const getAttributeName = att =>
    get(props, ["format", "attributes"], [])
      .reduce((a, c) => c.key === att ? (c.name || c.key) : a, att);

  const makeSort = () =>{
    let { sortBy, sortOrder, transform } = props,
      dir = sortOrder === "desc" ? -1 : 1;
    if (!transform && (sortBy === "updated_at")) {
      transform = v => new Date(v).valueOf();
    }
    else if (!transform) {
      transform = v => v;
    }
    return (a, b) => (transform(get(a, sortBy)) - transform(get(b, sortBy))) * dir;
  }

  return !props.dataItems.length ? null : (
    <div className={ props.className }>
      { props.title ? <Title>{ props.title }</Title> : null }
      <table className="w-full text-left">
        <thead>
          <tr>
            { attributes.map(a =>
                <th key={ a } className="px-3 border-b-2">
                  { getAttributeName(a) }
                </th>
              )
            }
            { actions.length ? <th className="border-b-2" colSpan={ span }/> : null }
          </tr>
        </thead>
        <tbody>
          { dataItems.sort(makeSort())
              .map(d =>
                <DmsListRow key={ d.id } className={ props.theme.contentBgHover } action="dms:view" item={ d }>
                  { attributes.map(a =>
                      <td key={ a } className="py-1 px-3">
                        { d.data[a] }
                      </td>
                    )
                  }
                  { actions.map(a =>
                      <td key={ get(a, "action", a) } className="text-right p-1">
                        <div className="flex items-center justify-end">
                          <DmsButton action={ a } item={ d } small/>
                        </div>
                      </td>
                    )
                  }
                </DmsListRow>
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
  filter: false,
  sortBy: "updated_at",
  sortOrder: "desc",
  transform: null,
  theme: {}
}
export default DmsList;
