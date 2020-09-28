import React from "react"

import { Input } from "components/avl-components/components/Inputs"
import DndList from "components/avl-components/components/List/DndList"
import { useTheme } from "components/avl-components/wrappers/with-theme"

import { DmsButton } from "components/dms/components/dms-button"

const ListItem = ({ children }) => {
  const theme = useTheme();
  return (
    <div className={ theme.listItem }>
      { children }
    </div>
  )
}

export default ({ dataItems, interact, ...props }) => {
  const [text, setText] = React.useState("");

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
  }, [dataItems, interact])

  return (
    <div className="flex">
      <div className="flex-1 container m-auto mt-10">
        <div className="flex mb-2">
          <Input className="mr-2" value={ text } onChange={ setText }/>
          <DmsButton disabled={ !text }
            action={ {
              action: "api:create",
              seedProps: () => ({ text, index: dataItems.length }),
              then: () => setText("")
            } }/>
        </div>
        <DndList onDrop={ onDrop }>
          { [...dataItems].sort((a, b) => a.data.index - b.data.index)
              .map(item =>
                <ListItem key={ item.id }>
                  <div className="flex items-center">
                    <div className="flex-1">
                      ({ item.id }) { item.data.text } ({ item.data.index })
                    </div>
                    <DmsButton className="flex-0" small item={ item }
                      action={ {
                        action: "api:delete"
                      } }/>
                  </div>
                </ListItem>
              )
          }
        </DndList>
      </div>
    </div>
  )
}
