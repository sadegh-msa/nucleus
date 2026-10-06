export const uiHtmlId = Object.freeze({
  popover: {
    container: 'ui-popover-container',
  },
});

export const uiStyleVar = Object.freeze({
  checkmark: '--ui-checkmark-svg-path',
  popover: '--ui-popover',
  ripple: '--ui-ripple',
  trigger: '--ui-trigger',
});

export const uiStyleClass = Object.freeze({
  prefix: 'ui',
  bubble: {
    basic: 'ui bubble',
    arrow: 'bubble-arrow',
    close: 'ui button emphasis stamp tiny rounded-full bubble-close',
  },
  checkbox: {
    basic: 'ui checkbox',
  },
  formField: {
    basic: 'ui form-field',
  },
  menu: {
    basic: 'ui menu',
    status: {
      compact: 'compact',
      wide: 'wide',
      popup: 'popup',
      still: 'still',
      floating: 'floating',
      sliding: 'sliding',
    },
    item: {
      button: {
        basic: 'ui button medium rounded-none',
        hover: 'basic stamp second-ink',
        active: 'bulk primary',
      },
    },
  },
  message: {
    container: 'ui messages',
  },
  password: {
    checklist: {
      optional: 'ui list checklist',
    },
    input: {
      basic: 'ui input password',
    },
  },
  popover: {
    basic: 'ui popover',
    optional: 'text stamp fade-normal',
    zIndex: 200,
    invisibility: ['numb', 'transparent'],
  },
  ripple: {
    basic: 'ui ripple',
    ending: 'ending',
  },
  svgIcon: {
    basic: 'ui icon',
  },
  tooltip: {
    basic: 'ui tooltip',
    optional: 'stamp fade-normal',
  },
});
