import React, { Component } from "react";
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, FlatList } from "react-native";
import Constants from "expo-constants";
import UserRating from "./rating"

const defimg = require('../assets/default.jpg');

export class RecipeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipe: this.props.route.params.recipe
        }
    }
    render() {
        // const {Data} = this.props.route.params.data
        // console.log(this.props.route.params.data)
        return (
            <ScrollView >
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
                    <Text style={styles.recipe_text}> How to Prepare {this.state.recipe.Name} </Text>
                    <Text style={styles.recipe_text}> Ingredients: {this.state.recipe.Ingredients}</Text>
                    <Text style={styles.recipe_text}> Preparation: {this.state.recipe.Preparation}</Text>
                    <Text style={styles.recipe_text}> Method: {this.state.recipe.Method}</Text>
                </View>
                <View style={{ width: "90%" }} >
                    <Text style={styles.recipe_text}> Customer Ratings for {this.state.recipe.Name} </Text>

                    {/* Pass recipe name as params to the CustomerRating component */}
                    <UserRating />
                </View>
            </ScrollView>
        );
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
    }

});
