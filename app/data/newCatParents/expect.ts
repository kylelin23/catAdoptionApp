type Card = {
    category: string;
    bullet1: string;
    bullet2: string;
    bullet3: string;
    bullet4: string;
    bullet5: string;
};

const expectCards: Card[] = [
    {
        category: 'Food',
        bullet1: 'Hiding is their way of getting used to their new environment but most cats are very food motivated.',
        bullet2: "Place wet food out for them to entice them with the smell. Do not worry if they hide and don't eat right away.",
        bullet3: 'Cats love routines and schedules. Maintain the same feeding times for your cats.',
        bullet4: 'With multiple cats, monitor feeding or separate meals if needed to ensure all cats are eating properly',
        bullet5: "Brush your cat's teeth and get cat tooth gel to help prevent the formation of tartar.",
    },
    {
        category: 'Toys',
        bullet1: 'Do not leave strong or ribbon toys out when your cat is not supervised.',
        bullet2: 'If you have kittens, they need no urging to play. Get some tunnels or toy mice for them.',
        bullet3: 'Older cats may be shy but are still curious and watchful. Gently encourage them with a wand toy or a hide and seek toy.',
        bullet4: 'Cat TV? Turn on the cat channel to see if the birds and wildlife is holding their attention.',
        bullet5: 'If you already have another pet, take time before introducing them to each other. ',
    },
    {
        category: 'Litter',
        bullet1: "They may not poop the first day but to make sure they're eating, monitor their litter box activity.",
        bullet2: 'Cats instinctinvely know how to use the litter box. Just show them where it is and let their instincts take over!',
        bullet3: 'If you have more than one cat, it may be best to change out the cat litter more often, like every 2 weeks.',
        bullet4: 'If you want to transition to new litter begin mixing in the new litter with the old.',
        bullet5: '',
    },
    {
        category: 'Furniture',
        bullet1: 'If you notice scratch marks on any furniture, that would be a sure sign to start placing your scratchers there.',
        bullet2: "Cat fur should be soft and shiny and not matted. This is a good time to get familiar with your cat's fur health.",
        bullet3: 'Put the bed away from other pets and away from high traffic areas.',
        bullet4: 'By the end of Week 1, your cat may already have settled into a comfy place for bedtime.',
        bullet5: "If your cat is super friendly and wants to sleep on your bed with you, now's the time to decide if that's something you're comfortable with.",
    },
];

export default expectCards;