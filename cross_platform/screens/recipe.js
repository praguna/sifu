import React, { Component } from "react";
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, FlatList } from "react-native";
import Constants from "expo-constants";
import { Rating } from 'react-native-elements';
import UserRating from "./rating"
import CommentModal from "./modal";
import AsyncStorage from '@react-native-community/async-storage'
import { env } from "../config";
import Loader from './loader';

const defimg = require('../assets/default.jpg');
console.disableYellowBox = true;

export class RecipeComponent extends Component {
    state = {
        username: '',
        userID: '',
        isCommentsLoaded: false,
        recipe: this.props.route.params.recipe,
        reviews: [],
        canSubmit: true,
        uniqueValue: 1,
        loading:false
    }
    constructor(props) {
        super(props);
        global.loading = false
        this.setState({loading:global.loading})
        AsyncStorage.getItem('username').then(value =>
            this.setState({ username: value })
        ).catch(err=>console.error(err));
        AsyncStorage.getItem('userID').then(value => {
            this.setState({ userID: value });
        }
        ).then(() => {
            this.getUserComments()
                .then(() => {
                    // this.setState({loading:false})
                    this.setState({ isCommentsLoaded: true });
                });
        }).catch(err=>console.error(err));

    }
    render() {
        // const {Data} = this.props.route.params.data
        // console.log(this.props.route.params.data)
        if (this.state.isCommentsLoaded) {
            return (
                <ScrollView style={{ backgroundColor: "#E1E8EE" }}>
                    <Loader loading = {this.state.loading} />
                    <Text style={styles.recipe_label, { fontSize: 20, fontWeight: '400', padding: 10, alignSelf: "center" }}> {this.state.recipe.Name} </Text>
                    <View style={{ alignSelf: "center" }}>
                        <Image
                            style={{ width: 375, height: 200, borderRadius: 15 }}
                            source={this.state.recipe.image}
                        />
                    </View>
                    <View style={{ width: "95%", height: "63%", alignSelf: "center" }} key={this.state.uniqueValue}>
                        
                        <Text style={styles.recipe_label}>How to Prepare {this.state.recipe.Name} </Text>
                        <Text style={styles.recipe_label}>Ingredients: </Text>
                        {
                            this.state.recipe.Ingredients.split(',').map((item, key) => (
                                <Text key={key} style={styles.recipe_details_text}> {item.trim()}</Text>
                            ))
                        }
                        
                        <Text style={styles.recipe_label}>Preparation: </Text>{
                            this.state.recipe.Preparation === "" ? <Text style={styles.recipe_text}> No preparation required </Text>
                            : 
                            this.state.recipe.Preparation.split('.').map((item, key) => (
                                item.trim() !== ""? <Text key={key} style={styles.recipe_details_text}> {"- "+item.trim()+"."}</Text> : null
                            ))
                        }
                        <Text style={styles.recipe_label}>Method: </Text>

                        {
                            this.state.recipe.Method.split('.').map((item, key) => (
                                item.trim() != "" ? <Text key={key} style={styles.recipe_details_text}> {"- "+item.trim()+"."}</Text>: null
                            ))
                        }

                        <Text style={styles.recipe_label}> Customer Ratings for {this.state.recipe.Name} </Text>
                        {this.checkReviewStatus()}
                        <View style={{marginTop: 5}}>
                        {
                            this.state.reviews.map((item, key) => (
                                <View style={styles.rating_style} key={key} >
                                    <Image style={{ margin: 5, height: 70, width: 70, borderRadius: 35 }} source={require('../assets/profile.png')} />
                                    <View>
                                        <Text style={{ marginTop: 10, fontWeight: '600' }}> User: {item.username} </Text>
                                        <View style={{ flexDirection: "row" }}>
                                            <Rating imageSize={20} readonly startingValue={item.rating} style={{ marginTop: 15, marginLeft: 0 }} /><Text style={{ marginTop: 15 }}>({item.rating})</Text>
                                        </View>
                                        <Text style={{ marginTop: 15, fontWeight: '600' }}> Comments:</Text><Text> {item.comment} </Text>
                                    </View>
                                </View>
                            ))
                        }
                        </View>
                    </View>
            </ScrollView>
            );
        }
        return (
            <View style={StyleSheet.container}>
            <Loader loading={true} />
            </View>
        );
    }

    getUserComments = () => {
        // this.setState({loading:true})
        return fetch(env.server + "comment?recipe_name=" + this.state.recipe.Name, {
            method: "GET"
        })
            .then((response) => response.json())
            .then((json) => {
                json.sort(function (a, b) {
                    return a.timestamp > b.timestamp;
                });
                this.setState({ reviews: json });
                for (let userObject of json) {
                    if (userObject.ReviewID == this.state.userID) {
                        this.setState({
                            canSubmit: false
                        })
                    }
                }
            }).catch((error) => console.log(error))
    }
    checkReviewStatus = () => {
        if (this.state.canSubmit == true) {
            return (
                <View>
                    <Text style={{ alignSelf: "center", fontWeight: "700" }}>Want to leave a review? Click Below!</Text>
                    <CommentModal recipeName={this.state.recipe.Name} userID={this.state.userID} userName={this.state.username} reloadScreen={this.getUserComments} />
                </View>
            )
        }
        return (<Text style={{ alignSelf: "center", fontWeight: "700" }}>You have already submitted a review.</Text>)
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
        fontWeight: '400',
        textAlign: 'justify'
    },
    recipe_details_text: {
        paddingLeft: 20,
        fontSize: 18,
        fontWeight: '400',
        textTransform: 'capitalize'
    },
    recipe_label: {
        padding: 20,
        fontSize: 18,
        fontWeight: '700'
    },
    rating_style: {
        width: "90%",
        borderRadius: 15,
        alignSelf: "center",
        padding: 10,
        paddingTop: 5,
        paddingBottom: 1,
        marginBottom: 5,
        backgroundColor: "#FEFFFE",
        flex: 1,
        flexDirection: "row",
    },
    listitems: {
        flex: 1,
        flexDirection: "row-reverse",
        backgroundColor: '#bdc6cf',
        alignSelf: "center",
        justifyContent: "flex-end",
        padding: 5,
        borderRadius: 15,
        width: "80%"
    }

});
