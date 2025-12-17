type Card = {
    category: string;
    bullet1: string;
    bullet2: string;
    bullet3: string;
    bullet4: string;
    bullet5: string;
};

const prepCards: Card[] = [
    {
        category: 'Food',
        bullet1: 'Check what your cat is currently eating (from foster home or shelter) and transition food slowly over 7–10 days',
        bullet2: 'Use a mix of dry and wet food to give your cats variety and benefits that come from both',
        bullet3: 'Place multiple water bowls around the home to encourage hydration',
        bullet4: 'Pick up some lickable treats to help you bond and socialize with your new cat!',
        bullet5: 'Consider a water fountain—running water can encourage drinking',
    },
    {
        category: 'Toys',
        bullet1: 'I love toys! It helps me stay active and decreases boredom.',
        bullet2: 'Avoid items with small attachments that could break off and be swallowed.',
        bullet3: 'Laser pointers - the verdict is not final on this one. Safe to use for a short amount of time!',
        bullet4: 'Simple household items like cardboard boxes, balls, and paper shopping bags can make great toys',
        bullet5: '',
    },
    {
        category: 'Litter',
        bullet1: 'Check what your cat is currently using for litter at their foster home or shelter and transition slowly over 7–10 days',
        bullet2: 'There are different types of litter. Choose unscented over scented.',
        bullet3: 'Cats have a strong sense of smell and can be sensitive to scents.',
        bullet4: 'Automatic litter boxes are also a good option for those who may not be home for long stretches of time.',
        bullet5: 'We recommend multiple boxes for multiple cats.',
    },
    {
        category: 'Furniture',
        bullet1: 'Get both vertical and horizontal scratchers, although cats may end up preferring one over the other.',
        bullet2: 'Place some catnip on the scratching posts to attract them to use it.',
        bullet3: 'Cats will want to hide when they get to a new environment. Start out with getting a cave-like covered bed.',
        bullet4: 'Get a nail trimmer and brush! ',
        bullet5: "If it's the winter, heated cat beds or self-warming cat mats may be a good idea!",
    },
];

export default prepCards;