import React from "react"

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

import { Input } from "components/avl-components/components/Inputs"
import { useTheme } from "components/avl-components/wrappers/with-theme"

import { DmsButton } from "components/DMS/components/dms-button"

// const range = num => {
//   const range = [];
//   for (let i = 0; i < num; ++i) {
//     range.push(i);
//   }
//   return range;
// }
// const makeData = (length = 9) =>
//   range(length).map(i => ({
//     id: i,
//     data: {
//       index: i,
//       text: `text-${ i }`
//     }
//   }))
//
// let Items = makeData();

const DraggableItem = ({ id, index, children }) =>
  <Draggable draggableId={ `draggable-${ id }` } index={ index }>
    { provided => (
        <div ref={ provided.innerRef } className="flex"
          { ...provided.draggableProps }
          { ...provided.dragHandleProps }>
          <div className="flex-1">
            { children }
          </div>
        </div>
      )
    }
  </Draggable>

const ListItem = ({ children }) => {
  const theme = useTheme();
  return (
    <div className={ theme.listItem }>
      { children }
    </div>
  )
}

const DndList = ({ onDrop, children }) => {
  const onDragEnd = React.useCallback(result => {
    if (!result.destination) return;

    const start = result.source.index,
      end = result.destination.index;

    if (start === end) return;

    onDrop(start, end);
  }, [onDrop]);
  const theme = useTheme();

  return (
    <DragDropContext onDragEnd={ onDragEnd }>
      <Droppable droppableId={ "my-list" } className="box-content">
        { (provided, snapshot) => (
            <div ref={ provided.innerRef }
              { ...provided.droppableProps }
              className={ `flex flex-col
                ${ snapshot.isDraggingOver ? theme.listDragging : theme.list }
              ` }>
              <div>
                { React.Children.toArray(children).map((child, i) =>
                    <DraggableItem key={ child.key }
                      id={ child.key }
                      index={ i }>
                      { child }
                    </DraggableItem>
                  )
                }
              </div>
              { provided.placeholder }
            </div>
          )
        }
      </Droppable>
    </DragDropContext>
  )
}
DndList.defaultProps = {
  items: [],
  idAccessor: d => d.id,
  indexAccessor: d => d.index,
  onDrop: (start, end) => {}
}

export default ({ dataItems, interact, ...props }) => {
  const [text, setText] = React.useState("");

  const onDrop = React.useCallback((start, end) => {
    const min = Math.min(start, end),
      max = Math.max(start, end),

      temp = [...dataItems],
      [item] = temp.splice(start, 1);
    temp.splice(end, 0, item);

    for (let i = min; i <= max; ++i) {
      const item = temp[i];
      interact("api:edit", item.id, { ...item.data, index: i });
      item.data.index = i; // <-- this is temp. It just makes the list look nice until data is updated
    }
  }, [dataItems, interact]);

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
          { dataItems.sort((a, b) => a.data.index - b.data.index)
              .map(item =>
                <ListItem key={ item.id }>
                  <div className="flex items-center">
                    <div className="flex-1">
                      ({ item.id }) { item.data.text } ({ item.data.index })
                    </div>
                    <DmsButton className="flex-0"
                      small item={ item }
                      action="api:delete"/>
                  </div>
                </ListItem>
              )
          }
        </DndList>
      </div>
    </div>
  )
}
