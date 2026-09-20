"""Addendum 3: mirror export workspaces and resolve dependencies with pnpm."""
import datetime,json,os,shutil,subprocess,time
from pathlib import Path
E=Path('/work/zod/experiments/testpilot-2026-09');root=Path('/work/zod-versions/v4.6.0');out=E/'results/survival/v4.6.0';env=dict(os.environ,HUSKY='0',COREPACK_ENABLE_PROJECT_SPEC='0',npm_config_yes='false');start=time.monotonic()
def log(s):
 with (E/'docs/log-stage-s.md').open('a') as f:f.write(s+'\n')
def run(cmd):
 p=subprocess.run(cmd,cwd=root,env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
 with (out/'build.log').open('a') as f:f.write(f'== addendum 3 {datetime.datetime.now(datetime.timezone.utc).isoformat()} {cmd!r}\n{p.stdout}\n== exit={p.returncode}\n')
 log(f'- v4.6.0 HUSKY=0 COREPACK_ENABLE_PROJECT_SPEC=0 `{ " ".join(cmd)}`: exit {p.returncode}; appended build.log.');return p
patterns=json.loads((root/'package.json').read_text())['workspaces'];assert isinstance(patterns,list) and all(isinstance(x,str) for x in patterns)
workspace=root/'pnpm-workspace.yaml';assert not workspace.exists(),'Unexpected workspace file exists';workspace.write_text('packages:\n'+''.join('  - '+json.dumps(x)+'\n' for x in patterns))
log('- D-22: added export-only pnpm-workspace.yaml mirroring workspaces '+json.dumps(patterns)+'. Resolve dependencies afresh; record resolved lockfile and versions.');state=dict(release='v4.6.0',install=False,build=False,probe='not-run',fallbacks=['COREPACK_ENABLE_PROJECT_SPEC=0 (D-17)','pnpm-workspace.yaml + --no-frozen-lockfile (D-22)'])
p=run(['pnpm','install','--no-frozen-lockfile']);state['install']=p.returncode==0
# Only the addendum-authorized newer-pnpm fallback may follow a feature incompatibility.
if p.returncode:
 state['error']=p.stdout[-6000:];state['stage']='install failed';log('- Installation failed; exact error retained for fallback assessment. No automatic unrelated retry.')
else:
 p=run(['pnpm','build']);state['buildExitCode']=p.returncode;state['build']=p.returncode==0
 if p.returncode:state['error']=p.stdout[-6000:];state['stage']='build failed'
versions={}
with (out/'env.txt').open('w') as f:
 for package in ['vitest','typescript','zshy','@biomejs/biome']:
  path=root/'node_modules'/package/'package.json';versions[package]=json.loads(path.read_text())['version'] if path.exists() else 'not installed';f.write(package+' '+versions[package]+'\n')
 for cmd in [['node','--version'],['pnpm','--version']]:
  p=subprocess.run(cmd,cwd=root,env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT);f.write(' '.join(cmd)+': '+p.stdout);log(f'- environment `{ " ".join(cmd)}`: exit {p.returncode}; {p.stdout.strip()}')
state['resolvedVersions']=versions
if (root/'pnpm-lock.yaml').exists():shutil.copyfile(root/'pnpm-lock.yaml',out/'pnpm-lock.resolved.yaml')
exports=json.loads((root/'packages/zod/package.json').read_text())['exports']['.'];entry=exports['require'];entry=entry.get('default') if isinstance(entry,dict) else entry
state.update(exports=exports,requireEntry=entry,entryExists=(root/'packages/zod'/entry).exists(),wallSeconds=time.monotonic()-start);state['build']=state['build'] and state['entryExists'];(out/'build-status.json').write_text(json.dumps(state,indent=2)+'\n');print(json.dumps(state),flush=True)
