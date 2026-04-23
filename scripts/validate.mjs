// Valida cada JSON de configs/v1/<game>/<channel>.json
// contra el schema de schemas/<game>.schema.json.
// Ejecutado en CI antes de publicar.

// Usamos el build de Ajv para draft 2020-12 (el
// schema lo declara en `$schema`). El default de
// `ajv` expone draft 7 y rechazaria el $schema.
import Ajv from 'ajv/dist/2020.js';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ajv = new Ajv({ allErrors: true, strict: false });

const schemasDir = 'schemas';
const configsDir = 'v1';

let failed = false;

for (const schemaFile of readdirSync(schemasDir)) {
  if (!schemaFile.endsWith('.schema.json')) continue;
  const gameId = schemaFile.replace('.schema.json', '');
  const schema = JSON.parse(
    readFileSync(join(schemasDir, schemaFile), 'utf8'),
  );
  const validate = ajv.compile(schema);

  const gameDir = join(configsDir, gameId);
  try {
    statSync(gameDir);
  } catch {
    console.warn(
      `SKIP ${gameId}: no hay carpeta ${gameDir}`,
    );
    continue;
  }

  for (const configFile of readdirSync(gameDir)) {
    if (!configFile.endsWith('.json')) continue;
    const fullPath = join(gameDir, configFile);
    const data = JSON.parse(
      readFileSync(fullPath, 'utf8'),
    );
    if (!validate(data)) {
      failed = true;
      console.error(
        `FAIL ${gameId}/${configFile}:`,
        JSON.stringify(validate.errors, null, 2),
      );
    } else {
      console.log(`OK   ${gameId}/${configFile}`);
    }
  }
}

if (failed) {
  console.error('\nValidation failed.');
  process.exit(1);
}

console.log('\nAll configs valid.');
