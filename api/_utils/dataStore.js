import { promises as fs } from 'fs';
import path from 'path';

const TMP_DIR = '/tmp';
const BUILTIN_DATA_DIR = path.resolve(process.cwd(), 'api', '_data');

function getTmpPath(collection) {
  return path.join(TMP_DIR, `${collection}.json`);
}

function getBuiltinPath(collection) {
  return path.join(BUILTIN_DATA_DIR, `${collection}.json`);
}

export async function ensureTmpDir() {
  try {
    await fs.mkdir(TMP_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create /tmp directory:', error);
  }
}

export async function loadData(collection, defaultValue = []) {
  await ensureTmpDir();

  const tmpPath = getTmpPath(collection);
  try {
    const raw = await fs.readFile(tmpPath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    // Ignore and fallback to builtin data
  }

  try {
    const builtinPath = getBuiltinPath(collection);
    const raw = await fs.readFile(builtinPath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    return defaultValue;
  }
}

export async function saveData(collection, data) {
  await ensureTmpDir();
  try {
    await fs.writeFile(getTmpPath(collection), JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Failed to save ${collection} to /tmp:`, error);
  }
}
