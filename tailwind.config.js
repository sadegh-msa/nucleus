const { join } = require('path');
const Color = require('color');

function darkenColor(hexColor, level) {
  return Color(hexColor).darken(level).hex();
}

function lightenColor(hexColor, level) {
  return Color(hexColor).lightness(level).hex();
}

const pale = { suffix: 'pale', level: 94 };
const darker = { suffix: 'darker', level: 0.08 };
const darkest = { suffix: 'darkest', level: 0.15 };
const blackRgb = Color('black').rgb().array();
const mainColors = {
  primary: '#3E5063',
  accent: '#99324E',
  info: '#3B82F6',
  success: '#34C759',
  warning: '#E16F3E',
  danger: '#D70000',
  lightgray: '#A0A8B3',
  gray: '#8C8C8C',
  darkgray: '#717171',
};

const configs = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, 'libs/**/src/!(*.stories|*.spec).{ts,html}'),
  ],
  theme: {
    extend: {
      colors: {
        'surface-basic': '#E2DACA',
        'surface-card': '#F4F4F4',
        'surface-form': '#D8DBDF',
        'surface-ground': '#FAFAFA',
        'status-cyan': '#32ADE6',
        'status-green': '#34C759',
        'status-purple': '#AF52DE',
        'status-red': '#FF3B30',
        'status-yellow': '#FFCC00',
      },
      borderColor: {
        DEFAULT: '#A0A8B3',
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
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

for (const [name, color] of Object.entries({ ...mainColors })) {
  mainColors[`${name}-${pale.suffix}`] = lightenColor(color, pale.level);
}

for (const [name, color] of Object.entries({ ...mainColors })) {
  configs.theme.extend.colors[name] = color;
  configs.theme.extend.colors[`${name}-${darker.suffix}`] = darkenColor(
    color,
    darker.level,
  );
  configs.theme.extend.colors[`${name}-${darkest.suffix}`] = darkenColor(
    color,
    darkest.level,
  );
}

configs.theme.extend.colors[`transparent-${darker.suffix}`] = `rgb(${blackRgb.join(',')}, 0.03)`;
configs.theme.extend.colors[`transparent-${darkest.suffix}`] = `rgb(${blackRgb.join(',')}, 0.06)`;

module.exports = configs;
