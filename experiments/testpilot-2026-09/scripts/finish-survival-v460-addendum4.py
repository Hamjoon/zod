"""Run only v4.6.0 developer/LLM corpora; always restore wrapper target."""
import json,os,subprocess,time
from pathlib import Path
E=Path('/work/zod/experiments/testpilot-2026-09');out=E/'results/survival/v4.6.0';W=E/'wrappers/zod'
def log(s):
 with (E/'docs/log-stage-s.md').open('a') as f:f.write(s+'\n')
def run(cmd,cwd=E):
 start=time.monotonic();p=subprocess.run(cmd,cwd=cwd,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT);log(f'- cwd `{cwd}` `{ " ".join(cmd)}` -> exit {p.returncode}, {time.monotonic()-start:.3f}s; {p.stdout.strip()}');return p
p=run(['python3','scripts/run-survival-dev.py','--release','v4.6.0']);print(p.stdout,flush=True)
if p.returncode:
 state=json.loads((out/'dev-status.json').read_text());state.update(harness='failed',error=p.stdout);(out/'dev-status.json').write_text(json.dumps(state,indent=2)+'\n');log('- Developer harness failed; raw outputs preserved, continue to LLM per addendum.')
build=json.loads((out/'build-status.json').read_text())
if not build['build']:log('- No LLM execution: build failed.');raise SystemExit(0)
original=os.readlink(W/'node_modules/zod');assert original=='../../../../../packages/zod';log('- Wrapper original target: '+original)
try:
 (W/'node_modules/zod').unlink();(W/'node_modules/zod').symlink_to('/work/zod-versions/v4.6.0/packages/zod')
 p=run(['node','-e',"const z=require('zod'); console.log(require('zod/package.json').version, typeof z.z, typeof z.z.string)"],W);(out/'llm-probe.txt').write_text(p.stdout)
 ok=p.returncode==0 and p.stdout.strip()=='4.6.0 object function';build['probe']='ok' if ok else 'failed';(out/'build-status.json').write_text(json.dumps(build,indent=2)+'\n')
 if ok:
  assert not (out/'llm-results.json').exists()
  p=run(['python3','scripts/run-survival-llm.py','--release','v4.6.0','--out','results/survival/v4.6.0']);print(p.stdout,flush=True);assert p.returncode==0
  assert len(json.loads((out/'llm-results.json').read_text()))==139;assert len(list((out/'llm-raw').iterdir()))==278;log('- v4.6.0 LLM: 139 entries, 278 raw files verified.')
 else:log('- v4.6.0 probe failed: skipped LLM execution.')
finally:
 (W/'node_modules/zod').unlink();(W/'node_modules/zod').symlink_to(original)
 p=run(['node','-e',"console.log(require('zod/package.json').version)"],W);assert p.returncode==0 and p.stdout.strip()=='4.0.5';assert not (W/'test-s').exists();log('- Original wrapper restored, 4.0.5 probe verified, scratch absent.')
