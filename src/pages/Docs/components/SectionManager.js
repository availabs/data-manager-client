import React, { useState  }  from "react"

import { List, ListItemAction, Input } from 'components/avl-components/components'


import { DmsButton } from "components/DMS/components/dms-button"


//import get from "lodash.get"

import { makeFilter } from "components/DMS/utils"

const DmsTable = ({ sortBy, sortOrder, columns, initialPageSize, Container, ...props }) => {
	const [newSectionTitle, setNewSectionTitle] = useState('');

  const filter = makeFilter(props),
    dataItems = (filter ? props.dataItems.filter(filter) : props.dataItems);

  // console.log("DATA ITEMS:", dataItems)
  return (
    <div>
      <pre>
        {JSON.stringify(dataItems, null, 4)}
      </pre>
      <Input value={newSectionTitle} onChange={setNewSectionTitle} className='w-full text-xl p-4' />
      <DmsButton 
        action={{
          action: 'api:create',
          seedProps: () => ({section: newSectionTitle, sectionLanding: 1})
        }}
      />
      {!props.dataItems.length ? null : 
      (
        dataItems
          .filter(d => d.data.sectionLanding)
          .map((d,i) => {
          return (
            <List key={i} className='my-3'>
              <ListItemAction 
                item={`(${d.id})-${d.data.section}`} 
                action={
                  <DmsButton 
                    action={{
                      action: 'create',
                      seedProps: () => ({section: d.data.section})
                    }}
                    label={'Add Page'}
                  />
                }
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
