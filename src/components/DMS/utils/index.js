import React from "react"

import get from "lodash.get"

export const capitalize = string =>
  string.toLowerCase().split("")
    .map((c, i) => i === 0 ? c.toUpperCase() : c).join("");
export const prettyKey = key =>
  key.replace(/[_-]/g, " ").split(" ").map(string => capitalize(string)).join(" ");

export const ITEM_REGEX = /^item:(.+)$/;
export const PROPS_REGEX = /^props:(.+)$/;

export const makeFilter = (filter, props) => {
  if (!props) {
    props = filter;
    filter = get(props, "filter", false);
  }

  if (!filter) return false;

  if (typeof filter === "function") return filter;

  let { args, comparator } = filter;

  args = args.map(arg => {
    if (typeof arg === "string") {
      if (ITEM_REGEX.test(arg)) {
        return {
          type: "item",
          path: arg.slice(5)
        }
      }
      if (PROPS_REGEX.test(arg)) {
        return {
          type: "value",
          value: get(props, arg.slice(6))
        }
      }
    }
    return { type: "value", value: arg };
  })

  return d =>
    comparator(
      ...args.map(({ type, path, value }) => {
        return type === "item" ? get(d, path) : value
      })
    );
}

export const checkAuth = (rules, action, props, item) => {
  const rule = get(rules, action.replace(/^(dms|api):(.+)$/, (m, c1, c2) => c2), null);

  if (!rule) return true;

  let { args, comparator } = rule;

  args = args.map(a => {
    if (typeof a === "string") {
      if (a.includes("props:")) {
        return get(props, a.slice(6));
      }
      if (a.includes("item:")) {
        return get(item, a.slice(5));
      }
    }
    return a;
  })
  return comparator(...args);
}

const OPS = [
  ">>>", "==>", "-->", "->", "==", ">", "<", ">=", "<="
]

const getCompare = arg => {
  switch (arg) {
    case "==":
      return (a, b) => a == b;
    case ">":
      return (a, b) => a > b;
    case "<":
      return (a, b) => a < b;
    case ">=":
      return (a, b) => a >= b;
    case "<=":
      return (a, b) => a <= b;
  }
}

const applyOp = (op, args, source) => {
  switch (op) {
    case ">>>":
      return source.map(d => get(d, ...args, null));
    case "==>":
      return source.filter(d => getCompare(args[1])(get(d, args[0], null), args[2]))
    case "-->":
      return source.reduce((a, c) => getCompare(args[1])(get(c, args[0], null), args[2]) ? c : a, null)
    default:
      return source;
  }
}
const getArgs = (op, split) => {
  const { length } = split;
  switch (op) {
    case ">>>":
      return split.splice(length - 2, length);
    case "==>":
    case "-->":
      return split.splice(length - 3, length);
    default:
      return [];
  }
}
const reduceSplit = (split, source) => {
  if (!split.length) return source;

  const path = split.pop();
  if (OPS.includes(path)) {
    const args = getArgs(path, split).reverse();
    return reduceSplit(split, applyOp(path, args, source));
  }
  return reduceSplit(split, get(source, path, null));
}

const getValueFromPath = (path, item, props, _default = null) => {
  const regex = /^(item|props):(.+$)/,
    match = regex.exec(path);

  if (!match) return _default || path;

  let [, from, rest] = match,
    source = from === "item" ? item : props;

  const split = rest.split(new RegExp(`(${ OPS.join("|") })`)).reverse();
  return reduceSplit(split, source);
}

export const getValue = (arg, sourceItem, sourceProps) => {
  if (!arg) return null;

  if (!sourceProps) {
    sourceProps = sourceItem;
    sourceItem = get(sourceProps, "item", null);
  }

  if (typeof arg === "string") {
    arg = { path: arg }
  }
  let {
    path,
    filter,
    props = {},
    type,
    key,
    value,
    interact = []
  } = arg;

  let data = getValueFromPath(path, sourceItem, sourceProps);

  if (type) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    const _filter = makeFilter(filter, sourceProps);
    if (_filter) {
      data = data.filter(_filter);
    }

    if (!Array.isArray(interact)) {
      interact = [interact];
    }

    const args = ({
      data: data.map((d, i) => ({
        key: getValueFromPath(key, d, sourceProps, `key-${ i }`),
        value: getValueFromPath(value, d, sourceProps, d),
        interact: interact.map(a => getValueFromPath(a, d, sourceProps))
      })),
      props,
      type
    })
    return (func, interact) => func(args, interact);
  }
  return data;
}

export const mapDataToProps = (map, item, props) => {
  if (!props) {
    props = item;
    item = get(props, "item", null);
  }

  const mappedProps = {};

  for (const key in map) {
    const path = map[key];

    if (Array.isArray(path)) {
      mappedProps[key] = path.map(p => getValue(p, item, props))
    }
    else {
      mappedProps[key] = getValue(path, item, props);
    }

  }
  return mappedProps;
}
