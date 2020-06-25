import React from "react"

import { compareActions, processFormat } from "../utils"

import get from "lodash.get"

export default Component =>
  ({ children, format, registeredFormats, ...props }) => {

    if (!format["$processed"]) {
      format = processFormat(format);
    }
    for (const key in registeredFormats) {
      if (!registeredFormats[key]["$processed"]) {
        registeredFormats[key] = processFormat(registeredFormats[key]);
      }
    }
    const dmsActions = [];
    children = React.Children.toArray(children)
      .reduce((children, child) => {
        if (compareActions(child.props.dmsAction, props.top.dmsAction)) {

          dmsActions.push(...get(child.props, ["dmsActions"], []));

          children.push(React.cloneElement(child,
            { app: props.app,
              type: props.type,
              format,
              registeredFormats,
              dataItems: props.dataItems,
              stack: props.stack,
              top: props.top,
              ...(props.top.props || {}),
              item: props.item,
              makeInteraction: props.makeInteraction,
              makeOnClick: props.makeOnClick,
              interact: props.interact,
              [props.type]: props.item
            }
          ));
        }
        else if (!child.props.dmsAction) {
          children.push(child);
        }
        return children;
      }, [])
      .map(child => {
        if (!compareActions(child.props.dmsAction, props.top.dmsAction)) {
          return React.cloneElement(child,
            { dmsActions,
              app: props.app,
              type: props.type,
              format,
              registeredFormats,
              dataItems: props.dataItems,
              stack: props.stack,
              top: props.top,
              ...(props.top.props || {}),
              item: props.item,
              makeInteraction: props.makeInteraction,
              makeOnClick: props.makeOnClick,
              interact: props.interact,
              [props.type]: props.item
            }
          );
        }
        return child;
      })
    return (
      <Component format={ format } { ...props }>{ children }</Component>
    )
  }
