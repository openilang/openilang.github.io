import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const CONFIG_PATHS = [
  'dist/server/wrangler.json',
  'dist/server/.prerender/wrangler.json',
];

for (const path of CONFIG_PATHS) {
  if (!existsSync(path)) continue;

  const raw = readFileSync(path, 'utf8');
  const config = JSON.parse(raw);

  // Wrangler rejects empty triggers objects; remove it when no cron triggers are configured.
  if (
    config.triggers &&
    typeof config.triggers === 'object' &&
    !Array.isArray(config.triggers) &&
    Object.keys(config.triggers).length === 0
  ) {
    delete config.triggers;
  }

  // Keep only valid KV namespace entries with explicit IDs.
  if (Array.isArray(config.kv_namespaces)) {
    config.kv_namespaces = config.kv_namespaces.filter(
      (entry) => typeof entry?.id === 'string' && entry.id.length > 0,
    );
  }

  writeFileSync(path, `${JSON.stringify(config)}\n`, 'utf8');
}
