import React from 'react'
import {Link} from 'react-router-dom'

const NavbarBrand = ({className, ...props}) =>
  <Link className={`${className} navbar-brand`} {...props} />

export default NavbarBrand
