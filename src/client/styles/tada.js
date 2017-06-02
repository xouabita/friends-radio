import {css} from 'glamor'

export default function tada(trans) {
  return css.keyframes({
    '0%': { transform: `${trans} scale3d(1, 1, 1)`},
    '10%, 20%': {
      transform: `${trans} scale3d(.9, .9, .9) rotate3d(0, 0, 1, -3deg)`,
    },
    '30%, 50%, 70%, 90%': {
      transform: `${trans} scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)`,
    },
    '40%, 60%, 80%': {
      transform: `${trans} scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)`,
    },
    '100%':  { transform: `${trans} scale3d(1, 1, 1)`},
  })
}
