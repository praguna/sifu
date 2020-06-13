import React, { Component } from "react";
import { Alert, Modal, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import {Rating, AirbnbRating } from 'react-native-elements';
import { env } from "../config";

export default class CommentModal extends Component {
  state = {
    modalVisible: false,
    rating:0,
    userComments:"",
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  ratingCompleted = (rate) => {
    console.log("Rating is: " + rate)
    this.setState({
        rating:rate
    })
  }

  handleCommentText = (com) =>{
      console.log(com)
      this.setState({
          userComments: com
      })
  }

  render() {
    const { modalVisible } = this.state;
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Submit Comments</Text>
              <TextInput style={styles.modalTextInput} placeholder="Type your comments here.." onChangeText={this.handleCommentText}/>
              <Rating 
                    type = "custom"
                    fractions={1}
                    ratingBackgroundColor = "#F2F2F2"
                    onFinishRating={this.ratingCompleted}
              />
              <View style={styles.inModalButtons}>
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3",margin:5 }}
                onPress={() => {
                  this.setModalVisible(!modalVisible);
                  this.submitComments()
                }}
              >
                <Text style={styles.textStyle}>Submit</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3",margin:5 }}
                onPress={() => {
                  this.setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>

        <TouchableHighlight
          style={styles.openButton}
          onPress={() => {
            this.setModalVisible(true);
          }}
        >
          <Text style={styles.textStyle}>Submit Comments</Text>
        </TouchableHighlight>
      </View>
    );
  }
  
        // usage:      Post request Body:-
        //             ReviewID:5
        //             rName:"Rava Vada"
        //             rating:4
        //             comment:"Good"
        
  submitComments = () =>{
    fetch(env.server+"comment", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "ReviewID": this.props.userID,
            "rName": this.props.recipeName,
            "rating":this.state.rating,
            "comment":this.state.userComments,
            "username": this.props.userName
        }),
    })
    .then( (response) => {console.log(response.json()) 
        this.props.reloadScreen()} )
    .catch((error) => console.log(error))

    
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#bdc6cf",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  inModalButtons:{
    flexDirection:"row",
    // backgroundColor: '#bdc6cf',
    alignSelf: "center",
    
    padding:5,
    margin:5,
    borderRadius:15,
    width: "80%"
  },
  modalTextInput:{
      borderWidth:1,
      padding:10,
      borderRadius:15,
      marginBottom:10
  }
});
