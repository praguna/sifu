import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Image, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import Constants from 'expo-constants';
import { TextInput } from 'react-native-gesture-handler';
import { StackActions } from '@react-navigation/native';
import firebase from '../firebase';

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
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : null}
            keyboardVerticalOffset={100}
            style={{ flex: 1 }} >
                <View style={styles.login_form_section}>
                    
                    <TextInput style={styles.inputbtn} placeholder="Username" onChangeText={this.handleUsername} />
                    <TextInput style={styles.inputbtn} placeholder="EmailID" onChangeText={this.handleEmail} />
                    <TextInput style={styles.inputbtn} secureTextEntry={true} placeholder="Password" onChangeText={this.handlePassword} />
                    <TextInput style={styles.inputbtn} secureTextEntry={true} placeholder="Confirm Password" onChangeText={this.handleConfirmPassword} />
                    <View style={styles.submitbtn} >
                        <Button title="Submit" onPress={this.handleSignup.bind(this, this.props.navigation)} />
                    </View>
                </View>
            </KeyboardAvoidingView>
        )
    }

    handleSignup = (navigation) => {
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
            })
            .then(function (result) {
                if (flag) {
                    navigation.dispatch(StackActions.replace('Landing'))
                    ToastAndroid.show("Sign Up Success!", ToastAndroid.SHORT);
                    //call an api here to register user to MONGODB
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
        borderRadius: 10
    },
    login_form_section: {
        marginTop: "40%"
    },
    inputbtn: {
        margin: 10,
        borderWidth: 1,
        padding: 15,
        borderRadius: 5,
        width: "80%",
        alignSelf: "center"
    },
    heading :{
        marginVertical: 8,
        marginHorizontal: 16,
        fontSize : 1
    }
  });