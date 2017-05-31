import React, { Component } from 'react'
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  Button,
  Container,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  NavbarToggler,
  Collapse,
} from 'reactstrap'

import { Link } from 'react-router-dom'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import {Img} from 'glamorous'

import NavbarBrand from '../NavbarBrand'

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

class ProfileButton extends Component {
  constructor (...props) {
    super(...props)
  }

  render() {

    const { me } = this.props

    return (
      <NavItem>
        {
          me ?
          <Link to={`/u/${me.id}`}>
            <Img
              borderRadius={3}
              src={avatarUrl(me.id)}
            />
          </Link>
          :
          <NavLink href="/auth/facebook">
            <Button color="primary" size="sm">
              Login
            </Button>
          </NavLink>
        }
      </NavItem>
    )
  }
}

const Navigation = ({data, className}) => (
  <div className={className}>
    <Navbar className={style.nav} light toggleable>
      <Container>
        <NavbarToggler right />
        <NavbarBrand className={style.brand} to="/">
          <img src={radioEmoji} />
          <span>RADIO ZIZI</span>
        </NavbarBrand>
        <Collapse navbar>
          <Nav className="ml-auto" navbar>
            {
              data.loading ?
                <NavItem>Loading....</NavItem>
                :
                <ProfileButton me={data.me} />
            }
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  </div>
)

export default graphql(currentUser)(Navigation)
