import React, { Component } from "react";
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, FlatList } from "react-native";
import Constants from "expo-constants";
import UserRating from "./rating"
import CommentModal from "./modal";
import AsyncStorage from '@react-native-community/async-storage'
import { env } from "../config";

const defimg = require('../assets/default.jpg');

export class RecipeComponent extends Component {
    state = {
        username: '',
        userID: '',
        isCommentsLoaded : false,
        recipe: this.props.route.params.recipe,
        reviews: []
    }
    constructor(props) {
        super(props);
        AsyncStorage.getItem('username').then(value =>
            this.setState({ username: value })
        );
        AsyncStorage.getItem('userID').then(value =>
            {
                this.setState({ userID: value });
            }
        ).then(() => {
            this.getUserComments()
            .then(() => {
                this.setState({ isCommentsLoaded: true });
            });
        });
        
    }
    render() {
        // const {Data} = this.props.route.params.data
        // console.log(this.props.route.params.data)
        if(this.state.isCommentsLoaded){
            return (
                <ScrollView style={{backgroundColor:"#E1E8EE"}}>
                    <View>
                        {/* Recipe 1 is a placeholder, Change the name dynamically */}
                        <Text style={{ fontSize: 20, fontWeight: '400',padding: 20, alignSelf: "center" }}> {this.state.recipeName} </Text>
                        <View style={{ paddingLeft: 20 }}>
                            <Image
                                style={{ width: 375, height: 200 }}
                                source={this.state.recipe.image}
                            />
                        </View>
    
                        {/* Fetch following from backend */}
                        <Text style={styles.recipe_label}>How to Prepare {this.state.recipe.Name} </Text>
                        <Text style={styles.recipe_label}>Ingredients: </Text><Text style={styles.recipe_text}> {this.state.recipe.Ingredients}</Text>
                        <Text style={styles.recipe_label}>Preparation: </Text><Text style={styles.recipe_text}> {this.state.recipe.Preparation}</Text>
                        <Text style={styles.recipe_label}>Method: </Text><Text style={styles.recipe_text}>{this.state.recipe.Method}</Text>
                    </View>
                    <Text style={{alignSelf:"center", fontWeight:"700"}}>Want to leave a comment? Click Below!</Text>
                    <CommentModal recipeName={this.state.recipe.Name} userID={this.state.userID} />
                    <View style={{ width: "90%" }} >
                        <Text style={styles.recipe_label}> Customer Ratings for {this.state.recipe.Name} </Text>
    
                        {/* Pass recipe name as params to the CustomerRating component */}
                        {/* <UserRating /> */}
                        <FlatList                
                        data={this.state.reviews}
                        renderItem={({ item }) => 
                        <View style ={styles.rating_style} >
                            <Text style = {{marginBottom:10, fontWeight: '600'}}> Username: {item.ReviewID} </Text>
                            <Text style = {{marginBottom:10, fontWeight: '600'}}> Ratings: {item.rating} </Text>
                            <Text style = {{marginBottom:10, fontWeight: '600'}}> Comments:  </Text>
                            <Text> {item.comment}</Text>
                        </View>}
                        keyExtractor={item => item.id}
                    />
                    </View>
                </ScrollView>
            );
        }
        return null        
    }

    getUserComments = () => { 
        return fetch(env.server+"comment?recipe_name="+this.state.recipe.Name,{
            method: "GET"
        })
        .then((response) => response.json())
        .then( (json) => {
            this.setState({ reviews: json });
            console.log(json)
        }).catch((error) => console.log(error))
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
    },
    heading: {
        fontSize: 1,
        alignItems: "center",
        padding: 20,
    },
    recipe_text: {
        padding: 20,
        fontSize: 18,
        fontWeight: '400'
    },
    recipe_label:{
        padding: 20,
        fontSize: 18,
        fontWeight: '700'
    },
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
