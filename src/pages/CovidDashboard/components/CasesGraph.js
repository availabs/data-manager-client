import React, { Component } from 'react';
import Papa from 'papaparse'
import { ResponsiveBarCanvas } from '@nivo/bar'

class Graph extends Component {
  static defaultProps = {
      geoids: ['36001']
  }
  state = {
    data: [],
  }

  componentDidMount() {
    this.fetchData();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData(this.props.id);
    }
  }
  fetchData(id) {
    Papa.parse('/data/covid_confirmed_usafacts.csv', {
      download: true,
      header: true,
      complete: (d) => {
        let data = d.data
          .filter(r => this.props.geoids.includes(r.countyFIPS))
          .reduce((out, county) => {
               
              let dates = Object.keys(county)
                .filter(k => !["countyFIPS","County Name","State","stateFIPS"].includes(k))
              dates.forEach(date => {
                if(!out[date]) {
                  out[date] = {date}
                }
                out[date][county.countyFIPS] = county[date]
              })
              return out
          },{})
        this.setState({ data:Object.values(data) })
      }
    })
  }
  render () {
    return (
      <div style={{width:'100%', height: 300}}>
        <ResponsiveBarCanvas 
          data={this.state.data}
          keys={this.props.geoids}
          indexBy='date'
          margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Confirmed Cases',
            legendPosition: 'middle',
            legendOffset: 36
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'food',
            legendPosition: 'Date',
            legendOffset: -40
        }}
        labelSkipWidth={14}
        />
      </div>
    )
  }
}

export default Graph

