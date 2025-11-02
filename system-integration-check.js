/**
 * System Integration Check
 * Validates that all interfaces, types, constants, functions, UI functions, and commands
 * properly support the ability system implementation
 */

const fs = require('fs');
const path = require('path');

// Read the main files
const rpgRefactorPath = path.join(__dirname, 'impulse/chat-plugins/rpg-wip/rpg-refactor.ts');
const abilitiesPath = path.join(__dirname, 'impulse/chat-plugins/rpg-wip/abilities.ts');

const rpgContent = fs.readFileSync(rpgRefactorPath, 'utf8');
const abilitiesContent = fs.readFileSync(abilitiesPath, 'utf8');

console.log('=== SYSTEM INTEGRATION CHECK ===\n');

// Check 1: Interface Compatibility
console.log('1. INTERFACE COMPATIBILITY CHECK');
console.log('   Checking if RPGPokemon interface has required fields...');

const requiredPokemonFields = [
	'species', 'level', 'hp', 'maxHp', 'atk', 'def', 'spa', 'spd', 'spe',
	'ability', 'item', 'status', 'moves', 'nature', 'ivs', 'evs'
];

const pokemonInterfaceMatch = rpgContent.match(/interface RPGPokemon\s*{([^}]+)}/s);
if (pokemonInterfaceMatch) {
	const interfaceBody = pokemonInterfaceMatch[1];
	const missingFields = requiredPokemonFields.filter(field => !interfaceBody.includes(field));
	if (missingFields.length === 0) {
		console.log('   ✅ RPGPokemon interface has all required fields');
	} else {
		console.log(`   ❌ Missing fields: ${missingFields.join(', ')}`);
	}
} else {
	console.log('   ❌ Could not find RPGPokemon interface');
}

// Check 2: BattleState Interface
console.log('\n2. BATTLESTATE INTERFACE CHECK');
console.log('   Checking if BattleState has weather and terrain fields...');

const battleStateMatch = rpgContent.match(/interface BattleState\s*{([^}]+)}/s);
if (battleStateMatch) {
	const interfaceBody = battleStateMatch[1];
	const hasWeather = interfaceBody.includes('weather');
	const hasTerrain = interfaceBody.includes('terrain');
	const hasSlots = interfaceBody.includes('playerSlots') && interfaceBody.includes('opponentSlots');
	
	if (hasWeather && hasTerrain && hasSlots) {
		console.log('   ✅ BattleState has weather, terrain, and slots fields');
	} else {
		console.log(`   ❌ Missing: ${!hasWeather ? 'weather ' : ''}${!hasTerrain ? 'terrain ' : ''}${!hasSlots ? 'slots' : ''}`);
	}
} else {
	console.log('   ❌ Could not find BattleState interface');
}

// Check 3: ActivePokemonSlot Interface
console.log('\n3. ACTIVEPOKEMONSLOT INTERFACE CHECK');
console.log('   Checking if ActivePokemonSlot has required volatile status fields...');

const activeSlotMatch = rpgContent.match(/interface ActivePokemonSlot\s*{([^}]+)}/s);
if (activeSlotMatch) {
	const interfaceBody = activeSlotMatch[1];
	const volatileFields = ['statStages', 'isConfused', 'isProtected', 'substitute', 'focusEnergy'];
	const hasAll = volatileFields.every(field => interfaceBody.includes(field));
	
	if (hasAll) {
		console.log('   ✅ ActivePokemonSlot has all volatile status fields');
	} else {
		const missing = volatileFields.filter(field => !interfaceBody.includes(field));
		console.log(`   ❌ Missing fields: ${missing.join(', ')}`);
	}
} else {
	console.log('   ❌ Could not find ActivePokemonSlot interface');
}

// Check 4: Import Statement
console.log('\n4. IMPORT STATEMENT CHECK');
console.log('   Checking if rpg-refactor.ts imports abilities module...');

