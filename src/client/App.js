import React from 'react'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

import { BrowserRouter, Route } from 'react-router-dom'

import Page from './components/Page'
import Homepage from './views/Homepage'
import User from './views/User'
import Media from './views/Media'

import playerReducer from './reducers/player.js'
import mediasReducer from './reducers/medias.js'

const networkInterface = createNetworkInterface('http://localhost:3000/graphql', {
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
        <Route exact path='/' component={Homepage} />
        <Route exact path='/u/:user_id/:source(likes|dislikes)?' component={User} />
        <Route exact path='/m/:id' component={Media} />
      </Page>
    </BrowserRouter>
  </ApolloProvider>
)

global.App = App

export default App
