import React ,{Component} from 'react'
import {View , FlatList , Text , StyleSheet} from 'react-native'
import Constants from 'expo-constants';

export class DisplayComponent extends Component{
    constructor(props) {
        super(props);
        this.state = {
            recipes: this.props.route.params.recipes
        }
    }

    render(){
        console.log("display")
        //console.log(this.state.recipes)
        return (
            <View style={StyleSheet.container}>
                <Text style = {StyleSheet.heading}> Recommended Recipes : </Text>
                    <FlatList 
                        data = {this.state.recipes}
                        renderItem={({ item })=>
                                <Text 
                                style={styles.item}
                                onPress={() => {
                                    this.props.navigation.push('Recipe', {recipe: item})
                                    this.props.navigation.navigate('Recipe')
                                }}
                                >{item.Name}</Text>
                        }
                    />
            </View>   
        )
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: Constants.statusBarHeight,
    },
    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    heading :{
        marginVertical: 8,
        marginHorizontal: 16,
        fontSize : 1
    }
  });