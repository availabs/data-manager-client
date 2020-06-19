import React from "react"

import { DmsButton, Title } from "./parts"

import get from "lodash.get"

import { prettyKey, makeFilter } from "../utils"
import { useMakeOnClick } from "../wrappers/dms-provider"
import { useTheme } from "components/avl-components/wrappers/with-theme"

const DmsList = ({ ...props }) => {
  const attributes = props.attributes
    .filter(a => (typeof a === "string") && !/^(dms|api):(.+)$/.test(a));

  const actions = props.attributes.filter(a => !attributes.includes(a));

  const filter = makeFilter(props),
    dataItems = filter ? props.dataItems.filter(filter) : props.dataItems;

  const getAttributeName = att =>
    get(props, ["format", "attributes"], [])
      .reduce((a, c) => c.key === att ? (c.name || prettyKey(c.key)) : a, att);

  const makeSort = () =>{
    let { sortBy, sortOrder, transform } = props,
      dir = sortOrder === "desc" ? -1 : 1;
    if (!transform && (sortBy === "updated_at")) {
      transform = v => new Date(v).valueOf();
    }
    else if (!transform) {
      transform = v => v;
    }
    return (a, b) => {
      const av = transform(get(a, sortBy)),
        bv = transform(get(b, sortBy));
      return (av < bv ? -1 : bv < av ? 1 : 0) * dir;
    }
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
            { actions.length ? <th className="border-b-2" colSpan={ actions.length }/> : null }
          </tr>
        </thead>
        <tbody>
          { dataItems.sort(makeSort())
              .map(d =>
                <DmsListRow action="dms:view" item={ d } key={ d.id }>
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
const DmsListRow = ({ children, action, item, ...props }) => {
  return (
    <tr onClick={ useMakeOnClick(action, item, props) } className={ `hover:${ useTheme().accent1 } cursor-pointer` }>
      { children }
    </tr>
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
