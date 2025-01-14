const { join } = require('path');
const twColors = require('tailwindcss/colors');
const Color = require('color');

const blackRgb = Color('black').rgb().array();

function darkenColor(hexColor, level) {
  return Color(hexColor).darken(level).hex();
}

function lightenColor(hexColor, lightness, saturate = 0) {
  return Color(hexColor).lightness(lightness).saturate(saturate).hex();
}

function buildColor(name, color, level = 600) {
  const colors = {
    [name]: twColors[color][level],
    [`${name}-lightest`]: lightenColor(twColors[color][level], 92, -0.58),
  };

  for (const [name, color] of Object.entries({ ...colors })) {
    colors[`${name}-darker`] = darkenColor(color, 0.08);
    colors[`${name}-darkest`] = darkenColor(color, 0.15);
  }

  return colors;
}

const configs = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, 'libs/**/src/!(*.stories|*.spec).{ts,html}'),
  ],
  theme: {
    extend: {
      colors: {
        ...buildColor('primary', 'sky', 800),
        ...buildColor('success', 'green'),
        ...buildColor('warning', 'amber'),
        ...buildColor('danger', 'red'),
        ...buildColor('black', 'zinc', 900),
        ...buildColor('darkgray', 'zinc', 600),
        ...buildColor('gray', 'zinc', 500),
        'transparent-darker': `rgb(${blackRgb.join(',')}, 0.03)`,
        'transparent-darkest': `rgb(${blackRgb.join(',')}, 0.06)`,
        'surface-card': '#F4F4F5',
        'surface-ground': '#E5E7EB',
        'surface-misty': `rgb(${blackRgb.join(',')}, 0.009)`,
      },
      borderColor: {
        DEFAULT: '#D4D4D8',
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

module.exports = configs;
