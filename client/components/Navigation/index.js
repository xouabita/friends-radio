import React from 'react'
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  Container,
} from 'reactstrap'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import avatarUrl from '../../utils/avatarUrl.js'
import {profilePic} from './style.styl'

const currentUser = gql`
  query getMe {
    me {
      id
    }
  }
`

const ProfileButton = ({me}) => (
  <NavItem>
    {
      me ?
        <div>
          <img className={profilePic} src={avatarUrl(me.id)} />
        </div>
      :
      <NavLink href="/auth/facebook">
        <Button color="primary" size="sm">
          Login
        </Button>
      </NavLink>
    }
  </NavItem>
)

const Navigation = ({data, className}) => (
  <div className={className}>
    <Navbar color="faded">
      <Container>
        <NavbarBrand>RadioZizi</NavbarBrand>
        <Nav className="pull-xs-right" navbar>
          {
            data.loading ?
            <NavItem>Loading....</NavItem>
            :
            <ProfileButton me={data.me} />
          }
        </Nav>
      </Container>
    </Navbar>
  </div>
)

export default graphql(currentUser)(Navigation)
