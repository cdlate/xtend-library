// https://tailwindcss.com/docs/plugins/#css-in-js-syntax

module.exports = function () {
  return function ({ addComponents, theme }) {
    //console.log(theme('fontFamily.sans'))
    addComponents({
      '.btn': {
        // setup
        cursor: 'pointer',
        display: 'inline-flex',
        position: 'relative',
        verticalAlign: 'middle',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: theme('zIndex.base'),
        '&:hover, &.hover': {
          zIndex: theme('zIndex.active'),
        },
        '&.out': {
          zIndex: theme('zIndex.out'),
        },
        ...theme('btn.custom'),
      },
    })
  }
}
