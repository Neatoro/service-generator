import { Command } from 'commander';
import { resolve as path_resolve } from 'path';
import { copyStatic, writeResult } from './code/file.js';
import { generateCode, printNode } from './code/index.js';
import { error, info } from './log.js';
import { loadValidSchema, transformSchema } from './schema/index.js';

const program = new Command();
program
  .name('service-generator')
  .argument('<file>', 'Input File for service generation')
  .action(async (file) => {
    try {
      const schema = loadValidSchema({
        path: path_resolve(process.cwd(), file)
      });
      info('Loaded Schema');
      const definition = transformSchema({ schema });
      info('Transformed to Definition');
      const codeBlocks = generateCode({ definition });
      info('Generated Code');
      const sources = codeBlocks.map(printNode);
      await writeResult({ sources });
      await copyStatic();
    } catch (e) {
      error(e);
    }
  });

program.parse();
