import React from "react"

import { DmsButton } from "./parts"

import { Content, Table, Header } from 'components/avl-components/components'

import get from "lodash.get"

import { makeFilter } from "../utils"

const DmsList = ({ ...props }) => {
  const attributes = props.attributes
    .filter(a => (typeof a === "string") && !/^(dms|api):(.+)$/.test(a));

  const actions = props.attributes.filter(a => !attributes.includes(a))
    //span = actions.reduce((a, c) => a + (c.showConfirm ? 2 : 1), 0);

  const filter = makeFilter(props),
    dataItems = filter ? props.dataItems.filter(filter) : props.dataItems;

  // const getAttributeName = att =>
  //   get(props, ["format", "attributes"], [])
  //     .reduce((a, c) => c.key === att ? (c.name || prettyKey(c.key)) : a, att);

  

  let columns = [
    ...attributes.map(d => {return {accessor: d, Header: d}}),
    ...actions
      .map(a => { 
        return {
          accessor: get(a, "action", a), 
          Header: get(a, "action", a).split(':')[1], 
          Cell: props =>  {
            console.log('props', props)
            return <DmsButton action={ props.value } item={ props.row } small/>
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
            o[get(a, "action", a)] = get(a, "label", a)
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
