import React ,{Component} from 'react'
import {View , FlatList , Text , StyleSheet} from 'react-native'
import Constants from 'expo-constants';

export class DisplayComponent extends Component{
    render(){
        const {Data} = this.props.route.params.data
        console.log(this.props.route.params.data)
        return (
            <View style={StyleSheet.container}>
                <Text style = {StyleSheet.heading}> Recommended Recipes : </Text>
                <FlatList 
                    data = {this.props.route.params.data}
                    renderItem={({ item })=> <Text style={styles.item}>{item}</Text>}
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