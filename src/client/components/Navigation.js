import React, {Component} from "react"
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  Button,
  Container,
  NavbarToggler,
  Collapse,
} from "reactstrap"

import {Link} from "react-router-dom"

import {graphql} from "react-apollo"
import getMe from "../graphql/queries/getMe.graphql"

import {Img} from "glamorous"

import NavbarBrand from "./NavbarBrand"

import avatarUrl from "../utils/avatarUrl"
import radioEmoji from "../assets/emojis/radio.png"
import mainColor from "../styles/mainColor"

import {css} from "glamor"

const logo = process.env.RAZZLE_LOGO || radioEmoji
const brandName = process.env.RAZZLE_BRAND_NAME || "FRIENDS RADIO"

const navStyle = css({
  background: mainColor,
  borderRadius: 0,
  "& img": {
    height: 38,
    width: "auto",
  },
})

const brandStyle = css({
  margin: 0,
  padding: 0,
  "& span, & img": {
    display: "inline-block",
    verticalAlign: "bottom",
  },
  "& img": {
    marginRight: 10,
  },
  "& span": {
    fontFamily: "Open Sans",
    fontWeight: 600,
    color: "white",
  },
})

class ProfileButton extends Component {
  render() {
    const {me} = this.props

    return (
      <NavItem>
        {me
          ? <Link to={`/u/${me.id}`}>
              <Img borderRadius={3} src={avatarUrl(me.id)} />
            </Link>
          : <NavLink href="/auth/facebook">
              <Button color="primary" size="sm">
                Login
              </Button>
            </NavLink>}
      </NavItem>
    )
  }
}

const Navigation = ({data, className}) =>
  <div className={className}>
    <Navbar {...navStyle} light toggleable>
      <Container>
        <NavbarToggler right />
        <NavbarBrand {...brandStyle} to="/">
          <img src={logo} alt="" />
          <span>
            {brandName}
          </span>
        </NavbarBrand>
        <Collapse navbar>
          <Nav className="ml-auto" navbar>
            {data.loading
              ? <NavItem>Loading....</NavItem>
              : <ProfileButton me={data.me} />}
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  </div>

export default graphql(getMe)(Navigation)
