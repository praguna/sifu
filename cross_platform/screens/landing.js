import React, { Component } from 'react'
import { View, FlatList,ScrollView, Text, StyleSheet, Button, TouchableOpacity, Image, SafeAreaView } from 'react-native'
import {SearchBar} from 'react-native-elements'
import Constants from 'expo-constants';
import { StackActions } from '@react-navigation/native';
import firebase from '../firebase';
import AsyncStorage from '@react-native-community/async-storage'
import { env } from "../config";
// import { ScrollView } from 'react-native-gesture-handler';

const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      recipeName: 'Palya',
      comment: 'Tasty recipe!!',
      filePath: require('../assets/picture1.jpg')
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      recipeName: 'Dosa',
      comment: 'Yummy recipe..',
      filePath: require('../assets/picture2.jpg')
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      recipeName: 'Upma',
      comment: 'Nice recipe',
      filePath: require('../assets/picture3.jpg')
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d74',
        recipeName: 'Rice',
        comment: 'Tasty recipe',
        filePath: require('../assets/picture1.jpg')
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d78',
        recipeName: 'Poha',
        comment: 'Yummy recipe!',
        filePath: require('../assets/picture2.jpg')
    },

  ];

export class LandingComponent extends Component {

    state = {
        username: '',
        userID: '',
        isLoaded: false,
        recipes: []
    }

    constructor(props){  
        super(props);
        AsyncStorage.getItem('username').then(value =>
            this.setState({ username: value })
        );
        AsyncStorage.getItem('userID').then(value =>
            {
                this.setState({ userID: value });
            }
        ).then(() => {
            this.getPopularRecipeImages()
            .then(() => {
                this.setState({ isLoaded: true });
            });
        });
    }
    handleSignout = (navigation) => {
        firebase.auth().signOut().then(function () {
            navigation.dispatch(StackActions.replace('Login'))
        })
        console.log("Signed Out Successfully!")
    }
    render() {
        //console.log(this.state.recipes);
        if(this.state.isLoaded){
        return (
            <ScrollView style={styles.container}>
                <View style={StyleSheet.heading}>
                    <View style={styles.new_section}>
                        




                            <Button title="Sign Out" onPress={this.handleSignout.bind(this, this.props.navigation)} />
                        </View>
                        {/* <Text> Recommended Recipes</Text> */}
                        <SearchBar        
                            placeholder="Search for Recipes"        
                            lightTheme        
                            round        
                            
                            autoCorrect={false}             
                        />
                        <FlatList data = {this.state.recipes} 
                            renderItem = {({item})=><View>
                                <TouchableOpacity key={item.Name} style={{ margin:5, width:"100%", alignSelf: "center" }} activeOpacity={.5} onPress={() => {
                                        this.props.navigation.push('Recipe', {recipe: item})
                                    }}>
                                        <View style={styles.listitems}>
                                            <Text style={{marginTop:36}} >{item.Name}</Text>
                                            <Image style={{ margin:10, height:70, width:70, borderRadius: 35 }} source={item.image} />
                                        </View>
                                    </TouchableOpacity>
                                </View>

                            }
                            
            />
                        
                    </View>                    
                {/* </View> */}

                
            </ScrollView>
        )
        }
        return null
    }

    getPopularRecipeImages = () => { 
        return fetch(env.server+"recommend?userID="+this.state.userID,{
            method: "GET"
        })
        .then((response) => response.json())
        .then( (json) => {
            this.setState({ recipes: json.recipes });
            console.log(json.recipes)
        }).catch((error) => console.log(error))
    }
}


const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // marginTop: Constants.statusBarHeight,
        backgroundColor:"#E1E8EE",
        height:"100%",
        width:"100%"
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    heading: {
        fontSize: 1
    },
    new_section: {
        padding: 20,
    },
    listitems:{
        flex:1,
        flexDirection: "row-reverse",
        backgroundColor: '#bdc6cf',
        alignSelf: "center",
        justifyContent: "flex-end",
        padding:5,
        borderRadius:15,
        width: "80%"
    }
});