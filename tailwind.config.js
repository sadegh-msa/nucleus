const { join } = require('path');
const Color = require('color');

const DARKER_LEVEL = 0.08;
const DARKEST_LEVEL = 0.15;
const DARKER_SUFFIX = 'darker';
const DARKEST_SUFFIX = 'darkest';

function darkenColor(hexColor, level) {
  return Color(hexColor).darken(level).hex();
}

const configs = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, 'libs/**/src/!(*.stories|*.spec).{ts,html}'),
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3E5063',
        accent: '#99324E',
        info: '#3B82F6',
        success: '#34C759',
        warning: '#E16F3E',
        danger: '#D70000',
        lightgray: '#A0A8B3',
        gray: '#8C8C8C',
        darkgray: '#717171',
        'surface-basic': '#E2DACA',
        'surface-gray': '#F7F7F7',
        'surface-card': '#F4F4F4',
        'surface-form': '#D8DBDF',
        'surface-ground': '#FAFAFA',
        'surface-primary': '#D4DCE4',
        'surface-accent': '#F0D1D9',
        'surface-info': '#D8E6FD',
        'surface-success': '#CBFFD8',
        'surface-warning': '#F7F1E7',
        'surface-danger': '#F7E7E7',
        'status-cyan': '#32ADE6',
        'status-green': '#34C759',
        'status-purple': '#AF52DE',
        'status-red': '#FF3B30',
        'status-yellow': '#FFCC00',
      },
      borderColor: {
        DEFAULT: '#A0A8B3',
      },
      screens: {
        xsmall: { raw: 'only screen and (max-width: 599.98px)' },
        small: {
          raw: 'only screen and (min-width: 600px) and (max-width: 959.98px)',
        },
        medium: {
          raw: 'only screen and (min-width: 960px) and (max-width: 1279.98px)',
        },
        large: {
          raw: 'only screen and (min-width: 1280px) and (max-width: 1919.98px)',
        },
        xlarge: { raw: 'only screen and (min-width: 1920px)' },
        handset: {
          raw: `only screen and (max-width: 599.98px) and (orientation: portrait),
           (max-width: 959.98px) and (orientation: landscape)`,
        },
        tablet: {
          raw: `only screen and (min-width: 600px) and (max-width: 839.98px) and (orientation: portrait),
           (min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)`,
        },
        web: {
          raw: `only screen and (min-width: 840px) and (orientation: portrait),
           (min-width: 1280px) and (orientation: landscape)`,
        },
        'handset-portrait': {
          raw: 'only screen and (max-width: 599.98px) and (orientation: portrait)',
        },
        'tablet-portrait': {
          raw: 'only screen and (min-width: 600px) and (max-width: 839.98px) and (orientation: portrait)',
        },
        'web-portrait': {
          raw: 'only screen and (min-width: 840px) and (orientation: portrait)',
        },
        'handset-landscape': {
          raw: 'only screen and (max-width: 959.98px) and (orientation: landscape)',
        },
        'tablet-landscape': {
          raw: 'only screen and (min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)',
        },
        'web-landscape': {
          raw: 'only screen and (min-width: 1280px) and (orientation: landscape)',
        },
      },
    },
  },
  plugins: [],
};

for (const [name, color] of Object.entries({...configs.theme.extend.colors})) {
  configs.theme.extend.colors[`${name}-${DARKER_SUFFIX}`] = darkenColor(color, DARKER_LEVEL);
  configs.theme.extend.colors[`${name}-${DARKEST_SUFFIX}`] = darkenColor(color, DARKEST_LEVEL);
}

module.exports = configs;
