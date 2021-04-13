import React from "react"

import { Button } from "@availabs/avl-components"

import {
  BarGraph,
  generateTestBarData,
  LineGraph,
  generateTestLineData
} from "components/avl-graph/src"

const getNumX = () => Math.round(Math.random() * 20) + 40;

const indexFormat = i => i.replace("-", " "),
  valueFormat = v => `${ v.toFixed(2) } units`;

const BarTest = () => {
  const [numBars, setNumBars] = React.useState(getNumX()),
    [barData, setBarData] = React.useState(generateTestBarData(numBars));

  const randomData = React.useCallback(e => {
    setBarData(generateTestBarData(numBars));
  }, [numBars]);

  const randomBars = React.useCallback(e => {
    const numBars = getNumX();
    setNumBars(numBars);
    setBarData(generateTestBarData(numBars));
  }, []);

  const clearData = React.useCallback(e => {
    setBarData(generateTestBarData(0, 0));
  }, []);

  return (
    <div className="p-8 flex justify-center">
      <div style={ { width: "1280px" } }>
        <div className="mb-4" style={ { height: "32rem" } }>
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

const idFormat = id => id.replace("-", " ");

const LineTest = () => {
  const [numPoints, setNumPoints] = React.useState(getNumX()),
    [lineData, setLineData] = React.useState([
      generateTestLineData(numPoints, 2),
      generateTestLineData(numPoints, 2, true)
    ]);

  const randomData = React.useCallback(e => {
    setLineData([
      generateTestLineData(numPoints, 2),
      generateTestLineData(numPoints, 2, true)
    ]);
  }, [numPoints]);

  const randomPoints = React.useCallback(e => {
    const numPoints = getNumX();
    setNumPoints(numPoints);
    setLineData([
      generateTestLineData(numPoints, 2),
      generateTestLineData(numPoints, 2, true)
    ]);
  }, []);

  const clearData = React.useCallback(e => {
    setLineData([[], []]);
  }, []);

  return (
    <div className="p-8 flex justify-center">
      <div style={ { width: "1280px" } }>
        <div className="mb-4" style={ { height: "32rem" } }>
          <LineGraph data={ lineData[0] }
            secondary={ lineData[1] }
            margin={ { bottom: 50, right: 80, left: 80 } }
            hoverComp={ {
              idFormat,
              xFormat: idFormat,
              yFormat: ",d"
            } }
            axisLeft={ {
              label: "Measurements in Units"
            } }
            axisBottom={ {
              label: "Some Time Points",
              format: idFormat
            } }
            axisRight={ {
              label: "Secondary Measurements in Other Units"
            } }/>
        </div>
        <div className="flex justify-center">
          <Button className="mr-4" onClick={ randomData }>
            Random Data
          </Button>
          <Button className="mr-4" onClick={ randomPoints }>
            Random Points
          </Button>
          <Button onClick={ clearData }>
            Clear Data
          </Button>
        </div>
      </div>
    </div>
  )
}

const Test = () => {
  return (
    <div className="grid gap-y-4">
      <LineTest />
      <BarTest />
    </div>
  )
}

export default {
  path: '/graph-test',
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
