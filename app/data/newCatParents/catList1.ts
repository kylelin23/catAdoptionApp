type Item = {
    item: string;
    answer: string;
    fakeAnswer: string;
}

const food: Item[] = [ // Is it toxic ?
    {
        item: 'chocolate',
        answer: 'yes',
        fakeAnswer: 'yes',
    },
    {
        item: 'onions',
        answer: 'yes',
        fakeAnswer: 'yes',
    },
    {
        item: 'grapes',
        answer: 'yes',
        fakeAnswer: 'yes',
    },
    {
        item: 'rice',
        answer: 'no',
        fakeAnswer: 'yes',
    },
    {
        item: 'raisins',
        answer: 'yes',
        fakeAnswer: 'yes',
    },
    {
        item: 'garlic',
        answer: 'yes',
        fakeAnswer: 'yes',
    },
    {
        item: 'zucchini',
        answer: 'no',
        fakeAnswer: 'yes',
    },
    {
        item: 'raw yeast dough',
        answer: 'yes',
        fakeAnswer: 'yes',
    },
    {
        item: 'pasta',
        answer: 'no',
        fakeAnswer: 'no',
    },
    {
        item: 'raw eggs',
        answer: 'yes',
        fakeAnswer: 'no',
    },
    {
        item: 'alcohol',
        answer: 'yes',
        fakeAnswer: 'no',
    }
];

export default food;

export const plants: Item[] = [ // Is it toxic ?
    {
        item: 'orchid',
        answer: 'no',
        fakeAnswer: 'yes',
    },
    {
        item: 'spider plant',
        answer: 'no',
        fakeAnswer: 'yes',
    },
    {
        item: 'lilies',
        answer: 'yes',
        fakeAnswer: 'yes',
    },
    {
        item: 'sago palms',
        answer: 'yes',
        fakeAnswer: 'yes',
    },
    {
        item: 'daffodils',
        answer: 'yes',
        fakeAnswer: 'yes',
    },
    {
        item: 'cacti',
        answer: 'yes',
        fakeAnswer: 'yes',
    },
    {
        item: 'bamboo palm',
        answer: 'no',
        fakeAnswer: 'no',
    },
    {
        item: 'tulips',
        answer: 'yes',
        fakeAnswer: 'no',
    },
    {
        item: 'marijuana',
        answer: 'yes',
        fakeAnswer: 'no',
    },
];

export const householdItems: Item[] = [ // Is it toxic ?
    {
        item: 'aspirin',
        answer: 'yes',
        fakeAnswer: 'yes',
    },
    {
        item: 'paper towels',
        answer: 'no',
        fakeAnswer: 'yes',
    },
    {
        item: 'pesticide',
        answer: 'yes',
        fakeAnswer: 'yes',
    },
    {
        item: 'household cleaners',
        answer: 'yes',
        fakeAnswer: 'yes',
    },
    {
        item: 'human medications',
        answer: 'yes',
        fakeAnswer: 'yes',
    },
    {
        item: 'cotton balls',
        answer: 'no',
        fakeAnswer: 'yes',
    },
    {
        item: 'bleach',
        answer: 'yes',
        fakeAnswer: 'no',
    },
    {
        item: 'cardboard',
        answer: 'no',
        fakeAnswer: 'no',
    },
    {
        item: 'antifreeze',
        answer: 'yes',
        fakeAnswer: 'no',
    },
];


export const others: Item[] = [ // Is it toxic ?
    {
        item: 'catnip',
        answer: 'no',
        fakeAnswer: 'yes',
    },
    {
        item: 'flea and tick medication for dogs',
        answer: 'yes',
        fakeAnswer: 'yes',
    },
    {
        item: 'glow sticks',
        answer: 'yes',
        fakeAnswer: 'yes',
    },
    {
        item: 'LED candles',
        answer: 'no',
        fakeAnswer: 'yes',
    },
    {
        item: 'fertilizers',
        answer: 'yes',
        fakeAnswer: 'no',
    },
    {
        item: 'ping pong balls',
        answer: 'no',
        fakeAnswer: 'no',
    },
    {
        item: 'essential oils',
        answer: 'yes',
        fakeAnswer: 'no',
    },
];
