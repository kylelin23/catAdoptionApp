import { createStackNavigator } from '@react-navigation/stack';
import Start from '../(tabs)/index'
import Home from '../(tabs)/areYou'
import ThinkingOfAdopting from '../(tabs)/Categories/thinkingOfAdopting'
import NewCatParents from '../(tabs)/Categories/newCatParents'
import CatParents from '../(tabs)/Categories/catParents'
import CatLovers from '../(tabs)/Categories/catLovers'
import Pros from '../(tabs)/Categories/pros'
import Cons from '../(tabs)/Categories/cons'




const StartingStack = createStackNavigator();

export default function App (){
    return(
        <StartingStack.Navigator
            initialRouteName = "Start"
            screenOptions={{
                headerStyle: {
                backgroundColor: '#c1d6f7',
                },
                headerTintColor: 'black',
            }}
            >
            <StartingStack.Screen name = "Start" component = {Start} options = {{headerShown: false}}/>
            <StartingStack.Screen name = " " component = {Home} options = {{headerShown: false}}/>

            <StartingStack.Screen name = "  " component = {ThinkingOfAdopting} />
            <StartingStack.Screen name = "   " component = {NewCatParents} />
            <StartingStack.Screen name = "    " component = {CatParents} />
            <StartingStack.Screen name = "     " component = {CatLovers} />
            <StartingStack.Screen name = "Pros" component = {Pros} />
            <StartingStack.Screen name = "Cons" component = {Cons} />
        </StartingStack.Navigator>
    );
}