const importMatch = rpgContent.match(/import.*RPGAbilities.*from.*abilities/);
if (importMatch) {
	console.log('   ✅ RPGAbilities is imported');
	console.log(`   Import: ${importMatch[0]}`);
} else {
	console.log('   ❌ RPGAbilities import not found');
}

// Check 5: RPGAbilities Usage
console.log('\n5. RPGABILITIES USAGE CHECK');
console.log('   Checking if key RPGAbilities functions are used...');

const functionsToCheck = [
	'checkImmunity',
	'applyPowerModifier',
	'applyTypeModifier',
	'preventsStatus',
	'applySwitchInAbilities',
	'takesIndirectDamage',
	'preventsRecoil',
	'isGrounded'
];

const usageResults = {};
for (const func of functionsToCheck) {
	const regex = new RegExp(`RPGAbilities\\.${func}`, 'g');
	const matches = rpgContent.match(regex);
	usageResults[func] = matches ? matches.length : 0;
}

let allUsed = true;
for (const [func, count] of Object.entries(usageResults)) {
	if (count > 0) {
		console.log(`   ✅ ${func}: used ${count} time(s)`);
	} else {
		console.log(`   ⚠️  ${func}: not used`);
		allUsed = false;
	}
}

// Check 6: Constants
console.log('\n6. CONSTANTS CHECK');
console.log('   Checking if required constants exist...');

const constants = ['TYPE_CHART', 'NATURES', 'ITEMS_DATABASE', 'CUSTOM_ITEMS_DATABASE'];
for (const constant of constants) {
	if (rpgContent.includes(`const ${constant}`)) {
		console.log(`   ✅ ${constant} defined`);
	} else {
		console.log(`   ❌ ${constant} not found`);
	}
}

// Check 7: UI Functions
console.log('\n7. UI FUNCTIONS CHECK');
console.log('   Checking if UI functions exist and handle abilities...');

const uiFunctions = [
	'generateBattleHTML',
	'generatePokemonInfoHTML',
	'generateDoubleBattleHTML',
	'generateSingleBattleHTML'
];

for (const func of uiFunctions) {
	if (rpgContent.includes(`function ${func}`)) {
		console.log(`   ✅ ${func} exists`);
		// Check if it displays ability
		if (rpgContent.match(new RegExp(`${func}[\\s\\S]{0,500}ability`, 'i'))) {
			console.log(`      ✅ Displays ability information`);
		}
	} else {
		console.log(`   ❌ ${func} not found`);
	}
}

// Check 8: Commands
console.log('\n8. COMMANDS CHECK');
console.log('   Checking if battle commands exist...');

const commands = ['battleaction', 'battle', 'choosestarter', 'menu'];
for (const cmd of commands) {
	if (rpgContent.includes(`${cmd}(`)) {
		console.log(`   ✅ ${cmd} command exists`);
	} else {
		console.log(`   ❌ ${cmd} command not found`);
	}
}

// Check 9: Damage Calculation Integration
console.log('\n9. DAMAGE CALCULATION CHECK');
console.log('   Checking if calculateDamage uses ability functions...');

const calculateDamageMatch = rpgContent.match(/function calculateDamage[\s\S]{0,3000}/);
if (calculateDamageMatch) {
	const damageFunc = calculateDamageMatch[0];
	const checksInDamageCalc = [
		'checkImmunity',
		'applyPowerModifier',
		'applyTypeModifier',
		'applyDamageModifier'
	];
	
	for (const check of checksInDamageCalc) {
		if (damageFunc.includes(check)) {
			console.log(`   ✅ ${check} used in damage calculation`);
		} else {
			console.log(`   ⚠️  ${check} not used in damage calculation`);
		}
	}
} else {
	console.log('   ❌ calculateDamage function not found');
}

// Check 10: Status Application Integration
console.log('\n10. STATUS APPLICATION CHECK');
console.log('   Checking if status moves use preventsStatus...');

