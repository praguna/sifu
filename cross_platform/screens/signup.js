import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Image, KeyboardAvoidingView, ToastAndroid, ImageBackground } from 'react-native';
import Constants from 'expo-constants';
import { TextInput } from 'react-native-gesture-handler';
import { StackActions } from '@react-navigation/native';
import firebase from '../firebase';
import { env } from "../config";
import AsyncStorage from '@react-native-community/async-storage'
console.disableYellowBox = true;

export class SignupComponent extends Component{
    state = {
        username: "",
        email: "",
        password: "",
        confirmpassword: ""
    }

    handleUsername = (e) => {
        this.setState({
            username: e
        })
    }

    handleEmail = (e) => {
        this.setState({
            email: e
        })
    }

    handlePassword = (e) => {
        this.setState({
            password: e
        })
    }

    handleConfirmPassword = (e) => {
        this.setState({
            confirmpassword: e
        })
    }

    render(){
        return (
            // <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : null}  keyboardVerticalOffset={100} >
                <ImageBackground source = {require('../assets/background2.jpg')} style = {styles.bgimg} resizeMode="cover">
                    <View style={styles.login_form_section}>
                        
                        <TextInput style={styles.inputbtn} placeholder="Username" onChangeText={this.handleUsername} />
                        <TextInput style={styles.inputbtn} placeholder="EmailID" onChangeText={this.handleEmail} />
                        <TextInput style={styles.inputbtn} secureTextEntry={true} placeholder="Password" onChangeText={this.handlePassword} />
                        <TextInput style={styles.inputbtn} secureTextEntry={true} placeholder="Confirm Password" onChangeText={this.handleConfirmPassword} />
                        <View style={styles.submitbtn} >
                            <Button title="Submit" onPress={this.handleSignup.bind(this, this.props.navigation, this.state.email, this.state.username)} />
                        </View>
                    </View>
                </ImageBackground>
            // </KeyboardAvoidingView>
        )
    }

    handleSignup = (navigation, email, username) => {
        var flag = true;
        try {

            if(this.state.password !== this.state.confirmpassword){
                throw new Error("Confirm Password do not match");
            }

            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                flag = false;
                ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
            }).then((result) => {});
            
            fetch(env.server+"registerUser", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "username": username,
                    "email": email
                }),
            })
            .then((response) => response.json())
            .then((json) => {
                AsyncStorage.setItem('username', username);
                AsyncStorage.setItem('userID', json.userID);
                console.log(json.message);
            })
            .catch((error) => console.log(error))
            .then(function () {
                if (flag) {
                    navigation.dispatch(StackActions.replace('Landing'));
                    ToastAndroid.show("Sign Up Success!", ToastAndroid.SHORT);
                }
            })
        } catch (error){
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        }
        
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: Constants.statusBarHeight,
    },
    submitbtn: {
        borderWidth: 2,
        margin: 20,
        alignSelf: "center",
        borderRadius: 10,
        backgroundColor:'rgba(255, 255, 255, 0.9)'
    },
    login_form_section: {
        marginTop: "30%"
    },
    inputbtn: {
        margin: 10,
        borderWidth: 1,
        padding: 15,
        borderRadius: 5,
        width: "80%",
        alignSelf: "center",
        backgroundColor:'rgba(255, 255, 255, 0.8)'
    },
    heading :{
        marginVertical: 8,
        marginHorizontal: 16,
        fontSize : 1
    },
    bgimg:{
        height:"100%",
        width:"100%",
        opacity: 0.9
    }
  });