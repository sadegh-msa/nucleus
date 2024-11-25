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
  primary: '#2563EB',
  info: '#0891B2',
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
  black: '#27272A',
  gray: '#71717A',
};

const configs = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, 'libs/**/src/!(*.stories|*.spec).{ts,html}'),
  ],
  theme: {
    extend: {
      colors: {
        'surface-card': '#E4E4E7',
        'surface-ground': '#D4D4D8',
        'surface-inner': `rgb(${blackRgb.join(',')}, 0.009)`,
      },
      borderColor: {
        DEFAULT: '#A1A1AA',
      },
      borderRadius: {
        inherit: 'inherit',
      },
      spacing: {
        4.5: '1.125rem',
        5.5: '1.375rem',
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
  configs.theme.extend.colors[`${name}-${darker.suffix}`] = darkenColor(color, darker.level);
  configs.theme.extend.colors[`${name}-${darkest.suffix}`] = darkenColor(color, darkest.level);
}

configs.theme.extend.colors[`transparent-${darker.suffix}`] = `rgb(${blackRgb.join(',')}, 0.03)`;
configs.theme.extend.colors[`transparent-${darkest.suffix}`] = `rgb(${blackRgb.join(',')}, 0.06)`;

module.exports = configs;
