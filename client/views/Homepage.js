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
    }
  }
`

const Homepage = ({data}) => (
  <Row>
    <Col xs='9'>
      {
        data.loading?
        <h2>Loading...</h2>
        :
        <Container>
          {data.medias.map((media, i) => <Media key={i} {...media} />)}
        </Container>
      }
    </Col>
  </Row>
)

export default graphql(mediasQuery)(Homepage)
