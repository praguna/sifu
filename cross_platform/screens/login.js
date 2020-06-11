import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Image, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import Constants from 'expo-constants';
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
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : null}
            style={{ flex: 1 }} >
                <Image
                    style={styles.splashimg}
                    source={require("../assets/picture1.jpg")}
                />

                <View style={styles.login_form_section}>
                    <TextInput style={styles.inputbtn} placeholder="EmailID" onChangeText={this.handleEmail} />

                    <TextInput style={styles.inputbtn} secureTextEntry={true} placeholder="Password" onChangeText={this.handlePassword} />

                    <View style={styles.loginbtn} >
                        <Button title="Login" onPress={this.handleLogin.bind(this, this.props.navigation, this.state.email, this.state.password)} />
                    </View>
                    <View style={{ alignSelf: "center" }}>
                        <Text style={{alignSelf: "center"}} >New user? Click Sign Up!</Text>
                        <View style={styles.loginbtn} >
                            <Button title="Sign Up" onPress={() => { this.props.navigation.navigate('Signup') }} />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>


        )
    }
}

const styles = StyleSheet.create({
    loginbtn: {
        borderWidth: 2,
        margin: 20,
        alignSelf: "center",
        borderRadius: 10
    },
    inputbtn: {
        margin: 10,
        borderWidth: 1,
        padding: 15,
        borderRadius: 5,
        width: "80%",
        alignSelf: "center"
    },
    login_form_section: {
        marginTop: "40%"
    },
    splashimg: {
        width: 375,
        height: 200,
        alignSelf: "center",
        marginTop: 30
    }
});