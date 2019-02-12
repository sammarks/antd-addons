import React from 'react'
import PropTypes from 'prop-types'
import SelectButton from './SelectButton'
import pick from 'lodash/pick'
import { withNamespaces } from '../i18n'

@withNamespaces()
export default class FilterButton extends React.Component {
  static propTypes = {
    query: PropTypes.object.isRequired,
    queryPath: PropTypes.string.isRequired,
    variables: PropTypes.object,
    name: PropTypes.string.isRequired,
    selectedItems: PropTypes.arrayOf(PropTypes.object),
    selectionUpdated: PropTypes.func.isRequired,
    getItemName: PropTypes.func
  }

  static defaultProps = {
    selectedItems: []
  }

  render () {
    return <SelectButton
      {...pick(this.props, ['query', 'queryPath', 'variables', 'name', 'getItemName'])}
      value={this.props.selectedItems}
      onChange={this.props.selectionUpdated}
      renderLabel={(itemNames) => {
        if (itemNames) {
          return (
            <React.Fragment>
              <strong>{this.props.t('FilterButton.selected', { name: this.props.name })}</strong>
              <span> {itemNames}</span>
            </React.Fragment>
          )
        } else {
          return this.props.t('FilterButton.select', { name: this.props.name })
        }
      }}
    />
  }
}
