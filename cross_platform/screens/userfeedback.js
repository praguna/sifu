import React ,{Component} from 'react'
import {View , Text , StyleSheet} from 'react-native'
import Constants from 'expo-constants';
export class UserFeedBack extends Component{
    constructor(props){
        super(props)
        this.state = {
            username : this.props.route.params.username,
            userID : this.props.route.params.userID,
            image : this.props.route.params.image,
            response : this.props.route.params.response
        }
    }

    render(){
        return(
            <View style={styles.container}>
                <Text>I am {this.state.username}!!, Hello world!!</Text>
            </View>
        );
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
    heading :{
        marginVertical: 8,
        marginHorizontal: 16,
        fontSize : 1
    }
  });