import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';

const outDir = 'dist';

// ビルド前にdistをクリア
if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true });
}
fs.mkdirSync(outDir);
fs.mkdirSync(path.join(outDir, 'icons'));

// TypeScriptをビルド
async function build() {
    // popup.ts をビルド
    await esbuild.build({
        entryPoints: ['src/popup/popup.ts'],
        bundle: true,
        outfile: 'dist/popup.js',
        format: 'iife',
        target: 'es2020',
        minify: true,
    });

    // content.ts をビルド
    await esbuild.build({
        entryPoints: ['src/content/content.ts'],
        bundle: true,
        outfile: 'dist/content.js',
        format: 'iife',
        target: 'es2020',
        minify: true,
    });

    // 静的ファイルをコピー
    fs.copyFileSync('src/manifest.json', path.join(outDir, 'manifest.json'));
    fs.copyFileSync('src/popup/popup.html', path.join(outDir, 'popup.html'));
    fs.copyFileSync('src/popup/popup.css', path.join(outDir, 'popup.css'));

    // アイコンをコピー
    for (const file of fs.readdirSync('icons')) {
        fs.copyFileSync(path.join('icons', file), path.join(outDir, 'icons', file));
    }

    console.log('✓ Build completed successfully!');
}

build().catch((err) => {
    console.error('Build failed:', err);
    process.exit(1);
});
