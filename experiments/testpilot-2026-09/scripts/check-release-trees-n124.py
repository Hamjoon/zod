"""Stage S n124, Step 0: integrity of the reused release trees in $ROOT/zod-versions (host, standard library, read only).
1. packages/zod/src/ outside tests/ directories is byte-identical to the tag (git blob ids of the tree files vs `git ls-tree <tag>`);
2. packages/zod/index.cjs exists (sha256 recorded);
3. the sha256 mapping of src/v4/**/tests/** equals the frozen-v4.0.5-tests snapshot."""
import hashlib,json,subprocess
from pathlib import Path
E=Path(__file__).resolve().parents[1];Z=E.parents[1];V=Z.parent/'zod-versions';OUT=E/'results/survival-n124/source-integrity.json'
def blob(b):return hashlib.sha1(b'blob %d\0'%len(b)+b).hexdigest()
def testshashes(root):return {str(p.relative_to(root)):hashlib.sha256(p.read_bytes()).hexdigest() for p in root.rglob('*') if p.is_file() and 'tests' in p.relative_to(root).parts}
def main():
 tags=[r['tag'] for r in json.loads((E/'results/survival-n124/tags.json').read_text())];frozen=testshashes(V/'frozen-v4.0.5-tests');rows=[]
 for t in tags:
  src=V/t/'packages/zod/src'
  ls=subprocess.run(['git','-C',str(Z),'ls-tree','-r',t,'packages/zod/src'],check=True,text=True,capture_output=True).stdout.splitlines()
  git={l.split('\t',1)[1][len('packages/zod/src/'):]:l.split()[2] for l in ls}
  git={p:h for p,h in git.items() if 'tests' not in Path(p).parts}
  tree={str(p.relative_to(src)):p for p in src.rglob('*') if p.is_file() and 'tests' not in p.relative_to(src).parts}
  changed=sorted(p for p in git if p in tree and blob(tree[p].read_bytes())!=git[p])
  cjs=V/t/'packages/zod/index.cjs'
  rows.append(dict(release=t,checkedFiles=len(git),changed=changed,missingInTree=sorted(set(git)-set(tree)),extraInTree=sorted(set(tree)-set(git)),
   indexCjs=dict(exists=cjs.is_file(),sha256=hashlib.sha256(cjs.read_bytes()).hexdigest() if cjs.is_file() else None),
   testsFiles=len(h:=testshashes(V/t/'packages/zod/src/v4')),testsEqualFrozen=h==frozen))
 OUT.write_text(json.dumps(rows,indent=2)+'\n')
 for r in rows:print(r['release'],'checked',r['checkedFiles'],'changed',len(r['changed']),'missing',len(r['missingInTree']),'extra',len(r['extraInTree']),'index.cjs',r['indexCjs']['exists'],r['indexCjs']['sha256'],'tests files',r['testsFiles'],'== frozen',r['testsEqualFrozen'])
 ok=all(not r['changed'] and not r['missingInTree'] and r['indexCjs']['exists'] and r['testsEqualFrozen'] for r in rows)
 print('frozen snapshot files:',len(frozen));print('INTEGRITY_OK' if ok else 'INTEGRITY_MISMATCH');raise SystemExit(0 if ok else 1)
if __name__=='__main__':main()
