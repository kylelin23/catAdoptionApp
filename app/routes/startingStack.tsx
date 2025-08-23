import { createStackNavigator } from '@react-navigation/stack';
import Home from '../(tabs)/index'
import AreYou from '../(tabs)/areYou'
import ThinkingOfAdopting from '../(tabs)/Categories/thinkingOfAdopting'
import NewCatParents from '../(tabs)/Categories/newCatParents'
import CatParents from '../(tabs)/Categories/catParents'
import CatLovers from '../(tabs)/Categories/catLovers'

const StartingStack = createStackNavigator();

export default function App (){
    return(
        <StartingStack.Navigator initialRouteName = "Home">
            <StartingStack.Screen name = "Home" component = {Home} options = {{headerShown: false}}/>
            <StartingStack.Screen name = "Are You" component = {AreYou} options = {{headerShown: false}}/>
            <StartingStack.Screen name = "Thinking of Adopting" component = {ThinkingOfAdopting} options = {{headerShown: true}}/>
            <StartingStack.Screen name = "New Cat Parents" component = {NewCatParents} options = {{headerShown: true}}/>
            <StartingStack.Screen name = "Cat Parents" component = {CatParents} options = {{headerShown: true}}/>
            <StartingStack.Screen name = "Cat Lovers" component = {CatLovers} options = {{headerShown: true}}/>
        </StartingStack.Navigator>
    );
}