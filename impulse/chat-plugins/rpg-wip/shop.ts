export const SHOP_INVENTORIES: Record<string, ShopInventory> = {
	'startingroom': {
		locationId: 'startingroom',
		tiers: [
			{
				requiredBadges: 0,
				items: [
					'pokeball', 
					'potion', 
                    'antidote',
                    // Test a custom item if you added one to items.ts, or a standard one
                    'oranberry' 
				],
			},
            {
                // This tier unlocks after beating Joey because of the Badge setup above
                requiredBadges: 1,
                items: [
                    'greatball',
                    'superpotion'
                ]
            }
		],
	},
};
