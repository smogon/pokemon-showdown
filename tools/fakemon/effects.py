"""Compile the natural-language move effect text from the source files into real
Pokemon Showdown move fields.

Every rule here emits actual engine data (secondaries, boosts, callbacks,
conditions...), never a description string. Anything that does not match a rule
is reported by `build.py` so it can be implemented by hand instead of silently
shipping an inert move.
"""
import re

STAT = {
    'attack': 'atk', 'atk': 'atk', 'defense': 'def', 'def': 'def',
    'sp. atk': 'spa', 'sp.atk': 'spa', 'sp atk': 'spa', 'special attack': 'spa',
    'spa': 'spa', 'sp. def': 'spd', 'sp.def': 'spd', 'sp def': 'spd',
    'special defense': 'spd', 'spd': 'spd', 'speed': 'spe', 'spe': 'spe',
    'accuracy': 'accuracy', 'evasion': 'evasion', 'evasiveness': 'evasion',
}
STAT_RE = ('attack|atk|defense|def|sp\\.? ?atk|special attack|sp\\.? ?def|'
           'special defense|speed|spe|accuracy|evasion|evasiveness')

STATUS = {
    'burn': 'brn', 'burned': 'brn', 'burns': 'brn',
    'paralysis': 'par', 'paralyze': 'par', 'paralyzed': 'par', 'paralyzes': 'par',
    'paralysed': 'par', 'stun': 'par',
    'freeze': 'frz', 'frozen': 'frz', 'freezes': 'frz',
    'sleep': 'slp', 'asleep': 'slp', 'sleeps': 'slp',
    'poison': 'psn', 'poisons': 'psn', 'poisoned': 'psn',
    'badly poison': 'tox', 'badly poisons': 'tox', 'severely poison': 'tox',
    'toxic': 'tox',
}


class Spec:
    """Accumulates the Showdown fields for one move."""

    def __init__(self, move):
        self.move = move
        self.fields = {}
        self.secondaries = []
        self.self_boosts = {}
        self.target_boosts = {}
        self.notes = []
        self.matched = []
        self.unmatched = True

    def set(self, key, value):
        self.fields[key] = value

    def add_secondary(self, sec):
        self.secondaries.append(sec)

    def note(self, text):
        if text not in self.notes:
            self.notes.append(text)


def _stat(word):
    return STAT[word.strip().lower().replace('sp.atk', 'sp. atk').replace('sp.def', 'sp. def')]


def _status(word):
    return STATUS[word.strip().lower()]


# --------------------------------------------------------------------------
# Rules. Each is (compiled regex, handler). Handlers mutate the Spec.
# Rules are all tried against the whole effect string; several may fire.
# --------------------------------------------------------------------------
RULES = []


def rule(pattern, flags=re.I):
    def deco(fn):
        RULES.append((re.compile(pattern, flags), fn))
        return fn
    return deco


# ---- secondary status chances -------------------------------------------
@rule(r'(\d+)%\s*(?:chance (?:to|of) )?(?:cause |induce |inflict |severely )?'
      r'(burn|paralysis|paralyze|paralysed|paralyzed|freeze|sleep|poison|'
      r'badly poison|severely poison|confusion|confuse|flinch|toxic)\b')
def r_secondary_status(sp, m):
    chance = int(m.group(1))
    word = m.group(2).lower()
    if word in ('confusion', 'confuse'):
        sp.add_secondary({'chance': chance, 'volatileStatus': "'confusion'"})
    elif word == 'flinch':
        sp.add_secondary({'chance': chance, 'volatileStatus': "'flinch'"})
    else:
        sp.add_secondary({'chance': chance, 'status': f"'{_status(word)}'"})


@rule(r'(\d+)% chance to (burn|paralyze) or (burn|paralyze)')
def r_secondary_either(sp, m):
    a, b = _status(m.group(2)), _status(m.group(3))
    sp.add_secondary({
        'chance': int(m.group(1)),
        'onHit': f"(target, source, move) => {{ target.trySetStatus("
                 f"source.battle.sample(['{a}', '{b}']), source, move); }}",
    })


@rule(r'(\d+)% chance to (?:Sleep|sleep) or (?:Poison|poison) the target')
def r_secondary_slp_psn(sp, m):
    sp.add_secondary({
        'chance': int(m.group(1)),
        'onHit': "(target, source, move) => { target.trySetStatus("
                 "source.battle.sample(['slp', 'psn']), source, move); }",
    })


@rule(r'(\d+)% chance to (?:Poison|poison) or (?:Badly Poison|badly poison)')
def r_secondary_psn_tox(sp, m):
    sp.add_secondary({
        'chance': int(m.group(1)),
        'onHit': "(target, source, move) => { target.trySetStatus("
                 "source.battle.sample(['psn', 'tox']), source, move); }",
    })


@rule(r'(\d+)% chance to cause (?:confusion|Confusion) or (?:paralysis|Paralysis)')
def r_secondary_confuse_par(sp, m):
    chance = int(m.group(1))
    sp.add_secondary({
        'chance': chance,
        'onHit': "(target, source, move) => { if (source.battle.randomChance(1, 2)) "
                 "{ target.addVolatile('confusion', source, move); } else "
                 "{ target.trySetStatus('par', source, move); } }",
    })


@rule(r'Randomly inflicts Sleep, Poison, or Paralysis')
def r_random_status(sp, m):
    sp.add_secondary({
        'chance': 100,
        'onHit': "(target, source, move) => { target.trySetStatus("
                 "source.battle.sample(['slp', 'psn', 'par']), source, move); }",
    })


# ---- secondary stat drops / raises ---------------------------------------
@rule(r'(\d+)%\s*(?:chance to )?(?:lower|drop|reduce)(?:s)?\s*(?:the )?'
      r'(?:target(?:\'s)?|opponent(?:\'s)?)?\s*(' + STAT_RE + r')\s*(?:by (\d))?')
def r_secondary_drop(sp, m):
    sp.add_secondary({'chance': int(m.group(1)),
                      'boosts': {_stat(m.group(2)): -int(m.group(3) or 1)}})


@rule(r'(\d+)% (' + STAT_RE + r')\s*(?:↓|-)\s*(?:by (\d))?(?!\d)')
def r_secondary_drop_arrow(sp, m):
    sp.add_secondary({'chance': int(m.group(1)),
                      'boosts': {_stat(m.group(2)): -int(m.group(3) or 1)}})


@rule(r'(\d+)% chance to (?:raise|boost)(?:s)? (?:the )?user(?:\'s)? '
      r'(' + STAT_RE + r')(?: by (\d))?')
def r_secondary_self_raise(sp, m):
    sp.add_secondary({'chance': int(m.group(1)), 'self':
                      {'boosts': {_stat(m.group(2)): int(m.group(3) or 1)}}})


@rule(r'(\d+)% chance to lower all (?:the )?target(?:\'s)? stats by (\d)')
def r_secondary_all_stats(sp, m):
    n = -int(m.group(2))
    sp.add_secondary({'chance': int(m.group(1)),
                      'boosts': {k: n for k in ('atk', 'def', 'spa', 'spd', 'spe')}})


@rule(r'(\d+)% chance to heal user (\d+)%')
def r_secondary_heal(sp, m):
    pct = int(m.group(2))
    sp.add_secondary({'chance': int(m.group(1)), 'self':
                      {'onHit': f"(source) => {{ source.heal(source.baseMaxhp * {pct} / 100); }}"}})


# ---- primary stat changes ------------------------------------------------
@rule(r'(?:^|[,.] )(?:Raises|Boosts)?\s*(?:the )?user(?:\'s)?\s*'
      r'(' + STAT_RE + r')\s*(?:rises|falls|drops)?\s*(?:by )?([+-]?\d)\b')
def r_user_stat(sp, m):
    sp.self_boosts[_stat(m.group(1))] = int(m.group(2))


@rule(r'(?:^|[,.] )(?:Raises|Boosts)?\s*(?:the )?target(?:\'s)?\s*'
      r'(' + STAT_RE + r')\s*(?:by )?([+-]\d|\d)\b')
def r_target_stat(sp, m):
    v = m.group(2)
    sp.target_boosts[_stat(m.group(1))] = int(v) if v.startswith(('+', '-')) else -int(v)


@rule(r'Lowers (?:the )?user(?:\'s)? (' + STAT_RE + r')(?: and (' + STAT_RE + r'))?'
      r'(?: by (\d))?')
def r_lower_user(sp, m):
    n = -int(m.group(3) or 1)
    sp.self_boosts[_stat(m.group(1))] = n
    if m.group(2):
        sp.self_boosts[_stat(m.group(2))] = n


@rule(r'Lowers (?:the )?target(?:\'s)? (' + STAT_RE + r')(?: and (' + STAT_RE + r'))?'
      r'(?: by (\d))?')
def r_lower_target(sp, m):
    n = -int(m.group(3) or 1)
    sp.target_boosts[_stat(m.group(1))] = n
    if m.group(2):
        sp.target_boosts[_stat(m.group(2))] = n


