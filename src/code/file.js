import * as fs from 'fs/promises';
import * as path from 'path';

export async function writeResult({ sources }) {
    const dist = path.resolve(process.cwd(), 'dist');
    await fs.mkdir(dist, { recursive: true });
    for (const source of sources) {
        await fs.writeFile(path.resolve(dist, source.name), source.code);
    }
}
