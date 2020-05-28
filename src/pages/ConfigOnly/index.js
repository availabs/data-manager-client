import React from "react"


const DataFetcher = (WrappedComponent, options = {}) => {
  return class Wrapper extends React.Component {
    state = {
      loading: false,
      data: null
    }
    componentDidMount() {
      this.setState({ loading: true });
      new Promise(resolve => setTimeout(resolve, 2000, { data: "DATA" }))
        .then(data => this.setState({ loading: false, data }));
    }
    render() {
      return <WrappedComponent { ...this.state } { ...this.props }/>
    }
  }
}

export default
{
  path: '/',
  mainNav: true,
  exact: true,
  name: 'Config Test',
  icon: 'HomeOutline',
  layoutSettings: {
    fixed: true,
    nav: 'side',
    maxWidth: '',
    headerBar: false,
    theme: 'light'

  },
  
  component: {
    type: "dms-manager", // top level component for managing data items
    props: {
      app: "blog",
      dataFormat: "blog-post",
      defaultAction: "list",
      actions: ["create"]
    },
    children: [
// dms-manager children are special
// they are only shown when the dms-manager state === the child.props.action
      { type: "dms-list", // generic dms component for viewing multiple data items
        props: {
          attributes: ["title", "bloggerId", "action:view", "action:edit", "action:delete"]
        }
        
      },

      { type: "dms-card", // generic dms component for viewing a single data item
        wrappers: [
          { type: "falcor", options: { requests: [["..."], ["..."]] } },
          { type: "connect",
            options: {
              mapStateToProps: (state, props) => ({}),
              mapDispatchToProps: {}
            }
          },
          DataFetcher
        ],
        props: {
          mapDataToProps: {
// this is used by dms-card to map data attributes to component props
// attribute: prop
            title: "title",
            body: "content"
          },
          actions: [
            { action: "reply",
              seedProps: props => ({ "blog-post": props.data }) }
          ]
        },
      },

      { type: "dms-create" },

      { type: "dms-create",
        props: {
          action: "reply"
        }
      }
    ]
  }
}

