import React from 'react'
import DataTable from './DataTable'
import PropTypes from 'prop-types'

export default class ModalDataTable extends React.Component {
  static propTypes = {
    CreateComponent: PropTypes.func.isRequired,
    createProps: PropTypes.object,
    EditComponent: PropTypes.func.isRequired,
    editProps: PropTypes.object,
    DeleteComponent: PropTypes.func.isRequired,
    deleteProps: PropTypes.object
  }
  static defaultProps = {
    createProps: {},
    editProps: {},
    deleteProps: {}
  }
  constructor (props) {
    super(props)
    this.state = {
      createVisible: false,
      editVisible: false,
      editingId: null,
      deleteVisible: false,
      deletingId: null
    }
    this.onCreateClickedBound = this.onCreateClicked.bind(this)
    this.onCreateClosedBound = this.onCreateClosed.bind(this)
    this.onEditClickedBound = this.onEditClicked.bind(this)
    this.onEditClosedBound = this.onEditClosed.bind(this)
    this.onDeleteClickedBound = this.onDeleteClicked.bind(this)
    this.onDeleteClosedBound = this.onDeleteClosed.bind(this)
  }
  onCreateClicked () {
    this.setState({ createVisible: true })
    return false
  }
  onCreateClosed () {
    this.setState({ createVisible: false })
  }
  onEditClicked ({ id }) {
    this.setState({ editVisible: true, editingId: id })
    return false
  }
  onEditClosed () {
    this.setState({ editVisible: false, editingId: null })
  }
  onDeleteClicked ({ id }) {
    this.setState({ deleteVisible: true, deletingId: id })
    return false
  }
  onDeleteClosed () {
    this.setState({ deleteVisible: false, deletingId: null })
  }
  get createProps () {
    return {
      ...this.props.createProps,
      isModal: true,
      visible: this.state.createVisible,
      onModalClosed: this.onCreateClosedBound,
      onCreateCompleted: () => false
    }
  }
  get editProps () {
    return {
      ...this.props.editProps,
      isModal: true,
      visible: this.state.editVisible,
      idOverride: this.state.editingId,
      onModalClosed: this.onEditClosedBound,
      onEditCompleted: () => false
    }
  }
  get deleteProps () {
    return {
      ...this.props.deleteProps,
      isModal: true,
      visible: this.state.deleteVisible,
      idOverride: this.state.deletingId,
      onModalClosed: this.onDeleteClosedBound,
      onDeleteCompleted: () => false
    }
  }
  render () {
    const { CreateComponent, EditComponent, DeleteComponent } = this.props
    return (
      <React.Fragment>
        <DataTable
          {...this.props}
          onCreateClicked={this.onCreateClickedBound}
          onEditClicked={this.onEditClickedBound}
          onDeleteClicked={this.onDeleteClickedBound}
        />
        <CreateComponent {...this.createProps} />
        <EditComponent {...this.editProps} />
        <DeleteComponent {...this.deleteProps} />
      </React.Fragment>
    )
  }
}
