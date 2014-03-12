var shop = {
    tkt: {
        currency: 'dollars',
        price: 100,
        tkts: 1,
        name: 'Ticket',
        id: 'tkt',
        benefits: 'a ticket',
    },
    reel: {

        price: 1000,
        name: 'TicketReel',
        tkts: 10,
        id: 'reel',
        benefits: 'a ticket reel (10)',
    },
    chest: {
        currency: 'dollars',
        price: 10000,
        name: 'TicketChest',
        tkts: 100,
        id: 'chest',
        benefits: 'a ticket chest (50)',
    },
    voice: {
        currency: 'coins',
        price: 5000,
        name: 'Voice',
        id: 'voice',
        promo: '+',
        benefits: 'a promotion to Voice',
    },
    tc: {
        currency: 'dollars',
        price: 100000,
        name: 'Trainer Card',
        id: 'tc',
        benefits: 'a trainer card',
        promo: '$',
    },
    msg: {
        currency: 'dollars',
        price: 50000,
        name: 'Message',
        //add: getRandmsg(),
        id: 'msg',
        benefits: 'a random message',
    },
    color: {
        currency: 'coins',
        price: 775,
        name: 'Custom Color',
        id: 'color',
        //say: '/superdupersekritnamechange',
        benefits: 'a custom color that appears on the custom client',
    },
    av: {
        currency: 'coins',
        price: 500,
        name: 'Custom Avatar',
        id: 'av',
        userproperties: {
            hasAv: true
        },
        benefits: 'a custom avatar',
    },
};
exports.shop = shop;
