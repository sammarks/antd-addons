import React from 'react'
import PropTypes from 'prop-types'
import { Popover, Button } from 'antd'
import SelectButtonContent from './SelectButtonContent'
import { withNamespaces } from '../i18n'
import '../styles/SelectButton.css'
import 'antd/lib/dropdown/style'

@withNamespaces()
export default class SelectButton extends React.Component {
  static propTypes = {
    query: PropTypes.object.isRequired,
    queryPath: PropTypes.string.isRequired,
    variables: PropTypes.object,
    name: PropTypes.string.isRequired,
    value: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func.isRequired,
    maxSelection: PropTypes.number,
    getItemName: PropTypes.func,
    renderLabel: PropTypes.func,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    getItemName: (item) => item.name
  }

  renderLabel = (itemNames) => {
    if (itemNames) {
      return (
        <React.Fragment>
          <strong>{this.props.t('SelectButton.selected', { name: this.props.name })} </strong>
          <span>{itemNames}</span>
        </React.Fragment>
      )
    } else {
      return this.props.t('SelectButton.select', { name: this.props.name })
    }
  }

  clear = () => {
    this.props.onChange([])
  }

  get label () {
    const itemNames = this.props.value && this.props.value.filter(Boolean).length > 0
      ? this.props.value.filter(Boolean).map((item) => this.props.getItemName(item)).join(', ')
      : null
    return this.props.renderLabel ? this.props.renderLabel(itemNames) : this.renderLabel(itemNames)
  }

  get hasValue () {
    return this.props.value && this.props.value
      .filter(Boolean)
      .filter((val) => Object.keys(val).length > 0)
      .length > 0
  }

  get buttonType () {
    return this.hasValue ? 'primary' : null
  }

  render () {
    return (
      <div className={this.props.className}>
        <Button.Group>
          <Popover
            content={<SelectButtonContent
              query={this.props.query}
              queryPath={this.props.queryPath}
              variables={this.props.variables}
              selectedItems={this.props.value}
              maxSelection={this.props.maxSelection}
              selectionUpdated={this.props.onChange}
            />}
            title={this.props.t('SelectButton.select', { name: this.props.name })}
            trigger={'click'}
            placement={'bottomLeft'}
            overlayClassName={'filter-popover'}
            overlayStyle={{ width: 300 }}
          >
            <Button type={this.buttonType} disabled={this.props.disabled}>{this.label}</Button>
          </Popover>
          {this.hasValue && <Button
            type={this.buttonType}
            onClick={this.clear}
            icon={'close'}
            disabled={this.props.disabled}
          />}
        </Button.Group>
      </div>
    )
  }
}