@rule(r'Raises (?:the )?user(?:\'s)? (' + STAT_RE + r')(?: and (' + STAT_RE + r'))?'
      r'(?: by (\d))?')
def r_raise_user(sp, m):
    n = int(m.group(3) or 1)
    sp.self_boosts[_stat(m.group(1))] = n
    if m.group(2):
        sp.self_boosts[_stat(m.group(2))] = n


@rule(r'^(?:Raises )?(' + STAT_RE + r')\s*([+-]\d)(?:, (' + STAT_RE + r')\s*([+-]\d))?'
      r'(?:, (' + STAT_RE + r')\s*([+-]\d))?')
def r_shorthand_stat(sp, m):
    for i in (1, 3, 5):
        if m.group(i):
            sp.self_boosts[_stat(m.group(i))] = int(m.group(i + 1))


@rule(r'^(?:Raises )?(' + STAT_RE + r') (?:and|,) (' + STAT_RE + r')'
      r'(?: and (' + STAT_RE + r'))? by (\d)')
def r_multi_raise(sp, m):
    n = int(m.group(4))
    for i in (1, 2, 3):
        if m.group(i):
            sp.self_boosts[_stat(m.group(i))] = n


@rule(r'^(?:Target|User) (' + STAT_RE + r')\s*([+-]?\d)')
def r_prefixed_stat(sp, m):
    who = m.group(0).split()[0].lower()
    v = m.group(2)
    n = int(v) if v.startswith(('+', '-')) else (int(v) if who == 'user' else -int(v))
    (sp.self_boosts if who == 'user' else sp.target_boosts)[_stat(m.group(1))] = n


@rule(r'^(' + STAT_RE + r')\s*↓')
def r_arrow_drop(sp, m):
    sp.target_boosts[_stat(m.group(1))] = -1


@rule(r'^User (' + STAT_RE + r')\s*↓')
def r_arrow_drop_user(sp, m):
    sp.self_boosts[_stat(m.group(1))] = -1


@rule(r'Target(?:\'s)? (' + STAT_RE + r') and (' + STAT_RE + r') drop by (\d)')
def r_target_two_drop(sp, m):
    n = -int(m.group(3))
    sp.target_boosts[_stat(m.group(1))] = n
    sp.target_boosts[_stat(m.group(2))] = n


@rule(r'Lowers all (?:opponents|targets)\'? (' + STAT_RE + r')'
      r'(?: and (' + STAT_RE + r'))? by (\d)')
def r_lower_all_foes(sp, m):
    n = -int(m.group(3))
    sp.set('target', "'allAdjacentFoes'")
    sp.target_boosts[_stat(m.group(1))] = n
    if m.group(2):
        sp.target_boosts[_stat(m.group(2))] = n


@rule(r'Raises the user\'s lowest stat by (\d)')
def r_lowest_stat(sp, m):
    n = int(m.group(1))
    sp.set('onHit', "(target, source) => {\n"
                    "\t\tlet bestStat: StatIDExceptHP = 'atk';\n"
                    "\t\tlet bestValue = Infinity;\n"
                    "\t\tlet stat: StatIDExceptHP;\n"
                    "\t\tfor (stat in source.storedStats) {\n"
                    "\t\t\tif (source.storedStats[stat] < bestValue) {\n"
                    "\t\t\t\tbestStat = stat;\n"
                    "\t\t\t\tbestValue = source.storedStats[stat];\n"
                    "\t\t\t}\n"
                    "\t\t}\n"
                    f"\t\tsource.battle.boost({{ [bestStat]: {n} }}, source, source);\n"
                    "\t}")


@rule(r'Randomly raises one stat by (\d)')
def r_random_boost(sp, m):
    n = int(m.group(1))
    sp.set('onHit', "(target, source) => {\n"
                    "\t\tconst stats = ['atk', 'def', 'spa', 'spd', 'spe'] as StatIDExceptHP[];\n"
                    "\t\tconst stat = source.battle.sample(stats.filter(s => source.boosts[s] < 6));\n"
                    f"\t\tif (stat) source.battle.boost({{ [stat]: {n} }}, source, source);\n"
                    "\t}")


# ---- crit / accuracy / priority ------------------------------------------
@rule(r'high critical (?:hit )?ratio')
def r_crit(sp, m):
    sp.set('critRatio', 2)


@rule(r'Always a critical hit if user moves first')
def r_crit_first(sp, m):
    sp.set('onModifyMove', "(move, source, target) => {\n"
                           "\t\tif (target && source.battle.queue.willMove(target)) move.willCrit = true;\n"
                           "\t}")


@rule(r'Always a critical hit in Hail/Snow')
def r_crit_hail(sp, m):
    sp.set('onModifyMove', "(move, source) => {\n"
                           "\t\tif (['hail', 'snowscape'].includes(source.effectiveWeather())) move.willCrit = true;\n"
                           "\t}")


@rule(r'(?:Always hits|Never misses|Ignores Accuracy checks)')
def r_always_hits(sp, m):
    sp.set('accuracy', 'true')


@rule(r'Priority \+(\d)')
def r_priority(sp, m):
    sp.set('priority', int(m.group(1)))


@rule(r'^\+(\d) priority$')
def r_priority2(sp, m):
    sp.set('priority', int(m.group(1)))


@rule(r'negative prio')
def r_negative_priority(sp, m):
    sp.set('priority', -5)


@rule(r'Priority \+1 if user has no held item')
def r_priority_itemless(sp, m):
    sp.set('priority', 0)
    sp.set('onModifyPriority', "(priority, source) => {\n"
                               "\t\tif (!source.item) return priority + 1;\n"
                               "\t}")


@rule(r'Priority \+1, only works on the user\'s first turn out')
def r_fake_out(sp, m):
    sp.set('priority', 1)
    sp.set('onTry', "(source) => {\n"
                    "\t\tif (source.activeMoveActions > 1) {\n"
                    "\t\t\tsource.battle.hint(`${source.name} only works on its first turn out.`);\n"
                    "\t\t\treturn false;\n"
                    "\t\t}\n"
                    "\t}")


@rule(r'(?:\+1 priority if target is attacking|'
      r'Always goes first if the target uses a status move|'
      r'Power doubles if the target is attacking this turn)')
def r_conditional_priority(sp, m):
    status_only = 'status move' in m.group(0)
    if status_only:
        sp.set('priority', 2)
        sp.set('onTry', "(source, target) => {\n"
                        "\t\tconst action = source.battle.queue.willMove(target);\n"
                        "\t\tif (!action || action.move.category !== 'Status') return false;\n"
                        "\t}")
    elif 'Power doubles' in m.group(0):
        sp.set('onBasePower', "(basePower, source, target) => {\n"
                              "\t\tconst action = source.battle.queue.willMove(target);\n"
                              "\t\tif (action && action.move.category !== 'Status') return basePower * 2;\n"
                              "\t}")
    else:
        sp.set('onModifyPriority', "(priority, source, target) => {\n"
                                   "\t\tconst action = target && source.battle.queue.willMove(target);\n"
                                   "\t\tif (action && action.move.category !== 'Status') return priority + 1;\n"
                                   "\t}")


# ---- recoil / drain / heal ----------------------------------------------
@rule(r'(?:user takes|takes) (\d+)% recoil')
def r_recoil_pct(sp, m):
    n = int(m.group(1))
    sp.set('recoil', f"[{n}, 100]")


@rule(r'user takes 1/(\d+) recoil')
def r_recoil_frac(sp, m):
    sp.set('recoil', f"[1, {m.group(1)}]")


@rule(r'Heals? (?:the )?user (?:by |for )?(\d+)% of (?:the )?(?:damage|dmg) dealt')
def r_drain(sp, m):
    sp.set('drain', f"[{int(m.group(1))}, 100]")


@rule(r'(?:Restores|Heals) (\d+)% (?:of )?(?:damage|dmg)(?: dealt)?')
def r_drain2(sp, m):
    sp.set('drain', f"[{int(m.group(1))}, 100]")


@rule(r'(?:Restores|Heals)(?: user(?: by)?| the user(?: by)?)? (\d+)% ?HP(?!,? each| for)')
def r_heal(sp, m):
    n = int(m.group(1))
    sp.set('heal', f"[{n}, 100]")


@rule(r'Fully heals user')
def r_full_heal(sp, m):
    sp.set('heal', '[1, 1]')


@rule(r'Restores 1/16 HP for 5 turns')
def r_aqua_ring(sp, m):
    sp.set('volatileStatus', "'aquaring'")
    sp.set('target', "'self'")


@rule(r'Heals 25% HP each turn for 3 turns')
def r_heal_over_time(sp, m):
    sp.set('volatileStatus', "'fakemonregen'")
    sp.set('target', "'self'")


# ---- multi-hit -----------------------------------------------------------
@rule(r'Hits 2[-–]5 times')
def r_multihit25(sp, m):
    sp.set('multihit', '[2, 5]')


@rule(r'Hits 2[-–]3 times')
def r_multihit23(sp, m):
    sp.set('multihit', '[2, 3]')


