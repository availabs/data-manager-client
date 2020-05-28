import React from "react"

class Test extends React.Component {
  render() {
    console.log("PROPS:", this.props);
    return (
      <div>TESTING!!!</div>
    )
  }
}



export default
{
  path: '/simple',
  mainNav: true,
  exact: true,
  name: 'Layout Test',
  //icon: 'HomeOutline',
  layoutSettings: {
    fixed: true,
    nav: 'side',
    // maxWidth: 'max-w-7xl',
    headerBar: false,
    theme: 'light'

  },
  component: {
    type: "div",
    props: {
      className: 'grid grid-cols-12 gap-2 p-5 max-w-7xl m-auto h-screen'
    },
    children: [
      { type: "div",
        props: { className: 'h-full bg-white shadow col-span-12'},
        children: [
          {
            type: "TextBox",
            props: {
              header: "ECONOMY",
              body: "The economic security of individuals and families is essential to achieving the values of American society. For complex reasons, this financial security is beyond the means of many in our community."
            }
          }
        ]
      },
      { type: "div",
        props: { className: "col-span-4 bg-white h-64 shadow" }, 
        children: [
          { 
            type:"CensusStatBox",
            props: {
              title:'Percent of Populaion Over 16 Years-old, Not in Labor Force',
              sumType: 'pct',
              censusKeys:["B23025_007E"],
              divisorKey: "B23025_001E",
              showCompareYear: true,
              invertColors: true,
              valueSuffix: '%',
              maximumFractionDigits: 1,
            }
          }
        ]
      },
      "CHILD 3",
      Test
    ]
  }
}

