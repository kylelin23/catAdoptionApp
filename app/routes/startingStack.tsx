import { createStackNavigator } from '@react-navigation/stack';
import Home from '../(tabs)/index'
import AreYou from '../(tabs)/areYou'
import ThinkingOfAdopting from '../(tabs)/Categories/thinkingOfAdopting'
import NewCatParents from '../(tabs)/Categories/newCatParents'
import CatParents from '../(tabs)/Categories/catParents'
import CatLovers from '../(tabs)/Categories/catLovers'
import TOAFAQ from '../(tabs)/thinkingOfAdopting/toaFAQ'
import TOATRIVIA from '../(tabs)/thinkingOfAdopting/toaTrivia'
import TOAWHATTOEXPECT from '../(tabs)/thinkingOfAdopting/toaWhatToExpect';
import NewCatParentsFAQ from '../(tabs)/newCatParents/newCatParentsFAQ'
import NewCatParentsTrivia from '../(tabs)/newCatParents/newCatParentsTrivia'
import NewCatParentsWhatToExpect from '../(tabs)/newCatParents/newCatParentsWhatToExpect';
import CatParentsFAQ from '../(tabs)/catParents/catParentsFAQ'
import CatParentsTrivia from '../(tabs)/catParents/catParentsTrivia'
import CatParentsWhatToExpect from '../(tabs)/catParents/catParentsWhatToExpect';
import CatLoversFAQ from '../(tabs)/catLovers/catLoversFAQ'
import CatLoversTrivia from '../(tabs)/catLovers/catLoversTrivia'
import CatLoversWhatToExpect from '../(tabs)/catLovers/catLoversWhatToExpect';

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

            <StartingStack.Screen name = "Thinking of Adopting: FAQs" component = {TOAFAQ} options = {{headerShown: true}} />
            <StartingStack.Screen name = "Thinking of Adopting: Trivia" component = {TOATRIVIA} options = {{headerShown: true}} />
            <StartingStack.Screen name = "Thinking of Adopting: What to Expect" component = {TOAWHATTOEXPECT} options = {{headerShown: true}} />

            <StartingStack.Screen name = "New Cat Parents: FAQs" component = {NewCatParentsFAQ} options = {{headerShown: true}} />
            <StartingStack.Screen name = "New Cat Parents: Trivia" component = {NewCatParentsTrivia} options = {{headerShown: true}} />
            <StartingStack.Screen name = "New Cat Parents: What to Expect" component = {NewCatParentsWhatToExpect} options = {{headerShown: true}} />

            <StartingStack.Screen name = "Cat Parents: FAQs" component = {CatParentsFAQ} options = {{headerShown: true}} />
            <StartingStack.Screen name = "Cat Parents: Trivia" component = {CatParentsTrivia} options = {{headerShown: true}} />
            <StartingStack.Screen name = "Cat Parents: What to Expect" component = {CatParentsWhatToExpect} options = {{headerShown: true}} />

            <StartingStack.Screen name = "Cat Lovers: FAQs" component = {CatLoversFAQ} options = {{headerShown: true}} />
            <StartingStack.Screen name = "Cat Lovers: Trivia" component = {CatLoversTrivia} options = {{headerShown: true}} />
            <StartingStack.Screen name = "Cat Lovers: What to Expect" component = {CatLoversWhatToExpect} options = {{headerShown: true}} />
        </StartingStack.Navigator>
    );
}