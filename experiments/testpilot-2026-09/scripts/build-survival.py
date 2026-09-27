"""Install and build exported releases in Docker; preserve every command result."""
import datetime,json,os,subprocess,time
from pathlib import Path
E=Path('/work/zod/experiments/testpilot-2026-09')
def log(s):
 with (E/'docs/log-stage-s.md').open('a') as f:f.write(s+'\n')
for row in json.loads((E/'results/survival/tags.json').read_text()):
 t=row['tag']; root=Path('/work/zod-versions')/t; out=E/'results/survival'/t; start=time.monotonic(); env=dict(os.environ,HUSKY='0')
 status={'release':t,'install':False,'build':False,'probe':'not-run','fallbacks':[]}
 with (out/'build.log').open('w') as f:
  def run(args,extra=None):
   stamp=datetime.datetime.now(datetime.timezone.utc).isoformat();f.write(f'== {stamp} {args!r}\n');f.flush();s=time.monotonic()
   proc=subprocess.run(args,cwd=root,env=dict(env,**(extra or {})),stdout=f,stderr=subprocess.STDOUT)
   f.write(f'== exit={proc.returncode} wall={time.monotonic()-s:.3f}s\n');f.flush(); log(f'- {t}: HUSKY=0 `{ " ".join(args)}` (cwd {root}), exit {proc.returncode}; output `{out.relative_to(E)}/build.log`.')
   return proc.returncode
  rc=run(['pnpm','install','--frozen-lockfile'])
  if rc:
   err='\n'.join(line for line in (out/'build.log').read_text().splitlines() if not line.startswith('=='))
   if 'Corepack' in err or 'corepack' in err or 'packageManager' in err or 'package manager specification' in err:
    status['fallbacks'].append('COREPACK_ENABLE_STRICT=0');rc=run(['pnpm','install','--frozen-lockfile'],{'COREPACK_ENABLE_STRICT':'0'})
   elif 'lockfile' in err.lower():
    status['fallbacks'].append('--no-frozen-lockfile');rc=run(['pnpm','install','--no-frozen-lockfile'])
   elif 'husky' in err.lower() or 'prepare' in err.lower():
    status['fallbacks'].append('--ignore-scripts');rc=run(['pnpm','install','--frozen-lockfile','--ignore-scripts'])
   if rc:
    status['error']='Installation failed; no further applicable fallback'; status['wallSeconds']=time.monotonic()-start;(out/'build-status.json').write_text(json.dumps(status,indent=2)+'\n');raise SystemExit(status['error']+' at '+t)
  status['install']=True;rc=run(['pnpm','build']);status['buildExitCode']=rc
 pkg=root/'packages/zod'; probe=subprocess.run(['node','-e',"console.log(JSON.stringify(require('./package.json').exports['.']))"],cwd=pkg,text=True,capture_output=True)
 status['exports']=json.loads(probe.stdout) if probe.returncode==0 else probe.stderr
 require=status['exports'].get('require') if isinstance(status['exports'],dict) else None
 if isinstance(require,dict):require=require.get('default')
 status['requireEntry']=require;status['entryExists']=bool(require and (pkg/require).exists());status['build']=rc==0 and status['entryExists']
 with (out/'env.txt').open('w') as f:
  for cmd in [['npx','--no-install','vitest','--version'],['node','--version'],['pnpm','--version']]:
   p=subprocess.run(cmd,cwd=pkg,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT); f.write(p.stdout);log(f'- {t}: `{" ".join(cmd)}` exit {p.returncode}; {p.stdout.strip()}')
 status['wallSeconds']=time.monotonic()-start;(out/'build-status.json').write_text(json.dumps(status,indent=2)+'\n');log(f'- {t}: build status {json.dumps(status)}');print(json.dumps(status),flush=True)
