import React from "react"

import {
  Button,
  Title
} from "./parts"

// import get from "lodash.get"

export default class DmsCard extends React.Component {
  static defaultProps = {
    action: "view",
    title: "",
    content: "",
    actions: [],
    interact: () => {},
    data: {},
    mapDataToProps: {}
  }
  render() {
    const {
      actions, interact,
      data, mapDataToProps
    } = this.props;

    const mapped = {
      title: this.props.title,
      content: this.props.content
    };

    for (const key in mapDataToProps) {
      const v = data.data[key],
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
          { actions.map(({ action, seedProps }) =>
              <Button key={ action }
                onClick={ e => interact(action, data.id, seedProps(this.props)) }>
                { action }
              </Button>
            )
          }
        </div>
        { this.props.children }
      </div>
    )
  }
}
