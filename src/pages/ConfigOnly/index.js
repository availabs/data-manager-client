import React from "react"

// class Test extends React.Component {
//   render() {
//     console.log("PROPS:", this.props);
//     return (
//       <div>TESTING!!!</div>
//     )
//   }
// }

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
    nav: 'top',
    // maxWidth: 'max-w-7xl',
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

//   component: {
//     type: "div",
//     props: {
//       className: 'grid grid-cols-12 gap-2 p-5 max-w-7xl m-auto'
//     },
//     children: [
//       { type: "div",
//         props: { className: 'h-64 bg-white shadow col-span-12'},
//         children: [
//           {
//             type: "TextBox",
//             props: {
//               header: "ECONOMY",
//               body: "The economic security of individuals and families is essential to achieving the values of American society. For complex reasons, this financial security is beyond the means of many in our community."
//             }
//           }
//         ]
//       },
//       { type: "div",
//         props: { className: "col-span-4" },
//         children: [
//           { type: "h1", children: ["HEADER!!!"] }
//         ]
//       },
//       "CHILD 3",
//       Test
//     ]
//   }
// }

      // {
      //     type:"CensusStatBox",
      //     title:'Percent of Populaion Over 16 Years-old, Not in Labor Force',
      //     sumType: 'pct',
      //     censusKeys:["B23025_007E"],
      //     divisorKey: "B23025_001E",
      //     showCompareYear: true,
      //     invertColors: true,
      //     valueSuffix: '%',
      //     maximumFractionDigits: 1,
      //     container: {
      //       type: 'card',
      //       props: {className:'h-64 col-span-3'},
      //        w:3,
      //        h:9
      //     }
      //  },
//       {
//         type: "CensusBarChart",
//         title: "Employment Status for the Population 16 Years and Over",
//         orientation: "horizontal",
//         marginLeft: 250,
//         legendPosition: "bottom-right",
//         censusKeys: ["B23025_001E...B23025_007E"],
//         container: {
//           type: 'div',
//           props: {className:'h-64 bg-white col-span-9 shadow'},
//              w:9,
//              h:9
//           }
//       },
//       {
//           type:"CensusStatBox",
//           title:'Percent of Labor Force Unemployed (census proxy for unemployment rate)',
//           sumType: 'pct',
//           censusKeys:["B23025_005E"],
//           divisorKey: "B23025_001E",
//           showCompareYear: true,
//           valueSuffix: '%',
//           invertColors: true,
//           maximumFractionDigits: 1,
//           container: {
//             type: 'div',
//             props: {className:'h-64 bg-white shadow col-span-3'},
//              w:3,
//              h:9
//           }
//        }
//     ]
//   }
// }
