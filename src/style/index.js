import { css } from 'glamor'

export function styleSheet (definitions) {
  let style = {}
  for (let key in definitions) {
    style[key] = css(definitions[key])
  }
  return style
}

export const colors = {
  green: ['#64ffac', '#07db7c', '#00a84e'],
  blue: ['#a9ffff', '#72e3ff', '#34b1cc'],
  black: ['#242424', '#494949'],
  white: ['#D9D9D9', '#808080'],
  red: ['#ff6f60', '#e53935', '#ab000d'],
}

export const gradients = {
  green: `linear-gradient(135deg, ${colors.green[1]} 0%, ${colors.blue[1]} 100%)`,
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
    overflow: 'hidden',
  },
  'h1, h2, h3': {
    textAlign: 'center',
  },
  'h1': {
    fontSize: 40,
  },
  'h2': {
    fontSize: 15,
  },
  'input, button': {
    border: '0',
    display: 'block',
    fontFamily: 'inconsolata',
    opacity: 1,
    fontSize: 20,
    borderBottom: '2px solid ' + colors.white[1],
    backgroundColor: colors.white[0],
    fontWeight: 'bold',
    padding: 3,
    margin: '5px auto',
  },
  'button': {
    position: 'relative',
    transitionDuration: '.1s',
    height: 30,
  },
  'button:after': {
    position: 'absolute',
    content: '""',
    top: 0,
    left: 0,
    opacity: 0,
    background: gradients.green,
    transitionDuration: '.5s',
    width: '100%',
    height: '100%',
  },
  'button:hover:after': {
    opacity: 1,
  },
  'button:hover': {
    borderBottomColor: colors.green[2],
  },
  'button span': {
    zIndex: 10,
    position: 'relative',
  },
  'button:active': {
    transform: 'translateY(1px)',
    borderBottom: 0,
  },
  'button:focus, input:focus': {
    outline: 'none',
  }
})
