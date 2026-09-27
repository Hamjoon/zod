"""Authorized lifecycle-free install and direct zshy build (addendum 4)."""
import datetime,json,os,shutil,subprocess,time
from pathlib import Path
E=Path('/work/zod/experiments/testpilot-2026-09');root=Path('/work/zod-versions/v4.6.0');out=E/'results/survival/v4.6.0';env=dict(os.environ,HUSKY='0',COREPACK_ENABLE_PROJECT_SPEC='0',npm_config_yes='false');start=time.monotonic()
def log(s):
 with (E/'docs/log-stage-s.md').open('a') as f:f.write(s+'\n')
def run(cmd,cwd=root):
 p=subprocess.run(cmd,cwd=cwd,env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
 with (out/'build.log').open('a') as f:f.write(f'== addendum 4 {datetime.datetime.now(datetime.timezone.utc).isoformat()} cwd={cwd} {cmd!r}\n{p.stdout}\n== exit={p.returncode}\n')
 log(f'- v4.6.0 HUSKY=0 COREPACK_ENABLE_PROJECT_SPEC=0 cwd `{cwd}` `{ " ".join(cmd)}`: exit {p.returncode}; appended build.log.');return p
workspace=root/'pnpm-workspace.yaml'
if not workspace.exists():workspace.write_text('packages:\n  - "packages/*"\n')
assert workspace.read_text()=='packages:\n  - "packages/*"\n'
state=json.loads((out/'build-status.json').read_text());state.update(install=False,build=False,probe='not-run');state.pop('error',None);state.pop('fallbackAssessment',None);state['fallbacks']+=['--ignore-scripts (D-24)','direct zshy build; no postbuild (D-25)']
p=run(['pnpm','install','--no-frozen-lockfile','--ignore-scripts']);state['install']=p.returncode==0
if not state['install']:state['error']=p.stdout[-6000:];state['stage']='install failed'
else:
 p=run(['npx','--no-install','zshy','--project','tsconfig.build.json'],root/'packages/zod')
 if p.returncode and ('npx canceled' in p.stdout or 'zshy: not found' in p.stdout):
  log('- D-25 permitted binary-resolution fallback: pnpm --filter zod exec zshy from root.')
  p=run(['pnpm','--filter','zod','exec','zshy','--project','tsconfig.build.json'])
 state['buildExitCode']=p.returncode;state['build']=p.returncode==0;state['stage']='built' if state['build'] else 'build failed'
 if p.returncode:
  errors=[line for line in p.stdout.splitlines() if 'error' in line.lower()][:20];state['error']='\n'.join(errors) or p.stdout[-6000:];log('- First 20 build error lines: '+state['error'])
lock=root/'pnpm-lock.yaml';record=out/'pnpm-lock.resolved.yaml';changed=lock.read_bytes()!=record.read_bytes();state['resolvedLockChanged']=changed
if changed:shutil.copyfile(lock,record)
log(f'- Resolved lockfile comparison: {"different; recorded copy replaced" if changed else "identical to addendum 3 resolution"}.')
with (out/'env.txt').open('a') as f:
 f.write('\n== addendum 4\n')
 for cmd in [['node','-e',"console.log(JSON.parse(require('fs').readFileSync('node_modules/zshy/package.json','utf8')).version)"],['node','--version'],['pnpm','--version']]:
  p=subprocess.run(cmd,cwd=root,env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT);f.write(' '.join(cmd)+': '+p.stdout);log(f'- environment `{ " ".join(cmd)}`: exit {p.returncode}; {p.stdout.strip()}')
for package in state['resolvedVersions']:state['resolvedVersions'][package]=json.loads((root/'node_modules'/package/'package.json').read_text())['version']
pkg=root/'packages/zod';state['entryExists']=(pkg/'index.cjs').exists();state['requireEntry']=json.loads((pkg/'package.json').read_text())['exports']['.']['require'];state['build']=state['build'] and all((pkg/n).exists() for n in ['index.cjs','index.js','index.d.cts'])
if state['build']:
 p=run(['node','-e',"console.log(require('./package.json').exports['.']); const z=require('./index.cjs'); console.log(typeof z.z, typeof z.z.string, require('./package.json').version)"],pkg);assert p.returncode==0 and p.stdout.strip().endswith('object function 4.6.0')
state['wallSeconds']=time.monotonic()-start;(out/'build-status.json').write_text(json.dumps(state,indent=2)+'\n');print(json.dumps(state),flush=True)
