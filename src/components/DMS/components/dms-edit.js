import DmsCreate from "./dms-create"

import get from "lodash.get"

export default class DmsEdit extends DmsCreate {
  static defaultProps = {
    dmsAction: "edit"
  }
  INITIALIZED = false
  componentDidMount() {
    this.INITIALIZED = false;
    this.initState();
  }
  componentDidUpdate(oldProps) {
    !this.INITIALIZED && this.initState();
  }
  initState() {
    const item = get(this.props, this.props.type, null),
      data = get(item, "data", null);
    if (!this.INITIALIZED && data) {
      this.setState({ ...data });
      this.INITIALIZED = true;
    }
  }
  create() {
    const values = this.getValues(),
      id = get(this.props, [this.props.type, "id"], null);
    this.props.interact("api:edit", id, values);
  }
  getButtonAction(values) {
    return {
      action: "api:edit",
      seedProps: () => values
    }
  }
  render() {
    return !this.INITIALIZED ? null : super.render();
  }
}
