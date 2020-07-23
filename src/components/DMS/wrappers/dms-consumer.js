import React, { useState, useEffect } from "react"

import { useDms } from "../contexts/dms-context"
import { mapDataToProps as doMapDataToProps, getValue } from "../utils"

// import get from "lodash.get"

const createElements = ({ data, Comp }, interact) =>
  data.map((d, i) =>
    <Comp key={ d.key } { ...d.props }
      onClick={ !d.interact.length ? null :
        e => interact(...d.interact)
      }>
      { d.value }
    </Comp>
  )

export default (Component, options = {}) => {
  const {
    mapDataToProps = {},
    interactOnMount = []
  } = options;

  return ({ ...props }) => {
    const newProps = { ...props, ...useDms() },
      { interact } = newProps;

    const [acted, setActed] = useState(false);

    let defaultInteract = [];
    if (!acted) {
      defaultInteract = getValue(interactOnMount, { props: newProps });
    }
    const [action, id, seededProps] = defaultInteract,
      numOnMount = interactOnMount.filter(Boolean).length,
      numInteract = defaultInteract.filter(Boolean).length,
      ready = Boolean(action) && (numOnMount === numInteract);

    useEffect(() => {
      if (!acted && ready) {
        interact(action, id, seededProps);
        setActed(true);
      }
    }, [acted, ready, interact, action, id, seededProps]);

    const handleData = data => {
      if (Array.isArray(data)) {
        return data.map(handleData);
      }
      if (typeof data === "function") {
        return data(createElements, newProps.interact);
      }
      return data;
    }

    const mapped = doMapDataToProps(mapDataToProps, { props: newProps })

    for (const key in mapped) {
      const data = mapped[key];
      newProps[key] = handleData(data);
    }
    return <Component { ...newProps }/>
  }
}
