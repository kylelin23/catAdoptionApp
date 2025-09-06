import { createStackNavigator } from '@react-navigation/stack';
import Start from '../(tabs)/index'
import Home from '../(tabs)/areYou'
import ThinkingOfAdopting from '../(tabs)/Categories/thinkingOfAdopting'
import NewCatParents from '../(tabs)/Categories/newCatParents'
import CatParents from '../(tabs)/Categories/catParents'
import CatLovers from '../(tabs)/Categories/catLovers'

const StartingStack = createStackNavigator();

export default function App (){
    return(
        <StartingStack.Navigator initialRouteName = "Start">
            <StartingStack.Screen name = "Start" component = {Start} options = {{headerShown: false}}/>
            <StartingStack.Screen name = "Home" component = {Home} options = {{headerShown: false}}/>

            <StartingStack.Screen name = "Thinking of Adopting" component = {ThinkingOfAdopting} options = {{headerShown: false}}/>
            <StartingStack.Screen name = "New Cat Parents" component = {NewCatParents} options = {{headerShown: false}}/>
            <StartingStack.Screen name = "Cat Parents" component = {CatParents} options = {{headerShown: false}}/>
            <StartingStack.Screen name = "Cat Lovers" component = {CatLovers} options = {{headerShown: false}}/>
        </StartingStack.Navigator>
    );
}