# Integration Guide: Wiring New Types into Commands

This document explains how to integrate the new NPC action and scripted event handlers into the command system.

---

## Status

### ✅ Completed
- Type definitions extended in `interface.ts`
- Handler functions implemented in `npc-actions.ts` (18 functions)
- Handler functions implemented in `scripted-events.ts` (42 functions)
- Imports added to `commands.ts`
- Placeholder messages added for unimplemented types

### ⚠️ Pending Integration
- Individual case statements for each new type in `commands.ts`
- HTML generation helpers in `html.ts` (optional but recommended)
- Example NPCs and events in `data.ts` (for demonstration)

---

## How to Integrate NPC Actions

### Location in Code
File: `commands.ts`
Function: `npcaction`
Line: ~2523-2640

### Current Structure
```typescript
switch (action.type) {
  case 'giveitem': // ✅ Implemented
  case 'givepokemon': // ✅ Implemented
  case 'exchangeitems': // ✅ Implemented
  case 'takeitem': // ✅ Implemented
  default: // ⚠️ Shows placeholder message
}
```

### How to Add a New Action Type

#### Step 1: Add Case Statement
```typescript
case 'fossilrevival': {
  // Import is already done at top: import * as NPCActions from './npc-actions';
  
  // Call the handler
  const result = NPCActions.handleFossilRevival(player, action, fossilItemId);
  
  // Handle success
  if (result.success && result.pokemon) {
    // Add Pokemon to party or PC
    if (player.party.length < 6) {
      player.party.push(result.pokemon);
      resultHTML += `<p style="color: green;">✅ ${result.pokemon.species} joined your party!</p>`;
    } else {
      storePokemonInPC(player, result.pokemon);
      resultHTML += `<p style="color: green;">✅ ${result.pokemon.species} sent to PC!</p>`;
    }
    
    // Mark as completed if one-time action
    if (action.onceOnly) player.completedNPCActions.add(npcId);
  } else {
    // Handle failure
    return this.errorReply(result.message);
  }
  break;
}
```

#### Step 2: Add Display Logic (in `npc` command, ~line 2407)
```typescript
case 'fossilrevival':
  if (action.fossils && action.fossils.length > 0) {
    dialogueHTML += `<p><strong>Fossil Revival Service:</strong></p>`;
    dialogueHTML += `<p>I can revive fossils for ₽${action.revivalCost || 1500}.</p>`;
    
    // Show available fossils player has
    const playerFossils = action.fossils.filter(f => player.inventory.has(f));
    if (playerFossils.length > 0) {
      dialogueHTML += `<p>Your fossils: ${playerFossils.join(', ')}</p>`;
      // Would need additional command to select fossil
      dialogueHTML += `<button name="send" value="/rpg revivedossil ${npcId} helixfossil" class="button">Revive Fossil</button>`;
    } else {
      dialogueHTML += `<p style="color: gray;">You don't have any fossils.</p>`;
    }
  }
  break;
```

### Complete Example: Daily Reward

```typescript
// In npcaction handler (~line 2523)
case 'dailyreward': {
  const result = NPCActions.handleDailyReward(player, action, npcId);
  
  if (result.success && result.rewards) {
    resultHTML += `<p style="color: green;">✅ ${result.message}</p>`;
    
    // Add rewards to inventory
    for (const reward of result.rewards) {
      addItemToInventory(player, reward.itemId, reward.quantity);
      const item = ITEMS_DATABASE[reward.itemId];
      resultHTML += `<p>Received: ${item?.name || reward.itemId} x${reward.quantity}</p>`;
    }
  } else {
    return this.errorReply(result.message);
  }
  break;
}

// In npc display handler (~line 2407)
case 'dailyreward':
  dialogueHTML += `<p><strong>Daily Rewards:</strong></p>`;
  dialogueHTML += `<p>Come back every day for rewards!</p>`;
  dialogueHTML += `<button name="send" value="/rpg npcaction ${npcId}" class="button">🎁 Claim Daily Reward</button>`;
  break;
