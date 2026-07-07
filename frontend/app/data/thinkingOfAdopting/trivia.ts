type Trivia = {
  question: string;
  answer1: string;
  answer2: string;
  answer3: string;
};

const quiz: Trivia[] = [
  {
    question:
      "1. Can you com\u00ADfort\u00ADably af\u00ADford re\u00ADcur\u00ADring ex\u00ADpenses like food, lit\u00ADter, and toys (~$100 to $200/month)?",
    answer1: "A. Yes I've budg\u00ADeted for it",
    answer2: "B. I could make it work",
    answer3: "C. Not really sure",
  },

  {
    question:
      "2. What if your cat needs a $5000+ emer\u00ADgency pro\u00ADced\u00ADure?",
    answer1: "A. I have sav\u00ADings or plan to get pet in\u00ADsur\u00ADance",
    answer2: "B. I might pan\u00ADic but will find a way",
    answer3: "C. I would have to loan from my fam\u00ADily or friends",
  },

  {
    question:
      "3. Are you pre\u00ADpared for an\u00ADnu\u00ADal costs such as vac\u00ADcin\u00ADa\u00ADtions, check-ups, flea meds, or pet-sit\u00ADting?",
    answer1: "A. Yes, I'm pre\u00ADpared for it",
    answer2: "B. It's on my mind",
    answer3: "C. Not really",
  },

  {
    question:
      "4. Cats can live 15 to 20 years. Are you ready for that length of com\u00ADmit\u00ADment?",
    answer1: "A. Yes, I'm in it for the long haul",
    answer2: "B. Sounds a bit daunt\u00ADing but I'm ready",
    answer3: "C. Er\u00ADrrr... I can't plan past 2 years",
  },

  {
    question:
      "5. How of\u00ADten are you away from home (work, trav\u00ADel, so\u00ADcial life)?",
    answer1: "A. I'm home most days",
    answer2: "B. I'm out but there's al\u00ADways some\u00ADone else home",
    answer3:
      "C. I trav\u00ADel for my work and don't have too much back\u00ADup",
  },

  {
    question:
      "6. Cats are in\u00ADde\u00ADpend\u00ADent but need lov\u00ADing care daily. Are you ready to pro\u00ADvide love and at\u00ADten\u00ADtion?",
    answer1: "A. Can't wait to pour my love on\u00ADto a cat",
    answer2: "B. I see my\u00ADself just as a care\u00ADgiv\u00ADer",
    answer3:
      "C. Adopt\u00ADing a cat isn't for me, it's for some\u00ADone else in the fam\u00ADily!",
  },

  {
    question:
      "7. How do you feel about clean\u00ADing up messes like hair\u00ADballs or the oc\u00ADca\u00ADsion\u00ADal ac\u00ADcid\u00ADent?",
    answer1: "A. Doesn't both\u00ADer me",
    answer2: "B. I'll man\u00ADage",
    answer3: "C. Ugghhsss, no thanks",
  },

  {
    question:
      "8. Are you will\u00ADing to ad\u00ADjust your home (e.g., fur\u00ADnit\u00ADure, closed doors, scratch\u00ADing posts)?",
    answer1: "A. Ab\u00ADso\u00ADlutely, I can't wait",
    answer2: "B. Some\u00ADwhat... ",
    answer3: "C. I'm not ready to ad\u00ADjust at all",
  },

  {
    question:
      "9. What if your cat scratches your fa\u00ADvor\u00ADite couch or wakes you at 3am or you de\u00ADvel\u00ADop al\u00ADler\u00ADgies?",
    answer1: "A. Not a big deal at all",
    answer2: "B. I'll get over it",
    answer3: "C. Cat will have to go",
  },
];

export default quiz;
