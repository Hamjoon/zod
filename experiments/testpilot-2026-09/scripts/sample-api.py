"""Deterministic population and stratified sample; Python standard library only."""
import collections
import json
import random
from pathlib import Path
R = Path(__file__).resolve().parents[1] / 'results'
C = set('lt lte gt gte positive negative nonpositive nonnegative multipleOf maxSize minSize size maxLength minLength length regex lowercase uppercase includes startsWith endsWith property mime overwrite normalize trim toLowerCase toUpperCase check refine superRefine custom transform preprocess stringFormat'.split())
Q = set('parse parseAsync safeParse safeParseAsync setErrorMap getErrorMap'.split())
def read(name):
    return json.loads((R / name).read_text())
def population(api, prefix):
    return [f for f in api if f['accessPath'].startswith(prefix) and (
        (f['accessPath'].count('.') == 2 and f['descriptor']['signature'] not in ('(def)', '(inst, def)')) or
        (f['accessPath'].count('.') == 3 and f['accessPath'][len(prefix):].split('.')[0] in ('coerce', 'iso')))]
def stratum(f):
    path=f['accessPath']; name=path.split('.')[-1]
    if '.coerce.' in path or '.iso.' in path or name in Q: return 'Q'
    return 'C' if name in C else 'S'
def write_json(name, data):
    (R/name).write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n')
def main():
    api=read('explore-mainwrap-native/api.json'); p=population(api,'zod.z.')
    groups={s:sorted([f for f in p if stratum(f)==s],key=lambda f:f['accessPath']) for s in ('S','C','Q')}
    sizes={s:len(v) for s,v in groups.items()}
    print('Main population:',len(p),'outside:',len(api)-len(p),'strata:',sizes)
    if abs(len(p)-124)>2 or sizes!={'S':74,'C':35,'Q':15}:
        print(json.dumps(groups,indent=2)); raise SystemExit('Unexpected population/strata; stop')
    write_json('population-main.json',p)
    lines=[f"{f['accessPath']}\t{stratum(f)}" for f in p]
    (R/'population-main.txt').write_text('\n'.join(lines)+'\n'); print('\n'.join(lines))
    rng=random.Random(20260919); allocation={'S':36,'C':17,'Q':7}
    sample=[f for s in ('S','C','Q') for f in rng.sample(groups[s],allocation[s])]
    assert len({f['accessPath'] for f in sample})==60
    write_json('api-sample-n60-s20260919.json',sample)
    snippets=dict(read('explore-main-docs/snippetMap.json'))
    lines=['accessPath\tstratum\tsignature\timplLength\tsnippets_docs']+[f"{f['accessPath']}\t{stratum(f)}\t{f['descriptor']['signature']}\t{len(f['descriptor']['implementation'])}\t{len(snippets.get(f['accessPath'].split('.')[-1],[]))}" for f in sample]
    (R/'api-sample-n60-s20260919.txt').write_text('\n'.join(lines)+'\n')
    print('Allocation:',allocation); print('\n'.join(lines))
    mini_api=read('explore-mini-native/api.json'); mini=population(mini_api,'zod-mini.z.')
    main_impl={f['descriptor']['implementation'] for f in p}
    specific=[f for f in mini if f['descriptor']['implementation'] not in main_impl]
    (R/'population-mini-specific.txt').write_text('\n'.join(f['accessPath'] for f in specific)+'\n')
    facts={'main':{'population':len(p),'outside':len(api)-len(p),'strata':sizes},'mini':{'population':len(mini),'outside':len(mini_api)-len(mini),'strata':dict(collections.Counter(stratum(f) for f in mini)),'identicalImplementation':len(mini)-len(specific),'specific':len(specific)},'seed':20260919,'allocation':allocation}
    write_json('population-stats.json',facts); print(json.dumps(facts,indent=2))
if __name__=='__main__': main()
