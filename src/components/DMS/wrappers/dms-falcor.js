import React from "react"

import { connect } from "react-redux"
// import { reduxFalcor } from "utils/redux-falcor"
import { reduxFalcor } from "utils/redux-falcor-new"

import get from "lodash.get"

import {
  makeFilter,
  ITEM_REGEX,
  PROPS_REGEX
} from "../utils"

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
  const length = get(state, ["falcorCache", ...path, "length"], 0);

  const dataItems = [];
  for (let i = 0; i < length; ++i) {
    const p = get(state, ["falcorCache", ...path, "byIndex", i, "value"], null);
    if (p) {
      const dataItem = JSON.parse(JSON.stringify(get(state, ["falcorCache", ...p], {})));
      dataItem.data = get(dataItem, ["data", "value"], {});
      dataItems.push(dataItem);
    }
  }
  return filter ? dataItems.filter(filter) : dataItems;
}

const getFormat = (app, type, state) => {
  const key = `${ app }+${ type }`,
    format = JSON.parse(JSON.stringify(get(state, ["falcorCache", "dms", "format", key], {})));

  format.attributes = get(format, ["attributes", "value"], {});

  return format;
}

export default (WrappedComponent, options = {}) => {
  class Wrapper extends React.Component {
    state = { loading: 0 };

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
      const { /*app, type,*/ path } = this.props;
      return this.props.falcor.get(
        // ["dms", "format", `${ app }+${ type }`, ["app", "type", "attributes"]],
        [...path, "length"]
      ).then(res => {
        let length = get(res, ["json", ...path, "length"], 0);
        if (length) {
          return this.props.falcor.chunk(
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

      if (falcorAction) {
        this.startLoading();
        return falcorAction.call(this, action, id, data)
          .then(() => this.stopLoading());
      }
      return Promise.resolve();
    }
    falcorEdit(action, id, data) {
      if (!(id && data)) return Promise.resolve();

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
        });
    }
    falcorCreate(action, id, data) {
      const args = [this.props.app, this.props.type, data].filter(Boolean);

      if (args.length < 3) return Promise.resolve();

      return this.props.falcor.call(["dms", "data", "create"], args);
    }
    falcorDelete(action, id, ids) {
      ids = ids || [];
      const args = [this.props.app, this.props.type, id, ...ids].filter(Boolean);

      if (args.length < 3) return Promise.resolve();

      return this.props.falcor.call(["dms", "data", "delete"], args);
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