@rule(r'Hits (\d) times|Damages (\d) [Tt]imes|Hits twice')
def r_multihit_n(sp, m):
    n = m.group(1) or m.group(2)
    sp.set('multihit', int(n) if n else 2)


@rule(r'Hits twice if it is raining')
def r_multihit_rain(sp, m):
    sp.fields.pop('multihit', None)
    sp.set('multihit', 1)
    sp.set('onModifyMove', "(move, source) => {\n"
                           "\t\tif (['raindance', 'primordialsea'].includes(source.effectiveWeather())) "
                           "move.multihit = 2;\n"
                           "\t}")


# ---- targeting -----------------------------------------------------------
@rule(r'[Hh]its all adjacent (?:foes|targets|opponents)|Lowers all targets|'
      r'[Hh]its all foes|Damages [Bb]oth (?:Opponents|Enemies)|hits both opponents')
def r_spread_foes(sp, m):
    sp.set('target', "'allAdjacentFoes'")


@rule(r'[Hh]its all(?: the)? Pok[eé]mon on the field|[Hh]its all adjacent Pok[eé]mon|'
      r'[Hh]its all targets')
def r_spread_all(sp, m):
    sp.set('target', "'allAdjacent'")


# ---- switching -----------------------------------------------------------
@rule(r'User switches out')
def r_self_switch(sp, m):
    sp.set('selfSwitch', 'true')


@rule(r'(?:Forces (?:the )?target to switch|Target switches out|'
      r'Target is forced to switch|Forces switch)')
def r_force_switch(sp, m):
    sp.set('forceSwitch', 'true')


@rule(r'(?:Prevents (?:the )?target from switching|Traps (?:the )?target|'
      r'Target cannot switch|disables switching|and trapping|Speed↓ and trapping)')
def r_trap(sp, m):
    sp.set('volatileStatus', "'partiallytrapped'"
           if 'deals' in (sp.move.get('effect') or '').lower() else "'trapped'")


@rule(r'Traps all active Pok[eé]mon')
def r_trap_all(sp, m):
    sp.set('onHitField', "(target, source) => {\n"
                         "\t\tfor (const pokemon of source.battle.getAllActive()) {\n"
                         "\t\t\tif (pokemon !== source) pokemon.addVolatile('trapped', source, "
                         "source.battle.effect as ActiveMove, 'trapper');\n"
                         "\t\t}\n"
                         "\t}")
    sp.set('target', "'all'")


# ---- weather / terrain / hazards / screens -------------------------------
WEATHER = {'sun': 'sunnyday', 'harsh sunlight': 'sunnyday', 'rain': 'raindance',
           'sandstorm': 'sandstorm', 'hail': 'hail', 'snow': 'snowscape'}


@rule(r'sets? (harsh sunlight|sun|rain|sandstorm|hail|snow)(?: weather)?')
def r_weather(sp, m):
    sp.set('weather', f"'{WEATHER[m.group(1).lower()]}'")


@rule(r'Cancels all weather conditions, prevents them for 5 turns')
def r_no_weather(sp, m):
    sp.set('pseudoWeather', "'fakemonweatherlock'")
    sp.set('target', "'all'")


@rule(r'(?:Eliminates|Breaks|Removes) all [Tt]errains')
def r_clear_terrain(sp, m):
    sp.set('onHitField', "(target, source) => { source.battle.field.clearTerrain(); }")


@rule(r'Breaks Terrains and Room effects')
def r_clear_field(sp, m):
    sp.set('onHitField', "(target, source) => {\n"
                         "\t\tsource.battle.field.clearTerrain();\n"
                         "\t\tfor (const id of ['trickroom', 'magicroom', 'wonderroom', "
                         "'hauntedroom', 'glitchedroom']) {\n"
                         "\t\t\tif (source.battle.field.getPseudoWeather(id)) "
                         "source.battle.field.removePseudoWeather(id);\n"
                         "\t\t}\n"
                         "\t}")
    sp.set('target', "'all'")


@rule(r'Removes all entry hazards from user\'s side|'
      r'[Cc]lears? (?:all )?[Ee]ntry hazards on (?:fieldside|user\'s side)|'
      r'[Cc]lears hazards on both sides')
def r_defog(sp, m):
    both = 'both sides' in m.group(0)
    sides = ("[source.side, source.side.foe]" if both else "[source.side]")
    sp.set('onHit', "(target, source) => {\n"
                    "\t\tconst removals = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', "
                    "'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge', "
                    "'livewire'];\n"
                    f"\t\tfor (const side of {sides}) {{\n"
                    "\t\t\tfor (const id of removals) {\n"
                    "\t\t\t\tif (side.removeSideCondition(id)) {\n"
                    "\t\t\t\t\tsource.battle.add('-sideend', side, "
                    "source.battle.dex.conditions.get(id).name, '[from] move: ' + "
                    "source.battle.effect.name);\n"
                    "\t\t\t\t}\n"
                    "\t\t\t}\n"
                    "\t\t}\n"
                    "\t}")


@rule(r'removes toxic spikes/spikes')
def r_remove_spikes(sp, m):
    sp.set('onHit', "(target, source) => {\n"
                    "\t\tfor (const id of ['spikes', 'toxicspikes']) {\n"
                    "\t\t\tif (target.side.removeSideCondition(id)) {\n"
                    "\t\t\t\tsource.battle.add('-sideend', target.side, "
                    "source.battle.dex.conditions.get(id).name);\n"
                    "\t\t\t}\n"
                    "\t\t}\n"
                    "\t}")


@rule(r'(?:Breaks|Removes) Reflect(?:,)? and Light Screen|'
      r'Breaks Reflect, Light Screen, and Aurora Veil|'
      r'Removes Relfect and Light Screen')
def r_brick_break(sp, m):
    sp.set('onTryHit', "(target, source, move) => {\n"
                       "\t\tfor (const id of ['reflect', 'lightscreen', 'auroraveil']) {\n"
                       "\t\t\tif (target.side.removeSideCondition(id)) {\n"
                       "\t\t\t\tsource.battle.add('-sideend', target.side, "
                       "source.battle.dex.conditions.get(id).name);\n"
                       "\t\t\t}\n"
                       "\t\t}\n"
                       "\t}")


@rule(r'(?:Ignores|Bypasses) (?:screens )?\(?Reflect')
def r_ignore_screens(sp, m):
    # Screens are bypassed with `infiltrates`; there is no `ignoreScreens` field.
    sp.set('onModifyMove', "(move) => { move.infiltrates = true; }")


@rule(r'Reduces physical damage by 50% for 5 turns')
def r_reflect(sp, m):
    sp.set('sideCondition', "'reflect'")
    sp.set('target', "'allySide'")


@rule(r'Reduces special damage by 50% for 5 turns')
def r_lightscreen(sp, m):
    sp.set('sideCondition', "'lightscreen'")
    sp.set('target', "'allySide'")


@rule(r'Entry hazard, lowers Speed by 1|Hazard: lowers Speed by 1 upon switching in')
def r_sticky_web(sp, m):
    sp.set('sideCondition', "'stickyweb'")
    sp.set('target', "'foeSide'")


@rule(r'Team Speed \+1|Raises allies\' Speed by 1')
def r_tailwind(sp, m):
    sp.set('sideCondition', "'tailwind'")
    sp.set('target', "'allySide'")


# ---- stat-change manipulation -------------------------------------------
@rule(r'(?:Ignores|ignores) (?:the )?(?:target\'s )?positive stat (?:boosts|changes)|'
      r'Ignores target\'s positive stat boosts')
def r_ignore_boosts(sp, m):
    sp.set('ignoreOffensive' if False else 'ignoreEvasion', 'true')
    sp.set('ignoreDefensive', 'true')


@rule(r'(?:Removes|Clears) (?:the )?target\'s (?:positive )?stat (?:changes|boosts)|'
      r'Removes stat changes from target')
def r_clear_boosts(sp, m):
    sp.set('onHit', "(target) => { target.clearBoosts(); "
                    "target.battle.add('-clearboost', target); }")


@rule(r'Removes one negative stat change from user|Removes stat drops')
def r_clear_negative(sp, m):
    sp.set('target', "'self'")
    sp.set('onHit', "(target) => {\n"
                    "\t\tlet stat: BoostID;\n"
                    "\t\tfor (stat in target.boosts) {\n"
                    "\t\t\tif (target.boosts[stat] < 0) target.boosts[stat] = 0;\n"
                    "\t\t}\n"
                    "\t\ttarget.battle.add('-clearnegativeboost', target);\n"
                    "\t}")


@rule(r'Swaps user\'s and target\'s stat changes')
def r_swap_boosts(sp, m):
    sp.set('onHit', "(target, source) => {\n"
                    "\t\tconst targetBoosts: SparseBoostsTable = {};\n"
                    "\t\tconst sourceBoosts: SparseBoostsTable = {};\n"
                    "\t\tlet i: BoostID;\n"
                    "\t\tfor (i in target.boosts) {\n"
                    "\t\t\ttargetBoosts[i] = target.boosts[i];\n"
                    "\t\t\tsourceBoosts[i] = source.boosts[i];\n"
                    "\t\t}\n"
                    "\t\ttarget.setBoost(sourceBoosts);\n"
                    "\t\tsource.setBoost(targetBoosts);\n"
                    "\t\tsource.battle.add('-swapboost', source, target, '[from] move: ' + "
                    "source.battle.effect.name);\n"
                    "\t}")


