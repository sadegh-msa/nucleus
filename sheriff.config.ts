import {
  anyTag,
  noDependencies,
  type UserSheriffConfig as SheriffConfig,
} from '@softarc/sheriff-core';

/**
 * Architecture Matrix enforcement (DDD): each module may only import what its
 * layer allows. Tags follow the lib (ext/int sub-barrels inherit via <lib>
 * placeholders), depRules encode the allowed dependency graph.
 */
export const config: SheriffConfig = {
  entryFile: 'apps/nucleus/src/main.ts',
  // ponytail: one module per lib. Nested index.ts dirs would each become barrel
  // modules and flag every intra-lib relative import; a nonexistent barrelFileName
  // collapses each lib to a single barrel-less module. EncapsulationPattern is
  // never-matching (regex match = encapsulated, so nothing is); lib barrels keep
  // int/ hidden cross-lib; depRules below enforce the matrix.
  enableBarrelLess: true,
  barrelFileName: '__never__.ts',
  encapsulationPattern: /$^/,
  modules: {
    'apps/nucleus/src/app': 'app',
    'libs/<lib>/src': ['lib:<lib>'],
  },
  depRules: {
    root: anyTag,
    app: anyTag,
    'lib:common': noDependencies,
    'lib:l10n': noDependencies,
    'lib:theme': noDependencies,
    'lib:ui': ['lib:common'],
    'lib:auth': ['lib:ui', 'lib:common'],
    'lib:crud': ['lib:ui', 'lib:common', 'lib:auth'],
    'lib:panel': ['lib:crud', 'lib:ui', 'lib:common'],
  },
};
