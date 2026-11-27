import { lstat, readdir, chmod, rename, rm, symlink, mkdtemp } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const site = '/site';

async function snapshot() {
  const files = [];
  for (const root of ['src', 'public']) {
    for (const name of (await readdir(root, { recursive: true })).sort()) {
      const path = `${root}/${name}`;
      const stat = await lstat(path).catch((error) => {
        if (error.code !== 'ENOENT') throw error;
      });
      if (stat) files.push([path, stat.ino, stat.size, stat.mtimeMs, stat.ctimeMs]);
    }
  }
  return JSON.stringify(files);
}

async function build() {
  const output = await mkdtemp(`${site}/build-`);
  // mkdtemp creates a private directory; nginx needs to traverse it.
  await chmod(output, 0o755);
  const child = spawn('npm', ['run', 'build', '--', '--configuration=production', '--base-href=/', `--output-path=${output}`], { stdio: 'inherit' });
  const code = await new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', resolve);
  });
  if (code !== 0) {
    await rm(output, { recursive: true, force: true });
    console.error('Build failed; keeping the last successful build. Waiting for edits.');
    return;
  }

  const next = `${site}/.next`;
  await rm(next, { force: true });
  await symlink(`${output.split('/').pop()}/browser`, next);
  await rename(next, `${site}/current`);
  for (const name of await readdir(site)) {
    if (name.startsWith('build-') && `${site}/${name}` !== output) {
      await rm(`${site}/${name}`, { recursive: true, force: true });
    }
  }
  console.log('Build published to nginx; waiting for edits.');
}

let previous;
for (;;) {
  const current = await snapshot();
  if (current !== previous) {
    previous = current;
    await build();
  }
  await sleep(1000);
}
