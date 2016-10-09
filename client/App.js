import React from 'react'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'

import Navigation from './components/Navigation'

const networkInterface = createNetworkInterface('/graphql', {
  credentials: 'same-origin'
})
const client = new ApolloClient({networkInterface})

const App = () => (
  <ApolloProvider client={client}>
    <Navigation />
  </ApolloProvider>
)

export default App