@rule(r'Averages the user\'s and target\'s stat changes')
def r_average_boosts(sp, m):
    sp.set('onHit', "(target, source) => {\n"
                    "\t\tconst boosts: SparseBoostsTable = {};\n"
                    "\t\tlet i: BoostID;\n"
                    "\t\tfor (i in target.boosts) {\n"
                    "\t\t\tboosts[i] = Math.trunc((target.boosts[i] + source.boosts[i]) / 2);\n"
                    "\t\t}\n"
                    "\t\ttarget.setBoost(boosts);\n"
                    "\t\tsource.setBoost(boosts);\n"
                    "\t\tsource.battle.add('-swapboost', source, target, '[from] move: ' + "
                    "source.battle.effect.name);\n"
                    "\t}")


@rule(r'User and target\'s HP are averaged')
def r_pain_split(sp, m):
    sp.set('onHit', "(target, source) => {\n"
                    "\t\tconst averagehp = Math.floor((target.hp + source.hp) / 2) || 1;\n"
                    "\t\tconst targetHP = (target.volatiles['substitute'] ? target.hp : "
                    "Math.min(target.maxhp, averagehp));\n"
                    "\t\ttarget.sethp(targetHP);\n"
                    "\t\tsource.sethp(Math.min(source.maxhp, averagehp));\n"
                    "\t\tsource.battle.add('-sethp', target, target.getHealth, source, "
                    "source.getHealth, '[from] move: ' + source.battle.effect.name);\n"
                    "\t}")


# ---- damage calculation quirks ------------------------------------------
@rule(r'Uses (?:the )?user\'s Sp\.? ?Atk(?:ack)? (?:stat )?for damage')
def r_use_spa(sp, m):
    sp.set('overrideOffensiveStat', "'spa'")


@rule(r'Uses (?:the )?user\'s Sp\.? ?Def (?:stat )?for damage')
def r_use_spd_off(sp, m):
    sp.set('overrideOffensiveStat', "'spd'")


@rule(r'Uses (?:the )?target\'s Sp\.? ?Def stat for damage')
def r_use_spd_def(sp, m):
    sp.set('overrideDefensiveStat', "'spd'")


@rule(r'Uses the user\'s Special Attack stat for damage')
def r_use_spa2(sp, m):
    sp.set('overrideOffensiveStat', "'spa'")


@rule(r'Deals damage based on user\'s weight|Power increases with user\'s weight')
def r_user_weight(sp, m):
    sp.set('basePowerCallback', "(pokemon) => {\n"
                                "\t\tconst weight = pokemon.getWeight();\n"
                                "\t\tif (weight >= 2000) return 120;\n"
                                "\t\tif (weight >= 1000) return 100;\n"
                                "\t\tif (weight >= 500) return 80;\n"
                                "\t\tif (weight >= 250) return 60;\n"
                                "\t\treturn 40;\n"
                                "\t}")


@rule(r'Uses target\'s weight for damage calculation')
def r_target_weight(sp, m):
    sp.set('basePowerCallback', "(pokemon, target) => {\n"
                                "\t\tconst weight = target.getWeight();\n"
                                "\t\tif (weight >= 2000) return 120;\n"
                                "\t\tif (weight >= 1000) return 100;\n"
                                "\t\tif (weight >= 500) return 80;\n"
                                "\t\tif (weight >= 250) return 60;\n"
                                "\t\treturn 40;\n"
                                "\t}")


@rule(r'Deals neutral damage regardless of target\'s type|'
      r'Always hits neutral, ignores resistance/immunity|'
      r'Ignores resistance of Rock types \(hits neutrally\)')
def r_neutral(sp, m):
    sp.set('onEffectiveness', "() => 0")
    sp.set('ignoreImmunity', 'true')


@rule(r'Super effective (?:against|on) (Steel|Water|Flying|Psychic|Ice|Grass|Rock|Bug) types?')
def r_super_effective(sp, m):
    t = m.group(1)
    sp.set('onEffectiveness', "(typeMod, target, type) => {\n"
                              f"\t\tif (type === '{t}') return 1;\n"
                              "\t}")


@rule(r'Deals double damage to (Steel) types')
def r_double_vs_type(sp, m):
    t = m.group(1)
    sp.set('onBasePower', "(basePower, source, target) => {\n"
                          f"\t\tif (target.hasType('{t}')) return basePower * 2;\n"
                          "\t}")


@rule(r'Deals double damage (?:to grounded Pok[eé]mon|if target is grounded)')
def r_double_grounded(sp, m):
    sp.set('onBasePower', "(basePower, source, target) => {\n"
                          "\t\tif (target.isGrounded()) return basePower * 2;\n"
                          "\t}")


@rule(r'Deals double damage if target is below (\d+)% HP')
def r_double_low_hp(sp, m):
    pct = int(m.group(1))
    sp.set('onBasePower', "(basePower, source, target) => {\n"
                          f"\t\tif (target.hp * 100 <= target.maxhp * {pct}) return basePower * 2;\n"
                          "\t}")


@rule(r'Power doubles if user\'s HP is below (\d+)%|'
      r'Priority \+1, double damage if HP is below (\d+)%')
def r_double_self_low(sp, m):
    pct = int(m.group(1) or m.group(2))
    sp.set('onBasePower', "(basePower, source) => {\n"
                          f"\t\tif (source.hp * 100 <= source.maxhp * {pct}) return basePower * 2;\n"
                          "\t}")


@rule(r'Power doubles if target is Poisoned|More power if target is Poisoned|'
      r'doubles damage if target is poisoned')
def r_double_poisoned(sp, m):
    sp.set('onBasePower', "(basePower, source, target) => {\n"
                          "\t\tif (['psn', 'tox'].includes(target.status)) return basePower * 2;\n"
                          "\t}")


@rule(r'Double damage if target is asleep, does not wake them up')
def r_double_asleep(sp, m):
    sp.set('onBasePower', "(basePower, source, target) => {\n"
                          "\t\tif (target.status === 'slp') return basePower * 2;\n"
                          "\t}")


@rule(r'Double damage if target is burned, cures their burn')
def r_double_burned(sp, m):
    sp.set('onBasePower', "(basePower, source, target) => {\n"
                          "\t\tif (target.status === 'brn') return basePower * 2;\n"
                          "\t}")
    sp.set('onAfterHit', "(target, source) => { if (target.status === 'brn') target.cureStatus(); }")


@rule(r'Double damage if target used a Status move this turn|'
      r'Doubles Damage if Status Move is used the Turn before')
def r_double_status(sp, m):
    sp.set('onBasePower', "(basePower, source, target) => {\n"
                          "\t\tif (target.moveThisTurn && target.lastMove?.category === 'Status') "
                          "return basePower * 2;\n"
                          "\t}")


@rule(r'Double power if hit first|Deals double damage if target is switching in this turn')
def r_double_if_slower(sp, m):
    sp.set('onBasePower', "(basePower, source, target) => {\n"
                          "\t\tif (!source.battle.queue.willMove(target)) return basePower * 2;\n"
                          "\t}")


@rule(r'Power doubles if target holds a Berry \(destroys Berry\)')
def r_pluck(sp, m):
    sp.set('onBasePower', "(basePower, source, target) => {\n"
                          "\t\tif (target.getItem().isBerry) return basePower * 2;\n"
                          "\t}")
    sp.set('onAfterHit', "(target, source) => {\n"
                         "\t\tif (target.getItem().isBerry && target.hp) "
                         "target.setItem('');\n"
                         "\t}")


@rule(r'Power doubles if no stat changes are active on the field')
def r_double_no_boosts(sp, m):
    sp.set('onBasePower', "(basePower, source) => {\n"
                          "\t\tfor (const pokemon of source.battle.getAllActive()) {\n"
                          "\t\t\tlet stat: BoostID;\n"
                          "\t\t\tfor (stat in pokemon.boosts) {\n"
                          "\t\t\t\tif (pokemon.boosts[stat]) return basePower;\n"
                          "\t\t\t}\n"
                          "\t\t}\n"
                          "\t\treturn basePower * 2;\n"
                          "\t}")


@rule(r'Power doubles if target used a stat-boosting move last turn')
def r_double_after_boost(sp, m):
    sp.set('onBasePower', "(basePower, source, target) => {\n"
                          "\t\tif (target.lastMove?.boosts || target.lastMove?.self?.boosts) "
                          "return basePower * 2;\n"
                          "\t}")


@rule(r'Power doubles if user was hit by a Fire move previously')
def r_double_after_fire(sp, m):
    sp.set('onBasePower', "(basePower, source) => {\n"
                          "\t\tconst hitByFire = source.attackedBy.some(entry => "
                          "source.battle.dex.moves.get(entry.move).type === 'Fire');\n"
                          "\t\tif (hitByFire) return basePower * 2;\n"
                          "\t}")


