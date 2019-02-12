import React from 'react'
import PropTypes from 'prop-types'
import SelectButton from './SelectButton'
import pick from 'lodash/pick'
import { Button } from 'antd'
import { withNamespaces } from '../i18n'

@withNamespaces()
export default class SingleSelectButton extends React.Component {
  static propTypes = {
    query: PropTypes.object.isRequired,
    queryPath: PropTypes.string.isRequired,
    variables: PropTypes.object,
    name: PropTypes.string.isRequired,
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onCreate: PropTypes.func,
    getItemName: PropTypes.func
  }

  onChange = (values) => {
    this.props.onChange(values ? values[0] : null)
  }

  get hasValue () {
    return this.props.value && Object.keys(this.props.value).length > 0
  }

  renderAddButton () {
    if (this.props.onCreate && !this.hasValue) {
      return (
        <Button
          icon={'plus'}
          onClick={this.props.onCreate}
        >{this.props.t('SingleSelectButton.addItem', { name: this.props.name })}</Button>
      )
    }
  }

  render () {
    return (
      <React.Fragment>
        <SelectButton
          {...pick(this.props, ['query', 'queryPath', 'variables', 'name', 'getItemName'])}
          onChange={this.onChange}
          maxSelection={1}
          value={[this.props.value].filter(Boolean)}
        />
        {this.renderAddButton()}
      </React.Fragment>
    )
  }
}