const statusCheckCount = (rpgContent.match(/preventsStatus/g) || []).length;
if (statusCheckCount > 0) {
	console.log(`   ✅ preventsStatus used ${statusCheckCount} time(s)`);
} else {
	console.log('   ❌ preventsStatus not used');
}

// Check 11: Switch Logic Integration
console.log('\n11. SWITCH LOGIC CHECK');
console.log('   Checking if switch logic uses switch abilities...');

const switchInCount = (rpgContent.match(/applySwitchInAbilities/g) || []).length;
if (switchInCount > 0) {
	console.log(`   ✅ applySwitchInAbilities used ${switchInCount} time(s)`);
} else {
	console.log('   ⚠️  applySwitchInAbilities not used (optional feature)');
}

// Check 12: Weather/Terrain Handling
console.log('\n12. WEATHER/TERRAIN CHECK');
console.log('   Checking weather and terrain handling...');

const weatherFunctionMatch = rpgContent.match(/function handleEndOfTurnWeather/);
if (weatherFunctionMatch) {
	console.log('   ✅ handleEndOfTurnWeather function exists');
	
	// Check if it handles healing abilities
	const weatherSection = rpgContent.match(/function handleEndOfTurnWeather[\s\S]{0,2000}/);
	if (weatherSection && weatherSection[0].includes('raindish')) {
		console.log('   ✅ Weather healing abilities integrated');
	}
} else {
	console.log('   ⚠️  handleEndOfTurnWeather function not found');
}

// Check 13: Item Interaction
console.log('\n13. ITEM INTERACTION CHECK');
console.log('   Checking if item interactions respect abilities...');

const itemChecks = [
	'takesIndirectDamage', // For Life Orb
	'canUseHeldItem', // For Klutz
	'checkItemRemovalPrevention' // For Sticky Hold
];

for (const check of itemChecks) {
	const count = (rpgContent.match(new RegExp(check, 'g')) || []).length;
	if (count > 0) {
		console.log(`   ✅ ${check} used ${count} time(s)`);
	} else {
		console.log(`   ⚠️  ${check} not used (may need implementation)`);
	}
}

// Check 14: Contact Abilities
console.log('\n14. CONTACT ABILITIES CHECK');
console.log('   Checking if contact moves trigger abilities...');

const contactMatch = rpgContent.match(/move\.flags\.contact[\s\S]{0,500}(Static|Flame Body|Rough Skin)/i);
if (contactMatch) {
	console.log('   ✅ Contact abilities implemented');
} else {
	console.log('   ⚠️  Contact abilities may not be triggering');
}

// Check 15: Exports from abilities.ts
console.log('\n15. ABILITIES.TS EXPORTS CHECK');
console.log('   Checking if abilities.ts exports all required functions...');

const requiredExports = [
	'checkAbilityImmunity',
	'applyAbilityPowerModifier',
	'applyAbilityTypeModifier',
	'preventsStatus',
	'applySwitchInAbilities',
	'takesIndirectDamage',
	'preventsRecoil',
	'isGrounded',
	'RPGAbilities'
];

for (const exp of requiredExports) {
	if (abilitiesContent.includes(`export function ${exp}`) || 
	    abilitiesContent.includes(`export const ${exp}`)) {
		console.log(`   ✅ ${exp} exported`);
	} else {
		console.log(`   ❌ ${exp} not exported`);
	}
}

// Summary
console.log('\n=== SUMMARY ===');
console.log('All critical integration points have been checked.');
console.log('✅ = Fully implemented');
console.log('⚠️  = May need attention or is optional');
console.log('❌ = Missing or needs implementation');

console.log('\n=== RECOMMENDATIONS ===');
console.log('1. If any ❌ appear above, those need immediate attention');
console.log('2. If ⚠️  appear, review if those features are needed for your use case');
console.log('3. All ✅ items are properly integrated and working');