@rule(r'Power increases by (\d+)% if any Terrain is active')
def r_terrain_boost(sp, m):
    pct = 100 + int(m.group(1))
    sp.set('onBasePower', "(basePower, source) => {\n"
                          "\t\tif (source.battle.field.terrain) "
                          f"return Math.floor(basePower * {pct} / 100);\n"
                          "\t}")


@rule(r'Power increases by (\d+)(?:%)? each consecutive|'
      r'Power increases by (\d+) if used consecutively')
def r_echo(sp, m):
    step = int(m.group(1) or m.group(2))
    cap = 110 if 'max 110' in (sp.move.get('effect') or '') else 999
    sp.set('basePowerCallback', "(pokemon, target, move) => {\n"
                                f"\t\tconst bp = move.basePower + {step} * "
                                "(pokemon.volatiles['fakemonecho']?.hitCount || 0);\n"
                                f"\t\treturn Math.min(bp, {cap});\n"
                                "\t}")
    sp.set('onHit', "(target, source) => { source.addVolatile('fakemonecho'); }")
    sp.set('onMoveFail', "(target, source) => { source.removeVolatile('fakemonecho'); }")


@rule(r'Stronger below 50% HP')
def r_stronger_low(sp, m):
    sp.set('onBasePower', "(basePower, source) => {\n"
                          "\t\tif (source.hp * 2 <= source.maxhp) return Math.floor(basePower * 1.5);\n"
                          "\t}")


@rule(r'Deals exactly the same amount of damage the user last received|'
      r'Deals 2x the damage received from a physical attack')
def r_counter(sp, m):
    mult = 2 if '2x' in m.group(0) else 1
    sp.set('damageCallback', "(pokemon) => {\n"
                             "\t\tconst lastDamagedBy = pokemon.getLastDamagedBy(true);\n"
                             "\t\tif (lastDamagedBy === undefined || !lastDamagedBy.thisTurn) return false;\n"
                             f"\t\treturn Math.max(1, lastDamagedBy.damage * {mult});\n"
                             "\t}")


# ---- volatile / misc effects --------------------------------------------
@rule(r'User becomes confused')
def r_self_confuse(sp, m):
    sp.set('self', "{ volatileStatus: 'confusion' }")


@rule(r'Must recharge next turn')
def r_recharge(sp, m):
    sp.set('self', "{ volatileStatus: 'mustrecharge' }")


@rule(r'Two-turn move, user avoids most attacks on turn 1')
def r_two_turn(sp, m):
    sp.set('flags_extra', ['charge'])
    sp.set('onTryMove', "(attacker, defender, move) => {\n"
                        "\t\tif (attacker.removeVolatile(move.id)) return;\n"
                        "\t\tattacker.battle.attrLastMove('[still]');\n"
                        "\t\tattacker.battle.add('-prepare', attacker, move.name);\n"
                        "\t\tattacker.addVolatile('twoturnmove', defender);\n"
                        "\t\treturn null;\n"
                        "\t}")
    sp.set('condition', "{\n\t\tduration: 2,\n\t\tonInvulnerability: () => false,\n\t}")


@rule(r'Locked into move for 2-3 turns, confused afterwards')
def r_outrage(sp, m):
    sp.set('self', "{ volatileStatus: 'lockedmove' }")
    sp.set('onAfterMove', "(pokemon) => {\n"
                          "\t\tif (pokemon.volatiles['lockedmove']?.duration === 1) "
                          "pokemon.removeVolatile('lockedmove');\n"
                          "\t}")


@rule(r'Disables (?:the )?target\'s last (?:used )?move')
def r_disable(sp, m):
    sp.set('volatileStatus', "'disable'")


@rule(r'Target loses (\d+) PP on their last used move')
def r_spite(sp, m):
    n = int(m.group(1))
    sp.set('onHit', "(target, source) => {\n"
                    "\t\tconst move = target.lastMove;\n"
                    "\t\tif (!move || move.isZ) return false;\n"
                    "\t\tconst ppSlot = target.moveSlots.find(m2 => m2.id === move.id);\n"
                    "\t\tif (!ppSlot || ppSlot.pp <= 0) return false;\n"
                    f"\t\tconst lost = target.deductPP(move.id, {n});\n"
                    "\t\tif (!lost) return false;\n"
                    "\t\ttarget.battle.add('-activate', target, 'move: ' + "
                    "source.battle.effect.name, move.name, lost);\n"
                    "\t}")


@rule(r'Attracts target \(Infatuation\)')
def r_attract(sp, m):
    sp.set('volatileStatus', "'attract'")


@rule(r'Puts target to sleep')
def r_sleep(sp, m):
    sp.set('status', "'slp'")


@rule(r'(?:Burns|Poisons|Badly poisons|Paralyzes) (?:the )?target(?:\b|,)')
def r_primary_status(sp, m):
    word = m.group(0).split()[0].lower().rstrip(',')
    mapping = {'burns': 'brn', 'poisons': 'psn', 'badly': 'tox', 'paralyzes': 'par'}
    sp.set('status', f"'{mapping[word]}'")


@rule(r'^Target Poisoned$|^Poisons target$')
def r_primary_psn(sp, m):
    sp.set('status', "'psn'")


@rule(r'Badly poisons all active Pok[eé]mon except Poison/Steel types')
def r_tox_all(sp, m):
    sp.set('target', "'all'")
    sp.set('onHitField', "(target, source) => {\n"
                         "\t\tfor (const pokemon of source.battle.getAllActive()) {\n"
                         "\t\t\tif (pokemon.hasType('Poison') || pokemon.hasType('Steel')) continue;\n"
                         "\t\t\tpokemon.trySetStatus('tox', source);\n"
                         "\t\t}\n"
                         "\t}")


@rule(r'Poison for 3 turns')
def r_psn3(sp, m):
    sp.set('status', "'psn'")


@rule(r'Transfers user\'s status condition to target')
def r_psycho_shift(sp, m):
    sp.set('onHit', "(target, source) => {\n"
                    "\t\tif (!source.status || target.status) return false;\n"
                    "\t\tconst status = source.status;\n"
                    "\t\tif (!target.trySetStatus(status, source)) return false;\n"
                    "\t\tsource.cureStatus();\n"
                    "\t}")


@rule(r'(?:Cures|Clears) (?:all )?status conditions?(?: on the user)?|'
      r'User cures its own status condition|cures status condition')
def r_cure_self(sp, m):
    sp.set('onHit', "(target) => { target.cureStatus(); }")
    sp.set('target', "'self'")


@rule(r'Cures user\'s party of sleep condition|Cures all status conditions on the user\'s active team')
def r_heal_bell(sp, m):
    sleep_only = 'sleep' in m.group(0)
    cond = "if (ally.status !== 'slp') continue;\n\t\t\t" if sleep_only else ""
    sp.set('target', "'allyTeam'")
    sp.set('onHit', "(target, source) => {\n"
                    "\t\tfor (const ally of source.side.pokemon) {\n"
                    f"\t\t\t{cond}ally.cureStatus();\n"
                    "\t\t}\n"
                    "\t}")


@rule(r'Clears all stat drops for the user\'s party')
def r_party_clear_drops(sp, m):
    sp.set('target', "'allyTeam'")
    sp.set('onHit', "(target, source) => {\n"
                    "\t\tfor (const ally of source.side.pokemon) {\n"
                    "\t\t\tlet stat: BoostID;\n"
                    "\t\t\tfor (stat in ally.boosts) {\n"
                    "\t\t\t\tif (ally.boosts[stat] < 0) ally.boosts[stat] = 0;\n"
                    "\t\t\t}\n"
                    "\t\t}\n"
                    "\t}")


@rule(r'Reveals (?:the )?(?:opponent\'s entire moveset|target\'s held item and abilities)')
def r_reveal(sp, m):
    what = 'moveset' if 'moveset' in m.group(0) else 'item'
    if what == 'moveset':
        body = ("\t\tfor (const slot of target.moveSlots) {\n"
                "\t\t\tsource.battle.add('-activate', target, 'move: ' + "
                "source.battle.effect.name, slot.move);\n\t\t}\n")
    else:
        body = ("\t\tsource.battle.add('-item', target, target.getItem().name, '[identify]');\n"
                "\t\tsource.battle.add('-ability', target, target.getAbility().name, "
                "'[identify]');\n")
    sp.set('onHit', "(target, source) => {\n" + body + "\t}")


@rule(r'Protects from attacks|Protects from physical moves|'
      r'^Protect')
def r_protect(sp, m):
    sp.set('priority', 4)
    sp.set('stallingMove', 'true')
    sp.set('volatileStatus', "'protect'")
    sp.set('target', "'self'")
    sp.set('onPrepareHit', "(pokemon) => !!pokemon.battle.queue.willAct() && "
                           "pokemon.battle.runEvent('StallMove', pokemon)")
    sp.set('onHit', "(pokemon) => { pokemon.addVolatile('stall'); }")


