import * as migration_20261022_202510_initial from './20261022_202510_initial';
import * as migration_20261022_213832_blob_prefix from './20261022_213832_blob_prefix';

export const migrations = [
  {
    up: migration_20261022_202510_initial.up,
    down: migration_20261022_202510_initial.down,
    name: '20261022_202510_initial',
  },
  {
    up: migration_20261022_213832_blob_prefix.up,
    down: migration_20261022_213832_blob_prefix.down,
    name: '20261022_213832_blob_prefix'
  },
];
