import React from "react"

export default ({ header, subheader, body, link }) =>
  <div style={ { padding: "10px 20px" } }>
    { header && <div className='text-2xl'>{ header }</div> }
    { subheader && <div className='text-xs -mt-2'>{ subheader }</div> }
    { body && <div className='text-base '>{ body }</div> }
    { link && <a className="text-base absolute top-0 right-0 mr-10 mt-5 btn btn-sm btn-success" href={ link } target="_blank">Link</a> }
  </div>