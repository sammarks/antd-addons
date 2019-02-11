import React from 'react'
import { Icon } from 'antd'
import { withTranslation } from '../i18n'
import styled from 'styled-components'
import PropTypes from 'prop-types'

@withTranslation()
class ErrorIndicator extends React.Component {
  static propTypes = {
    compact: PropTypes.bool
  }

  renderCompact () {
    return (<Icon type={'exclamation-circle'} theme={'filled'} />)
  }

  renderFull () {
    return (
      <React.Fragment>
        <Icon type={'exclamation-circle'} theme={'filled'} />
        <div>
          <h2>{this.props.t('ErrorIndicator.header')}</h2>
          <p>{this.props.t('ErrorIndicator.content')}</p>
        </div>
      </React.Fragment>
    )
  }

  render () {
    return (
      <div className={this.props.className}>
        {this.props.compact ? this.renderCompact() : this.renderFull()}
      </div>
    )
  }
}

export default styled(ErrorIndicator)`
  display: flex;
  max-width: 400px;
  margin: 0 auto;
  padding: ${props => props.compact ? '10px' : '30px'};
  flex-direction: row;
  align-items: flex-start;
  justify-content: ${props => props.compact ? 'center' : 'flex-start'};
  i {
    font-size: ${props => props.compact ? '20px' : '50px'};
    margin: 5px 15px 0 0;
    color: #FF0000;
  }
  > div {
    margin: 0;
    flex-grow: 1;
  }
  h2 {
    margin-bottom: 5px;
  }
`
