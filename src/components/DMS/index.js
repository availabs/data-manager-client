import React from "react"

const DATA_ITEM = {
  id: "unique-database-id",

  app: "app-name",
  user: "avail-auth-user-id",

  tags: ["strings"],

  data: "json",

  created_at: "datetime",
  updated_at: "datetime"
}

const DefaultDataItem = ({ data, action, interact, setTags }) =>
  action === "list" ?
    <div>
      <div>{ data.name }</div>
      <div>
        <button onClick={ e => interact(data.id, "view") }>
          View
        </button>
        <button onClick={ e => interact(data.id, "edit") }>
          Edit
        </button>
        <button onClick={ e => interact(data.id, "delete") }>
          Delete
        </button>
      </div>
    </div>
    : action === "view" ?
      <div>
        <div>Viewing { data.name }</div>
        <div{ data.body }</div>
      </div>
    : action === "edit" ?
      <div>
        <div>Editing { data.name }</div>
        <div{ data.body }</div>
      </div>
    : action === "delete" ?
      <div>
        <div>Should { data.name } be deleted?</div>
      </div>
    : <div>
        <div>Create new item</div>
      </div>

class DMS extends React.Component {
  static defaultProps = {
    app: "app-name",
    user: "user-id" // can be null,
    DataItem: DefaultDataItem
  }
  state = {
    action: "list",
    dataItems: [],
    activeItem: null,
    tags: []
  }
  getFalcorRequest() {
    return this.props.user ?
        ["dms", this.props.app, this.props.user.id, "length"]
      : ["dms", this.props.app, "length"]
  }
  fetchFalcorDeps() {
    this.props.falcor.get(this.getFalcorRequest())
      .then(() => "...etc")
  }

  interact(action, id = null) {
    this.setState({
      activeItem: id,
      action
    });
  }
  setTags(tags) {
    this.setState({ tags });
  }

  render() {
    const { action, dataItems, activeItem, tags } = this.state,
      { DataItem } = this.props;

    return (
      <div>
        <div>
          <h4>HEADER STUFF</h4>
          <button onClick={ e => this.interact("create") }>
            Create New
          </button>
        </div>
        <div>
          { action === "list" ?
              dataItems
                .filter(d =>
                  tags.reduce((a, c) => a || d.tags.includes(c), !Boolean(tags.length))
                )
                .map(d =>
                  <DataItem action="list" data={ d }
                    interact={ (a, id) => this.interact(a, id) }/>
                )
            : action === "create" ?
              <DataItem action="create"/>
            :
              dataItems.reduce((a, c) => c.id === activeItem ?
                <DataItem action={ action } data={ c }
                  interact={ (a, id) => this.interact(a, id) }/> : a
              , null)
          }
        </div>
      </div>
    )
  }
}
