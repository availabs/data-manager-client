import React from "react"

import {
  DmsButton,
  Title
} from "./parts"

const SEED_PROPS = () => ({});

export default class DmsCard extends React.Component {
  static defaultProps = {
    action: "view",
    title: "",
    content: "",
    actions: [],
    interact: () => {},
    data: {},
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
  render() {
    const {
      actions, interact,
      type, mapDataToProps
    } = this.props;

    const item = this.props[type],
      data = item.data;

    const mapped = {
      title: this.props.title,
      content: this.props.content
    };

    for (const key in mapDataToProps) {
      const v = data[key],
        k = mapDataToProps[key];
      mapped[k] = v;
    }
    const { title, content } = mapped;

    return (
      <div>
        { title ? <Title>{ title }</Title> : null }
        { !content ? null :
          <div className="mb-2">
            { content }
          </div>
        }
        <div>
          { actions.map(({ action }) =>
              <DmsButton key={ action }
                action={ action } item={ item } interact={ interact }>
                { action }
              </DmsButton>
            )
          }
        </div>
        { this.renderChildren() }
      </div>
    )
  }
}
