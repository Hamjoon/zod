"""Record the Stage G addendum gate without changing experiment artifacts."""
import json,re,sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]/'results'/sys.argv[1]
report=json.loads((root/'report.json').read_text()); prompts=json.loads((root/'prompts.json').read_text())['prompts']; byid={p['id']:p for p in prompts}
def block(p):
 c=(p.get('completions') or [''])[0] or ''; m=re.search(r'```[^\n]*\n([\s\S]*?)```',c)
 return m.group(1) if m else ''
eligible=[p for p in prompts if not any(v['refiner']=='RetryWithError' for v in p['provenance'])]
ok=[p['id'] for p in eligible if block(p).lstrip().startswith("let mocha = require('mocha');")]
records=[]
for t in report['tests']:
 if t.get('err',{}).get('message')=='Invalid syntax':
  evidence=[]
  for pid in t['promptIds']:
   code=block(byid[pid]); first=code.split('\n')[0]; duplicate='require' not in first and bool(re.search(r'\b(?:let|const)\s+(?:mocha|assert|zod)\s*=\s*require',code))
   evidence.append(dict(promptId=pid,firstLineContainsRequire='require' in first,likelyImportDuplication=duplicate,first200=code[:200]))
  records.append(dict(testName=t['testName'],evidence=evidence))
failed=(root/'stdout.txt').read_text().count('Failed to get completions'); passed=sum(t['status']=='PASSED' for t in report['tests'])
out=dict(requestFailures=failed,prompts=len(prompts),refinerPrompts=sum(bool(p['provenance']) for p in prompts),eligiblePrompts=len(eligible),requireFirst=len(ok),notRequireFirst=[p['id'] for p in eligible if p['id'] not in ok],tests=len(report['tests']),passes=passed,invalidSyntax=len(records),syntaxRecords=records,stats=report['stats'],metaData=report['metaData'])
out['gatePassed']=failed==0 and len(ok)==len(eligible) and passed>0 and len(records)<len(report['tests'])/2
out['fixBIndicated']=not (passed>0 and len(records)<len(report['tests'])/2) and sum(any(e['likelyImportDuplication'] for e in r['evidence']) for r in records)>len(records)/2
(root/'smoke-check.json').write_text(json.dumps(out,indent=2)+'\n'); print(json.dumps(out,indent=2))
