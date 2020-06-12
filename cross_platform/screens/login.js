import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, ToastAndroid, ImageBackground } from 'react-native';
import Constants from 'expo-constants';
import {Button} from 'react-native-elements'
import { TextInput } from 'react-native-gesture-handler';
import { StackActions } from '@react-navigation/native';
import firebase from '../firebase';
import { env } from "../config";
import AsyncStorage from '@react-native-community/async-storage'


export class LoginComponent extends Component {
    state = {
        email: "",
        password: "",
        // there is three ways to adjust (position , height , padding )
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

    handleLogin = (navigation, email, password) => {
        var flag = true
        firebase.auth().signInWithEmailAndPassword(email, password)
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                flag = false;
                ToastAndroid.show(errorMessage, ToastAndroid.SHORT)
            })
            .then(function (result) {
                fetch(env.server+"registerUser?email="+email, {
                    method: "GET"
                })
                .then((response) => response.json())
                .then((json) => {
                    AsyncStorage.setItem('username', json.username);
                    AsyncStorage.setItem('userID', json.userID);
                });
                if (flag) {
                    // navigation.navigate("Landing")
                    navigation.dispatch(StackActions.replace('Landing'))
                    ToastAndroid.show("Login Success!", ToastAndroid.SHORT)
                }
            })
    }

    render() {
        return (
             <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : null}       style={{ flex: 1,height:"100%" }} >
                    <ImageBackground source = {require('../assets/background2.jpg')} style = {styles.bgimg} resizeMode="cover">
                        <View style={styles.login_form_section}>
                            <TextInput style={styles.inputbtn} placeholder="EmailID" onChangeText={this.handleEmail} />

                            <TextInput style={styles.inputbtn} secureTextEntry={true} placeholder="Password" onChangeText={this.handlePassword} />

                            <View style={styles.loginbtn} >
                                <Button type="outline" raised title="Login" onPress={this.handleLogin.bind(this, this.props.navigation, this.state.email, this.state.password)}/>
                            </View>
                            <View style={{ alignSelf: "center" }}>
                                <Text style={{color:"#FFF", alignSelf: "center"}} >New user? Click Sign Up!</Text>
                                <View style={styles.loginbtn} >
                                    <Button type="outline" raised title="Sign Up" onPress={() => { this.props.navigation.navigate('Signup') }} />
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
             </KeyboardAvoidingView>


        )
    }
}

const styles = StyleSheet.create({
    loginbtn: {
        margin: 20,
        alignSelf: "center",        
    },
    inputbtn: {
        margin: 10,
        
        padding: 15,
        borderRadius: 5,
        width: "80%",
        alignSelf: "center",
        backgroundColor:'rgba(255, 255, 255, 0.9)'
    },
    login_form_section: {
        marginTop: "80%",
        height:"100%"
    },
    splashimg: {
        width: "100%",
        height: "100%",
        alignSelf: "center",
        
    },
    bgimg:{
        height:"100%",
        width:"100%",
        opacity: 0.9
    }
});