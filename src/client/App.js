import React from 'react'
import {
  ApolloClient,
  createNetworkInterface,
  ApolloProvider,
} from 'react-apollo'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

import { BrowserRouter, Route } from 'react-router-dom'

import Page from './components/Page'
import Home from './pages/Home'
import User from './pages/User'
import Media from './pages/Media'

import playerReducer from './reducers/player.js'
import mediasReducer from './reducers/medias.js'

const networkInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    credentials: 'same-origin',
  },
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
        <Route exact path='/' component={Home} />
        <Route exact path='/u/:user_id/:source(likes|dislikes)?' component={User} />
        <Route exact path='/m/:id' component={Media} />
      </Page>
    </BrowserRouter>
  </ApolloProvider>
)

export default App
