import React from "react"

import { DmsButton } from "../components/parts"

import get from "lodash.get"

import { prettyKey } from "../utils"

const SEED_PROPS = () => ({});

const ViewItem = ({ value, type }) =>
  type !== "img" ? <div>{ value }</div> :
  <div className="h-64"><img src={ value } className="max-h-full"/></div>

const ViewRow = ({ name, children }) =>
  <div className="grid grid-cols-4 my-2">
    <div className="col-span-1 font-bold">{ name }</div>
    <div className="col-span-3">
      { children }
    </div>
  </div>

export default (Component, options = {}) => {
  return class Wrapper extends React.Component {
    static defaultProps = {
      dmsAction: "view",
      actions: [],
      interact: () => {},
      mapDataToProps: {},
      seedProps: props => ({})
    }
    renderChildren() {
      const { seedProps = SEED_PROPS, ...props } = this.props;
      return React.Children.map(this.props.children, child =>
        React.cloneElement(child,
          { ...props,
            ...child.props,
            ...seedProps(props)
          }
        )
      )
    }
    renderItem(path, item) {
      let { format } = this.props,
        key = path.split(".").pop(),
        attributes = get(format, "attributes", []),
        attribute = attributes.reduce((a, c) => c.key === key ? c: a, {}),
        name = attribute.name || prettyKey(key),
        type = attribute.type,
        value = get(item, path, null);

      if (!value) return null;

      if (key === "updated_at") {
        value = (new Date(value)).toLocaleString();
      }
      if (/^array:/.test(type)) {
        value = value.map((v, i) => <ViewItem key={ i } type={ type } value={ v }/>)
      }
      else {
        value = <ViewItem type={ type } value={ value }/>
      }

      return (
        <ViewRow key={ path } name={ name }>
          { value }
        </ViewRow>
      );
    }
    renderRow(path, item) {
      const regex = /^(item|props):(.+)$/,
        match = regex.exec(path);

      if (!match) return null;

      const [,, p] = match;

      if (match[1] === "item") {
        return this.renderItem(p, item);
      }

      const value = get(this.props, p, null);
      return (
        <ViewRow key={ p } name={ p }>
          { value }
        </ViewRow>
      );
    }
    getValue(path, item) {
      const regex = /^(item|props):(.+)$/,
        match = regex.exec(path);

      if (!match) return null;

      const [, from, p] = match;

      if (from === "item") {
        return get(item, p, null)
      }
      return get(this.props, p, null);
    }
    render() {
      const {
        actions, interact,
        type, format,
        mapDataToProps
      } = { ...this.props, ...options };

      const item = get(this, ["props", type], null);

      if (!item) return null;

      const props = {};

      for (const key in mapDataToProps) {
        if (typeof mapDataToProps[key] === "string") {
          props[key] = this.getValue(mapDataToProps[key], item);
        }
        else {
          props[key] = mapDataToProps[key].map(path => {
            return this.renderRow(path, item)
          })
        }
      }

      return (
        <div>
          <Component { ...props } { ...this.props }/>
          { !actions.length ? null :
            <div className="mt-2 btn-group-horizontal">
              { actions.map(a =>
                  <DmsButton key={ get(a, "action", a) } item={ item } action={ a } props={ this.props }/>
                )
              }
            </div>
          }
          <div>{ this.renderChildren() }</div>
        </div>

      )
    }
  }
}

// export default class DmsView extends React.Component {
//   static defaultProps = {
//     dmsAction: "view",
//     title: "",
//     content: "",
//     actions: [],
//     interact: () => {},
//     data: {},
//     mapDataToProps: {},
//     seedProps: props => ({})
//   }
//   render() {
//     const {
//       actions, interact,
//       type, format,
//       mapDataToProps
//     } = this.props;
//
//     const item = get(this, ["props", type], null);
//
//     if (!item) return null;
//
//     const data = get(item, "data", {});
//
//     const mapped = {
//       title: this.props.title,
//       content: this.props.content
//     };
//
//     for (const key in mapDataToProps) {
//       const v = data[key],
//         k = mapDataToProps[key];
//       mapped[k] = v;
//     }
//     const { title, content } = mapped;
//
//     return (
//       <div>{ title }</div>
//     )
//   }
// }
