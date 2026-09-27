"""Stage C: run a frozen passing corpus at t = v4.0.5 under nyc, one process per test, and keep each test's coverage.
Based on run-survival-llm.py: same scratch copy and require rewrite, same Mocha arguments, 5000 ms kill timeout, same status
classification. The Mocha process runs under nyc with testpilot2's validator arguments (src/mochaValidator.ts), except
--cwd, which is the coverage build's package directory instead of the wrapper (D-34), so zod's files fall under nyc's cwd.
Runs inside Docker, with the wrapper symlink pointed at the coverage build by replay-coverage.py."""
import argparse,collections,json,os,shutil,signal,subprocess,tempfile,time
from pathlib import Path
E=Path(__file__).resolve().parents[1]
W=E/'wrappers/zod'
NYC='/work/testpilot2/node_modules/.bin/nyc';MOCHA='/work/testpilot2/node_modules/.bin/mocha';CWD='/work/zod-versions/v4.0.5-cov/packages/zod'
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--set',required=True);ap.add_argument('--out',required=True);ap.add_argument('--raw',required=True)
 ap.add_argument('--passing',default='results/gen-n60-passing.json');ap.add_argument('--tests',default='results/gen-n60/tests',help='test directory for entries without a run field');a=ap.parse_args()
 out=Path(a.out).resolve();out.mkdir(parents=True,exist_ok=True);assert not (out/'llm-results.json').exists()
 raw=Path(a.raw);raw.mkdir(parents=True,exist_ok=False);scratch=W/'test-s';scratch.mkdir();start=time.monotonic();results=[]
 try:
  for entry in json.loads((E/a.passing).read_text()):
   run=entry.get('run','gen-n60');source=(E/'results'/entry['run']/'tests' if 'run' in entry else E/a.tests)/Path(entry['testFile']).name;dest=scratch/source.name
   dest.write_bytes(source.read_bytes().replace(b"require('zod')",b"require('..')"))
   tmp=Path(tempfile.mkdtemp(prefix='coverage-llm'));cov=tmp/'coverage'
   cmd=[NYC,'--cwd='+CWD,'--exclude='+scratch.name,'--reporter=json','--report-dir='+str(cov),'--temp-dir='+str(cov),
        MOCHA,'--full-trace','--exit','--allow-uncaught=false','--reporter=json','--reporter-option','output=/dev/stdout','--',str(dest)]
   t=time.monotonic();proc=subprocess.Popen(cmd,cwd=W,stdout=subprocess.PIPE,stderr=subprocess.PIPE,start_new_session=True)
   timeout=False
   try:stdout,stderr=proc.communicate(timeout=5)
   except subprocess.TimeoutExpired:
    timeout=True;os.killpg(proc.pid,signal.SIGKILL);stdout,stderr=proc.communicate()
   elapsed=(time.monotonic()-t)*1000
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
   report=cov/'coverage-final.json';rawfile=raw/f"{run}__{entry['testName']}.json"
   if report.exists():shutil.copyfile(report,rawfile)
   shutil.rmtree(tmp,ignore_errors=True)
   results.append(dict(entry,status=status,err=err,stackFirstLine=stack,errorCode=code,durationMs=round(elapsed,3),exitCode=proc.returncode,coverageFile=rawfile.name if rawfile.exists() else None))
  (out/'llm-results.json').write_text(json.dumps(results,indent=2)+'\n')
  summary=dict(collections.Counter(r['status'] for r in results));summary['withCoverage']=sum(bool(r['coverageFile']) for r in results);summary['wallSeconds']=time.monotonic()-start
  (out/'llm-summary.json').write_text(json.dumps(summary,indent=2)+'\n');print(a.set,' / '.join(f'{k}={summary.get(k,0)}' for k in ['pass','fail','load-error','timeout','other']),f"withCoverage={summary['withCoverage']}",f"wall={summary['wallSeconds']:.3f}s")
 finally:shutil.rmtree(scratch)
if __name__=='__main__':main()
