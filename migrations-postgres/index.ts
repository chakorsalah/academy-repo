import * as migration_20261022_202510_initial from './20261022_202510_initial';

export const migrations = [
  {
    up: migration_20261022_202510_initial.up,
    down: migration_20261022_202510_initial.down,
    name: '20261022_202510_initial'
  },
];
