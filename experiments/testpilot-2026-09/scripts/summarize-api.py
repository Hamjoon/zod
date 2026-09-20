"""Full API inventory and prompt examples; Python standard library only."""
import collections, csv, json, math, re, shutil, statistics
from pathlib import Path
R=Path(__file__).resolve().parents[1]/'results'
def read(p): return json.loads((R/p).read_text())
def norm(s): return re.sub(r'\s+',' ',s).strip()
def table(lines, header, rows):
    lines.extend(['| '+' | '.join(header)+' |','| '+' | '.join(['---']*len(header))+' |'])
    for row in rows: lines.append('| '+' | '.join(str(x).replace('|','\\|').replace('\n',' ') for x in row)+' |')
    lines.append('')
def namespace(path):
    parts=path.split('.')[2:-1]
    return '.'.join(parts) if parts else '<top>'
def main():
    lines=['# API summary','', 'Main API facts use the CommonJS main wrapper; mini facts use mini-native. Snippet comparisons use the original native and website-docs runs. Main-wrapper-native itself has zero snippets because its directory contains no Markdown. Snippet keys are final function names, so counts can be shared by unrelated paths with the same last component. Distributions include zero-snippet functions. p90 uses the nearest-rank definition.','']
    rows=[]; facts={}
    for entry in ('main','mini'):
        source='explore-mainwrap-native' if entry=='main' else 'explore-mini-native'
        api=read(source+'/api.json'); docs_api=read(f'explore-{entry}-docs/api.json')
        assert {f['accessPath'] for f in api}=={f['accessPath'] for f in docs_api}
        sn={c:dict(read(f'explore-{entry}-{c}/snippetMap.json')) for c in ('native','docs')}
        groups=collections.defaultdict(list)
        for f in api: groups[norm(f['descriptor']['implementation'])].append(f['accessPath'])
        counts={c:[len(sn[c].get(f['accessPath'].split('.')[-1],[])) for f in api] for c in sn}
        lengths=sorted(len(f['descriptor']['implementation']) for f in api)
        raw=read(f'explore-{entry}-raw.json'); raw_functions=sum(d['type']=='function' for _,d in raw)
        assert raw_functions==len(api)
        facts[entry]={'functions':len(api),'constructors':sum(bool(f['descriptor'].get('isConstructor')) for f in api),'async':sum(bool(f['descriptor'].get('isAsync')) for f in api),'docComments':sum(bool(f['descriptor'].get('docComment')) for f in api),'snippets_native':sum(bool(n) for n in counts['native']),'snippets_docs':sum(bool(n) for n in counts['docs']),'rawFunctions':raw_functions}
        lines+=['## '+entry,'']
        table(lines,['Metric','Value'],facts[entry].items())
        table(lines,['Website snippet count min','median','max'],[[min(counts['docs']),statistics.median(counts['docs']),max(counts['docs'])]])
        table(lines,['Access-path dots','Functions'],sorted(collections.Counter(f['accessPath'].count('.') for f in api).items()))
        table(lines,['Namespace after package.z','Functions'],sorted(collections.Counter(namespace(f['accessPath']) for f in api).items()))
        signatures=collections.Counter(f['descriptor']['signature'] for f in api)
        lines+=['### 15 most frequent exact signatures','']
        table(lines,['Signature','Count'],signatures.most_common(15))
        duplicates=sorted([v for v in groups.values() if len(v)>1],key=lambda v:(-len(v),v[0]))
        lines += [f'Normalized implementation duplicate groups: **{len(duplicates)}**. Largest ten (first five paths per group):','']
        table(lines,['Group size','Access paths'],[(len(v),'; '.join(v[:5])) for v in duplicates[:10]])
        table(lines,['Implementation length min','median','p90','max','above 4,000'],[[lengths[0],statistics.median(lengths),lengths[math.ceil(.9*len(lengths))-1],lengths[-1],sum(n>4000 for n in lengths)]])
        lines+=['Non-function raw entries:','']
        table(lines,['Type','Count'],sorted(collections.Counter(d['type'] for _,d in raw if d['type']!='function').items()))
        for i,f in enumerate(api):
            d=f['descriptor']; rows.append([entry,f['accessPath'],f['accessPath'].count('.'),bool(d.get('isConstructor')),bool(d.get('isAsync')),bool(d.get('docComment')),counts['native'][i],counts['docs'][i],d['signature'],len(d['implementation']),len(groups[norm(d['implementation'])])])
    population=read('population-stats.json')
    lines+=['## Population and sample','', 'P includes exactly package.z.<name> at depth 2 except signatures `(def)` and `(inst, def)`, plus depth-3 coerce and iso functions. All other discovered functions are excluded. Prototype methods are never walked by the explorer and are therefore not counted in the excluded discovered functions.','']
    table(lines,['Entry','Population','Excluded','S','C','Q'],[[e,population[e]['population'],population[e]['outside'],*[population[e]['strata'].get(s,0) for s in ('S','C','Q')]] for e in ('main','mini')])
    lines += ['Main population: 115 top-level + 5 coerce + 4 iso = 124. Sample: 60, seed 20260919, fixed draw order S/C/Q, allocation 36/17/7. Remaining main population: 64. See [sample](api-sample-n60-s20260919.txt) and [population](population-main.txt).', '',f"Mini has {population['mini']['identicalImplementation']} members with exactly identical implementation text to main, and {population['mini']['specific']} mini-specific members ([list](population-mini-specific.txt)). Text equality alone does not independently prove runtime function-object identity.",'']
    api=read('explore-main-docs/api.json'); sig=collections.Counter(f['descriptor']['signature'] for f in api).most_common(1)[0][0]
    selected=[min([f for f in api if f['accessPath'].endswith('.string')],key=lambda f:(f['accessPath'].count('.'),len(f['accessPath']),f['accessPath'])),next(f for f in api if f['descriptor']['signature']==sig)]
    constructors=[f for f in api if f['descriptor'].get('isConstructor')]
    if constructors: selected.append(constructors[0])
    dest=R/'prompt-examples'; dest.mkdir(exist_ok=True); prompts=read('explore-main-docs/prompts.json')['prompts']
    lines+=['## Prompt examples','']
    for f in selected:
        path=f['accessPath']; matches=[p for p in prompts if path+f['descriptor']['signature'] in (R/'explore-main-docs/prompts'/p['file']).read_text()]
        assert matches, path
        prompt=min(matches,key=lambda p:(bool(p['provenance']),p['id']))
        shutil.copyfile(R/'explore-main-docs/prompts'/prompt['file'],dest/(path+'.js'))
        lines.append(f"- [{path}](prompt-examples/{path}.js): signature `{f['descriptor']['signature']}`, source `{prompt['file']}`, provenance `{json.dumps(prompt['provenance'])}`; base prompt (empty provenance).")
    lines+=['','No mock completions or outcome-dependent refiner prompts exist. Zero attached doc comments closes the doc-comment template question for this stage. Website docs are selected for generation, but `--numSnippets all` is unsuitable: string has 807 snippets and parse has 250. Generation instructions must set a cap.','']
    with (R/'api-functions.csv').open('w',newline='') as out:
        writer=csv.writer(out); writer.writerow('entry accessPath depth isConstructor isAsync hasDocComment snippets_native snippets_docs signature implLength implGroupSize'.split()); writer.writerows(sorted(rows,key=lambda r:(r[0],r[1])))
    (R/'api-summary.md').write_text('\n'.join(lines)); (R/'api-facts.json').write_text(json.dumps(facts,indent=2)+'\n')
    print(json.dumps(facts,indent=2)); print('CSV rows:',len(rows),'prompt examples:',len(selected))
if __name__=='__main__': main()
