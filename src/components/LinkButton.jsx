import React from 'react'
import { Button } from 'antd'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import _ from 'lodash'

@withRouter
export default class LinkButton extends React.Component {
  static propTypes = {
    path: PropTypes.string.isRequired
  }
  constructor (props) {
    super(props)
    this.onClickBound = this.onClick.bind(this)
  }
  onClick () {
    this.props.history.push(this.props.path)
  }
  get buttonProps () {
    return _.pick(this.props, Object.keys(Button.propTypes).concat(['children', 'style']))
  }
  render () {
    return <Button onClick={this.onClickBound} {...this.buttonProps} />
  }
}
