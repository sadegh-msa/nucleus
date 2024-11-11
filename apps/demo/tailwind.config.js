const sharedTailwindConfig = require('../../libs/theme/src/lib/configs/tailwind.config');
const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...sharedTailwindConfig,
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, 'libs/**/src/!(*.stories|*.spec|*.config).{js,ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
};
