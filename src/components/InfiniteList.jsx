import React from 'react'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroller'
import { Icon as LegacyIcon } from '@ant-design/compatible'
import { Spin } from 'antd'
import List from './List'
import { withTranslation } from '../i18n'

@withTranslation()
export default class InfiniteList extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    renderItem: PropTypes.func.isRequired,
    loadMore: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    hasMore: PropTypes.bool,
    useWindow: PropTypes.bool,
    listProps: PropTypes.object,
    scrollProps: PropTypes.object,
    compact: PropTypes.bool,
    showNoMore: PropTypes.bool
  }

  static defaultProps = {
    useWindow: true,
    showNoMore: true,
    listProps: {},
    scrollProps: {}
  }

  renderLoader () {
    const margin = this.props.compact ? '10px auto' : '20px auto'
    return (
      <div style={{ width: '100%', textAlign: 'center', margin }}>
        <Spin />
      </div>
    )
  }

  renderNoMore () {
    if (this.props.compact) {
      return (
        <div style={{ width: '100%', textAlign: 'center', margin: '10px auto' }}>
          {this.props.t('InfiniteList.noMoreResults')}
        </div>
      )
    } else {
      return (
        <div style={{ width: '100%', textAlign: 'center', margin: '20px auto' }}>
          <LegacyIcon
            type={'exclamation-circle'}
            theme={'filled'}
            styled={{ opacity: 0.25, fontSize: 30, margin: '0 0 10px 0' }}
          />
          <p>{this.props.t('InfiniteList.nothingElse')}</p>
        </div>
      )
    }
  }

  render () {
    return (
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={this.props.loadMore}
        hasMore={!this.props.loading && this.props.hasMore}
        useWindow={this.props.useWindow}
        {...this.props.scrollProps}
      >
        <List
          dataSource={this.props.data}
          renderItem={this.props.renderItem}
          loading={this.props.loading && (!this.props.data || !this.props.data.length)}
          {...this.props.listProps}
        />
        {this.props.loading && this.props.hasMore && this.renderLoader()}
        {!this.props.hasMore && this.props.showNoMore && this.renderNoMore()}
      </InfiniteScroll>
    )
  }
}
