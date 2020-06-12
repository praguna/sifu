import React, { Component } from 'react'
import { View, FlatList, Text, StyleSheet, Button, TouchableOpacity, Image } from 'react-native'


// Populate DATA with data from the backend, must include fields: id, comments, username
// Get the ratings and comments data from the name of the recipe that is passed to this component
const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      username: 'User1',
      comment: 'Tasty recipe!!'
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      username: 'User2',
      comment: 'Yummy recipe..'
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      username: 'User3',
      comment: 'Nice recipe'
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d74',
        username: 'User4',
        comment: 'Tasty recipe'
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d78',
        username: 'User5',
        comment: 'Yummy recipe!'
    },

  ];
  
export default class UserRating extends Component {
    render() {
        return(
            <View>
                <FlatList                
                    data={DATA}
                    renderItem={({ item }) => 
                    <View style ={styles.rating_style} >
                        <Text style = {{marginBottom:10, fontWeight: '600'}}> Username: {item.username} </Text>
                        <Text style = {{marginBottom:10, fontWeight: '600'}}> Ratings:</Text>
                        <Text style = {{marginBottom:10, fontWeight: '600'}}> Comments:</Text>
                        <Text> {item.comment}</Text>
                    </View>}
                    keyExtractor={item => item.id}
                />
                
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    rating_style :{
        width:"90%",
        borderWidth: 2,
        borderRadius:5,
        alignSelf: "center",
        padding:10,
        marginLeft:35,
        marginBottom:10,
        backgroundColor:"#FEFFFE"
    }
});