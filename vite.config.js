import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import envCompatible from 'vite-plugin-env-compatible';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        envCompatible({ prefix: 'REACT_APP_' }),
        nodePolyfills({
            protocolImports: true,
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: 'build',
    },
    server: {
        port: 3000,
        open: true,
    },
});
