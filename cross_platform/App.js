import React, { PureComponent } from 'react';
import {CameraComponent} from  './screens/camera'
import {DisplayComponent} from './screens/display'
import {LoginComponent} from './screens/login'
import {LandingComponent} from './screens/landing'
import {RecipeComponent} from './screens/recipe'
import {SignupComponent} from './screens/signup'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserFeedBack } from './screens/userfeedback';

const Stack  = createStackNavigator()

export default class SifuMobileApp extends PureComponent {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen name = "Login" component = {LoginComponent} options={{title:'Welcome to SIFU'}} />
        <Stack.Screen name = "Landing" component = {LandingComponent} options={{ title: 'Home', headerLeft: null }}/>
        <Stack.Screen name = "Recipe" component = {RecipeComponent} />
        <Stack.Screen name = "Camera" component={CameraComponent}/>
        <Stack.Screen name = "Display" component={DisplayComponent}/>
        <Stack.Screen name = "Signup" component={SignupComponent}/>
        <Stack.Screen name = "UserFeedBack" component={UserFeedBack} options={{title:'User Feedback'}}/>
       </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
