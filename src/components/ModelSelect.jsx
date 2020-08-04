import React from 'react'
import PropTypes from 'prop-types'
import SingleSelectButton from './SingleSelectButton'
import '../styles/SelectButton.css'
import { Provider } from './CRUDContext'
import pick from 'lodash/pick'
import get from 'lodash/get'
import { Query } from '@apollo/client/react/components'

export default class ModelSelect extends React.Component {
  static propTypes = {
    listQuery: PropTypes.object.isRequired,
    nodeQuery: PropTypes.object.isRequired,
    labelPath: PropTypes.string.isRequired,
    queryPath: PropTypes.string.isRequired,
    CreateComponent: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.string,
    name: PropTypes.string.isRequired,
    createContext: PropTypes.object,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    labelPath: 'name',
    createContext: {}
  }

  state = { createSelected: false }

  onCreate = () => {
    this.setState({ createSelected: true })
  }

  setCreateVisibility (visible) {
    this.setState({ createSelected: visible })
  }

  setSelectVisibility (visible) {
    if (this._selectRef) {
      this._selectRef.setPopoverVisibility(visible)
    }
  }

  onChange = (selected) => {
    this.props.onChange(selected ? selected.id : null)
  }

  onModalClosed = () => {
    this.setState({ createSelected: false })
  }

  render () {
    let modal, onCreate

    if (this.props.CreateComponent) {
      onCreate = this.onCreate
      const CreateComponent = this.props.CreateComponent
      modal = (
        <Provider value={this.props.createContext}>
          <CreateComponent
            visible={!!this.state.createSelected}
            isModal
            onCreateCompleted={({ id }) => {
              this.setState({ createSelected: false })
              if (this.props.onChange) {
                this.props.onChange(id)
              }
              return false
            }}
            onModalClosed={this.onModalClosed}
          />
        </Provider>
      )
    }

    return (
      <Query
        query={this.props.nodeQuery}
        variables={{ id: this.props.value || '' }}
        skip={!this.props.value}
        fetchPolicy={'network-only'}
      >
        {({ data }) => (
          <React.Fragment>
            <SingleSelectButton
              {...pick(this.props, ['queryPath', 'name', 'disabled'])}
              query={this.props.listQuery}
              getItemName={() => get(data, this.props.labelPath)}
              onCreate={onCreate}
              value={this.props.value ? { ...(data ? data.node : {}), id: this.props.value } : null}
              onChange={this.onChange}
              selectRef={(c) => {
                this._selectRef = c
              }}
            />
            {modal}
          </React.Fragment>
        )}
      </Query>
    )
  }
}
