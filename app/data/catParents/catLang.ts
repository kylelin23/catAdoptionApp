type Card = {
    title: string;
    happy: string;
    loving: string;
    excited: string;
    angry: string;
};

const cards: Card[] = [
    {
        title: 'Eyes',
        happy: 'almond shaped or sliver shaped pupils',
        loving: 'slow blinking',
        excited: 'widened, with dilated pupils',
        angry: 'wide and dilated'
    },
    {
        title: 'Ears',
        happy: 'neutral position',
        loving: 'neutral position',
        excited: 'shifted forward or reversed',
        angry: 'flattened or airplane ears'
    },
    {
        title: 'Whiskers',
        happy: 'neutral position',
        loving: 'neutral position',
        excited: 'forward and fanned out',
        angry: 'flattened against face'
    },
    {
        title: 'Body',
        happy: 'loose and curved',
        loving: 'rolling or kneading biscuits',
        excited: 'loose and relaxed',
        angry: 'arched and tense, with fur standing up, tightly bound, and limbs tucked'
    },
    {
        title: 'Tail',
        happy: 'loosely positioned, down or curved forward',
        loving: 'loosely positioned, down or curved forward',
        excited: 'upright and possibly quivering at the tip or held lower and swishing',
        angry: 'puffed up and quick swishing or tucked under the body'
    },
    {
        title: 'Sounds',
        happy: 'meowing or trilling',
        loving: 'purring',
        excited: 'chittering (hunting mode)',
        angry: 'yowling'
    }
];

export default cards;