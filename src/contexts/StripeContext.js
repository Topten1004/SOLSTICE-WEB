import * as React from 'react'

const StripeContext = React.createContext() ;

export const StripeProvider = ({ children, value }) => {
  return (
    <StripeContext.Provider value={ value }>
      { children }
    </StripeContext.Provider>
  )
}

export const useStripeInfo = () => {
    return React.useContext(StripeContext) ;
}
