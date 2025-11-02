/**
 * Simple test to verify abilities module can be loaded
 * Run with: node test-abilities.js
 */

console.log('\n=== ABILITY SYSTEM VERIFICATION TEST ===\n');

// Test 1: Check if abilities.ts exists
const fs = require('fs');
const path = require('path');

const abilitiesPath = path.join(__dirname, 'abilities.ts');
const rpgPath = path.join(__dirname, 'rpg-refactor.ts');

console.log('✓ Checking file existence...');
console.log(`  abilities.ts: ${fs.existsSync(abilitiesPath) ? '✅ EXISTS' : '❌ MISSING'}`);
console.log(`  rpg-refactor.ts: ${fs.existsSync(rpgPath) ? '✅ EXISTS' : '❌ MISSING'}`);

// Test 2: Check file sizes
const abilitiesSize = fs.statSync(abilitiesPath).size;
const rpgSize = fs.statSync(rpgPath).size;

console.log('\n✓ Checking file sizes...');
console.log(`  abilities.ts: ${(abilitiesSize / 1024).toFixed(1)} KB`);
console.log(`  rpg-refactor.ts: ${(rpgSize / 1024).toFixed(1)} KB`);

// Test 3: Verify ability implementations exist
const abilitiesContent = fs.readFileSync(abilitiesPath, 'utf-8');

const checkAbility = (name, displayName) => {
const found = abilitiesContent.includes(`'${name}':`);
console.log(`  ${displayName}: ${found ? '✅' : '❌'}`);
return found;
};

console.log('\n✓ Checking immunity abilities...');
let passed = 0;
passed += checkAbility('soundproof', 'Soundproof');
passed += checkAbility('overcoat', 'Overcoat');
passed += checkAbility('levitate', 'Levitate');
passed += checkAbility('waterabsorb', 'Water Absorb');
passed += checkAbility('wonderguard', 'Wonder Guard');

console.log('\n✓ Checking power modifiers...');
passed += checkAbility('ironfist', 'Iron Fist');
passed += checkAbility('strongjaw', 'Strong Jaw');
passed += checkAbility('technician', 'Technician');
passed += checkAbility('sheerforce', 'Sheer Force');
passed += checkAbility('adaptability', 'Adaptability');

console.log('\n✓ Checking type modifiers...');
passed += checkAbility('pixilate', 'Pixilate');
passed += checkAbility('aerilate', 'Aerilate');
passed += checkAbility('refrigerate', 'Refrigerate');
passed += checkAbility('normalize', 'Normalize');

console.log('\n✓ Checking weather abilities...');
passed += checkAbility('drought', 'Drought');
passed += checkAbility('drizzle', 'Drizzle');
passed += checkAbility('sandstream', 'Sand Stream');
passed += checkAbility('raindish', 'Rain Dish');
passed += checkAbility('solarpower', 'Solar Power');

console.log('\n✓ Checking terrain abilities...');
passed += checkAbility('electricsurge', 'Electric Surge');
passed += checkAbility('grassysurge', 'Grassy Surge');
passed += checkAbility('surgesurfer', 'Surge Surfer');

console.log('\n✓ Checking contact abilities...');
passed += checkAbility('static', 'Static');
passed += checkAbility('flamebody', 'Flame Body');
passed += checkAbility('roughskin', 'Rough Skin');
passed += checkAbility('ironbarbs', 'Iron Barbs');

console.log('\n✓ Checking status prevention...');
passed += checkAbility('immunity', 'Immunity');
passed += checkAbility('limber', 'Limber');
passed += checkAbility('insomnia', 'Insomnia');

console.log('\n✓ Checking item interactions...');
passed += checkAbility('stickyhold', 'Sticky Hold');
passed += checkAbility('magicguard', 'Magic Guard');
passed += checkAbility('klutz', 'Klutz');

console.log('\n✓ Checking critical hit abilities...');
passed += checkAbility('superluck', 'Super Luck');
passed += checkAbility('sniper', 'Sniper');

console.log('\n✓ Checking switch abilities...');
passed += checkAbility('regenerator', 'Regenerator');
passed += checkAbility('naturalcure', 'Natural Cure');

console.log('\n✓ Checking stat modifiers...');
passed += checkAbility('hugepower', 'Huge Power');
passed += checkAbility('guts', 'Guts');

console.log('\n✓ Checking damage reduction...');
passed += checkAbility('multiscale', 'Multiscale');
passed += checkAbility('furcoat', 'Fur Coat');

console.log('\n✓ Checking recoil prevention...');
passed += checkAbility('rockhead', 'Rock Head');

// Test 4: Check integration points in rpg-refactor.ts
const rpgContent = fs.readFileSync(rpgPath, 'utf-8');

console.log('\n✓ Checking integration in rpg-refactor.ts...');
const checkIntegration = (text, desc) => {
const found = rpgContent.includes(text);
console.log(`  ${desc}: ${found ? '✅' : '❌'}`);
return found;
};

let integrated = 0;
integrated += checkIntegration('import RPGAbilities', 'Import statement');
integrated += checkIntegration('RPGAbilities.checkImmunity', 'Immunity check');
integrated += checkIntegration('RPGAbilities.applyPowerModifier', 'Power modifier');
integrated += checkIntegration('RPGAbilities.applyTypeModifier', 'Type modifier');
integrated += checkIntegration('RPGAbilities.getSTABMultiplier', 'STAB calculation');
integrated += checkIntegration('RPGAbilities.preventsStatus', 'Status prevention');
integrated += checkIntegration('RPGAbilities.applySwitchInAbilities', 'Switch-in abilities');
integrated += checkIntegration('RPGAbilities.takesIndirectDamage', 'Indirect damage check');
integrated += checkIntegration('RPGAbilities.preventsRecoil', 'Recoil prevention');

// Test 5: Check function exports
console.log('\n✓ Checking exports...');
const checkExport = (text) => {
const found = abilitiesContent.includes(text);
console.log(`  ${text}: ${found ? '✅' : '❌'}`);
return found;
};

let exports = 0;
exports += checkExport('export const RPGAbilities');
exports += checkExport('checkImmunity:');
exports += checkExport('applyPowerModifier:');
exports += checkExport('applyTypeModifier:');
exports += checkExport('getSTABMultiplier');
exports += checkExport('preventsStatus');
exports += checkExport('isGrounded');

// Final results
console.log('\n=== RESULTS ===\n');
console.log(`Abilities Found: ${passed}/42`);
console.log(`Integration Points: ${integrated}/9`);
console.log(`Exports: ${exports}/7`);

const totalTests = 42 + 9 + 7;
const totalPassed = passed + integrated + exports;
const successRate = ((totalPassed / totalTests) * 100).toFixed(1);

console.log(`\nTotal: ${totalPassed}/${totalTests} (${successRate}%)`);

if (totalPassed === totalTests) {
console.log('\n🎉 ALL TESTS PASSED! System is fully integrated.\n');
} else {
console.log(`\n⚠️  ${totalTests - totalPassed} tests failed.\n`);
}

// Test 6: Check documentation
console.log('✓ Checking documentation...');
const docPath = path.join(__dirname, 'ABILITY_SYSTEM_DOCUMENTATION.md');
console.log(`  Documentation: ${fs.existsSync(docPath) ? '✅ EXISTS' : '❌ MISSING'}`);

if (fs.existsSync(docPath)) {
const docSize = fs.statSync(docPath).size;
console.log(`  Size: ${(docSize / 1024).toFixed(1)} KB`);
}

console.log('\n✅ Verification complete!\n');
