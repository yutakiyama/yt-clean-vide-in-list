import { defineConfig, build } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import * as fs from 'fs';

const entries = ['popup', 'content'] as const;

// Chrome拡張向け：各エントリーポイントを個別にビルド
export default defineConfig({
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: entries.reduce((acc, name) => {
                acc[name] = resolve(__dirname, `src/${name === 'popup' ? 'popup/popup' : 'content/content'}.ts`);
                return acc;
            }, {} as Record<string, string>),
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                // 共有チャンクを無効化して各ファイルにインライン化
                manualChunks: undefined,
            },
        },
    },
    plugins: [
        viteStaticCopy({
            targets: [
                { src: 'src/manifest.json', dest: '' },
                { src: 'src/popup/popup.html', dest: '' },
                { src: 'src/popup/popup.css', dest: '' },
                { src: 'icons/*', dest: 'icons' },
            ],
        }),
    ],
});
