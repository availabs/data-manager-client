import React from 'react'

const div = ({children, ...rest}) => <div {...rest}>{children}</div>
const card = ({children, ...rest}) => <div {...rest} className={'bg-white rounded shadow ' +rest.className}>{children}</div>	

export default  {
 	div,
 	card
}