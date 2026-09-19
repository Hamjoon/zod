"""Normalize runtime Vitest JSON; failed imports inherit baseline case identities."""
import argparse,collections,json
from pathlib import Path
E=Path(__file__).resolve().parents[1]
def normalize(p):
 marker='/src/v4/';assert marker in p,p;return p.split(marker,1)[1]
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--release',required=True);ap.add_argument('--out',required=True);a=ap.parse_args();out=Path(a.out)
 data=json.loads((out/'dev-run.json').read_text());files=data['testResults'];assert len(files)==81, f'Expected 81 runtime files, found {len(files)}'
 baseline=[] if a.release=='v4.0.5' else json.loads((E/'results/survival/v4.0.5/dev-cases.json').read_text())
 cases=[];loaded=0;failed=0
 for f in files:
  name=normalize(f['name']);assertions=f.get('assertionResults',[])
  if not assertions and f['status']=='failed':
   failed+=1;previous=[c for c in baseline if c['file']==name];assert previous,'Missing baseline case identities for '+name
   for c in previous:cases.append(dict(c,status='failed',message_first_line=(f.get('message','').strip().splitlines() or ['File load failure'])[0],file_load_failed=True))
  else:
   loaded+=1
   for c in assertions:
    message='\n'.join(c.get('failureMessages',[]));cases.append(dict(file=name,fullName=c['fullName'],status=c['status'],message_first_line=(message.strip().splitlines() or [''])[0]))
 counts=collections.Counter(c['status'] for c in cases);summary=dict(files=len(files),files_loaded=loaded,files_load_failed=failed,cases=len(cases),passed=counts['passed'],failed=counts['failed'],skipped=sum(v for k,v in counts.items() if k not in ('passed','failed')))
 assert len({(c['file'],c['fullName']) for c in cases})==len(cases),'Duplicate case identities'
 (out/'dev-cases.json').write_text(json.dumps(cases,indent=2)+'\n');(out/'dev-summary.json').write_text(json.dumps(summary,indent=2)+'\n');print(a.release,json.dumps(summary))
 if a.release=='v4.0.5':assert (summary['files'],summary['cases'],summary['passed'])==(81,888,888),'Control gate failed'
if __name__=='__main__':main()
