import React from 'react'

const CRUDContext = React.createContext({})
export default CRUDContext
export const Consumer = CRUDContext.Consumer
export const Provider = CRUDContext.Provider
