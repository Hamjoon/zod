"""Run the unchanged probe and a deliberately failing copy in the CJS wrapper."""
import json, pathlib, shutil, subprocess, time
exp=pathlib.Path('/work/zod/experiments/testpilot-2026-09')
w=exp/'wrappers/zod'; out=exp/'results/probe'; tp=pathlib.Path('/work/testpilot2')
(w/'tests-probe').mkdir(exist_ok=True)
source=(exp/'scripts/probe-test.js').read_text()
for fail in (False,True):
    name='probe-fail.js' if fail else 'probe-test.js'
    report='report-fail.json' if fail else 'report.json'
    (w/'tests-probe'/name).write_text(source.replace("s.parse('abc'), 'abc'", "s.parse('abc'), 'xyz'") if fail else source)
    cmd=[str(tp/'node_modules/.bin/nyc'), '--cwd='+str(w), '--exclude=tests-probe', '--reporter=json', '--report-dir='+str(out/'coverage'), '--temp-dir='+str(out/'coverage'),str(tp/'node_modules/.bin/mocha'),'--full-trace','--exit','--allow-uncaught=false','--reporter=json','--reporter-option','output='+str(out/report),'--','tests-probe/'+name]
    print(cmd,flush=True); start=time.monotonic(); rc=subprocess.run(cmd,cwd=w).returncode; elapsed=time.monotonic()-start
    data=json.loads((out/report).read_text()); coverage=json.loads((out/'coverage/coverage-final.json').read_text())
    timing=dict(exit=rc,seconds=elapsed,coverageBytes=(out/'coverage/coverage-final.json').stat().st_size,coverageFiles=list(coverage))
    (out/('timing-fail.json' if fail else 'timing.json')).write_text(json.dumps(timing,indent=2)+'\n')
    print(timing,data['stats'],flush=True)
    assert rc==(1 if fail else 0)
    assert data['stats']['failures']==int(fail) and data['stats']['passes']==int(not fail)
    if fail:
        err=data['failures'][0]['err']; print(err,flush=True)
        assert 'AssertionError' in err.get('name','') or 'AssertionError' in err.get('stack','')
        assert err['message']
shutil.rmtree(w/'tests-probe')
shutil.rmtree('/work/zod/packages/zod/tests-probe')
