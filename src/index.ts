import { Compiler, Compilation, sources } from 'webpack';
import { readFileSync } from 'fs';
import { join } from 'path';

const codeFilePath = join(__dirname, 'code.min.js');
const code = readFileSync(codeFilePath, { encoding: 'utf-8' });

type OverlayOptions = {
  querySelector: string;
};

export class Overlay {
  constructor(private opts: OverlayOptions) {}

  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(
      'Overlay',
      (compilation: Compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: 'Overlay',
            stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
          },
          (assets) => {
            let snippet = code;

            for (const filename in assets) {
              if (filename.endsWith('.js')) {
                const originalSource = assets[filename].source().toString();
                snippet = snippet.replace(
                  '$$overlayQuerySelector$$',
                  this.opts.querySelector,
                );
                const updatedSource = `${snippet}\n${originalSource}`;

                assets[filename] = new sources.RawSource(updatedSource);
              }
            }
          },
        );
      },
    );
  }
}

export default Overlay;
