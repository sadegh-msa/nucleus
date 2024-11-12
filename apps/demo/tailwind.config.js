const sharedTailwindConfig = require('../../tailwind.config');
const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...sharedTailwindConfig,
  content: [
    ...sharedTailwindConfig.content,
    ...createGlobPatternsForDependencies(__dirname),
  ],
};
