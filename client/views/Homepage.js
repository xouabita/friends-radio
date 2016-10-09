import React from 'react'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { Container, Row, Col } from 'reactstrap'

import Media from '../components/Media'

const mediasQuery = gql`
  query getMedias {
    medias {
      thumbnail
      title
      description
      url
    }
  }
`

const Homepage = ({data}) => (
  <div>
    {
      data.loading?
      <h2>Loading...</h2>
      :
      <div>
        {data.medias.map((media, i) => <Media key={i} {...media} />)}
      </div>
    }
  </div>
)

export default graphql(mediasQuery)(Homepage)
