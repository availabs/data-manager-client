import React from 'react'
import TrackVisibility from 'react-on-screen';
import Containers from  'layouts/components/Containers'
import CensusCharts from 'components/CensusCharts'

import DmsComponents from "components/DMS"

import get from "lodash.get"

const ComponentLibrary = {
    ...CensusCharts,
    ...DmsComponents
}

const getKey = (config, i) => get(config, "key", `key-${ i }`);

const BasicJSX = ({ Comp, props, children }) =>
  <Comp { ...props }>{ children }</Comp>

const getBasicJSX = config => ({ children }) =>
  <BasicJSX Comp={ config.type } props={ get(config, "props", {}) }>
    { children }
  </BasicJSX>

const getComponent = config =>
  typeof config === "function" ? config :
  typeof config === "string" ? () => <React.Fragment>{ config }</React.Fragment> :
  get(ComponentLibrary, config.type, getBasicJSX(config));

const applyWrappers = (Component, config) => {
  const wrappers = get(config, "wrappers", []);
console.log("WRAPPERS:", wrappers);
  return Component;
}

const processConfig = (config, rest, i = 0) => {
  const Component = applyWrappers(getComponent(config), config),
    children = get(config, "children", []);

  return React.createElement(Component,
            { ...config.props, ...rest, key: getKey(config, i) },
            children.map((child, i) => processConfig(child, rest, i))
          );
}

export default ({ config, ...rest }) => processConfig(config, rest)

//     const container = props.container ? props.container : {props:{}}
//     const Container = Containers[container.type] || (<React.Fragment />)
//     const graphType = props.type.split(' ').join('')
//     const Graph = CensusCharts[graphType] || (<div>No Component {graphType}</div>)
//     return props.track ?
//         (
//             <TrackVisibility partialVisibility style={ { height: '100%' } }>
//             	<ComponentHider Graph={ Graph } { ...props } />
//             </TrackVisibility>)
//         : (<Container {...container.props}><Graph { ...props } /></Container>)
// }

class ComponentHider extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            show: Boolean(props.isVisible)
        }
    }

    componentDidUpdate(prevProps, prevState) {
    	if(this.props.isVisible && !this.state.show) {
    		this.setState({show:true})
    	}
    }

    render () {
    	const { isVisible, Graph, ...rest } = this.props;
    	return (rest.type === "CensusMap" ? this.state.show : isVisible) ?
		    <Graph { ...rest } /> :
		    <div>Loading...</div>
    }
}