@rule(r'Ignores Protect/Detect|ignores the effects of protection moves')
def r_break_protect(sp, m):
    sp.set('breaksProtect', 'true')


@rule(r'Bypasses Soundproof ability')
def r_bypass_soundproof(sp, m):
    sp.set('ignoreAbility', 'true')


@rule(r'Type varies depending on active terrain')
def r_terrain_type(sp, m):
    sp.set('onModifyType', "(move, pokemon) => {\n"
                           "\t\tswitch (pokemon.battle.field.terrain) {\n"
                           "\t\tcase 'electricterrain': move.type = 'Electric'; break;\n"
                           "\t\tcase 'grassyterrain': move.type = 'Grass'; break;\n"
                           "\t\tcase 'mistyterrain': move.type = 'Fairy'; break;\n"
                           "\t\tcase 'psychicterrain': move.type = 'Psychic'; break;\n"
                           "\t\t}\n"
                           "\t}")


@rule(r'Move changes type to match user\'s primary type')
def r_user_type(sp, m):
    sp.set('onModifyType', "(move, pokemon) => { move.type = pokemon.types[0]; }")


@rule(r'Uses the target\'s last used move\'s type instead of Normal|'
      r'Type Changes to Type of Targets last moved attack')
def r_copy_type(sp, m):
    sp.set('onModifyType', "(move, pokemon, target) => {\n"
                           "\t\tif (target?.lastMove) move.type = target.lastMove.type;\n"
                           "\t}")


@rule(r'Changes type randomly between Fire, Water, or Grass before hit')
def r_random_type(sp, m):
    sp.set('onModifyType', "(move, pokemon) => {\n"
                           "\t\tmove.type = pokemon.battle.sample(['Fire', 'Water', 'Grass']);\n"
                           "\t}")


@rule(r'Changes target\'s type to Rock|User becomes pure Rock type')
def r_set_rock(sp, m):
    self_ = 'User becomes' in m.group(0)
    who = 'source' if self_ else 'target'
    sp.set('onHit', "(target, source) => {\n"
                    f"\t\t{who}.setType('Rock');\n"
                    f"\t\tsource.battle.add('-start', {who}, 'typechange', 'Rock');\n"
                    "\t}")


@rule(r'Changes target\'s ability to Run Away|Turns target\'s ability to Simple')
def r_set_ability(sp, m):
    ab = 'runaway' if 'Run Away' in m.group(0) else 'simple'
    sp.set('onHit', "(target, source) => {\n"
                    f"\t\tconst ability = source.battle.dex.abilities.get('{ab}');\n"
                    "\t\tif (target.getAbility().flags['cantsuppress']) return false;\n"
                    "\t\ttarget.setAbility(ability, source);\n"
                    "\t}")


@rule(r'Target levitates \(loses Ground immunity\)|'
      r'Target is not immune to ground for \d+ rounds|'
      r'removes their airborne status')
def r_ground(sp, m):
    sp.set('volatileStatus', "'smackdown'")


@rule(r'User gains Levitate ability for 5 turns|Raises Evasion by 1, immune to Electric moves for 1 turn')
def r_magnet_rise(sp, m):
    sp.set('volatileStatus', "'magnetrise'")
    sp.set('target', "'self'")


@rule(r'Can only be used if one of your moves has no pp left')
def r_last_resort(sp, m):
    sp.set('onTry', "(source) => {\n"
                    "\t\tif (!source.moveSlots.some(slot => slot.pp === 0)) return false;\n"
                    "\t}")


@rule(r'User loses (\d+)% HP')
def r_self_damage(sp, m):
    pct = int(m.group(1))
    sp.set('onAfterMove', "(source) => "
                          f"{{ source.battle.damage(Math.floor(source.baseMaxhp * {pct} / 100), source); }}")


@rule(r'User faints')
def r_self_ko(sp, m):
    sp.set('selfdestruct', "'ifHit'")


@rule(r'Repeats at 50% power next turn')
def r_echoed_voice(sp, m):
    sp.set('onAfterMove', "(source, target, move) => {\n"
                          "\t\tsource.addVolatile('fakemonrepeat', source, move);\n"
                          "\t}")


@rule(r'Prevents Burn for 5 turns|Raises Def and Sp. Def by 1, prevents status condition for 3 turns|'
      r'User and allies are protected from status moves for 3 turns')
def r_safeguard(sp, m):
    sp.set('sideCondition', "'safeguard'")
    sp.set('target', "'allySide'")



@rule(r'Reduces next attack by (\d+)%|Reduces next physical (?:attack|hit)(?: by (\d+)%)?|'
      r'Reduces next super-effective hit|Reduces damage from super-effective hits by (\d+)%|'
      r'Next attack received by the user does half damage|'
      r'Reduces next (?:Electric attack|Fire damage) by (\d+)%')
def r_damage_reduction(sp, m):
    pct = int(m.group(1) or m.group(2) or m.group(3) or m.group(4) or 50)
    sp.set('volatileStatus', f"'fakemonbrace{pct}'")
    sp.set('target', "'self'")


@rule(r'Next attack against the user misses guaranteed')
def r_next_miss(sp, m):
    sp.set('volatileStatus', "'fakemondodge'")
    sp.set('target', "'self'")


@rule(r'Next attack never misses and ignores stat changes|Never misses, ignores all stat changes')
def r_lock_on(sp, m):
    sp.set('onHit', "(target, source) => { source.addVolatile('lockon', target); }")


@rule(r'Next (Fire|Dark|Grass|Electric) (?:move|attack) (?:hits 2x harder|has 1\.5x power)')
def r_charge_next(sp, m):
    sp.set('onHit', "(target, source) => { source.addVolatile('fakemoncharged'); }")
    sp.set('target', "'self'")


@rule(r'Next Pok[eé]mon sent out on user\'s side gets \+2 Speed')
def r_baton_speed(sp, m):
    sp.set('sideCondition', "'fakemonrelayspeed'")
    sp.set('target', "'allySide'")


@rule(r'All allies heal 1/8 HP at end of turn for 3 turns|'
      r'Restores 1/16 HP for 5 turns')
def r_wish_field(sp, m):
    sp.set('sideCondition', "'fakemonhealingfield'")
    sp.set('target', "'allySide'")


@rule(r'Allies take 50% less damage from physical moves for 3 turns')
def r_ally_reflect(sp, m):
    sp.set('sideCondition', "'reflect'")
    sp.set('target', "'allySide'")


@rule(r'Traps target for (\d)[-–](\d) turns|Traps target for (\d) turns')
def r_partial_trap(sp, m):
    sp.set('volatileStatus', "'partiallytrapped'")


@rule(r'Blocks priority moves for 5 turns')
def r_psychic_terrain_like(sp, m):
    sp.set('pseudoWeather', "'fakemonprioritylock'")
    sp.set('target', "'all'")


@rule(r'Hazard: Causes Bleed \(1/16 damage\) on entry|'
      r'Sets hazard: Damages on entry, applies Leech Seed effect|'
      r'Hazard: Grounded incoming Pok[eé]mon take 10% recoil')
def r_custom_hazard(sp, m):
    sp.set('sideCondition', "'fakemonbleedhazard'")
    sp.set('target', "'foeSide'")


@rule(r'Summons ants: Deals 1/16 damage to all non-Bug types at turn end')
def r_ants(sp, m):
    sp.set('pseudoWeather', "'fakemonants'")
    sp.set('target', "'all'")


@rule(r'Electrifies ground, grounded Pok[eé]mon take 1/16 dmg, lose 1 Spd')
def r_electrified_ground(sp, m):
    sp.set('pseudoWeather', "'fakemonelectrifiedground'")
    sp.set('target', "'all'")


@rule(r'Removes all abilities from the field for 3 turns')
def r_no_abilities(sp, m):
    sp.set('pseudoWeather', "'fakemonabilitylock'")
    sp.set('target', "'all'")


@rule(r'Target can\'t use status moves next turn|'
      r'all enemies cant use status moves')
def r_taunt(sp, m):
    sp.set('volatileStatus', "'taunt'")


@rule(r'Target cannot use sound-based moves for \d+ turns')
def r_sound_lock(sp, m):
    sp.set('volatileStatus', "'fakemonsoundlock'")


@rule(r'Target\'s healing moves fail on the next turn')
def r_heal_block(sp, m):
    sp.set('volatileStatus', "'healblock'")


@rule(r'Target forgets the last move used for 3 turns')
def r_forget(sp, m):
    sp.set('volatileStatus', "'disable'")


@rule(r'Target\'s held item loses effect and hurts them \(1/8 HP\) each turn')
def r_cursed_item(sp, m):
    sp.set('volatileStatus', "'fakemoncurseditem'")


@rule(r'Destroys target\'s held item')
def r_knock_off(sp, m):
    sp.set('onAfterHit', "(target, source) => {\n"
                         "\t\tif (source.hp && target.hp && target.item && "
                         "!target.itemState.knockedOff) {\n"
                         "\t\t\tconst item = target.takeItem();\n"
                         "\t\t\tif (item) {\n"
                         "\t\t\t\ttarget.itemState.knockedOff = true;\n"
                         "\t\t\t\tsource.battle.add('-enditem', target, item.name, "
                         "'[from] move: ' + source.battle.effect.name);\n"
                         "\t\t\t}\n"
                         "\t\t}\n"
                         "\t}")


