import React from "react"

import DmsCreate from "./dms-create"

import get from "lodash.get"

export default class DmsEdit extends DmsCreate {
  static defaultProps = {
    dmsAction: "edit"
  }
  componentDidMount() {
    const item = get(this.props, this.props.type, null),
      data = get(item, "data");
    data && this.setState({ ...data });
  }
  create() {
    const values = this.getValues(),
      id = get(this.props, [this.props.type, "id"], null);
    this.props.interact("api:edit", id, values);
  }
}
