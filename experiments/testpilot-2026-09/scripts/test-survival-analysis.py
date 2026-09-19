"""Regression checks for repeated case names and frozen file-load accounting.

Uses recorded control JSON as a fixture. Does not execute any zod test.
"""
import collections,copy,importlib.util,json,subprocess,sys,tempfile,unittest
from pathlib import Path
E=Path(__file__).resolve().parents[1]
class CaseIdentityTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.raw=json.loads((E/'results/survival/v4.0.5/dev-run.json').read_text())
  cls.baseline=json.loads((E/'results/survival/v4.0.5/dev-cases.json').read_text())
 def summarize(self,raw):
  with tempfile.TemporaryDirectory() as name:
   out=Path(name);(out/'dev-run.json').write_text(json.dumps(raw))
   p=subprocess.run([sys.executable,str(E/'scripts/summarize-dev-run.py'),'--release','fixture','--out',str(out)],capture_output=True,text=True)
   self.assertEqual(p.returncode,0,p.stdout+p.stderr)
   return json.loads((out/'dev-cases.json').read_text()),json.loads((out/'dev-summary.json').read_text())
 def test_duplicate_name_can_fail_independently(self):
  raw=copy.deepcopy(self.raw)
  target=next(f for f in raw['testResults'] if f['name'].endswith('/classic/tests/standard-schema.test.ts'))
  repeats=[c for c in target['assertionResults'] if c['fullName']=='length checks'];self.assertEqual(len(repeats),4)
  repeats[1]['status']='failed';repeats[1]['failureMessages']=['synthetic failure']
  cases,summary=self.summarize(raw)
  observed=[c for c in cases if c['file']=='classic/tests/standard-schema.test.ts' and c['fullName']=='length checks']
  self.assertEqual([(c['occurrence'],c['status']) for c in observed],[(1,'passed'),(2,'failed'),(3,'passed'),(4,'passed')])
  self.assertEqual((summary['cases'],summary['passed'],summary['failed']),(888,887,1))
 def test_file_load_failure_preserves_every_baseline_case(self):
  raw=copy.deepcopy(self.raw);target=next(f for f in raw['testResults'] if f['name'].endswith('/classic/tests/standard-schema.test.ts'));count=len(target['assertionResults'])
  target.update(assertionResults=[],status='failed',message='Synthetic module load failure\nDetails')
  cases,summary=self.summarize(raw)
  identity=lambda c:(c['file'],c['fullName'],c['occurrence'])
  self.assertEqual({identity(c) for c in cases},{identity(c) for c in self.baseline})
  self.assertEqual((summary['cases'],summary['files_load_failed'],summary['failed']),(888,1,count))
  self.assertEqual(summary['passed'],888-count)
 def test_analysis_distinguishes_occurrences_and_ignores_unavailable(self):
  spec=importlib.util.spec_from_file_location('analysis',E/'scripts/analyze-survival.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
  self.assertEqual(len({m.key(c) for c in self.baseline}),888)
  self.assertEqual(m.firstbreak([('t','passed'),('t1','unavailable'),('t2','failed')],'passed'),'t2')
  self.assertTrue(m.rebound([('t','passed'),('t1','failed'),('t2','passed')],'passed'))
if __name__=='__main__':unittest.main()
