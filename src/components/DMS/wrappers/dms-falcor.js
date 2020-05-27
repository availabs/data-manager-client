import React from "react"

import { connect } from "react-redux"
import { reduxFalcor } from "utils/redux-falcor"

import get from "lodash.get"

import { blogPost, blogs } from "../test_formats/blog_format"

const getDefaultPath = props =>
  ["dms", "data", props.app, props.formatType]

const regex = /^from:(.+)$/;
const processPath = (path, props) => {
  if (typeof path === "string") {
    path = path.split(".");
  }
  return path.map(p => {
    const match = regex.exec(p);
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

export function makeFilter(options, props) {
  if (arguments.length === 1) props = options;

  const filter = get(options, "filter", false);

  if (filter === false) return false;
  if (typeof filter === "function") return filter;
  let { path, value, comparator } = filter;

  path = processPath(path, props);
  value = processPath([value], props).pop();

  return d => comparator(get(d, path), value);
}

export const mapStateToProps = (state, props) => {
  const path = processPath(get(props, "path", getDefaultPath(props))),
    filter = makeFilter(props);
  let dataItems = getDataItems(path, state);
  filter && (dataItems = dataItems.filter(filter));
  return {
    // format: get(state, ["graph", "dms", "format", props.app, props.formatType], null),
    // dataItems,
    path,
    format: blogPost,
    dataItems: filter ? blogs.filter(filter) : blogs
  }
}

export function fetchFalcorDeps() {
  const { app, formatType, path } = this.props;
  return this.props.falcor.get(
    ["dms", "format", app, formatType],
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
