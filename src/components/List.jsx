import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { List as AntList } from 'antd'
import omit from 'lodash/omit'

class List extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    separated: PropTypes.bool
  }

  static defaultProps = {
    separated: true
  }

  render () {
    return (
      <div className={this.props.className}>
        <AntList {...omit(this.props, Object.keys(List.propTypes))} />
      </div>
    )
  }
}

export default styled(List)`
  .ant-list-split .ant-list-item {
    ${props => props.separated === false ? 'border-bottom: none;' : ''}
  }
`
