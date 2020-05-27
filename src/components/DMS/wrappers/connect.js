import React from "react"

import { connect } from "react-redux"

export default (Component, options = {}) => {
  const {
    mapStateToProps,
    mapDispatchToProps
  } = options;
  return connect(mapStateToProps, mapDispatchToProps)(Component);
}
