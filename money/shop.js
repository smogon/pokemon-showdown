var shop = {
tkt: {
price: 100,
tkts: 1,
name: 'Ticket',
id: 'tkt',
benefits: 'a ticket',
},
reel: {
    price: 500,
    name: 'TicketReel',
	tkts: 10,
    id: 'reel',
    benefits: 'a ticket reel (10)',
},
chest: {
    price: 5000,
    name: 'TicketChest',
	tkts: 100,
    id: 'chest',
    benefits: 'a ticket chest (50)',
 },
voice: {
   price: 50000,
   name: 'Voice',
   id: 'voice',
   promo: '+',
   benefits: 'a promotion to Voice', 
},
host: {
    price: 100000,
    name: 'Host',
    id: 'host',
    benefits: 'a promotion to Host', 
    promo: '$',
},
msg: {
    price: 50000,
    name: 'Message',
    //add: getRandmsg(),
    id:'msg',
    benefits: 'a random message',
},
name: {
    price: 10000,
    name: 'Name',
    id:'name',
    //say: '/superdupersekritnamechange',
    benefits: 'a random name change',
},
av: {
    price: 25000,
    name: 'Custom Avatar',
    id:'av',
    userproperties: {
        hasAv: true
        },
    benefits: 'a custom avatar',
},
};
exports.shop = shop;
