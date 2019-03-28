import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, withRouter } from 'react-router-dom'
import CrumbRoute from './CrumbRoute'
import CRUDContext from './CRUDContext'
import DynamicCrumb from './DynamicCrumb'
import { withNamespaces } from '../i18n'

@withRouter
@withNamespaces()
export default class ModelCRUD extends React.Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    view: PropTypes.func.isRequired,
    list: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    fetchQuery: PropTypes.object.isRequired,
    modelName: PropTypes.string.isRequired,
    namePath: PropTypes.string.isRequired,
    idParam: PropTypes.string,
    childRoutes: PropTypes.func,
    routes: PropTypes.func,
    useBreadcrumbs: PropTypes.bool
  }
  static defaultProps = {
    idParam: 'id'
  }

  renderBreadcrumbRoutes () {
    return (
      <Switch>
        <CrumbRoute
          path={`${this.props.match.path}/create`}
          title={this.props.t('ModelCRUD.create')}
          component={this.props.create}
        />
        <CrumbRoute path={`${this.props.match.path}/:${this.props.idParam}`} title={(routeProps) => (
          <DynamicCrumb
            fetchQuery={this.props.fetchQuery}
            namePath={this.props.namePath}
            id={routeProps.match.params[this.props.idParam]}
          />
        )} render={(routeProps) => (
          <Switch>
            <CrumbRoute
              path={`${routeProps.match.path}/edit`}
              title={this.props.t('ModelCRUD.edit')}
              component={this.props.edit}
            />
            <CrumbRoute
              path={`${routeProps.match.path}/delete`}
              title={this.props.t('ModelCRUD.delete')}
              component={this.props.delete}
            />
            {this.props.childRoutes && this.props.childRoutes({ breadcrumb: true, routeProps })}
            <Route path={routeProps.match.path} component={this.props.view} />
          </Switch>
        )} />
        {this.props.routes && this.props.routes({ breadcrumb: true })}
        <Route path={this.props.match.path} component={this.props.list} />
      </Switch>
    )
  }
  renderRoutes () {
    return (
      <Switch>
        <Route path={`${this.props.match.path}/create`} component={this.props.create} />
        <Route path={`${this.props.match.path}/:${this.props.idParam}`} render={(routeProps) => (
          <Switch>
            <Route path={`${routeProps.match.path}/edit`} component={this.props.edit} />
            <Route path={`${routeProps.match.path}/delete`} component={this.props.delete} />
            {this.props.childRoutes && this.props.childRoutes({ breadcrumb: false, routeProps })}
            <Route path={routeProps.match.path} component={this.props.view} />
          </Switch>
        )} />
        {this.props.routes && this.props.routes({ breadcrumb: false })}
        <Route path={this.props.match.path} component={this.props.list} />
      </Switch>
    )
  }
  render () {
    const context = {
      ...this.props,
      listRoute: this.props.match.url,
      createRoute: `${this.props.match.url}/create`,
      viewRoute: `${this.props.match.url}/:${this.props.idParam}`,
      editRoute: `${this.props.match.url}/:${this.props.idParam}/edit`,
      deleteRoute: `${this.props.match.url}/:${this.props.idParam}/delete`
    }
    return (
      <CRUDContext.Provider value={context}>
        {this.props.useBreadcrumbs ? this.renderBreadcrumbRoutes() : this.renderRoutes()}
      </CRUDContext.Provider>
    )
  }
}
