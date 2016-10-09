import React from 'react'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { createStore, combineReducers, applyMiddleware } from 'redux'

import Page from './components/Page'
import Homepage from './views/Homepage.js'

import playerReducer from './reducers/player.js'

const networkInterface = createNetworkInterface('/graphql', {
  credentials: 'same-origin'
})
const client = new ApolloClient({networkInterface})

const store = createStore(
  combineReducers({
    player: playerReducer,
    apollo: client.reducer()
  }),
  applyMiddleware(client.middleware()),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)

const App = () => (
  <ApolloProvider client={client} store={store}>
    <Page>
      <Homepage />
    </Page>
  </ApolloProvider>
)

export default App