@rule(r'Steals target\'s item')
def r_thief(sp, m):
    sp.set('onAfterHit', "(target, source) => {\n"
                         "\t\tif (source.item || source.volatiles['gem'] || !target.hp) return;\n"
                         "\t\tconst item = target.takeItem(source);\n"
                         "\t\tif (item) {\n"
                         "\t\t\tsource.setItem(item);\n"
                         "\t\t\tsource.battle.add('-enditem', target, item.name, "
                         "'[silent]', '[from] move: ' + source.battle.effect.name);\n"
                         "\t\t\tsource.battle.add('-item', source, item.name, "
                         "'[from] move: ' + source.battle.effect.name);\n"
                         "\t\t}\n"
                         "\t}")


@rule(r'Target takes 1/16 damage every turn, halves their healing received|'
      r'Drains 1/8 HP at the end of every turn, heals user|'
      r'Traps target, drains 1/16 HP per turn to user|'
      r'Curse effect but drains 1/8 HP instead of 1/4|'
      r'10% Leech Seed')
def r_leech(sp, m):
    sp.set('volatileStatus', "'leechseed'")


@rule(r'Any healing the target receives also heals the user')
def r_shared_heal(sp, m):
    sp.set('volatileStatus', "'fakemonsharedheal'")


@rule(r'Target\'s attacks deal 50% less damage to the user')
def r_weaken_target(sp, m):
    sp.set('volatileStatus', "'fakemonweakened'")


@rule(r'Any damage the user takes this turn is mirrored to the target')
def r_mirror_damage(sp, m):
    sp.set('self', "{ volatileStatus: 'fakemonmirrordamage' }")


@rule(r'User becomes invulnerable to all multi-target moves for 3 turns')
def r_wide_guard_self(sp, m):
    sp.set('sideCondition', "'wideguard'")
    sp.set('target', "'allySide'")


@rule(r'User becomes immune to Fire-type moves for 3 turns')
def r_fire_immune(sp, m):
    sp.set('volatileStatus', "'fakemontypeward'")
    sp.set('target', "'self'")


@rule(r'Ground-type moves fail against all allies for 3 turns')
def r_ground_ward(sp, m):
    sp.set('sideCondition', "'fakemongroundward'")
    sp.set('target', "'allySide'")


@rule(r'Raises Defense by 2, (?:prevents critical hits for 3 turns|'
      r'user becomes immune to critical hits)')
def r_lucky_chant_self(sp, m):
    sp.self_boosts['def'] = 2
    sp.set('sideCondition', "'luckychant'")
    sp.set('target', "'allySide'")


@rule(r'Raises Def and Sp. Def by 1, prevents stat reduction|'
      r'Raises Sp. Def by 2, prevents stat drops for user')
def r_mist_self(sp, m):
    sp.set('sideCondition', "'mist'")
    sp.set('target', "'allySide'")


@rule(r'(?:Boosts Defense \+2|Raises Defense by 2), (?:hurts|damages) '
      r'(?:attackers making contact|contact attackers) by 1/8')
def r_spiky_shield_boost(sp, m):
    sp.self_boosts['def'] = 2
    sp.set('volatileStatus', "'fakemonthorns'")
    sp.set('target', "'self'")


@rule(r'Attackers making contact have Defense and Sp. Def lowered by 1|'
      r'Burns attackers making physical contact for 2 turns|'
      r'Physical attackers are Badly Poisoned upon contact|'
      r'20% chance attackers become Paralyzed')
def r_contact_punish(sp, m):
    text = m.group(0)
    if 'Burns' in text:
        vol = 'fakemonretaliateburn'
    elif 'Badly Poisoned' in text:
        vol = 'fakemonretaliatetox'
    elif 'Paralyzed' in text:
        vol = 'fakemonretaliatepar'
    else:
        vol = 'fakemonretaliatestats'
    sp.set('volatileStatus', f"'{vol}'")
    sp.set('target', "'self'")


@rule(r'If target switches, incoming Pok[eé]mon takes 1/8 damage|'
      r'Target is forced to switch, takes 1/8 damage upon entry|'
      r'Forces target to switch, incoming takes Stealth Rock damage')
def r_pursuit_hazard(sp, m):
    sp.set('forceSwitch', 'true')
    sp.set('onAfterHit', "(target, source) => {\n"
                         "\t\ttarget.side.addSideCondition('fakemonbleedhazard', source);\n"
                         "\t}")


@rule(r'Forces switch, clears all stat changes of incoming Pok[eé]mon')
def r_haze_switch(sp, m):
    sp.set('forceSwitch', 'true')
    sp.set('onHit', "(target) => { target.clearBoosts(); }")


@rule(r'User switches out, (?:heals replacement by 1/8 HP|replacement heals 25% HP)|'
      r'Heals target by 50%, cures status, user switches out')
def r_healing_wish_like(sp, m):
    sp.set('selfSwitch', 'true')
    sp.set('sideCondition', "'fakemonrelayheal'")


@rule(r'User faints, next Pok[eé]mon is fully healed and gets \+1 all stats')
def r_lunar_dance(sp, m):
    sp.set('selfdestruct', "'always'")
    sp.set('sideCondition', "'fakemonrelayheal'")
    sp.set('target', "'self'")


@rule(r'Steel and Electric types cannot switch out while active|'
      r'Traps all active Pok[eé]mon, heals user by 1/16 each turn')
def r_type_trap(sp, m):
    sp.set('onHit', "(target, source) => {\n"
                    "\t\tfor (const pokemon of source.foes()) {\n"
                    "\t\t\tpokemon.addVolatile('trapped', source, source.battle.effect as "
                    "ActiveMove, 'trapper');\n"
                    "\t\t}\n"
                    "\t}")


# ---- remaining specific effects -----------------------------------------
@rule(r'Chance auf Flinch')
def r_flinch_de(sp, m):
    pct = int(re.match(r'(\d+)', sp.move['effect']).group(1))
    sp.add_secondary({'chance': pct, 'volatileStatus': "'flinch'"})


@rule(r'(\d+)% (Bleed\*?|Curse|Disable)')
def r_secondary_volatile(sp, m):
    vol = {'bleed': 'fakemonbleed', 'bleed*': 'fakemonbleed',
           'curse': 'curse', 'disable': 'disable'}[m.group(2).lower()]
    sp.add_secondary({'chance': int(m.group(1)), 'volatileStatus': f"'{vol}'"})


@rule(r'Heals user by (\d+)%, cures sleep condition')
def r_heal_cure_slp(sp, m):
    sp.set('heal', f"[{int(m.group(1))}, 100]")
    sp.set('target', "'self'")
    sp.set('onHit', "(target) => { if (target.status === 'slp') target.cureStatus(); }")


@rule(r'Heals user (\d+)%, cures Freeze status for party')
def r_heal_cure_frz(sp, m):
    sp.set('heal', f"[{int(m.group(1))}, 100]")
    sp.set('target', "'self'")
    sp.set('onHit', "(target, source) => {\n"
                    "\t\tfor (const ally of source.side.pokemon) {\n"
                    "\t\t\tif (ally.status === 'frz') ally.cureStatus();\n"
                    "\t\t}\n"
                    "\t}")


@rule(r'Heals (\d+)% in sun, (\d+)% otherwise')
def r_heal_weather(sp, m):
    a, b = int(m.group(1)), int(m.group(2))
    sp.set('target', "'self'")
    sp.set('onHit', "(target) => {\n"
                    "\t\tconst sun = ['sunnyday', 'desolateland'].includes(target.effectiveWeather());\n"
                    f"\t\treturn !!target.heal(target.baseMaxhp * (sun ? {a} : {b}) / 100);\n"
                    "\t}")


@rule(r'(\d+)% chance to reflect entry hazards back to opponent\'s side')
def r_reflect_hazards(sp, m):
    sp.add_secondary({
        'chance': int(m.group(1)),
        'onHit': "(target, source) => {\n"
                 "\t\t\tconst hazards = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', "
                 "'livewire', 'fakemonbleedhazard'];\n"
                 "\t\t\tfor (const id of hazards) {\n"
                 "\t\t\t\tconst layers = source.side.sideConditions[id];\n"
                 "\t\t\t\tif (!layers) continue;\n"
                 "\t\t\t\tsource.side.removeSideCondition(id);\n"
                 "\t\t\t\ttarget.side.addSideCondition(id, source);\n"
                 "\t\t\t}\n"
                 "\t\t}",
    })


@rule(r'Tailwind effect for \d+ turns, but only affects Fire/Flying types')
def r_selective_tailwind(sp, m):
    sp.set('sideCondition', "'fakemonthermaldraft'")
    sp.set('target', "'allySide'")


@rule(r'Leaves a burn that does 1/16 dmg but lowers Defense by 1 each turn')
def r_scorch_mark(sp, m):
    sp.set('volatileStatus', "'fakemonscorchmark'")


