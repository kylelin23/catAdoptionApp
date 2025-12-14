type Trivia = {
    question: string;
    answer1: string;
    answer2: string;
    answer3: string;
}

const quiz: Trivia[] = [
    {
        question: '1. Can you comfortably afford recurring expenses like food, litter, toys, and vet care (~$50 to $100/month)?',
        answer1: "A. Yes I've budgeted for it",
        answer2: 'B. I could make it work',
        answer3: 'C. Not really sure'
    },

    {
        question: '2. What if your cat needs a $500+ emergency procedure?',
        answer1: 'A. I have savings or plan to get pet insurance',
        answer2: 'B. I might panic but will find a way',
        answer3: 'C. I would have to loan from my family or friends'
    },

    {
        question: '3. Are you prepared for annual costs such as vaccinations, check-ups, flea meds, or pet-sitting?',
        answer1: "A. Yes, I'm prepared for it",
        answer2:  "B. It's on my mind",
        answer3: 'C. Not really'
    },

    {
        question: '4. Cats can live 15 to 20 years. Are you ready for that length of commitment?',
        answer1: "A. Yes, I'm in it for the long haul",
        answer2: "B. Sounds a bit daunting but I'm ready",
        answer3: "C. Errrr... I can't plan past 2 years"
    },

    {
        question: '5. How often are you away from home (work, travel, social life)?',
        answer1: "A. I'm home most days",
        answer2: "B. I'm out but there's always someone else home",
        answer3: "C. I travel for my work and don't have too much backup"
    },

    {
        question: '6. Cats are independent but need loving care and attention daily. Are you ready to provide love and attention?',
        answer1: "A. Can't wait to pour my love onto a cat and open my heart",
        answer2: 'B. I see myself just as a caregiver',
        answer3: "C. Adopting a cat isn't for me, it's for someone else in the family!"
    },

    {
        question: '7. How do you feel about cleaning up messes like hairballs or the occasional accident?',
        answer1: "A. Doesn’t bother me",
        answer2: "B. I’ll manage",
        answer3: 'C. Ugghhsss, no thanks'
    },

    {
        question: '8. Are you willing to adjust your home (e.g., furniture, closed doors, scratching posts)?',
        answer1: "A. Absolutely, I can't wait",
        answer2: 'B. Somewhat... ',
        answer3: "C. I'm not ready to adjust at all"
    },

    {
        question: '9. What if your cat scratches your favorite couch or wakes you at 3am or you develop allergies?',
        answer1: 'A. Not a big deal at all',
        answer2: "B. I'll get over it",
        answer3: 'C. Cat will have to go'
    }
]

export default quiz;