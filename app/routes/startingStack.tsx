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
                headerBackTitle: '',
            }}
            >
            <StartingStack.Screen name = "Start" component = {Start} options = {{headerShown: false}} />
            <StartingStack.Screen name = "Home" component = {Home} options = {{headerShown: false}} />

            <StartingStack.Screen name = "Thinking of Adopting" component = {ThinkingOfAdopting} />
            <StartingStack.Screen name = "New Cat Parents" component = {NewCatParents} />
            <StartingStack.Screen name = "Cat Parents" component = {CatParents} />
            <StartingStack.Screen name = "Cat Lovers" component = {CatLovers} />
            <StartingStack.Screen name = "Pros" component = {Pros} />
            <StartingStack.Screen name = "Cons" component = {Cons} />
        </StartingStack.Navigator>
    );
}