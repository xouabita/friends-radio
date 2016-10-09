import React from 'react'
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import avatarUrl from '../../utils/avatarUrl.js'

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
        <img src={avatarUrl(me.id)} />
      :
        <NavLink href="/auth/facebook">Login</NavLink>
    }
  </NavItem>
)

const Navigation = ({data}) => (
  <div>
    <Navbar color="faded">
      <NavbarBrand>RadioZizi</NavbarBrand>
      <Nav className="pull-xs-right" navbar>
        {
          data.loading ?
            <NavItem>Loading....</NavItem>
          :
            <ProfileButton me={data.me} />
        }
      </Nav>
    </Navbar>
  </div>
)

export default graphql(currentUser)(Navigation)
