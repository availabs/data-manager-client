import React from "react"

import { DndList, useTheme } from "@availabs/avl-components"
import { DmsButton } from "components/dms/components/dms-button"
import { useMakeOnClick } from "components/dms/wrappers/dms-provider"

const ListItem = ({ item, children }) => {
  const theme = useTheme();
  return (
    <div className={ `${ theme.listItem } cursor-pointer` }
      onClick={ useMakeOnClick("view", item) }>
      { children }
    </div>
  )
}

const ListView = ({ dataItems, interact }) => {
  const onDrop = React.useCallback((start, end) => {
    const min = Math.min(start, end),
      max = Math.max(start, end),

      temp = [...dataItems].sort((a, b) => a.data.index - b.data.index),
      [item] = temp.splice(start, 1);
    temp.splice(end, 0, item);

    for (let i = min; i <= max; ++i) {
      interact("api:edit", temp[i].id, { ...temp[i].data, index: i }, { loading: false });
      temp[i].data.index = i; // <-- this is temp. It just makes the list look nice until data is updated
    }
  }, [dataItems, interact]);

  React.useEffect(() => {
// this effect is needed to update indices after a delete
    [...dataItems].sort((a, b) => a.data.index - b.data.index)
      .forEach((item, i) => {
        if (item.data.index !== i) {
          interact("api:edit", item.id, { ...item.data, index: i }, { loading: false });
        }
      })
  }, [dataItems, interact]);

  return (
    <DndList onDrop={ onDrop }>
      { [...dataItems].sort((a, b) => a.data.index - b.data.index)
          .map(item =>
            <ListItem key={ item.id } item={ item }>
              <div className="flex items-center">
                <div className="flex-1">
                  { item.data.page }
                </div>
                <DmsButton className="flex-0" item={ item }
                  action="dms:edit"/>
                <DmsButton className="flex-0 ml-1" item={ item }
                  action={ {
                    action: "api:delete",
                    showConfirm: true
                  } }/>
              </div>
            </ListItem>
          )
      }
    </DndList>
  )
}
export default ListView
