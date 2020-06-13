import React, { Component } from "react";
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, FlatList } from "react-native";
import Constants from "expo-constants";
import {Rating} from 'react-native-elements';
import UserRating from "./rating"
import CommentModal from "./modal";
import AsyncStorage from '@react-native-community/async-storage'
import { env } from "../config";

const defimg = require('../assets/default.jpg');
console.disableYellowBox = true;

export class RecipeComponent extends Component {
    state = {
        username: '',
        userID: '',
        isCommentsLoaded : false,
        recipe: this.props.route.params.recipe,
        reviews: [],
        canSubmit:true,
        uniqueValue: 1
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
                                style={{ width: 375, height: 200, borderRadius:15 }}
                                source={this.state.recipe.image}
                            />
                        </View>
    
                        {/* Fetch following from backend */}
                        <Text style={styles.recipe_label}>How to Prepare {this.state.recipe.Name} </Text>
                        <Text style={styles.recipe_label}>Ingredients: </Text><Text style={styles.recipe_text}> {this.state.recipe.Ingredients}</Text>
                        <Text style={styles.recipe_label}>Preparation: </Text><Text style={styles.recipe_text}> {this.state.recipe.Preparation}</Text>
                        <Text style={styles.recipe_label}>Method: </Text><Text style={styles.recipe_text}>{this.state.recipe.Method}</Text>
                    </View>
                    
                    {this.checkReviewStatus()}
                    
                    <View style={{ width: "95%" }} key={this.state.uniqueValue}>
                        <Text style={styles.recipe_label}> Customer Ratings for {this.state.recipe.Name} </Text>
    
                        {/* Pass recipe name as params to the CustomerRating component */}
                        {/* <UserRating /> */}
                        <FlatList                
                        data={this.state.reviews}
                        renderItem={({ item }) =>
                        
                        <View style ={styles.rating_style} >
                            <Image style={{ margin:5, height:70, width:70, borderRadius: 35 }} source={require('../assets/profile.png')} />
                            <View>
                                <View style={{flexDirection:"row"}}>
                                    <Text style = {{marginTop:15, fontWeight: '600'}}> User: {item.username} </Text>
                                    {/* <Text style = {{marginTop:15, marginLeft:20, fontWeight: '600'}}> Ratings: {item.rating} </Text> */}
            <Rating imageSize={20} readonly startingValue={item.rating} style = {{marginTop:15, marginLeft:10}}/><Text  style = {{marginTop:15}}>({item.rating})</Text>
                                </View>
                            <Text style = {{marginTop:15, fontWeight: '600'}}> Comments:</Text><Text> {item.comment} </Text>
                            </View>
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
            json.sort(function(a, b) {
                return a.timestamp > b.timestamp;
            });
            this.setState({ reviews: json });
            console.log(json)
            for (let userObject of json) {
                if (userObject.ReviewID == this.state.userID){
                    this.setState({
                        canSubmit : false
                    })
                }
            }
        }).catch((error) => console.log(error))
    }
    checkReviewStatus = () => {
        if(this.state.canSubmit == true){
            return(
                <View>
                <Text style={{alignSelf:"center", fontWeight:"700"}}>Want to leave a review? Click Below!</Text>
                <CommentModal recipeName={this.state.recipe.Name} userID={this.state.userID} userName={this.state.username} reloadScreen={this.getUserComments}/>
                </View>
                )
        }
        return (<Text style={{alignSelf:"center", fontWeight:"700"}}>You have already submitted a review.</Text>)
    }
    forceRemount = () => {
        this.setState({
          uniqueValue: this.state.uniqueValue + 1
        });
        console.log("Force remount fired")
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
        borderRadius:15,
        alignSelf: "center",
        padding:10,
        marginLeft:25,
        marginBottom:5,
        backgroundColor:"#FEFFFE",
        flex:1,
        flexDirection: "row",
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
