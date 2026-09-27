"""Replay the frozen Stage G passing corpus, one Mocha process per test."""
import argparse,collections,json,os,shutil,signal,subprocess,time
from pathlib import Path
E=Path(__file__).resolve().parents[1]
W=E/'wrappers/zod'
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--release',required=True);ap.add_argument('--out',required=True);ap.add_argument('--passing',default='results/gen-n60-passing.json',help='passing list, relative to the experiment directory');ap.add_argument('--tests',default='results/gen-n60/tests',help='test directory for entries without a run field');a=ap.parse_args()
 out=Path(a.out).resolve();raw=out/'llm-raw';raw.mkdir(parents=True,exist_ok=False);scratch=W/'test-s';scratch.mkdir();start=time.monotonic();results=[]
 try:
  for entry in json.loads((E/a.passing).read_text()):
   # D-31: an entry with a run field (two-run n124 result) lives in results/<run>/tests and is keyed <run>__<testName>
   source=(E/'results'/entry['run']/'tests' if 'run' in entry else E/a.tests)/Path(entry['testFile']).name;dest=scratch/source.name;rawname=(entry['run']+'__' if 'run' in entry else '')+entry['testName']
   dest.write_bytes(source.read_bytes().replace(b"require('zod')",b"require('..')"))
   # Keep validator's Mocha arguments, including output option, while also receiving JSON on stdout.
   report=Path('/dev/stdout')
   cmd=['/work/testpilot2/node_modules/.bin/mocha','--full-trace','--exit','--allow-uncaught=false','--reporter=json','--reporter-option','output='+str(report),'--',str(dest)]
   t=time.monotonic();proc=subprocess.Popen(cmd,cwd=W,stdout=subprocess.PIPE,stderr=subprocess.PIPE,start_new_session=True)
   timeout=False
   try:stdout,stderr=proc.communicate(timeout=5)
   except subprocess.TimeoutExpired:
    timeout=True;os.killpg(proc.pid,signal.SIGKILL);stdout,stderr=proc.communicate()
   elapsed=(time.monotonic()-t)*1000
   (raw/(rawname+'.stdout.json')).write_bytes(stdout);(raw/(rawname+'.stderr.txt')).write_bytes(stderr)
   status='other';err='';stack='';code=None
   if timeout:status='timeout';err='Process killed at 5000 ms'
   else:
    try:data=json.loads(stdout)
    except (ValueError,UnicodeDecodeError):status='load-error';err='\n'.join(x for x in stderr.decode(errors='replace').splitlines() if x.strip())[:300]
    else:
     stats=data.get('stats',{})
     if stats.get('failures',0)>=1:
      status='fail';e=data.get('failures',[{}])[0].get('err',{});err=str(e.get('message',''))[:300];stack=(e.get('stack','').splitlines() or [''])[0];code=e.get('code')
     elif stats.get('passes',0)>=1 and stats.get('failures',0)==0:status='pass'
     else:err=stdout.decode(errors='replace')
   results.append(dict(entry,status=status,err=err,stackFirstLine=stack,errorCode=code,durationMs=round(elapsed,3),exitCode=proc.returncode))
  (out/'llm-results.json').write_text(json.dumps(results,indent=2)+'\n')
  summary=dict(collections.Counter(r['status'] for r in results));summary['wallSeconds']=time.monotonic()-start
  (out/'llm-summary.json').write_text(json.dumps(summary,indent=2)+'\n');print(a.release,' / '.join(f'{k}={summary.get(k,0)}' for k in ['pass','fail','load-error','timeout','other']),f"wall={summary['wallSeconds']:.3f}s")
 finally:shutil.rmtree(scratch)
if __name__=='__main__':main()
