"""Shared loader for generation runs (recorded artifacts only; standard library, no model calls).

A result may span several run directories (e.g. gen-n124-run2 + gen-n124-tail). Prompt ids and test file
names repeat across runs, so prompts are keyed '<run>:<id>' and every test carries its run.

Prompt -> function mapping: testpilot2 generates functions one at a time in api.json order, and each
function's prompts start with its Base prompt (empty provenance). Walking a run's prompts in id order and
advancing to the next api.json function at every Base prompt therefore assigns each prompt to the function it
was generated for. load() asserts that this agrees with the tool's `api` for the first prompt of every test.
It is needed because the tool merges identical tests across functions (e.g. empty completions), so
`tests[].api` does not identify the function of every prompt in `promptIds`.
"""
import json
from pathlib import Path
R=Path(__file__).resolve().parents[1]/'results'
def refs(p): return '+'.join(sorted({v['refiner'] for v in p['provenance']})) or 'Base'
def load(runs):
 prompts={}; owner={}; tests=[]
 for run in runs:
  D=R/run; api=[f['accessPath'] for f in json.loads((D/'api.json').read_text())]
  k=-1
  for p in sorted(json.loads((D/'prompts.json').read_text())['prompts'],key=lambda p:p['id']):
   if not p['provenance']: k+=1
   key=f"{run}:{p['id']}"; prompts[key]=dict(p,run=run,text=(D/'prompts'/p['file']).read_text()); owner[key]=api[k]
  for t in json.loads((D/'report.json').read_text())['tests']:
   t=dict(t,run=run,promptIds=[f'{run}:{i}' for i in t['promptIds']]); tests.append(t)
   assert owner[t['promptIds'][0]]==t['api'],(run,t['testName'])
 return prompts,owner,tests
def testfile(t): return R/t['run']/'tests'/t['testFile']
