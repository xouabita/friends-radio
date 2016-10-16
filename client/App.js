import React from 'react'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

import { BrowserRouter, Match } from 'react-router'

import Page from './components/Page'
import Homepage from './views/Homepage.js'
import User from './views/User.js'

import playerReducer from './reducers/player.js'
import mediasReducer from './reducers/medias.js'

const networkInterface = createNetworkInterface('/graphql', {
  credentials: 'same-origin'
})
const client = new ApolloClient({
  networkInterface,
  dataIdFromObject: r => r.id
})

const store = createStore(
  combineReducers({
    player: playerReducer,
    medias: mediasReducer,
    apollo: client.reducer()
  }),
  compose(
    applyMiddleware(client.middleware()),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)

const App = () => (
  <ApolloProvider client={client} store={store}>
    <BrowserRouter>
      <Page>
        <Match exactly pattern='/' component={Homepage} />
        <Match exactly pattern='/u/:user_id/:source(likes|dislikes)?' foo='bar' component={User} />
      </Page>
    </BrowserRouter>
  </ApolloProvider>
)

export default App
