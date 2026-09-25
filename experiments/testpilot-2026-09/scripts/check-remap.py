"""Stage C, Step 1 remap check (host, standard library, read only).
Reads an nyc json report (coverage-final.json) produced by `require('.')` in v4.0.5-cov/packages/zod, and checks, for each target
function, that nyc's remapped fnMap declaration line and the first statement of its body land on the expected .ts lines.
Expected lines come from the .ts text: the declaration is the given line; the first statement is the first non-blank,
non-comment line after the line that opens the body."""
import json,re,sys
from pathlib import Path
SRC=Path(__file__).resolve().parents[4]/'zod-versions/v4.0.5-cov/packages/zod/src'
# (file under src/, function name in fnMap or None for an anonymous default export, declaration line of the implementation)
TARGETS=[('v4/classic/schemas.ts','string',371),('v4/classic/schemas.ts','array',1038),('v4/classic/schemas.ts','object',1150),
 ('v4/core/core.ts','config',131),('v4/core/util.ts','getEnumValues',201),('v4/core/util.ts','joinValues',209),('v4/locales/en.ts',None,123)]
def expected(lines,decl):
 i=decl-1
 while not lines[i].rstrip().endswith('{'):i+=1
 i+=1
 while not lines[i].strip() or lines[i].strip().startswith('//'):i+=1
 return i+1
def main():
 cov=json.loads(Path(sys.argv[1]).read_text());byrel={}
 for k,v in cov.items():
  m=re.search(r'/packages/zod/src/(.*)$',k)
  if m:byrel[m.group(1)]=v
 rows=[];ok=True
 for f,name,decl in TARGETS:
  lines=(SRC/f).read_text().split('\n');assert re.match(r'\s*export (default )?function',lines[decl-1]),(f,decl,lines[decl-1])
  exp_first=expected(lines,decl);fc=byrel.get(f)
  if fc is None:rows.append(dict(file=f,function=name or 'default export',expectedDecl=decl,actualDecl=None,expectedFirst=exp_first,actualFirst=None,match=False,note='file not in report'));ok=False;continue
  # a named function is found by its fnMap name; the anonymous default export by a name containing 'default' (CJS emit names it)
  fns=[fn for fn in fc['fnMap'].values() if (fn['name']==name if name else 'default' in fn['name'])]
  fn=fns[0] if len(fns)==1 else None
  if fn is None:rows.append(dict(file=f,function=name or 'default export',expectedDecl=decl,candidates=[(x['name'],x['decl']['start']['line']) for x in (fns or fc['fnMap'].values()) if abs(x['decl']['start']['line']-decl)<=3],match=False,note='function not uniquely found'));ok=False;continue
  lo,hi=fn['loc']['start'],fn['loc']['end']
  inside=[s['start'] for s in fc['statementMap'].values() if (s['start']['line'],s['start']['column'])>(lo['line'],lo['column']) and (s['start']['line'],s['start']['column'])<(hi['line'],hi['column'])]
  first=min(inside,key=lambda p:(p['line'],p['column']))['line'] if inside else None
  m=fn['decl']['start']['line']==decl and first==exp_first;ok&=m
  rows.append(dict(file=f,function=name or 'default export',fnMapName=fn['name'],expectedDecl=decl,actualDecl=fn['decl']['start']['line'],expectedFirst=exp_first,actualFirst=first,match=m))
 for r in rows:print(json.dumps(r))
 print('REMAP_OK' if ok else 'REMAP_MISMATCH');sys.exit(0 if ok else 1)
if __name__=='__main__':main()
