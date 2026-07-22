
import appRoot from 'app-root-path';
import path from 'node:path';
import tsconfigBase from '../tsconfig.base.json' with { type: 'json' };

export function getPathAlias() {
   return Object.fromEntries(
    Object.entries(tsconfigBase.compilerOptions.paths).map(([key, value]) => [
      key,
      path.resolve(appRoot.path, value[0]),
    ]),
  );
}
