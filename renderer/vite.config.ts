// Copyright 2024 GEEKROS, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";
import Package from "../package.json";

export default defineConfig(({ mode }) => ({
    root: __dirname,
    define: {
        __APP_NAME__: JSON.stringify(Package.title),
        __APP_VERSION__: JSON.stringify(Package.version),
        __DEV_SERVER_HOST__: JSON.stringify(Package.env.DEV_SERVER_HOST),
        __DEV_SERVER_PORT__: JSON.stringify(Package.env.DEV_SERVER_PORT),
        __DEV_BACKEND_HOST__: JSON.stringify(Package.env.DEV_BACKEND_HOST),
        __APP_LOCAL_STORAGE_PREFIX__: JSON.stringify(Package.env.LOCAL_STORAGE_PREFIX),
    },
    esbuild: {
        drop: mode === "production" ? ["debugger"] : [],
    },
    server: {
        host: Package.env.DEV_SERVER_HOST,
        port: Package.env.DEV_SERVER_PORT,
        cors: {
            origin: "*",
        },
        proxy: {
            "/backend": {
                target: Package.env.DEV_BACKEND_HOST,
                secure: false,
                changeOrigin: true,
                rewrite: (path: any) => path.replace(/^\/backend/, ""),
            },
        },
    },
    plugins: [
        react(),
        tailwindcss(),
        chunkSplitPlugin({
            strategy: "single-vendor",
            customChunk: (args) => {
                let { file, id, moduleId, root } = args;
                if (file.startsWith("src/")) {
                    file = file.substring(4);
                    file = file.replace(/\.[^.$]+$/, "");
                    return file;
                }
                return null;
            },
            customSplitting: {
                "react-vendor": ["react", "react-dom"],
            },
        }),
    ],
    build: {
        outDir: "../release/dist",
        emptyOutDir: true,
        sourcemap: false,
        cssCodeSplit: true,
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
            output: {
                comments: false,
            },
        },
        commonjsOptions: {
            requireReturnsDefault: "namespace",
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
}));
