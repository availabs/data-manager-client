import React from "react"

import { connect } from "react-redux"
import { reduxFalcor } from "utils/redux-falcor"

import get from "lodash.get"

import { blogPost, blogs } from "../test_formats/blog_format"

const ITEM_REGEX = /^item:(.+)$/,
  PROPS_REGEX = /^props:(.+)$/;

const getDefaultPath = props =>
  ["dms", "data", props.app, props.type]

const processPath = (path, props) => {
  return path.map(p => {
    const match = PROPS_REGEX.exec(p);
    if (match) {
      return get(props, match[1], null);
    }
    return p;
  })
}

const getDataItems = (path, state) => {
  const length = get(state, ["graph", ...path, "length"], 0);

  return [];
}

export function makeFilter(props) {
  const filter = get(props, "filter", false);

  if (filter === false) return false;
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
      ...args.map(({ type, path, value }) =>
        type === "item" ? get(d, path) : value
      )
    );
}

export const mapStateToProps = (state, props) => {
  const path = processPath(get(props, "path", getDefaultPath(props)), props),
    filter = makeFilter(props);
  const dataItems = getDataItems(path, state);
  return {
    // format: get(state, ["graph", "dms", "format", props.app, props.type], null),
    // dataItems,
    path,
    format: blogPost,
    dataItems: filter ? blogs.filter(filter) : blogs
  }
}

export function fetchFalcorDeps() {
  const { app, type, path } = this.props;
  return this.props.falcor.get(
    ["dms", "format", app, type],
    [...path, "length"]
  ).then(res => {
    const length = get(res, ["json", ...path, "length"], 0);
    if (length) {
      return this.props.falcor.get(
        [...path, "byIndex", { from: 0, to: --length },
          ["id", "app", "type", "attributes"]
        ]
      )
    }
  })
}

export default (WrappedComponent, options = {}) => {
  class Wrapper extends React.Component {
    fetchFalcorDeps
    render = () => <WrappedComponent { ...this.props }/>
  }
  const mS2P = (state, props) => mapStateToProps(state, { ...props, ...options });
  return connect(mS2P, null)(reduxFalcor(Wrapper));
}
