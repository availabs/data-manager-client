import React from "react"

import { DmsButton } from "./dms-button"

import { Content, Table, Header } from 'components/avl-components/components'

import get from "lodash.get"

import { makeFilter, prettyKey, processAction, getFormat, getValue, useDmsColumns } from "../utils"

const DmsTable = ({ columns, ...props }) => {
	const [attributes, actions] = useDmsColumns(columns);

  const filter = makeFilter(props),
    dataItems = filter ? props.dataItems.filter(filter) : props.dataItems;

  const getAttributeName = att =>
    get(props, ["format", "attributes"], [])
      .reduce((a, c) => c.key === att ? (c.name || prettyKey(c.key)) : a, att);

  const columnData = [
    // add attributes
    ...attributes
      .map(a => {
        return {
          id: a.source,
          accessor: d => d[a.source],
          Header: getAttributeName(a.key)
        }
      }),
      // .map(a => {
      //   return {
      //     id: a.source,
      //     accessor: d => a.format(getValue(a.source, d)),
      //     Header: d => getAttributeName(d.column.id.split(/[:.]/).pop()),
      //     ...a
      //   }
      // }),
    // add actions
    ...actions
      .map(a => {
        return {
          accessor: a.action,
          Header: d => null,
          Cell: cell =>
            <DmsButton action={ a } item={ cell.row.original.self }
              buttonTheme={ props.buttonTheme }/>
        }
      })
  ]

  const data = dataItems
    .map(self => ({
      self,
      ...attributes.reduce((a, c) => {
        a[c.source] = c.format(getValue(c.source, { self }));
        return a;
      }, {}),
      ...actions.reduce((o, a) => {
        o[a.action] = a;
        return o
      }, {})
    }))
// console.log("DATA ITEMS:", dataItems)
  return !props.dataItems.length ? null : (
    <Content>
      { props.title ? <Header title={ props.title } /> : null }
      <Table data={ data }
        columns={ columnData }
        // onRowClick={ d => props.makeInteraction('dms:view', d.original) }
      />
    </Content>
  )
}
DmsTable.defaultProps = {
  dmsAction: "list",
  dataItems: [],
  columns: [],
  format: {},
  filter: false,
  sortBy: "updated_at",
  sortOrder: "desc",
  transform: null,
  theme: {}
}
export default DmsTable;
