import React from 'react'
import { Table, Divider, Button, Dropdown, Icon, Menu, Modal } from 'antd'
import ButtonList from './ButtonList'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Query } from 'react-apollo'
import { offsetToCursor } from 'graphql-relay'
import _ from 'lodash'
import { withNamespaces } from '../i18n'

@withRouter
@withNamespaces()
export default class DataTable extends React.Component {
  static propTypes = {
    modelName: PropTypes.string.isRequired,
    query: PropTypes.object.isRequired,
    variables: PropTypes.object,
    getQueryResults: PropTypes.func,
    resultPath: PropTypes.string.isRequired,
    onCreateClicked: PropTypes.func,
    onEditClicked: PropTypes.func,
    onDeleteClicked: PropTypes.func,
    additionalButtons: PropTypes.array,
    pageSize: PropTypes.number.isRequired,
    bulkActions: PropTypes.arrayOf(PropTypes.object).isRequired
  }
  static defaultProps = {
    additionalButtons: [],
    pageSize: 10,
    bulkActions: []
  }
  constructor (props) {
    super(props)
    this.onCreateClickedBound = this.onCreateClicked.bind(this)
    this.onChangeBound = this.onChange.bind(this)
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      orderBy: undefined,
      orderDirection: undefined,
      after: null,
      currentPage: 1,
      bulkActionModalProps: null
    }
  }
  getQueryResults (data) {
    if (this.props.getQueryResults) {
      return this.props.getQueryResults(data)
    } else {
      return _.get(data, this.props.resultPath, {})
    }
  }
  onCreateClicked () {
    if ((this.props.onCreateClicked && this.props.onCreateClicked() !== false) || !this.props.onCreateClicked) {
      this.props.history.push(`${this.props.match.url}/create`)
    }
  }
  onEditClicked (record) {
    if ((this.props.onEditClicked && this.props.onEditClicked(record) !== false) || !this.props.onEditClicked) {
      this.props.history.push(`${this.props.match.url}/${record.id}/edit`)
    }
  }
  onDeleteClicked (record) {
    if ((this.props.onDeleteClicked && this.props.onDeleteClicked(record) !== false) || !this.props.onDeleteClicked) {
      this.props.history.push(`${this.props.match.url}/${record.id}/delete`)
    }
  }
  onChange (pagination, filters, sorter) {
    if (pagination && pagination.current !== this.state.currentPage) {
      this.setState({
        currentPage: pagination.current,
        after: offsetToCursor((pagination.current - 1) * this.props.pageSize)
      })
    }
    if (sorter && sorter.order && sorter.columnKey) {
      this.setState({
        orderBy: sorter.columnKey,
        orderDirection: sorter.order === 'descend' ? 'DESC' : 'ASC'
      })
    } else {
      this.setState({
        orderBy: undefined,
        orderDirection: undefined
      })
    }
  }
  performBulkAction (bulkAction) {
    const records = this.state.selectedRows
    if (records.length <= 0) return
    const refetchQueries = [{
      query: this.props.query,
      variables: this.variables
    }]
    const perform = (context = {}) => {
      return bulkAction.actOnRecords(records, { refetchQueries, ...context }).then(() => {
        this.setState({
          selectedRowKeys: [],
          selectedRows: []
        })
      })
    }
    if (bulkAction.confirmation) {
      const modalConfig = Object.assign({
        onOk: perform,
        onCancel: () => null
      }, bulkAction.confirmation(records))
      Modal.confirm(modalConfig)
    } else if (bulkAction.ModalComponent) {
      this.setState({
        bulkActionModalProps: {
          name: bulkAction.name,
          records,
          visible: true,
          onOk: (context) => {
            return perform(context).then(() => {
              this.setState({ bulkActionModalProps: null })
            })
          },
          onCancel: () => {
            this.setState({ bulkActionModalProps: null })
          }
        }
      })
    } else {
      perform()
    }
  }
  get variables () {
    return {
      ...this.props.variables,
      orderBy: this.state.orderBy,
      orderDirection: this.state.orderDirection,
      first: this.props.pageSize,
      after: this.state.after
    }
  }
  get rowSelection () {
    return {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRows, selectedRowKeys })
      }
    }
  }
  get bulkActionsDisabled () {
    return this.state.selectedRowKeys.length <= 0
  }
  get bulkActionsMenu () {
    const bulkActions = this.props.bulkActions.map((bulkAction) => (
      <Menu.Item
        key={bulkAction.name}
        onClick={this.performBulkAction.bind(this, bulkAction)}
      >
        <Icon type={bulkAction.icon} /> {bulkAction.name}
      </Menu.Item>
    ))
    return (
      <Menu>
        {bulkActions}
      </Menu>
    )
  }
  get bulkActionModals () {
    return this.props.bulkActions.filter((action) => action.ModalComponent).map((bulkAction) => {
      const ModalComponent = bulkAction.ModalComponent
      let props = { visible: false }
      if (this.state.bulkActionModalProps && this.state.bulkActionModalProps.name === bulkAction.name) {
        props = this.state.bulkActionModalProps
      }
      props.key = bulkAction.name
      return <ModalComponent {...props} />
    })
  }
  render () {
    return (
      <Query query={this.props.query} variables={this.variables}>
        {(opts) => {
          const { data, loading, error } = opts
          if (error) console.error(error)
          return (
            <React.Fragment>
              {this.bulkActionModals}
              <ButtonList>
                <Button type={'primary'} icon={'plus'} onClick={this.onCreateClickedBound}>
                  {this.props.t('DataTable.add', { model: this.props.modelName })}
                </Button>
                {this.props.bulkActions.length > 0 && <Dropdown
                  overlay={this.bulkActionsMenu}
                  disabled={this.bulkActionsDisabled}
                >
                  <Button>{this.props.t('DataTable.bulkActions')} <Icon type={'down'} /></Button>
                </Dropdown>}
                {this.props.additionalButtons}
              </ButtonList>
              <Table
                dataSource={(this.getQueryResults(data).edges || []).map((edge) => edge.node)}
                onChange={this.onChangeBound}
                rowSelection={this.rowSelection}
                rowKey={'id'}
                pagination={{
                  pageSize: this.props.pageSize,
                  current: this.state.currentPage,
                  total: this.getQueryResults(data).totalCount
                }}
                scroll={{ x: 800 }}
                loading={loading}
              >
                {this.props.children}
                <Table.Column key={'actions'} align={'right'} render={(text, record) => (
                  <span>
                    <a href={'javascript:;'} onClick={this.onEditClicked.bind(this, record)}>
                      {this.props.t('DataTable.edit')}
                    </a>
                    <Divider type={'vertical'} />
                    <a href={'javascript:;'} onClick={this.onDeleteClicked.bind(this, record)}>
                      {this.props.t('DataTable.delete')}
                    </a>
                  </span>
                )} />
              </Table>
            </React.Fragment>
          )
        }}
      </Query>
    )
  }
}
