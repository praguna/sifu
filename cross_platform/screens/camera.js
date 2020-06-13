import { Camera } from "expo-camera";
import React, { Component } from "react";
import * as Permissions from "expo-permissions";
import { Platform, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { env } from "../config";

export function Status({ show }) {
  if (show)
    return (
      <ActivityIndicator size="large" color="#ffffff" />
    );
  else {
    return <Text></Text>;
  }
}

export class CameraComponent extends Component {

  constructor(props){
     super(props);
     this.state = {
        username : this.props.route.params.username,
        userID : this.props.route.params.userID,
        hasPermission: null,
        type: Camera.Constants.Type.back,
        show: false
     }
  }

  // state = {
  //   hasPermission: null,
  //   type: Camera.Constants.Type.back,
  //   show: false,
  // };

  async componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    // Camera roll Permission

    if (Platform.OS === "ios") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }

    // Camera Permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === "granted" });
  };

  // pick image from gallery
  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
  };

  // toggling front and back camera
  handleCameraType = () => {
    const { cameraType } = this.state;

    this.setState({
      cameraType:
        cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back,
    });
  };

  //capture a picture
  takePicture = async () => {
    if (this.camera) {
      await this.camera
        .takePictureAsync({ base64: true })
        .then((data) => {
          //sending image
          this.setState({ show: true });
          fetch(env.server+"recommend", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uid: this.state.userID,
              data: data.base64,
            }),
          })
            .then((response) => response.json())
            .then((json) => {
              this.setState({ show: false });
              // if(typeof data === "undefined")
              //   console.log("unreachable !!")
              this.props.navigation.push('UserFeedBack', {
                username:this.state.username, 
                userID:this.state.userID,
                image : data,
                response : json
              })
              this.props.navigation.navigate("UserFeedBack");
              // return json;
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.error(error));
    }
  };

  //display
  render() {
    // check for permission
    const { hasPermission } = this.state;
    if (hasPermission === null) {
      return <View />;
    } else if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={this.state.cameraType}
            ref={(ref) => {
              this.camera = ref;
            }}
          >
            <Status show={this.state.show} />

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                margin: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  alignItems: "center",
                  backgroundColor: "transparent",
                }}
                onPress={() => {
                  this.pickImage();
                }}
              >
                <Ionicons
                  name="ios-photos"
                  style={{ color: "#fff", fontSize: 40 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  alignItems: "center",
                  backgroundColor: "transparent",
                }}
                onPress={() => {
                  this.takePicture();
                }}
                title="send"
              >
                <FontAwesome
                  name="camera"
                  style={{ color: "#fff", fontSize: 40 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  alignItems: "center",
                  backgroundColor: "transparent",
                }}
                onPress={() => this.handleCameraType()}
              >
                <MaterialCommunityIcons
                  name="camera-switch"
                  style={{ color: "#fff", fontSize: 40 }}
                />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}
