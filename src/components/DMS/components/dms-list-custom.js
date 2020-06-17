import React from "react"

import { DmsButton, Title, DmsListRow } from "./parts"

import { Content, Table } from 'components/avl-components/components'

import get from "lodash.get"

import { prettyKey, makeFilter } from "../utils"

const DmsList = ({ ...props }) => {
  const attributes = props.attributes
    .filter(a => (typeof a === "string") && !/^(dms|api):(.+)$/.test(a));

  const actions = props.attributes.filter(a => !attributes.includes(a)),
    span = actions.reduce((a, c) => a + (c.showConfirm ? 2 : 1), 0);

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
  let columns = [
    ...attributes.map(d => {return {accessor: d, Header: d}}),
    ...actions
      .map(a => { 
        return {
          accessor: get(a, "action", a), 
          Header: get(a, "action", a), 
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
      { props.title ? <Title>{ props.title }</Title> : null }
      {/*<Title>Columns</Title>
      {JSON.stringify(columns)}

      <Title>dataItems</Title>
      {JSON.stringify(data)}

      <Title>actions</Title>
      {JSON.stringify(actions)}*/}
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
