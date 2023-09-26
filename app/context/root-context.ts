import { createContext, useContext } from 'react'

export const RootContext = createContext({
    stripePublicKey: '',
})

export const useRootContext = () => useContext(RootContext)