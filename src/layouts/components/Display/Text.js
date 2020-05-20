import React from "react"
import 'styles/tailwind.css';


const Text = ({data,...rest}) => (
  <p {...rest}>
    {data}
  </p>
)


export default Text
