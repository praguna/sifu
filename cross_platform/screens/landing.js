import React, { Component } from 'react'
import { View, FlatList, Text, StyleSheet, Button, TouchableOpacity, Image } from 'react-native'
import Constants from 'expo-constants';
import { StackActions } from '@react-navigation/native';
import firebase from '../firebase';
import AsyncStorage from '@react-native-community/async-storage'
import { env } from "../config";

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
            <View style={StyleSheet.container}>
                <View style={StyleSheet.heading}>
                    <View style={styles.new_section}>
                        <Text> Welcome {this.state.username} </Text>
                        <Text> Recommended Recipes : </Text>

                        {/* This is placeholder images for top 3 dishes  */}
                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                            {
                                this.state.recipes.map((item, key) => (
                                    <TouchableOpacity key={key} style={{ flex: 1 }} activeOpacity={.5} onPress={() => {
                                        this.props.navigation.push('Recipe', {recipe: item})

                                        this.props.navigation.navigate('Recipe')
                                    }}>
                                        <Image style={{ width: 100, height: 100 }} source={item.image} />
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                    </View>

                    {/* Fetch and Display Breakfast recipes from backend */}
                    <View style={styles.new_section} >
                        <Text> Breakfast Recipes: </Text>
                    </View>

                    {/* Fetch and Display Lunch recipes from backend */}
                    <View style={styles.new_section} >
                        <Text> Lunch Recipes: </Text>
                    </View>

                    <View style={styles.new_section} >
                        <Text> Dinner Recipes: </Text>
                    </View>
                </View>

                <FlatList
                    // data = {this.props.route.params.data}
                    renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
                />
                <View style={{ paddingTop: 250 }}>
                    <Button title="Take a Picture" onPress={() => { this.props.navigation.navigate('Camera'); }} />
                </View>
                <Button title="Sign Out" onPress={this.handleSignout.bind(this, this.props.navigation)} />
            </View>
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
        }).catch((error) => console.log(error))
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
    heading: {
        fontSize: 1
    },
    new_section: {
        padding: 20,
    }
});