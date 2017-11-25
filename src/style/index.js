import { css } from 'glamor'

export function styleSheet (definitions) {
  let style = {}
  for (let key in definitions) {
    style[key] = css(definitions[key])
  }
  return style
}

export const colors = {
  gradient: 'linear-gradient(135deg, rgb(7, 219, 124) 0%, rgb(114, 227, 255) 100%)',
  black: ['#242424'],
  white: ['#D9D9D9', '#808080'],
}

export const align = {
  verticalCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  horizontalCenter: {
    margin: '0 auto',
  },
}

function globals (definitions) {
  Object.keys(definitions).forEach((key) => {
    css.global(key, definitions[key])
  })
}

globals({
  'html, body, #root, [data-reactroot]': {
    height: '100%',
    fontFamily: 'inconsolata',
  },
  'h1, h2, h3': {
    textAlign: 'center',
  },
  'button': {
    border: '0',
    display: 'block',
    margin: 'auto',
    fontFamily: 'inconsolata',
    opacity: 1,
    position: 'relative',
    borderBottom: '2px solid ' + colors.white[1],
    transitionDuration: '.3s',
  },
  'button:after': {
    position: 'absolute',
    content: '""',
    top: 0,
    left: 0,
    opacity: 0,
    background: colors.gradient,
    transitionDuration: '.3s',
    width: '100%',
    height: '100%',
  },
  'button:hover:after': {
    opacity: 1,
  },
  'button span': {
    zIndex: 10,
    position: 'relative',
  },
  'button:active': {
    transform: 'translateY(1px)',
    borderBottom: 0,
  },
  'button:focus': {
    outline: 'none',
  }
})