@rule(r'Ignores (?:effects of target\'s weight-based moves/abilities|weight modifiers)')
def r_ignore_weight(sp, m):
    sp.set('volatileStatus', "'fakemonweightless'")
    sp.set('target', "'self'")


@rule(r'Raises Evasion by 1, next Grass attack hits 100%')
def r_leaf_mirage(sp, m):
    sp.self_boosts['evasion'] = 1
    sp.set('target', "'self'")
    sp.set('onHit', "(target) => { target.addVolatile('fakemonsurefire'); }")


@rule(r'User\'s (\w+) moves do 1\.5x damage when HP is below (\d+)%')
def r_pinch_boost(sp, m):
    t, pct = m.group(1), int(m.group(2))
    sp.set('target', "'self'")
    sp.set('volatileStatus', "'fakemonovergrowth'")


@rule(r'Disables Steel moves & removes Steel-type abilities for \d+ turns')
def r_emp(sp, m):
    sp.set('pseudoWeather', "'fakemonempfield'")
    sp.set('target', "'all'")


@rule(r'User rests 1 turn after use, guaranteed Paralysis on hit')
def r_overload(sp, m):
    sp.set('status', "'par'")
    sp.set('self', "{ volatileStatus: 'mustrecharge' }")


@rule(r'Draws all Electric moves next turn, boosting Power to 100 if hit')
def r_lightning_rod_move(sp, m):
    sp.set('volatileStatus', "'fakemonlightningrod'")
    sp.set('target', "'self'")


@rule(r'Target\'s Evasion drops by (\d), Electric moves can\'t miss them')
def r_static_cling(sp, m):
    sp.target_boosts['evasion'] = -int(m.group(1))
    sp.set('onHit', "(target, source) => { target.addVolatile('foresight', source); }")


@rule(r'Reflects special attacks for \d+ turns')
def r_ice_mirror(sp, m):
    sp.set('sideCondition', "'fakemonspecialmirror'")
    sp.set('target', "'allySide'")


@rule(r'Raises user and target Attack and Speed by 1')
def r_sparring(sp, m):
    sp.set('onHit', "(target, source) => {\n"
                    "\t\tsource.battle.boost({ atk: 1, spe: 1 }, target, source);\n"
                    "\t\tsource.battle.boost({ atk: 1, spe: 1 }, source, source);\n"
                    "\t}")


@rule(r'Changes weather, non-Poison types lose 1/16 HP per turn')
def r_miasma(sp, m):
    sp.set('weather', "'fakemonmiasma'")


@rule(r'Cures target\'s Poison, lowers their Def/Sp\.Def by (\d)')
def r_antidote(sp, m):
    n = -int(m.group(1))
    sp.target_boosts['def'] = n
    sp.target_boosts['spd'] = n
    sp.set('onHit', "(target) => { if (['psn', 'tox'].includes(target.status)) target.cureStatus(); }")


@rule(r'User falls asleep for 1 turn, fully heals, wakes up with \+1 Sp\. Atk')
def r_trance(sp, m):
    sp.set('target', "'self'")
    sp.set('onHit', "(target) => {\n"
                    "\t\tif (!target.setStatus('slp')) return false;\n"
                    "\t\ttarget.statusState.time = 2;\n"
                    "\t\ttarget.statusState.startTime = 2;\n"
                    "\t\ttarget.heal(target.maxhp);\n"
                    "\t\ttarget.battle.add('-heal', target, target.getHealth, '[silent]');\n"
                    "\t\ttarget.battle.boost({ spa: 1 }, target, target);\n"
                    "\t}")


@rule(r'Hits 1 time for every (\w+) type in the user\'s party')
def r_party_multihit(sp, m):
    t = m.group(1)
    sp.set('multihit', 1)
    sp.set('onModifyMove', "(move, source) => {\n"
                           f"\t\tconst allies = source.side.pokemon.filter(p => p.hasType('{t}')).length;\n"
                           "\t\tmove.multihit = Math.max(1, Math.min(5, allies));\n"
                           "\t}")


@rule(r'Power increases by (\d+) for each (\w+)-type ally in party')
def r_party_power(sp, m):
    step, t = int(m.group(1)), m.group(2)
    sp.set('basePowerCallback', "(pokemon, target, move) => {\n"
                                f"\t\tconst allies = pokemon.side.pokemon.filter(p => p !== pokemon && "
                                f"p.hasType('{t}')).length;\n"
                                f"\t\treturn move.basePower + {step} * allies;\n"
                                "\t}")


@rule(r'Raises Evasion by (\d)(?:, lowers Defense by (\d))?')
def r_evasion(sp, m):
    sp.self_boosts['evasion'] = int(m.group(1))
    if m.group(2):
        sp.self_boosts['def'] = -int(m.group(2))
    sp.set('target', "'self'")


@rule(r'Raises Atk, Def, Sp\. Def by (\d), user cannot switch')
def r_hoard(sp, m):
    n = int(m.group(1))
    sp.self_boosts.update({'atk': n, 'def': n, 'spd': n})
    sp.set('target', "'self'")
    sp.set('onHit', "(target) => { target.addVolatile('fakemonrooted'); }")


@rule(r'Target becomes paralyzed, drops their Evasion by (\d)')
def r_dragon_gaze(sp, m):
    sp.set('status', "'par'")
    sp.target_boosts['evasion'] = -int(m.group(1))


@rule(r'Clears hazards, (\d+)% chance to blow target away \(forced switch\)')
def r_wyvern_wind(sp, m):
    sp.add_secondary({'chance': int(m.group(1)), 'onHit':
                      "(target) => { target.forceSwitchFlag = true; }"})


@rule(r'Swaps user\'s negative stat changes with target\'s positive ones')
def r_deception(sp, m):
    sp.set('onHit', "(target, source) => {\n"
                    "\t\tconst mine: SparseBoostsTable = {};\n"
                    "\t\tconst theirs: SparseBoostsTable = {};\n"
                    "\t\tlet i: BoostID;\n"
                    "\t\tfor (i in source.boosts) {\n"
                    "\t\t\tmine[i] = source.boosts[i] < 0 ? target.boosts[i] : source.boosts[i];\n"
                    "\t\t\ttheirs[i] = target.boosts[i] > 0 ? source.boosts[i] : target.boosts[i];\n"
                    "\t\t}\n"
                    "\t\tsource.setBoost(mine);\n"
                    "\t\ttarget.setBoost(theirs);\n"
                    "\t\tsource.battle.add('-swapboost', source, target, '[from] move: ' + "
                    "source.battle.effect.name);\n"
                    "\t}")


@rule(r'Raises Speed by (\d), Attack by (\d)')
def r_gear_overdrive(sp, m):
    sp.self_boosts['spe'] = int(m.group(1))
    sp.self_boosts['atk'] = int(m.group(2))
    sp.set('target', "'self'")


@rule(r'Double damage if target is infatuated, cures infatuation')
def r_heartbreak(sp, m):
    sp.set('onBasePower', "(basePower, source, target) => {\n"
                          "\t\tif (target.volatiles['attract']) return basePower * 2;\n"
                          "\t}")
    sp.set('onAfterHit', "(target) => { target.removeVolatile('attract'); }")


@rule(r'Heals user for (\d+)% damage dealt')
def r_drain3(sp, m):
    sp.set('drain', f"[{int(m.group(1))}, 100]")


@rule(r'(\d+)% chance to cause Infatuation or Confusion')
def r_infat_conf(sp, m):
    sp.add_secondary({
        'chance': int(m.group(1)),
        'onHit': "(target, source) => {\n"
                 "\t\t\tif (source.battle.randomChance(1, 2)) {\n"
                 "\t\t\t\ttarget.addVolatile('attract', source);\n"
                 "\t\t\t} else {\n"
                 "\t\t\t\ttarget.addVolatile('confusion', source);\n"
                 "\t\t\t}\n"
                 "\t\t}",
    })


@rule(r'^Raises (' + STAT_RE + r') by (\d)$')
def r_simple_raise(sp, m):
    sp.self_boosts[_stat(m.group(1))] = int(m.group(2))
    sp.set('target', "'self'")


@rule(r'Reduces (\w+) damage for \d+ turns')
def r_type_ward(sp, m):
    sp.set('sideCondition', "'fakemontypeward'")
    sp.set('target', "'allySide'")


# ---------------------------------------------------------------------------
# Compilation entry point
# ---------------------------------------------------------------------------
def compile_effect(move, effect):
    """Return a Spec with every rule that matched `effect` applied."""
    sp = Spec(move)
    if not effect:
        sp.unmatched = False
        return sp
    text = effect.strip()
    covered = []
    for regex, fn in RULES:
        for m in regex.finditer(text):
            # skip a match wholly inside a span an earlier (more specific) rule took
            if any(m.start() >= a and m.end() <= b for a, b in covered):
                continue
            fn(sp, m)
            covered.append((m.start(), m.end()))
            sp.matched.append((fn.__name__, m.group(0)))
    sp.unmatched = not sp.matched
    return sp
