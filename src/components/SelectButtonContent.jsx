import React from 'react'
import styled from 'styled-components'
import { Icon, Input, List } from 'antd'
import PropTypes from 'prop-types'
import InfiniteQuery from './InfiniteQuery'
import classnames from 'classnames'
import { withTranslation } from '../i18n'

const FILTER_TIMEOUT = 500

@withTranslation()
class SelectButtonContent extends React.Component {
  static propTypes = {
    query: PropTypes.object.isRequired,
    queryPath: PropTypes.string.isRequired,
    selectedItems: PropTypes.arrayOf(PropTypes.object),
    selectionUpdated: PropTypes.func.isRequired,
    maxSelection: PropTypes.number,
    filterVariable: PropTypes.string,
    variables: PropTypes.object
  }

  static defaultProps = {
    selectedItems: [],
    variables: {},
    filterVariable: 'name'
  }

  state = {
    filter: '',
    activeFilter: ''
  }

  get maxSelection () {
    return this.props.maxSelection !== undefined ? this.props.maxSelection : Infinity
  }

  onFilterChange = (e) => {
    const filter = e.target.value
    this.setState({ filter })
    setTimeout(() => {
      if (this.state.filter === filter) {
        this.setState({ activeFilter: filter })
      }
    }, FILTER_TIMEOUT)
  }

  itemSelected (item) {
    if (this.props.selectedItems.filter((sitem) => sitem.id === item.id).length > 0) {
      this.props.selectionUpdated(this.props.selectedItems.filter((sitem) => sitem.id !== item.id))
    } else {
      if (this.props.selectedItems.length >= this.maxSelection) {
        this.props.selectionUpdated([...this.props.selectedItems.slice(1), item])
      } else {
        this.props.selectionUpdated([...this.props.selectedItems, item])
      }
    }
  }

  renderItem = (item) => {
    const selected = this.props.selectedItems.map((item) => item.id).includes(item.id)
    const icon = selected
      ? <Icon type={'close-circle'} theme={'filled'} style={{ fontSize: 14 }} />
      : <Icon type={'right'} style={{ fontSize: 10, padding: '2px' }} />
    return (
      <List.Item
        extra={icon}
        className={classnames({
          'ant-dropdown-menu-item': true,
          'ant-dropdown-menu-item-selected': selected
        })}
        onClick={() => this.itemSelected(item)}
      >
        <span>{item.name}</span>
      </List.Item>
    )
  }

  render () {
    return (
      <div className={this.props.className}>
        <Input
          placeholder={this.props.t('SelectButtonContent.filter')}
          suffix={<Icon type={'search'} />}
          className={'search-input'}
          onChange={this.onFilterChange}
          value={this.state.filter}
        />
        <InfiniteQuery
          query={this.props.query}
          variables={{
            ...this.props.variables,
            [this.props.filterVariable]: this.state.activeFilter
          }}
          queryPath={this.props.queryPath}
          renderItem={this.renderItem}
          compact
          useWindow={false}
          listProps={{
            itemLayout: 'vertical',
            size: 'small',
            className: 'filter-list'
          }}
        />
      </div>
    )
  }
}

export default styled(SelectButtonContent)`
  position: relative;
  max-height: 300px;
  overflow-y: auto;
  .filter-list {
    .ant-list-item:last-child {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
    .ant-list-item-content { margin: 0; }
    .ant-dropdown-menu-item-selected .ant-list-item-content { color: inherit; }
  }
  .search-input {
    border-bottom: 1px solid ${props => (props.theme && props.theme['@border-color-split']) || '#e8e8e8'};
    input {
      border: none;
      box-shadow: none;
    }
  }
`
