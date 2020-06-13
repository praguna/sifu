import React ,{Component} from 'react'
import {View , Text , StyleSheet, Image, Button, Platform, KeyboardAvoidingView, ToastAndroid, TabBarIOS} from 'react-native'
import Constants from 'expo-constants';
import { TextInput } from 'react-native-gesture-handler';
import { StackActions } from '@react-navigation/native';
import { env } from "../config";
console.disableYellowBox = true;

export class UserFeedBack extends Component{
    constructor(props){
        super(props)
        this.state = {
            username : this.props.route.params.username,
            userID : this.props.route.params.userID,
            image : this.props.route.params.image,
            response : this.props.route.params.response,
            text : ""
        }
    }

    handleSubmit = async ()=>{
        if(this.state.text.trim().length == 0){
            if(Platform.OS === "android") ToastAndroid.show("Enter a value !", ToastAndroid.LONG);
            return;
        }
        fetch(env.server+"labelByUser", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: this.state.image,
              ingredients: this.state.text,
            }),
          }).then(res=>res.json())
          .then(json=>{
              if(Platform.OS === "android") ToastAndroid.show(json["message"], ToastAndroid.LONG);
              this.gotToDisplayPage();
          }).catch(err=>console.error(err))
    }

    gotToDisplayPage = ()=>{
        this.props.navigation.push("Display",{
            username:this.state.username,
            userID:this.state.userID,
            response:this.state.response
        });
        this.props.navigation.navigate("Display");
    }

    renderButtons = ()=>{
        var ingredients = this.state.response["Ingredients"]
        if(typeof ingredients !== "undefined"){
        const map = ingredients.map(ing=>{
            return <Text style={styles.btntext}>{ing}</Text>
            })
         return map
        }
        return (
            <Text style={styles.btntext}> Nothing to display!! </Text>
        )
    }

    render(){
        const keyboardVerticalOffset = Platform.OS === 'android' ? 80 : 60
        return(
            <KeyboardAvoidingView style={{backgroundColor:"#E1E8EE"}} behavior='position'  keyboardVerticalOffset={keyboardVerticalOffset}>
                <View style={{flexDirection:"row", justifyContent:"space-evenly", marginTop:20,marginBottom:20}}>
                            <Button title="Home" onPress={() => { this.props.navigation.dispatch(StackActions.replace('Landing'))}} />
                </View>
                <Text style={styles.heading}>Help us improve our Model Perfomance</Text>
                <Image 
                style={styles.imagestyle} 
                source={{uri: `data:image/png;base64,${this.state.image.base64}`}} 
                />
                <Text style={styles.subheading}>This is what we predicted :</Text>
                <View style = {{
                    flexDirection : "row",
                    alignSelf : "center",
                    flexWrap: 'wrap'
                }}>
                     {this.renderButtons()}
                </View>
                <Text style={styles.subheading}>What did we miss?</Text>
                <TextInput multiline={true} 
                 numberOfLines={4}
                 onChangeText={(text) => this.setState({text})}
                 style={styles.inputbtn} 
                 placeholder="Enter correct ingredients as Comma Seperated Values"/>

                 <View style={styles.buttons}>
                    <View style={styles.loginbtn} >
                        <Button 
                            title="Submit"
                            onPress = {this.handleSubmit}
                        />
                    </View>
                    <View style={styles.skipbtn} >
                        <Button 
                            title=">> Skip"
                            onPress = {this.gotToDisplayPage}
                        />
                    </View>
                </View>
                <Text style={styles.subheading}>Skip ahead to see recommended recipes.</Text>
            </KeyboardAvoidingView >
        );
    }
}

const styles = StyleSheet.create({
    container: {
      marginTop: Constants.statusBarHeight,
    },
    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    heading :{
        textAlign : "center",
        fontWeight: 'bold',
        fontSize: 18,
        // fontFamily : "sans-serif-medium",
        textDecorationLine: 'underline',
        marginHorizontal: 16,
        color : "blue"
    },
    subheading: {
        textAlign : "left",
        fontWeight: 'bold',
        fontSize: 12,
        fontStyle: 'italic',
        marginHorizontal: 16,
        color : "red",
        marginTop: 15,
        alignSelf: "center"
    },
    inputbtn: {
        margin: 10,
        padding: 15,
        borderRadius: 5,
        width: "80%",
        marginLeft: 10,
        backgroundColor:'rgba(255, 255, 255, 0.8)',
        alignSelf: "center"
    },
    imagestyle :{
        marginHorizontal: 16,
        marginTop: 16,
        height:200, 
        width:200,
        alignSelf: "center"
    },
    buttons:{
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    loginbtn :{
        width : 100,
        borderRadius: 20,
        paddingTop:10,
    },
    skipbtn : {
        width : 80,
        fontSize : 5,
        borderRadius: 20,
        paddingTop:10
    },
    btntext : {
        textAlign : "left",
        fontWeight: 'bold',
        fontSize: 12,
        backgroundColor : 'rgba(121, 203, 77, 1)',
        color : "white",
        margin : 10,
        padding : 10,
        borderRadius : 10
    }
  });