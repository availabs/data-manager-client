import React, { useEffect, useState, useContext } from "react"

import { DmsContext } from "../contexts"
import { mapDataToProps as getNewProps, getValue } from "../utils"

// import get from "lodash.get"

const createElements = ({ data, ...rest }, interact) =>
  data.map((d, i) =>
    <rest.type key={ d.key } { ...d.props }
      onClick={ !d.interact.length ? null :
        e => interact(...d.interact)
      }>
      { d.value }
    </rest.type>
  )

export default (Component, options = {}) => {
  const {
    // action,
    mapDataToProps,
    // mapDataToComponents,
    defaultAction
  } = options;

  return ({ ...props }) => {
    const dmsProps = useContext(DmsContext),
      newProps = { ...props, ...dmsProps };

    const [action, setAction] = useState(null);
    useEffect(() => {
      if (!action) {
        let newAction = getValue(defaultAction, { props: newProps });
        if (newAction) {
          if (!Array.isArray(newAction)) {
            newAction = [newAction];
          }
          dmsProps.interact(...newAction);
          setAction(newAction);
        }
      }
    })

    const handleData = data => {
      if (Array.isArray(data)) {
        return data.map(handleData);
      }
      if (typeof data === "function") {
        return data(createElements, newProps.interact);
      }
      return data;
    }

    const mapped = getNewProps(mapDataToProps, { props: newProps })

    for (const key in mapped) {
      const data = mapped[key];
      newProps[key] = handleData(data);
    }
    return <Component { ...newProps }/>
  }
}
