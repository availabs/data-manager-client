import React from 'react'
import Containers from  'layouts/components/Containers'
import ComponentFactory from 'layouts/ComponentFactory'

export default ({container={}, components=[]}) => {
    const Container = Containers[container.type] || (<React.Fragment />)
    //console.log('Page Factory', container, components)
    return (
        <Container {...container.props}>
            {components.map(c => <ComponentFactory {...c} />)}
        </Container>
    )	
}

