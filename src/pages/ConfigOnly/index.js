import React from "react"

class Test extends React.Component {
  render() {
    console.log("PROPS:", this.props);
    return (
      <div>TESTING!!!</div>
    )
  }
}

console.log("TESTING:", typeof Test)

export default
{
  path: '/config',
  mainNav: true,
  exact: true,
  name: 'Config Test',
  icon: 'HomeOutline',
  layoutSettings: {
    fixed: true,
    // maxWidth: 'max-w-7xl',
    headerBar: false,
    theme: 'flat'

  },

  component: {
    type: "div",
    props: {
      className: 'grid grid-cols-12 gap-2 p-5 max-w-7xl m-auto'
    },
    children: [
      { type: "div", children: ["CHILD 1"] },
      { type: "div",
        props: { className: "col-span-4" }, 
        children: [
          { type: "h1", children: ["HEADER!!!"] }
        ]
      },
      "CHILD 3",
      Test
    ]
  }
}
//       {
//         type: "TextBox",
//         header: "ECONOMY",
//         body: "The economic security of individuals and families is essential to achieving the values of American society. For complex reasons, this financial security is beyond the means of many in our community.",
//         container:{
//           type: 'card',
//           props: {className:'col-span-12'},
//           h: 3,
//           w: 12
//         }
//       },
//       {
//           type:"CensusStatBox",
//           title:'Percent of Populaion Over 16 Years-old, Not in Labor Force',
//           sumType: 'pct',
//           censusKeys:["B23025_007E"],
//           divisorKey: "B23025_001E",
//           showCompareYear: true,
//           invertColors: true,
//           valueSuffix: '%',
//           maximumFractionDigits: 1,
//           container: {
//             type: 'card',
//             props: {className:'h-64 col-span-3'},
//              w:3,
//              h:9
//           }
//        },
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
