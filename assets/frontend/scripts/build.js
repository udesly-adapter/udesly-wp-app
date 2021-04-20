const {name, main} = require('../package.json');
const esbuild = require('esbuild');

const isProduction = (process.argv).some( arg => arg.includes('--production'));

const watch = (process.argv).some( arg => arg.includes('--watch'));


esbuild.build({
    entryPoints: [main],
    bundle: true,
    minify: isProduction,
    watch,
    splitting: true,
    outdir: `js`,
    define: {
      DEV: !isProduction
    },
    plugins: [],
    format: "esm",
    logLevel: 'info',
    sourcemap: !isProduction
}).catch(() => process.exit(1))