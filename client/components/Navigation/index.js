import React from 'react'
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  Button,
  Container,
} from 'reactstrap'

import NavbarBrand from '../NavbarBrand'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import avatarUrl from '../../utils/avatarUrl.js'
import style from './style.styl'
import radioEmoji from '../../assets/emojis/radio.png'

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
        <img className={style.profilePic} src={avatarUrl(me.id)} />
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
    <Navbar className={style.nav} style={{borderRadius: 0}}>
      <Container>
        <NavbarBrand className={style.brand} to='/'>
          <img src={radioEmoji} />
          <span>RADIO ZIZI</span>
        </NavbarBrand>
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
