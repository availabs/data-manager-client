import { processAction, checkAuth } from "../../utils"

import get from "lodash.get"

const flattenAttributes = (Sections, Attributes, depth = 0, id = [0]) => {
  if (!Sections.length) return Attributes;
  const { attributes, sections, ...rest } = Sections.pop();
  if (sections) {
    flattenAttributes(sections, Attributes, depth + 1, [...id, 0]);
  }
  if (attributes) {
    Attributes.push(...attributes.map((att, i) => ({
      ...rest,
      ...att,
      depth,
      id: `${ att.key }-${ id.join(".") }.${ i }`
    })))
  }
  const last = id.pop()
  return flattenAttributes(Sections, Attributes, depth, [...id, last + 1]);
}

export const processFormat = format => {
  if (format.registerFormats) {
    format.registerFormats.forEach(processFormat);
  }
  format["$processed"] = true;
  if (!format.sections) {
    const attributes = format.attributes;
    format.attributes = [];
    return flattenAttributes([{ attributes }], format.attributes);
  };

  format.attributes = [];
  flattenAttributes(format.sections.reverse(), format.attributes);
}

export const getItem = (id, props) => {
  return (props.dataItems || []).reduce((a, c) => c.id === id ? c : a, null);
}

const normalizeArgs = (dmsAction, item, props, ...rest) => {
  let itemId = null;
  if (typeof item === "object") {
    itemId = get(item, "id", null);
  }
  else if (typeof item === "string") {
    itemId = item;
    item = getItem(itemId, props);
  }
  else if (!item) {
    item = get(props, "item", null);
    itemId = get(item, "id", null);
  }
  return [
    processAction(dmsAction),
    item,
    itemId,
    props,
    props.interact,
    ...rest
  ]
}
export const makeInteraction = (...args) => {
  const [
    { action, seedProps, isDisabled, doThen, ...rest },
    item, itemId,
    props,
    interact
  ] = normalizeArgs(...args);

  const { authRules, useRouter, basePath, location, history } = props,

    hasAuth = checkAuth(authRules, action, props, item);

  if (useRouter && hasAuth && !isDisabled) {
    const { push } = history,
      { pathname } = location,
      state = get(location, "state", null) || [],
      length = state.length;

    return /^(dms:)*back$/.test(action) ?
      { type: "link",
        key: action,
        action: { action, isDisabled, ...rest },
        to: {
          pathname: get(state, [length - 1], basePath),
          state: state.slice(0, length - 1)
        }
      }
      : /^(dms:)*home$/.test(action) ?
        { type: "link",
          key: action,
          action: { action, isDisabled, ...rest },
          to: {
            pathname: basePath,
            state: []
          }
        }
      : /^api:/.test(action) ?
        { type: "button",
          key: action,
          action: { action, isDisabled, ...rest },
          onClick: e => {
            e.stopPropagation();
            return Promise.resolve(interact(action, itemId, seedProps(props)))
              .then(() => doThen())
              .then(() => push({
                pathname: get(state, [length - 1], basePath),
                state: state.slice(0, length - 1)
              }))
          }
        }
      : { type: "link",
          key: action,
          action: { action, isDisabled, ...rest },
          to: {
            pathname: itemId ? `${ basePath }/${ action }/${ itemId }` : `${ basePath }/${ action }`,
            state: [...state, pathname]
          }
        }
  }
  return {
    type: "button",
    key: action,
    action: { action, isDisabled, ...rest },
    onClick: e => {
      e.stopPropagation();
      if (!hasAuth) return Promise.resolve();
      return Promise.resolve(interact(action, itemId, seedProps(props)))
        .then(() => /^api:/.test(action) && doThen())
        .then(() => /^api:/.test(action) && interact("dms:back"));
    }
  }
}

export const makeOnClick = (...args) => {
  const [
    { action, seedProps, doThen },
    item, itemId,
    props,
    interact
  ] = normalizeArgs(...args);

  const { authRules, useRouter, basePath, location, history } = props,

    hasAuth = checkAuth(authRules, action, props, item);

  if (useRouter && hasAuth) {
    const { push } = history,
      { pathname } = location,
      state = get(location, "state", null) || [],
      length = state.length;

    return /^(dms:)*back$/.test(action) ?
      (e => {
        e.stopPropagation();
        push({
          pathname: get(state, [length - 1], basePath),
          state: state.slice(0, -1)
        });
      })
      : /^(dms:)*home$/.test(action) ?
        (e => {
          e.stopPropagation();
          push({
            pathname: basePath,
            state: []
          });
        })
      : /^api:/.test(action) ?
        (e => {
          e.stopPropagation();
          return Promise.resolve(interact(action, itemId, seedProps(props)))
            .then(() => doThen())
            .then(() => push({
              pathname: get(state, [length - 1], basePath),
              state: state.slice(0, -1)
            }))
        })
      : (e => {
          e.stopPropagation();
          push({
            pathname: itemId ? `${ basePath }/${ action }/${ itemId }` : `${ basePath }/${ action }`,
            state: [...state, pathname]
          })
        })
  }
  return (
    e => {
      e.stopPropagation();
      if (!hasAuth) return Promise.resolve();
      return Promise.resolve(interact(action, itemId, seedProps(props)))
        .then(() => /^api:/.test(action) && doThen())
        .then(() => /^api:/.test(action) && interact("dms:back"));
    }
  )
}
