type Trivia = {
  question: string;
  answer1: string;
  answer2: string;
  answer3: string;
};

export const answers = ["b", "c", "a", "b", "b", "c", "a", "b", "b", "a"];

const quiz: Trivia[] = [
  {
    question: "1. What does it mean when a cat shows you its belly?",
    answer1: "A. It's sick",
    answer2: "B. It trusts you",
    answer3: "C. It wants food",
  },
  {
    question: "2. How many toes does a typ\u00ADic\u00ADal cat have?",
    answer1: "A. 20",
    answer2: "B. 12",
    answer3: "C. 18",
  },
  {
    question:
      "3. What part of a cat's body is as unique as a hu\u00ADman fin\u00ADger\u00ADprint?",
    answer1: "A. Its nose",
    answer2: "B. Its toe bean",
    answer3: "C. Its tail",
  },
  {
    question:
      "4. What is it com\u00ADmonly called when cats knead with their paws?",
    answer1: "A. Milk\u00ADing",
    answer2: "B. Mak\u00ADing bis\u00ADcuits",
    answer3: "C. Hunt\u00ADing",
  },
  {
    question: "5. How high can the av\u00ADer\u00ADage cat jump?",
    answer1: "A. Three times its height",
    answer2: "B. Six times its height",
    answer3: "C. Ten times its height",
  },
  {
    question:
      "6. Which city is known as the City of Cats for its large pop\u00ADu\u00ADla\u00ADtion of com\u00ADmun\u00ADity cats?",
    answer1: "A. Aoshi\u00ADma, Ja\u00ADpan",
    answer2: "B. Kuch\u00ADing, Ma\u00ADlay\u00ADsia",
    answer3: "C. Is\u00ADtan\u00ADbul, Turkey",
  },
  {
    question: "7. What can cats NOT taste?",
    answer1: "A. Sweet",
    answer2: "B. Spicy",
    answer3: "C. Sour",
  },
  {
    question:
      "8. What's the av\u00ADer\u00ADage ges\u00ADta\u00ADtion\u00ADal peri\u00ADod for a cat?",
    answer1: "A. One month",
    answer2: "B. Two months",
    answer3: "C. Three months",
  },
  {
    question:
      "9. Which of the fol\u00ADlow\u00ADing is con\u00ADsidered a rare breed?",
    answer1: "A. Fe\u00ADmale cali\u00ADcos",
    answer2: "B. Male cali\u00ADcos",
    answer3: "C. Maine coons",
  },
  {
    question: "10. What does it mean when a cat gives you a slow blink?",
    answer1: "A. It loves you",
    answer2: "B. It's sleepy",
    answer3: "C. It's sick",
  },
];

export default quiz;