```

---

## How to Integrate Scripted Events

### Location in Code
File: `commands.ts`
Function: `travel`
Line: ~1117-1205

### Current Structure
```typescript
if (firstEvent.type === 'dialogue') { // ✅ Implemented
} else if (firstEvent.type === 'item') { // ✅ Implemented
} else if (firstEvent.type === 'pokemon') { // ✅ Implemented
} else if (firstEvent.type === 'wildbattle') { // ✅ Implemented
} else if (firstEvent.type === 'trainer') { // ✅ Implemented
} else { // ⚠️ Shows placeholder message
}
```

### How to Add a New Event Type

#### Step 1: Add Conditional Branch
```typescript
} else if (firstEvent.type === 'cutscene') {
  // Import is already done at top: import * as ScriptedEvents from './scripted-events';
  
  // Call the handler
  const result = ScriptedEvents.handleCutscene(player, firstEvent);
  
  if (result.success && result.script) {
    eventHTML += `<p><strong>${firstEvent.name}</strong></p>`;
    
    // Display cutscene script (line by line)
    for (const line of result.script) {
      eventHTML += `<p>${line}</p>`;
    }
    
    eventHTML += `<p><button name="send" value="/rpg explore" class="button">Continue</button></p>`;
  }
```

#### Step 2: Handle Side Effects
```typescript
} else if (firstEvent.type === 'pokemonswarm') {
  const result = ScriptedEvents.handlePokemonSwarm(player, firstEvent);
  
  if (result.success) {
    eventHTML += `<p><strong>${firstEvent.name}</strong></p>`;
    eventHTML += `<p>${result.message}</p>`;
    eventHTML += `<p><em>Encounter rate for ${result.swarmSpecies} increased for ${result.duration} hours!</em></p>`;
    eventHTML += `<p><button name="send" value="/rpg explore" class="button">Continue</button></p>`;
    
    // NOTE: You'd also need to modify encounter logic to check for active swarms
    // Example in encounter handler:
    // if (ScriptedEvents.checkActiveSwarm(player, 'dratini')) {
    //   // Boost Dratini encounter rate by 5x
    // }
  }
```

### Complete Example: Choice Event

```typescript
} else if (firstEvent.type === 'choice') {
  eventHTML += `<p><strong>${firstEvent.name}</strong></p>`;
  eventHTML += `<p>${firstEvent.dialogue}</p>`;
  
  if (firstEvent.choices) {
    eventHTML += `<p><strong>Make your choice:</strong></p>`;
    
    for (let i = 0; i < firstEvent.choices.length; i++) {
      const choice = firstEvent.choices[i];
      eventHTML += `<button name="send" value="/rpg eventchoice ${firstEvent.id} ${i}" class="button">${choice.text}</button> `;
    }
  }
```

Then add a new command to handle choices:
```typescript
eventchoice(target, room, user) {
  const [eventId, choiceIndexStr] = target.split(' ');
  const choiceIndex = parseInt(choiceIndexStr);
  const player = getPlayerData(user.id);
  
  // Find the event
  const location = LOCATIONS[toID(player.location)];
  const event = location.scriptedEvents?.find(e => e.id === eventId);
  
  if (!event) return this.errorReply("Event not found.");
  
  // Handle the choice
  const result = ScriptedEvents.handleChoice(player, event, choiceIndex);
  
  if (result.success) {
    let html = `<div class="infobox">`;
    html += `<p>${result.message}</p>`;
    if (result.resultDialogue) {
      html += `<p>${result.resultDialogue}</p>`;
    }
    html += `<p><button name="send" value="/rpg explore" class="button">Continue</button></p>`;
    html += `</div>`;
    this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
  }
},
```

---

## Quick Integration Checklist

### For Each NPC Action Type:
- [ ] Add case to `npcaction` switch (~line 2523)
- [ ] Call appropriate handler from `npc-actions.ts`
- [ ] Handle success/failure response
- [ ] Add display logic to `npc` switch (~line 2407)
- [ ] Create buttons/interface for user interaction
- [ ] Test with example NPC in `data.ts`

### For Each Scripted Event Type:
- [ ] Add conditional to event trigger logic (~line 1117)
- [ ] Call appropriate handler from `scripted-events.ts`
- [ ] Display result to user
- [ ] Create any needed follow-up commands
- [ ] Test with example event in `data.ts`

---

## Testing Your Integration

### 1. Create Test NPC
```typescript
// In data.ts
'test_fossil_npc': {
  id: 'test_fossil_npc',
  name: 'Fossil Scientist',
  location: 'startertown_lab',
  npcType: 'fossildiscoverer',
  dialogue: "I can revive your fossils!",
  action: {
    type: 'fossilrevival',
    fossils: ['helixfossil', 'domefossil'],
    revivalCost: 2000,
  },
},
```

### 2. Give Player a Fossil
```typescript
// Use /rpg admin command or add to starter inventory
addItemToInventory(player, 'helixfossil', 1);
```

### 3. Test the Flow
1. Navigate to location with NPC
2. Use `/rpg npc test_fossil_npc`
3. Verify display shows fossil options
4. Click button to revive
5. Verify Pokemon is created
6. Check that money is deducted

### 4. Test Edge Cases
- Not enough money
- No fossils in inventory
- Party full (should go to PC)
- One-time action (should not repeat)

---

## Priority Order for Integration

### High Priority (Core Gameplay)
1. **fossilrevival** - Popular Pokemon mechanic
2. **dailyreward** - Player engagement
3. **battlerequest** - Replayable content
4. **pokemonswarm** - Event variety
5. **bossbattle** - Endgame challenge

### Medium Priority (Enhanced Features)
6. **questchain** - Story depth
7. **tournament** - Structured competition
8. **evtrainer** - Competitive features
9. **moverelearner** - Quality of life
10. **itemcraft** - Crafting system

### Low Priority (Polish)
11. **fortuneteller** - Fun feature
12. **berryplant** - Long-term investment
13. **photographer** - Collectible system
14. **haircutter/masseuse** - Friendship alternative
15. **lottery** - Gambling mini-game

---

## Common Patterns

### Pattern 1: Simple Action (No User Input)
```typescript
case 'ivchecker': {
  const result = NPCActions.handleIVChecker(selectedPokemon);
  if (result.success) {
    resultHTML += `<p><strong>IVs for ${selectedPokemon.nickname}:</strong></p>`;
    resultHTML += `<p>HP: ${result.ivs.hp} | ATK: ${result.ivs.atk} | DEF: ${result.ivs.def}</p>`;
    resultHTML += `<p>SPA: ${result.ivs.spa} | SPD: ${result.ivs.spd} | SPE: ${result.ivs.spe}</p>`;
  }
  break;
}
```

### Pattern 2: Action Requiring Selection
```typescript
// Need separate command for selection
case 'evtrainer': {
  // First show options
  let html = `<div class="infobox"><h2>EV Training</h2>`;
  html += `<p>Which stat would you like to train?</p>`;
  html += `<button name="send" value="/rpg evtrain ${npcId} atk" class="button">Attack</button> `;
  html += `<button name="send" value="/rpg evtrain ${npcId} def" class="button">Defense</button> `;
  // ... etc
  this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
}
```

### Pattern 3: Cooldown-Based Action
```typescript
case 'dailyreward': {
  const result = NPCActions.handleDailyReward(player, action, npcId);
  
  if (!result.success) {
    // Show cooldown message
    return this.errorReply(result.message); // "You can claim in X hours"
  }
  
  // Give rewards...
  break;
}
```

---

## Next Steps

1. **Start Small**: Pick 2-3 high-priority types to integrate first
2. **Test Thoroughly**: Ensure edge cases are handled
3. **Document Examples**: Add sample NPCs/events to `data.ts`
4. **Iterate**: Get feedback and refine
5. **Expand**: Gradually integrate remaining types

---

## Getting Help

- **Handler Documentation**: See `NEW_TYPES_DOCUMENTATION.md`
- **Handler Functions**: Review `npc-actions.ts` and `scripted-events.ts`
- **Implementation Examples**: See `IMPLEMENTATION_SUMMARY.md`
- **Type Definitions**: Check `interface.ts`

---

## Summary

✅ **Handlers Ready**: All 59 handler functions implemented
✅ **Imports Added**: Modules imported into commands.ts
✅ **Placeholders Added**: Graceful degradation for unimplemented types
⚠️ **Integration Pending**: Individual case statements need to be added
📖 **Documentation Complete**: This guide + 5 other docs

**The foundation is complete. Now it's just a matter of connecting the dots!** 🚀
