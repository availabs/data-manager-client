import React from "react"

import { DmsButton } from "./parts"

import { Content, Table, Header } from 'components/avl-components/components'

import get from "lodash.get"

import { makeFilter,prettyKey } from "../utils"

const DmsList = ({ ...props }) => {
  const attributes = props.attributes
    .filter(a => ((typeof a === "string") && !/^(dms|api):(.+)$/.test(a)) || typeof a === "object");


  const actions = props.attributes.filter(a => !attributes.includes(a));


  const filter = makeFilter(props),
    dataItems = filter ? props.dataItems.filter(filter) : props.dataItems;

  const getAttributeName = att =>
    get(props, ["format", "attributes"], [])
      .reduce((a, c) => c.key === att ? (c.name || prettyKey(c.key)) : a, att);

  

  let columns = [
    // add attributes
    ...attributes
      .map(a => {
        // console.log('a', a)
        return a.accessor ? a : 
        {
          id: a,
          accessor: a,  
          Header: d => getAttributeName(d.column.id) 
        }
      }),
    // add actions    
    ...actions
      .map(a => {
        return {
          accessor: get(a, "action", a),
          Header: d => null,
          Cell: (props) =>  {
            return <DmsButton action={ props.value } item={ props.row } buttonTheme="buttonText" />
          }
        }
      })
  ]

  let data = dataItems
    .map(d => {
      return {
        ...d.data,
        ...actions
          .reduce((o,a) => {
            o[get(a, "action", a)] = a
            return o
          },{})
      }
    })

  return !props.dataItems.length ? null : (
    <Content>
      { props.title ? <Header title={ props.title } /> : null } 
      <Table 
        columns={columns} 
        data={data}
        //onRowClick={d => props.makeInteraction('dms:view', d.original)}
      />
    </Content>
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
