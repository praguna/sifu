import React, { PureComponent } from 'react';
import {CameraComponent} from  './screens/camera'
import {DisplayComponent} from './screens/display'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack  = createStackNavigator()

export default class SifuMobileApp extends PureComponent {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen name="Camera" component={CameraComponent}/>
        <Stack.Screen name="Display" component={DisplayComponent}/>
       </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
