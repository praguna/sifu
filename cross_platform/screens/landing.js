import React, { Component } from 'react'
import { View, FlatList,ScrollView, Text, StyleSheet, Button, TouchableOpacity, Image, SafeAreaView } from 'react-native'
import {SearchBar} from 'react-native-elements'
import Constants from 'expo-constants';
import { StackActions } from '@react-navigation/native';
import firebase from '../firebase';
import AsyncStorage from '@react-native-community/async-storage'
import { env } from "../config";
// import { ScrollView } from 'react-native-gesture-handler';

console.disableYellowBox = true;

export class LandingComponent extends Component {

    state = {
        username: '',
        userID: '',
        isLoaded: false,
        isShowingSearchResult: false,
        recipes: [],
        recommendedRecipes: [],
        search: '',
        searchData: []
    }

    constructor(props){  
        super(props);
        if(typeof this.props.route.params !== "undefined"){
            this.setState({ 
                username : this.props.route.params.username,
                userID : this.props.route.params.userID,
                recipes : this.props.route.params.response.recipes,
                recommendedRecipes: this.props.route.params.response.recipes,
                isLoaded: true})
        }

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
        const { search } = this.state;
        if(this.state.isLoaded){
        return (
            <ScrollView style={styles.container}>
                <View style={StyleSheet.heading}>
                    <View style={styles.new_section}>
                        <Text> Welcome {this.state.username} </Text>
                        
                        <View style={{flexDirection:"row", justifyContent:"space-evenly"}}>
                            <Button title="Take a Picture" onPress={() => { this.props.navigation.navigate('Camera',
                            {username:this.state.username, userID:this.state.userID});}} />
                            <Button title="Sign Out" onPress={this.handleSignout.bind(this, this.props.navigation)} />
                        </View>
                        {/* <Text> Recommended Recipes</Text> */}
                        <SearchBar        
                            placeholder="Search for Recipes"        
                            lightTheme        
                            round        
                            onChangeText={text => this.searchFilterFunction(text)}
                            autoCorrect={false} 
                            value={search}            
                        />
                        <Text style ={{alignSelf:"center"}} > Recommended Recipes : </Text>
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
                            keyExtractor={item => item.Name}
            />
                        
                    </View>                    
                </View>

                
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
            this.setState({ recommendedRecipes: json.recipes });
            // console.log(json.recipes)
        }).catch((error) => console.log(error))
    }

    searchFilterFunction = text => { 
        this.setState({ search: text });
        fetch(env.server+"search?query="+text,{
            method: "GET"
        })
        .then((response) => response.json())
        .then((json) => {
            if(json.queryResult.length == 0){
                this.setState({recipes: this.state.recommendedRecipes});
            }else {
                this.setState({ recipes: json.queryResult }); 
            }
        }) 
      };
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