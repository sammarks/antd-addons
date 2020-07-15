import React from 'react'
import { Route } from 'react-router-dom'
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic'
import { Icon as LegacyIcon } from '@ant-design/compatible'
import isFunction from 'lodash/isFunction'

export default ({
  component: Component,
  title,
  icon,
  render,
  ...props
}) => (
  <Route {...props} render={routeProps => {
    let children = isFunction(title) ? title(routeProps) : title
    if (icon) {
      children = (
        <React.Fragment>
          <LegacyIcon type={icon} />
          <span>{title}</span>
        </React.Fragment>
      )
    }
    return (
      <React.Fragment>
        <BreadcrumbsItem to={routeProps.match.url}>{children}</BreadcrumbsItem>
        {Component ? <Component {...routeProps} /> : render(routeProps)}
      </React.Fragment>
    )
  }} />
)
