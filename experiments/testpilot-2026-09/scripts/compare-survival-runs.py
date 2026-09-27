"""Descriptive side-by-side of two Stage S results (default: n60 = results/survival vs n124 = results/survival-n124).
Recorded artifacts only; standard library; no tests are executed and no statistics are computed."""
import argparse,json
from pathlib import Path
E=Path(__file__).resolve().parents[1];R=E/'results'
ap=argparse.ArgumentParser()
ap.add_argument('--a-root',default='results/survival');ap.add_argument('--a-passing',default='results/gen-n60-passing.json');ap.add_argument('--a-name',default='n60')
ap.add_argument('--b-root',default='results/survival-n124');ap.add_argument('--b-passing',default='results/gen-n124-passing.json');ap.add_argument('--b-name',default='n124')
ap.add_argument('--shared',default='results/api-sample-n60-s20260919.json');ap.add_argument('--out',default='results/survival-n124-vs-n60.md')
A=ap.parse_args()
def load(p):return json.loads(Path(p).read_text())
def uid(s):return s['run']+'/'+s['testName'] if 'run' in s else s['testName']
def testpath(s,default_run):return f"results/{s.get('run',default_run)}/tests/{s['testFile']}"
def side(root,passing):
 root=E/root;tags=[r['tag'] for r in load(root/'tags.json')];S=load(E/passing)
 llm={t:{uid(r):r for r in load(root/t/'llm-results.json')} for t in tags}
 dev={t:load(root/t/'dev-summary.json') if (root/t/'dev-summary.json').exists() else None for t in tags}
 assert all(set(llm[t])=={uid(s) for s in S} for t in tags)
 return dict(tags=tags,S=S,llm=llm,dev=dev)
def firstbreak(x,u):return next((t for t in x['tags'] if x['llm'][t][u]['status']!='pass'),'')
def fnbreak(x,api):
 us=[uid(s) for s in x['S'] if s['api']==api]
 return next((t for t in x['tags'] if any(x['llm'][t][u]['status']!='pass' for u in us)),'never') if us else 'no tests in S'
def main():
 a=side(A.a_root,A.a_passing);b=side(A.b_root,A.b_passing);assert a['tags']==b['tags'];tags=a['tags'];an,bn=A.a_name,A.b_name
 L=[f'# Survival: {bn} vs {an}','',f'Descriptive only. {an}: `{A.a_root}` with `{A.a_passing}` ({len(a["S"])} tests); {bn}: `{A.b_root}` with `{A.b_passing}` ({len(b["S"])} tests). A test survives a release when its status there is `pass`. The developer corpus (888 frozen v4.0.5 cases) is run in both.','','## Release table','',
  f'| Release | {an} LLM survivors | {bn} LLM survivors | {an} dev passed | {bn} dev passed |','| --- | ---: | ---: | ---: | ---: |']
 for t in tags:
  sa=sum(r['status']=='pass' for r in a['llm'][t].values());sb=sum(r['status']=='pass' for r in b['llm'][t].values())
  dv=lambda x:f"{x['dev'][t]['passed']}/{x['dev'][t]['cases']}" if x['dev'][t] else 'unavailable'
  L.append(f'| {t} | {sa}/{len(a["S"])} ({sa/len(a["S"]):.2%}) | {sb}/{len(b["S"])} ({sb/len(b["S"]):.2%}) | {dv(a)} | {dv(b)} |')
 shared=[f['accessPath'] for f in load(E/A.shared)];diff=[f for f in shared if fnbreak(a,f)!=fnbreak(b,f)]
 L+=['',f'## The {len(shared)} shared functions','',f'Survivors per release (survivors / tests of the function in S). "First break" is the first release at which any of the function\'s tests does not pass (the control v4.0.5 included). Functions whose first break differs between the runs: **{len(diff)}** (marked **≠**).','',
  '| Function | Run | '+' | '.join(tags)+' | First break | |','| --- | --- | '+' | '.join('---:' for _ in tags)+' | --- | --- |']
 for f in sorted(shared):
  for x,n in ((a,an),(b,bn)):
   us=[uid(s) for s in x['S'] if s['api']==f]
   cells=[f"{sum(x['llm'][t][u]['status']=='pass' for u in us)}/{len(us)}" if us else '–' for t in tags]
   L.append(f'| {f} | {n} | '+' | '.join(cells)+f' | {fnbreak(x,f)} | {"**≠**" if f in diff and x is b else ""} |')
 L+=['','## LLM tests that fail at any release','','Every test of either run with a non-pass status at some release. The error line is the first line of the recorded error at the first break.','',
  '| Run | Test file | Function | First break | Status there | First error line |','| --- | --- | --- | --- | --- | --- |']
 for x,n,dflt in ((a,an,'gen-n60'),(b,bn,None)):
  for s in x['S']:
   u=uid(s);fb=firstbreak(x,u)
   if not fb:continue
   r=x['llm'][fb][u];line=(r['err'].strip().splitlines() or [''])[0].replace('|','\\|')[:200]
   L.append(f'| {n} | `{testpath(s,dflt)}` | {s["api"]} | {fb} | {r["status"]} | {line} |')
 L.append('');(E/A.out).write_text('\n'.join(L))
 print(json.dumps(dict(firstBreakDiffers=len(diff),failingA=sum(bool(firstbreak(a,uid(s))) for s in a['S']),failingB=sum(bool(firstbreak(b,uid(s))) for s in b['S']),out=A.out)))
if __name__=='__main__':main()
