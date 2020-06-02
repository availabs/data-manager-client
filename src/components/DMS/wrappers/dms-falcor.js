import React from "react"

import { connect } from "react-redux"
import { reduxFalcor } from "utils/redux-falcor"

import get from "lodash.get"

import { blogPost, blogs } from "../test_formats/blog_format"

const ITEM_REGEX = /^item:(.+)$/,
  PROPS_REGEX = /^props:(.+)$/;

const processPath = (path, props) => {
  return path.map(p => {
    const match = PROPS_REGEX.exec(p);
    if (match) {
      return get(props, match[1], null);
    }
    return p;
  })
}

const getDataItems = (path, state, filter = false) => {
  const length = get(state, ["graph", ...path, "length"], 0);

  const dataItems = [];
  for (let i = 0; i < length; ++i) {
    const p = get(state, ["graph", ...path, "byIndex", i, "value"], null);
    if (p) {
      const dataItem = JSON.parse(JSON.stringify(get(state, ["graph", ...p], {})));
      dataItem.data = get(dataItem, ["data", "value"], {});
      dataItems.push(dataItem);
    }
  }
  return filter ? dataItems.filter(filter) : dataItems;
}

export function makeFilter(props) {
  const filter = get(props, "filter", false);

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
      ...args.map(({ type, path, value }) =>
        type === "item" ? get(d, path) : value
      )
    );
}

const getFormat = (app, type, state) => {
  const key = `${ app }+${ type }`,
    format = JSON.parse(JSON.stringify(get(state, ["graph", "dms", "format", key], {})));

  format.attributes = get(format, ["attributes", "value"], {});

  return format;
}

export default (WrappedComponent, options = {}) => {
  class Wrapper extends React.Component {
    state = { loading: false };

    MOUNTED = false;
    componentDidMount() {
      this.MOUNTED = true;
    }
    componentWillUnmount() {
      this.MOUNTED = false;
    }
    setState(...args) {
      this.MOUNTED && super.setState(...args);
    }

    startLoading() {
      this.setState(state => ({ loading: ++state.loading }));
    }
    stopLoading() {
      this.setState(state => ({ loading: --state.loading }));
    }

    fetchFalcorDeps() {
      this.startLoading();
      const { app, type, path } = this.props;
      return this.props.falcor.get(
        // ["dms", "format", `${ app }+${ type }`, ["app", "type", "attributes"]],
        [...path, "length"]
      ).then(res => {
        let length = get(res, ["json", ...path, "length"], 0);
        if (length) {
          return this.props.falcor.get(
            [...path, "byIndex", { from: 0, to: --length },
              ["id", "app", "type", "data", "updated_at"]
            ]
          )
        }
      }).then(() => this.stopLoading())
    }
    apiInteract(action, id, data) {
      let falcorAction = null;

      switch (action) {
        case "api:edit":
          falcorAction = this.falcorEdit;
          break;
        case "api:create":
          falcorAction = this.falcorCreate;
          break;
        case "api:delete":
          falcorAction = this.falcorDelete;
          break;
      }

console.log("API ACTION:", action, id, data)
      if (falcorAction) {
        this.startLoading();
        return falcorAction.call(this, action, id, data)
          .then(() => this.stopLoading());
      }
      return Promise.resolve();
    }
    falcorEdit(action, id, data) {
      return this.props.falcor.set({
          paths: [["dms", "data", "byId", id, "data"]],
          jsonGraph: {
            dms: {
              data: {
                byId: {
                  [id]: { data: JSON.stringify(data) }
                }
              }
            }
          }
        })
        .then(res => console.log("EDIT RES:", res));
    }
    falcorCreate(action, id, data) {
      const args = [this.props.app, this.props.type, data];
      return this.props.falcor.call(["dms", "data", "create"], args)
        .then(res => console.log("CREATE RES:", res));
    }
    falcorDelete(action, id, data) {
console.log("FALCOR DELETE:", data);
      return Promise.resolve();
      // const ids = data ? [...data, id],
      // args = [this.props.format.app, this.props.format.type, ids];
      // return this.props.falcor.call(["dms", "data", "delete"], args)
      //   .then(res => console.log("DELETE RES:", res));
    }
    render() {
      return (
        <WrappedComponent { ...this.props } { ...this.state }
          apiInteract={ (...args) => this.apiInteract(...args) }/>
      )
    }
  }
  const mapStateToProps = (state, props) => {
    const { app, type } = get(props, "format", props),
      defaultPath = ["dms", "data", `${ app }+${ type }`],
      path = processPath(get(props, "path", defaultPath), props),
      dataItems = getDataItems(path, state, makeFilter(props));
    return {
      dataItems,
      path,
      app,
      type
    }
  }
  const mS2P = (state, props) =>
    mapStateToProps(state, { ...props, ...options });

  return connect(mS2P, null)(reduxFalcor(Wrapper));
}
