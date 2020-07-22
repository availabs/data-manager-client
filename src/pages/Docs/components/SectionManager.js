import React from "react"
import { List, ListItemAction, Input } from 'components/avl-components/components'
import { Link } from 'react-router-dom'

import { DmsButton } from "components/DMS/components/dms-button"


import get from "lodash.get"

import { makeFilter, prettyKey, getValue, useDmsColumns } from "components/DMS/utils"

const DmsTable = ({ sortBy, sortOrder, columns, initialPageSize, Container, ...props }) => {
	const [attributes, actions] = useDmsColumns(columns);

  const filter = makeFilter(props),
    dataItems = (filter ? props.dataItems.filter(filter) : props.dataItems);

  const data = dataItems
    .map(self => ({
      self,
      ...attributes.reduce((a, c) => {
				const { value, key } = getValue(c.path, { self }, { preserveKeys: true });
        a[key] = value;
        return a;
      }, {}),
      ...actions.reduce((o, a) => {
        o[a.action] = a;
        return o
      }, {}),
			onClick: props.makeOnClick('dms:view', self.id),
			subRows: []
    }))
// console.log("DATA ITEMS:", dataItems)
  return (
    <div>
      <Input className='w-full text-xl p-4' />
      <DmsButton 
        action={{
          action: 'api:create',
          seedProps: () => ({title: 'new section 123'})
        }}
      />
      {!props.dataItems.length ? null : 
      (
        dataItems.map((d,i) => {
          return (
            <List key={i} className='my-3'>
              <ListItemAction 
                item={d.data.title} 
                action={<Link className='rounded bg-blue-400 hover:bg-blue-600 p-2 text-white' to={'/admin/dms:create/'}>Add Page</Link>}
              />
            </List>
          )
        })
      )}
    </div>
  )
}
DmsTable.defaultProps = {
  dmsAction: "list",
  dataItems: [],
  columns: [],
  filter: false,
  sortBy: "updated_at",
  sortOrder: "desc",
  initialPageSize: 10,
  striped: false
}
export default DmsTable;
