type Con = {
    category: string;
    support1: string;
    support2: string;
    support3: string;
}

const cons: Con[] = [
  {
    category: "Cost",
    support1: "As with all pets, vet visits are the bulk of the expenses",
    support2: "Ongoing costs include food, litter, toys and vaccinations",
    support3: "Pet insurance is optional but will help during unexpected visits"
  },
  {
    category: "Commitment",
    support1: "Cats are family and can live for 15-20 years",
    support2: "Cats will fall sick and need at-home care with medication",
    support3: "While independent, cats also need playtime and bonding time"
  },
  {
    category: "Change",
    support1: "Be prepared to adapt your lifestyle to include your cat",
    support2: "Finding a reliable pet sitter while travelling",
    support3: "Cats will shed, throw up hairballs and scratch furniture"
  }
];

export default cons;