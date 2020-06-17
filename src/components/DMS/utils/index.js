import React from "react"

import get from "lodash.get"

export const capitalize = string =>
  string.toLowerCase().split("")
    .map((c, i) => i === 0 ? c.toUpperCase() : c).join("");
export const prettyKey = key =>
  key.replace(/[_-]/g, " ").split(" ").map(string => capitalize(string)).join(" ");

export const ITEM_REGEX = /^item:(.+)$/;
export const PROPS_REGEX = /^props:(.+)$/;
const SELF_REGEX = /^self:(.+)$/;

export const makeFilter = (filter, sources) => {
  if (!sources) {
    sources = { props: filter }
    filter = get(sources, ["props", "filter"]);
  }
  if (!sources.item) {
    sources.item = get(sources, ["props", "item"], null);
  }

  if (!filter) return false;

  if (typeof filter === "function") return filter;

  let { args, comparator } = filter;

  args = args.map(arg => {
    if (typeof arg === "string") {
      if (ITEM_REGEX.test(arg)) {
        arg = arg.slice(5);
        const path = arg.split(".");
        return {
          value: get(sources, ["item", ...path], arg)
        }
      }
      if (SELF_REGEX.test(arg)) {
        return {
          path: arg.slice(5)
        }
      }
      if (PROPS_REGEX.test(arg)) {
        arg = arg.slice(6);
        const path = arg.split(".");
        return {
          value: get(sources, ["props", ...path], arg)
        }
      }
    }
    return { type: "value", value: arg };
  })

  return d =>
    comparator(
      ...args.map(({ path, value }) => {
        return value || get(d, path)
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
      return (a, b) => a === b;
    case ">":
      return (a, b) => a > b;
    case "<":
      return (a, b) => a < b;
    case ">=":
      return (a, b) => a >= b;
    case "<=":
      return (a, b) => a <= b;
    default:
      return (a, b) => a === b;
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
    case "==":
      return getCompare(op)(args[0], source);
    default:
      return source;
  }
}
const getArgs = (op, split) => {
  const { length } = split;
  switch (op) {
    case ">>>":
    case "==":
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

const getValueFromPath = (path, sources, _default = null) => {
  if (typeof path !== "string") return _default || path;

  const split = path.toString().split(new RegExp(`(${ OPS.join("|") })`))
    .reduce((a, c) => {
      const match = /^(item|props|self):(.+)$/.exec(c);
      if (match) {
        const [, from, p] = match,
          source = get(sources, from, null);
        return [...a, get(source, p, null)];
      }
      return [...a, c];
    }, []).reverse();

  return reduceSplit(split, split.pop());
}

export const getValue = (arg, sources) => {
  if (!arg) return null;

  if (!sources.item) {
    sources.item = get(sources, ["props", "item"], null);
  }

  if (typeof arg !== "object") {
    arg = { path: arg }
  }
  let {
    path,
    filter,
    sortBy,
    props = {},
    type,
    key,
    value,
    interact = []
  } = arg;

  let data = getValueFromPath(path, sources);

  if (type) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    filter = makeFilter(filter, sources);
    if (filter) {
      data = data.filter(filter);
    }
    if (sortBy) {
      data.sort((a, b) => {
        const av = get(a, sortBy, a),
          bv = get(b, sortBy, b);
        return av < bv ? -1 : bv < av ? 1 : 0;
      })
    }

    if (!Array.isArray(interact)) {
      interact = [interact];
    }

    const args = ({
      data: data.map((d, i) => ({
        key: getValueFromPath(key, { self: d, ...sources }, `key-${ i }`),
        value: getValueFromPath(value, { self: d, ...sources }, d),
        interact: interact.map(a => getValueFromPath(a, { self: d, ...sources })),
        props: mapDataToProps(props, { self: d, ...sources })
      })),
      type
    })
    return (func, interact) => func(args, interact);
  }
  return data;
}

export const mapDataToProps = (map, sources = {}) => {
  if (!sources.item) {
    sources.item = get(sources, ["props", "item"], null);
  }

  const mappedProps = {};

  for (const key in map) {
    const path = map[key];

    let savedChildren = [];
    if (key === "children") {
      savedChildren = React.Children.toArray(get(sources, ["props", "children"], null));
    }

    let result;
    if (Array.isArray(path)) {
      result = path.map(p => getValue(p, sources))
    }
    else if (typeof path === "object") {
      const args = path.args.map(arg => getValueFromPath(arg, sources));
      result = path.func(...args);
    }
    else {
      result = getValue(path, sources);
    }

    if (key === "children") {
      if (Array.isArray(result)) {
        result = [...result, ...savedChildren];
      }
      else {
        result = [result, ...savedChildren];
      }
    }
    mappedProps[key] = result;

  }
  return mappedProps;
}
