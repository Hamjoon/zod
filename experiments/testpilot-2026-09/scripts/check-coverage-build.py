"""Stage C, Step 1 gates for the source-map rebuild in $ROOT/zod-versions/v4.0.5-cov (host, standard library, read only).
1. every built .cjs/.js under packages/zod (outside src/ and node_modules/) has a .map next to it, and its last line references that map;
2. every built .cjs/.js/.d.ts/.d.cts is byte-identical to v4.0.5's after removing the //# sourceMappingURL= line;
3. packages/zod/src/ is byte-identical, frozen tests/ included.
Also lists any other file under packages/zod (outside node_modules) that differs, e.g. package.json."""
import hashlib,json,re,sys
from pathlib import Path
V=Path(__file__).resolve().parents[4]/'zod-versions';A=V/'v4.0.5/packages/zod';B=V/'v4.0.5-cov/packages/zod'
OUT=Path(__file__).resolve().parents[1]/'results/coverage/build-check.json'
def files(root,pred):
 out={}
 for p in root.rglob('*'):
  r=p.relative_to(root)
  if r.parts and r.parts[0] in ('src','node_modules'):continue
  if p.is_file() and pred(p.name):out[str(r)]=p
 return out
built=lambda n:n.endswith(('.cjs','.js','.d.ts','.d.cts'))
code=lambda n:n.endswith(('.cjs','.js'))
URL=re.compile(rb'\n//# sourceMappingURL=[^\n]*\n?$')
def main():
 a,b=files(A,built),files(B,built);res={}
 res['builtFilesOriginal']=len(a);res['builtFilesCopy']=len(b);res['onlyInOriginal']=sorted(set(a)-set(b));res['onlyInCopy']=sorted(set(b)-set(a))
 # gate 1
 maps=[];bad1=[]
 for r,p in sorted(files(B,code).items()):
  m=p.with_name(p.name+'.map');last=p.read_bytes().rstrip(b'\n').split(b'\n')[-1]
  ok=m.is_file() and last==b'//# sourceMappingURL='+m.name.encode()
  if m.is_file():
   j=json.loads(m.read_text());maps.append(len(j.get('sources',[])))
  if not ok:bad1.append(dict(file=r,mapExists=m.is_file(),lastLine=last.decode(errors='replace')[:120]))
 res['gate1']=dict(codeFiles=len(files(B,code)),withValidMapReference=len(files(B,code))-len(bad1),failures=bad1[:20])
 # gate 2
 same=0;strip=0;bad2=[]
 for r in sorted(set(a)&set(b)):
  x,y=a[r].read_bytes(),b[r].read_bytes()
  if URL.search(x):bad2.append(dict(file=r,reason='original already has a sourceMappingURL'));continue
  y2=URL.sub(b'\n',y)
  if y2!=y:strip+=1
  if y2==x:same+=1
  else:bad2.append(dict(file=r,reason='differs only in trailing newlines' if y2.rstrip(b'\n')==x.rstrip(b'\n') else 'differs after removing the sourceMappingURL line'))
 res['gate2']=dict(compared=len(set(a)&set(b)),identical=same,sourceMappingUrlLinesRemoved=strip,failures=bad2[:20])
 # gate 3
 h=lambda root:{str(p.relative_to(root)):hashlib.sha256(p.read_bytes()).hexdigest() for p in (root/'src').rglob('*') if p.is_file()}
 ha,hb=h(A),h(B);res['gate3']=dict(files=len(ha),identical=ha==hb,differing=sorted(k for k in set(ha)|set(hb) if ha.get(k)!=hb.get(k))[:20])
 other=files(B,lambda n:not built(n) and not n.endswith('.map'));oa=files(A,lambda n:not built(n) and not n.endswith('.map'))
 res['otherFilesDiffering']=sorted(r for r in set(other)|set(oa) if r not in oa or r not in other or oa[r].read_bytes()!=other[r].read_bytes())
 res['mapSourcesPerMap']=dict(min=min(maps),max=max(maps)) if maps else None
 res['passed']=not res['onlyInOriginal'] and not res['onlyInCopy'] and not bad1 and not bad2 and res['gate3']['identical']
 OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(json.dumps(res,indent=2)+'\n');print(json.dumps(res,indent=1))
 sys.exit(0 if res['passed'] else 1)
if __name__=='__main__':main()
