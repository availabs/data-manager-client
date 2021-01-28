import React from "react"

import { Button } from "@availabs/avl-components"

import {
  BarGraph,
  generateTestBarData
} from "components/avl-graph/src"

const getNumBars = () => Math.round(Math.random() * 20) + 40;

const indexFormat = i => i.replace("-", " "),
  valueFormat = v => `${ v.toFixed(2) } units`;

const Test = () => {
  const [numBars, setNumBars] = React.useState(getNumBars()),
    [barData, setBarData] = React.useState(generateTestBarData(numBars));

  const randomData = React.useCallback(e => {
    setBarData(generateTestBarData(numBars));
  }, [numBars]);

  const randomBars = React.useCallback(e => {
    const numBars = getNumBars();
    setNumBars(numBars);
    setBarData(generateTestBarData(numBars));
  }, []);

  const clearData = React.useCallback(e => {
    setBarData(generateTestBarData(0, 0));
  }, []);

  return (
    <div className="p-8 flex justify-center">
      <div style={ { width: "1280px" } }>
        <div className="mb-4" style={ { height: "720px" } }>
          <BarGraph { ...barData }
            margin={ { bottom: 50 } }
            colors="5-BrBG-r"
            hoverComp={ {
              indexFormat,
              valueFormat,
              keyFormat: indexFormat
            } }
            axisBottom={ {
              label: "Some Things",
              format: indexFormat
            } }
            axisLeft={ {
              label: "Measurements in Units"
            } }/>
        </div>
        <div className="flex justify-center">
          <Button className="mr-4" onClick={ randomData }>
            Random Data
          </Button>
          <Button className="mr-4" onClick={ randomBars }>
            Random Bars
          </Button>
          <Button onClick={ clearData }>
            Clear Data
          </Button>
        </div>
      </div>
    </div>
  )
}

export default {
  path: '/test/graph',
  exact: true,
  auth: true,
  layoutSettings: {
    fixed: true,
    nav: 'side',
    headerBar: { title: "GRAPH TEST" },
    theme: 'TEST_THEME'
  },
  component: Test
}
