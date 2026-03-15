/**
 * Wrapper to run Expo CLI when project path contains "&" (e.g. C:\D&D\...).
 * Node resolves paths correctly; setting cwd explicitly avoids shell/CMD path issues.
 */
const path = require('path');
const { spawnSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const cliPath = path.join(projectRoot, 'node_modules', 'expo', 'bin', 'cli');
const args = process.argv.slice(2);

const result = spawnSync(process.execPath, [cliPath, ...args], {
  cwd: projectRoot,
  stdio: 'inherit',
  env: process.env,
});

process.exit(result.status !== null ? result.status : result.signal ? 1 : 0);
