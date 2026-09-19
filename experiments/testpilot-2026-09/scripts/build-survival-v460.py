"""Addendum 2 v4.6.0 install/build, preserving earlier logs."""
import datetime,json,os,subprocess,time
from pathlib import Path
E=Path('/work/zod/experiments/testpilot-2026-09');root=Path('/work/zod-versions/v4.6.0');out=E/'results/survival/v4.6.0';env=dict(os.environ,HUSKY='0',COREPACK_ENABLE_PROJECT_SPEC='0',npm_config_yes='false');start=time.monotonic()
def log(s):
 with (E/'docs/log-stage-s.md').open('a') as f:f.write(s+'\n')
def run(cmd):
 p=subprocess.run(cmd,cwd=root,env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
 with (out/'build.log').open('a') as f:f.write(f'== continuation 2 {datetime.datetime.now(datetime.timezone.utc).isoformat()} {cmd!r}\n{p.stdout}\n== exit={p.returncode}\n')
 log(f'- v4.6.0 HUSKY=0 COREPACK_ENABLE_PROJECT_SPEC=0 `{ " ".join(cmd)}`: exit {p.returncode}; appended build.log.');return p
state={'release':'v4.6.0','install':False,'build':False,'probe':'not-run','fallbacks':['COREPACK_ENABLE_PROJECT_SPEC=0 (D-17)']}
log('- D-17: ignore nub packageManager project specification; use container pnpm. Container precondition: seven releases plus frozen snapshot, 81 .test.ts files.')
p=run(['pnpm','install','--frozen-lockfile'])
if p.returncode and ('lockfile' in p.stdout.lower() or 'ERR_PNPM_OUTDATED_LOCKFILE' in p.stdout):
 log('- D-18: frozen install rejected; exact error retained in build.log; retry --no-frozen-lockfile.')
 state['fallbacks'].append('--no-frozen-lockfile (D-18)');p=run(['pnpm','install','--no-frozen-lockfile'])
state['install']=p.returncode==0
if state['install']:
 p=run(['pnpm','build']);state['buildExitCode']=p.returncode;state['build']=p.returncode==0
else:state['error']='install failed: '+p.stdout[-3000:]
pkg=root/'packages/zod';exports=json.loads((pkg/'package.json').read_text())['exports']['.'];entry=exports.get('require');entry=entry.get('default') if isinstance(entry,dict) else entry
state.update(exports=exports,requireEntry=entry,entryExists=(pkg/entry).exists());state['build']=state['build'] and state['entryExists']
with (out/'env.txt').open('w') as f:
 for cmd in [['npx','--no-install','vitest','--version'],['node','--version'],['pnpm','--version']]:
  p=subprocess.run(cmd,cwd=pkg,env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT);f.write(p.stdout);log(f'- v4.6.0 environment `{ " ".join(cmd)}`: exit {p.returncode}; {p.stdout.strip()}')
state['wallSeconds']=time.monotonic()-start;(out/'build-status.json').write_text(json.dumps(state,indent=2)+'\n');log('- v4.6.0 build status: '+json.dumps(state));print(json.dumps(state),flush=True)
