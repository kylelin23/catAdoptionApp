import { createStackNavigator } from "@react-navigation/stack";
import Start from "../(tabs)/index";
import Home from "../(tabs)/areYou";
import ThinkingOfAdopting from "../(tabs)/Categories/thinkingOfAdopting";
import NewCatParents from "../(tabs)/Categories/newCatParents";
import CatParents from "../(tabs)/Categories/catParents";
import CatLovers from "../(tabs)/Categories/catLovers";
import Pros from "../(tabs)/thinkingOfAdoptingInfo/pros";
import Cons from "../(tabs)/thinkingOfAdoptingInfo/cons";
import Preparation from '../(tabs)/newCatParentsInfo/preparation';
import Expect from '../(tabs)/newCatParentsInfo/expect';
import Checklist from "../../components/ui/catParents/checklist";
import CatList1 from '../(tabs)/catParentsInfo/checklist/catList1'
import CatLanguage from '../(tabs)/catParentsInfo/checklist/catLanguage'
import PoopMonitoring from '../(tabs)/catParentsInfo/checklist/poopMonitoring'

const StartingStack = createStackNavigator();

export default function App() {
  return (
    <StartingStack.Navigator
      initialRouteName="Start"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#c1d6f7",
        },
        headerTintColor: "black",
        headerBackTitle: "",
      }}
    >
      <StartingStack.Screen
        name="Start"
        component={Start}
        options={{ headerShown: false }}
      />
      <StartingStack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />

      <StartingStack.Screen
        name="Thinking of Adopting"
        component={ThinkingOfAdopting}
      />
      <StartingStack.Screen name="New Cat Parents" component={NewCatParents} />
      <StartingStack.Screen name="Cat Parents" component={CatParents} />
      <StartingStack.Screen name="Cat Lovers" component={CatLovers} />
      <StartingStack.Screen
        name="Pros"
        component={Pros}
        options={{ headerShown: true }}
      />
      <StartingStack.Screen
        name="Cons"
        component={Cons}
        options={{ headerShown: true }}
      />
      <StartingStack.Screen
        name="What to Buy in Preparation"
        component={Preparation}
        options={{ headerShown: true }}
      />
      <StartingStack.Screen
        name="What to Expect in the First Week"
        component={Expect}
        options={{ headerShown: true }}
      />
      <StartingStack.Screen
        name="Checklist"
        component={Checklist}
        options={{ headerShown: true }}
      />
      <StartingStack.Screen
        name="Toxic Foods, Plants and Items"
        component={CatList1}
        options={{ headerShown: true }}
      />
      <StartingStack.Screen
        name="Cat Language"
        component={CatLanguage}
        options={{ headerShown: true }}
      />
      <StartingStack.Screen
        name="Poop Monitoring Scores"
        component={PoopMonitoring}
        options={{ headerShown: true }}
      />
    </StartingStack.Navigator>
  );
}
