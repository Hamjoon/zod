"""Stage C, Step 5: developer suite at v4.0.5 with vitest-istanbul coverage, in the coverage build (Docker).
The command is last week's (results/survival/v4.0.5/dev-status.json) with the coverage options appended; the tests come from
the copy's src/v4/**/tests (frozen v4.0.5 tests, byte-identical to the original tree). The JSON test report is summarised with
summarize-dev-run.py and compared case by case with last week's dev-cases.json."""
import json,os,shlex,subprocess,time
from pathlib import Path
E=Path('/work/zod/experiments/testpilot-2026-09');ROOT=Path('/work/zod-versions/v4.0.5-cov');OUT=E/'results/coverage/dev';RUN=OUT/'v4.0.5';REPORTS=Path('/work/coverage-raw/dev/vitest')
def log(s):
 with (E/'docs/log-stage-c.md').open('a') as f:f.write(s+'\n')
def main():
 week3=json.loads((E/'results/survival/v4.0.5/dev-status.json').read_text());assert week3['fallbackUsed']==0 and week3['cwd']=='/work/zod-versions/v4.0.5'
 base=shlex.split(week3['command'].replace('/results/survival/v4.0.5/dev-run.json','/results/coverage/dev/v4.0.5/dev-run.json'))
 cov=['--coverage.enabled=true','--coverage.provider=istanbul','--coverage.all=false',"--coverage.include=packages/zod/src/**",'--coverage.reporter=json','--coverage.reporter=json-summary','--coverage.reportsDirectory='+str(REPORTS)]
 cmd=base+cov;RUN.mkdir(parents=True,exist_ok=False);start=time.monotonic()
 p=subprocess.run(cmd,cwd=ROOT,env=dict(os.environ,npm_config_yes='false'),text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT);secs=time.monotonic()-start
 (RUN/'dev-stdout.txt').write_text(f'$ {" ".join(cmd)}\n{p.stdout}\n== exit={p.returncode}, wallSeconds={secs:.3f}\n')
 status=dict(release='v4.0.5',cwd=str(ROOT),command=' '.join(cmd),week3Command=week3['command'],vitestExitCode=p.returncode,wallSeconds=secs,reportsDirectory=str(REPORTS),
  coverageFiles=sorted(x.name for x in REPORTS.iterdir()) if REPORTS.is_dir() else [])
 (RUN/'dev-status.json').write_text(json.dumps(status,indent=2)+'\n')
 log(f'- cwd `{ROOT}` npm_config_yes=false `{" ".join(cmd)}` -> exit {p.returncode}, {secs:.3f}s; coverage files {status["coverageFiles"]}')
 if not (RUN/'dev-run.json').exists():raise SystemExit('no JSON test report; see dev-stdout.txt: '+p.stdout[-2000:])
 s=subprocess.run(['python3',str(E/'scripts/summarize-dev-run.py'),'--release','v4.0.5','--out',str(RUN),'--out-root','results/coverage/dev'],cwd=E,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
 log(f'- summarize-dev-run.py --release v4.0.5 --out {RUN.relative_to(E)} --out-root results/coverage/dev -> exit {s.returncode}; {s.stdout.strip()}')
 if s.returncode:raise SystemExit(s.stdout)
 ident=lambda c:(c['file'],c['fullName'],c['occurrence'])
 a={ident(c):c['status'] for c in json.loads((E/'results/survival/v4.0.5/dev-cases.json').read_text())};b={ident(c):c['status'] for c in json.loads((RUN/'dev-cases.json').read_text())}
 cmp=dict(sameIdentities=set(a)==set(b),statusDiffering=[list(k)+[a[k],b[k]] for k in sorted(set(a)&set(b)) if a[k]!=b[k]]);(RUN/'dev-compare-week3.json').write_text(json.dumps(cmp,indent=2)+'\n')
 log(f'- case statuses vs last week v4.0.5: same identities {cmp["sameIdentities"]}, differing {len(cmp["statusDiffering"])}')
 print(json.dumps(dict(exit=p.returncode,seconds=round(secs,1),summary=json.loads((RUN/'dev-summary.json').read_text()),compare=dict(same=cmp['sameIdentities'],differing=len(cmp['statusDiffering'])),coverageFiles=status['coverageFiles'])))
 assert cmp['sameIdentities'] and not cmp['statusDiffering']
if __name__=='__main__':main()
