import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

export async function writeResult({ sources }) {
    const dist = path.resolve(process.cwd(), 'dist');
    await fs.mkdir(dist, { recursive: true });
    for (const source of sources) {
        await fs.mkdir(path.resolve(dist, source.type), { recursive: true });
        await fs.writeFile(path.resolve(dist, source.type, source.name), source.code);
    }
}

export async function copyStatic() {
    const dist = path.resolve(process.cwd(), 'dist');
    const staticFiles = path.resolve(fileURLToPath(import.meta.url), '..', '..', 'static');
    const files = await fs.readdir(staticFiles);
    for (const file of files) {
        await fs.copyFile(path.resolve(staticFiles, file), path.resolve(dist, file));
    }
}
