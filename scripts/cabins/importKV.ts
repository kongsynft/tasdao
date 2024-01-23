import {kv} from "@vercel/kv";
import { readFileSync } from 'fs';
import { join } from 'path';
import * as zlib from 'zlib';
import 'dotenv/config';

async function main() {
  const filePath = join(__dirname, 'updated_cabins.json');

  const cabinsData = JSON.parse(readFileSync(filePath, 'utf-8'));
  const cabinsJson = JSON.stringify(cabinsData);

  const compressed = zlib.gzipSync(cabinsJson);
  const compressedSizeInMB = compressed.length / (1024 * 1024);
  console.log(`Compressed data size: ${compressedSizeInMB} MB`);

  try {
    // await kv.set('cabins', compressed.toString('base64'));
    // console.log('Cabins data has been stored in Vercel KV (redis).');
    const cabins = await kv.get('cabins')
    console.log(cabins)
    console.log('Cabins data fetched from Vercel KV (redis).')
  } catch (err) {
    console.error('Error storing data in Vercel KV:', err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
