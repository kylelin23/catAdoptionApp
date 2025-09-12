import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function NewCatParents() {

  const [faq, setFAQ] = useState([
      // CHANGE THE FAQs OVER HERE
      ['What do I need for the first week?', 'Start out with the basics! Litter (and litter box), wet and dry food (and food and water bowls) and some simple toys! Key here is to not over buy.'],
      ['My cat is not eating, what do I do?', "It's common for cats to hide and not eat in new surroundings. Offer wet food as they're more likely to be enticed by the smell. Leave them alone and they're more likely to eat when no one is around."],
      ['How often should I be cleaning the litter box?', "At least once a day to make sure they're using the litter box and not constipated or dehydrated."],
      ["I can't find my cat!", "That happens to lots of new cat parents the first day! It helps to keep your cat contained in one room for the first week. But make sure there are covered cat beds or spaces for them to use and decompress."],
      ['My resident cat is hissing at our new cat', "There's not much to do here but give it time and take it slow. Continue to spend time with your resident cat so they don't feel threatened or sad that they may be losing you."],
      ["I can't sleep at night", "Cats are nocturnal and zoomies is the term we use when cats get their burst of energy at night! Over time, they will get used to your family's sleeping schedule and I promise, it will work itself out!"],
      ['Am I feeding enough? Too much?', 'Cats need different amounts of food at different phases. Kittens and nursing mothers need a lot more! Always check the suggested amount on the instructions listed on the dry and wet food and avoid overfeeding.'],
      ['Should I let my cat on the kitchen counter? Bed? Anywhere they want?', "Honestly, I haven't met anyone who's been successful at keeping their cat off counters or beds! If you're worried about germs, it's always a good idea to wipe down counters and avoid eating food directly from counters. As for the bed, they actually make great sleeping partners!"],
      ['How can I make my cat a lap cat?', "The key word here is 'make'. Cats are infamous for not being made to do anything and that is the truth, not a myth. Love your cats for who they are, not who you want them to be!"],
      ['Do I need to bathe my cat?', "Nope! Unless they got into a messy situation, cats are fussy about grooming themselves and keeping themselves clean. In fact, if they stop grooming, it's a sign of illness and time to watch out for what could be wrong."],
      ]);

  return (
    <View style = {styles.container}>
      <Text style = {styles.titleText}>New Cat Parents</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 50,
    textAlign: 'center'
  },

  container: {
    flex: 1,
    backgroundColor: 'rgb(154, 182, 212)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30
  },
});
