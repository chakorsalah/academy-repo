import * as migration_20261018_131931_initial from './20261018_131931_initial';
import * as migration_20261019_092735_full_site_editor from './20261019_092735_full_site_editor';
import * as migration_20261022_101956_library from './20261022_101956_library';
import * as migration_20261022_102403_source_gaps from './20261022_102403_source_gaps';
import * as migration_20261022_102951_menu from './20261022_102951_menu';
import * as migration_20261022_213834_blob_prefix from './20261022_213834_blob_prefix';

export const migrations = [
  {
    up: migration_20261018_131931_initial.up,
    down: migration_20261018_131931_initial.down,
    name: '20261018_131931_initial',
  },
  {
    up: migration_20261019_092735_full_site_editor.up,
    down: migration_20261019_092735_full_site_editor.down,
    name: '20261019_092735_full_site_editor',
  },
  {
    up: migration_20261022_101956_library.up,
    down: migration_20261022_101956_library.down,
    name: '20261022_101956_library',
  },
  {
    up: migration_20261022_102403_source_gaps.up,
    down: migration_20261022_102403_source_gaps.down,
    name: '20261022_102403_source_gaps',
  },
  {
    up: migration_20261022_102951_menu.up,
    down: migration_20261022_102951_menu.down,
    name: '20261022_102951_menu',
  },
  {
    up: migration_20261022_213834_blob_prefix.up,
    down: migration_20261022_213834_blob_prefix.down,
    name: '20261022_213834_blob_prefix'
  },
];
