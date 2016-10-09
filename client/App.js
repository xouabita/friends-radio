import React from 'react'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'

import Navigation from './components/Navigation'
import Homepage from './views/Homepage.js'

const networkInterface = createNetworkInterface('/graphql', {
  credentials: 'same-origin'
})
const client = new ApolloClient({networkInterface})

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <Navigation />
      <Homepage />
    </div>
  </ApolloProvider>
)

export default App
