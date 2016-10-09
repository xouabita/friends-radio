import React from 'react'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'

import Page from './components/Page'
import Homepage from './views/Homepage.js'

const networkInterface = createNetworkInterface('/graphql', {
  credentials: 'same-origin'
})
const client = new ApolloClient({networkInterface})

const App = () => (
  <ApolloProvider client={client}>
    <Page>
      <Homepage />
    </Page>
  </ApolloProvider>
)

export default App
