"""Stage S n124, Step 3: compare the rerun developer corpus with last week's, case by case (identity = file, fullName, occurrence).
Writes results/survival-n124/dev-compare-week3.json. Recorded artifacts only; standard library."""
import json
from pathlib import Path
E=Path(__file__).resolve().parents[1];A=E/'results/survival';B=E/'results/survival-n124'
def load(p):return json.loads(p.read_text())
def cases(p):return {(c['file'],c['fullName'],c['occurrence']):c for c in load(p)}
def main():
 out=[]
 for t in [r['tag'] for r in load(B/'tags.json')]:
  a,b=cases(A/t/'dev-cases.json'),cases(B/t/'dev-cases.json')
  differing=[dict(file=k[0],fullName=k[1],occurrence=k[2],week3=a[k]['status'],week4=b[k]['status']) for k in sorted(set(a)&set(b)) if a[k]['status']!=b[k]['status']]
  msg=sum(a[k].get('message_first_line')!=b[k].get('message_first_line') for k in set(a)&set(b))
  out.append(dict(release=t,casesWeek3=len(a),casesWeek4=len(b),sameIdentities=set(a)==set(b),onlyWeek3=[list(k) for k in sorted(set(a)-set(b))],onlyWeek4=[list(k) for k in sorted(set(b)-set(a))],
   statusDiffering=differing,identical=set(a)==set(b) and not differing,messageFirstLineDiffering=msg,
   summaryWeek3=load(A/t/'dev-summary.json'),summaryWeek4=load(B/t/'dev-summary.json'),
   commandWeek3=load(A/t/'dev-status.json').get('command','').replace('/results/survival/','/results/<root>/'),commandWeek4=load(B/t/'dev-status.json').get('command','').replace('/results/survival-n124/','/results/<root>/'),
   fallbackWeek3=load(A/t/'dev-status.json').get('fallbackUsed'),fallbackWeek4=load(B/t/'dev-status.json').get('fallbackUsed')))
 (B/'dev-compare-week3.json').write_text(json.dumps(out,indent=2)+'\n')
 for r in out:print(r['release'],'identical' if r['identical'] else 'DIFFERENT',f"{r['summaryWeek4']['passed']}/{r['casesWeek4']} vs week3 {r['summaryWeek3']['passed']}/{r['casesWeek3']}",'status diffs',len(r['statusDiffering']),'message diffs',r['messageFirstLineDiffering'],'same command',r['commandWeek3']==r['commandWeek4'],'fallback',r['fallbackWeek4'])
 print('ALL_IDENTICAL' if all(r['identical'] for r in out) else 'DIFFERENCES_FOUND')
if __name__=='__main__':main()
