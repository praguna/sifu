import React, { Component } from 'react'
import { View, FlatList, Text, StyleSheet, Button, TouchableOpacity, Image } from 'react-native'
import Constants from 'expo-constants';
import { StackActions } from '@react-navigation/native';
import firebase from '../firebase';

export class LandingComponent extends Component {
    handleSignout = (navigation) => {
        firebase.auth().signOut().then(function () {
            navigation.dispatch(StackActions.replace('Login'))
        })
        console.log("Signed Out Successfully!")
    }
    render() {
        // const {Data} = this.props.route.params.data
        // console.log(this.props.route.params.data)
        var popularRecipes = this.getPopularRecipeImages();
        return (
            <View style={StyleSheet.container}>
                <View style={StyleSheet.heading}>
                    <Text style={{ padding: 20 }}> Explore Our Popular Recipes : </Text>

                    {/* This is placeholder images for top 3 dishes  */}
                    <View style={{ flexDirection: "row", paddingLeft: 30, paddingBottom: 20 }}>
                    {
                        popularRecipes.map((item, key) => (
                            <TouchableOpacity key={key} style={{ flex: 1 }} activeOpacity={.5} onPress={() => { this.props.navigation.navigate('Recipe') }}>
                                    <Image style={{ width: 100, height: 100 }} source={item.filePath} />
                            </TouchableOpacity>
                        ))
                    }
                    </View>
                </View>

                <FlatList
                    // data = {this.props.route.params.data}
                    renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
                />
                <View style={{ paddingTop: 400 }}>
                    <Button title="Take a Picture" onPress={() => { this.props.navigation.navigate('Camera'); }} />
                </View>
                <Button title="Sign Out" onPress={this.handleSignout.bind(this, this.props.navigation)} />
            </View>
        )
    }

    getPopularRecipeImages = () => {
        // var popularImageData = [];

        // get from API
        // var popularImageNames = ['picture1.jpg', 'picture2.jpg', 'picture3.jpg'];

        // get from API
        // var popularImageUri = '../assets/';

        // to update the image source dynamically, as require() method takes only static values
        // popularImageNames.forEach(function(key){
        //     popularImageData.push(
        //         {uri: popularImageUri+key}
        //     );
        // });
        // return popularImageData;
        var popularImageData = [
            {filePath: require('../assets/picture1.jpg')},
            {filePath: require('../assets/picture2.jpg')},
            {filePath: require('../assets/picture3.jpg')}
        ];
        return popularImageData;
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
    }
});