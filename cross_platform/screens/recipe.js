import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Constants from "expo-constants";

export class RecipeComponent extends Component {
    render() {
        // const {Data} = this.props.route.params.data
        // console.log(this.props.route.params.data)
        return (
            <View style={StyleSheet.container}>
                <View style={StyleSheet.heading}>
                    {/* Recipe 1 is a placeholder, Change the name dynamically */}
                    <Text style={{ padding: 20, alignSelf:"center" }}> Recipe </Text>
                    <View style={{ paddingLeft: 20 }}>
                        <Image
                            style={{ width: 375, height: 200 }}
                            source={require("../assets/picture1.jpg")}
                        />
                    </View>
                    <Text style={{ padding: 20 }} >Ingredients, Preparation and Method of cooking: </Text>
                </View>
            </View>
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
});
