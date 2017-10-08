import React from "react"
import glamorous from "glamorous"

export const Wrapper = glamorous.div({
  background: "rgba(0, 0, 0, .5)",
  opacity: 0,
  transition: "all ease-in-out 300ms",
  ":hover": {
    opacity: 1,
  },
  width: "100%",
  height: "100%",
})

const Thumbnail = ({src, children, active, ...otherProps}) => {
  const thumbnailStyle = {
    backgroundImage: `url(${src})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
  }

  let activeStyle = undefined
  if (active === true) activeStyle = {opacity: 1}
  else if (active === false) activeStyle = {opacity: 0}

  if (otherProps.style) Object.assign(thumbnailStyle, otherProps.style)

  return (
    <div {...otherProps} style={thumbnailStyle}>
      <Wrapper style={activeStyle}>
        {children}
      </Wrapper>
    </div>
  )
}

export default Thumbnail
