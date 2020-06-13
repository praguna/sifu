import React ,{Component} from 'react'
import { View, FlatList,ScrollView, Text, StyleSheet, Button, TouchableOpacity, Image } from 'react-native'
import Constants from 'expo-constants';
import { StackActions } from '@react-navigation/native';
console.disableYellowBox = true;

export class DisplayComponent extends Component{
    constructor(props) {
        super(props);
        this.state = {
            recipes: this.props.route.params.response.recipes
        }
    }


    render(){
        if(this.state.recipes.length > 0){
        return (
            <ScrollView style={styles.container}>
                <View style={StyleSheet.heading}>
                    <View style={styles.new_section}>
                        <View style={{flexDirection:"row", justifyContent:"space-evenly", marginBottom:20}}>
                            <Button title="Home" onPress={() => { this.props.navigation.dispatch(StackActions.replace('Landing'))}} />
                            {/* <Button title="Sign Out" onPress={this.handleSignout.bind(this, this.props.navigation)} /> */}
                        </View>
                        <Text style = {StyleSheet.heading}> Recommended Recipes : </Text>
                        <FlatList data = {this.state.recipes} 
                        renderItem = {({item})=><View>
                            <TouchableOpacity key={item.Name} style={{ margin:5, width:"100%", alignSelf: "center" }} activeOpacity={.5} onPress={() => {
                                    this.props.navigation.push('Recipe', {recipe: item})
                                }}>
                                    <View style={styles.listitems}>
                                        <Text style={{marginTop:36}} >{item.Name}</Text>
                                        <Image style={{ margin:10, height:70, width:70, borderRadius: 35 }} source={item.image} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }            
                        />
                    </View>                    
                </View>
            </ScrollView>
        )
        } else{
            return (
            <ScrollView style={styles.container}>
                <View style={StyleSheet.heading}>
                    <View style={styles.new_section}>
                        <View style={{flexDirection:"row", justifyContent:"space-evenly", marginBottom:20}}>
                            <Button title="Home" onPress={() => { this.props.navigation.dispatch(StackActions.replace('Landing'))}} />
                        </View>
                        <Text style = {StyleSheet.heading, {marginTop:36}}> Sorry we could not find any result for your image </Text>
                    </View>                    
                </View>
            </ScrollView>
            )
        }
    }
}


const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // marginTop: Constants.statusBarHeight,
        backgroundColor:"#E1E8EE",
        height:"100%",
        width:"100%"
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    heading: {
        fontSize: 1
    },
    new_section: {
        padding: 20,
    },
    listitems:{
        flex:1,
        flexDirection: "row-reverse",
        backgroundColor: '#bdc6cf',
        alignSelf: "center",
        justifyContent: "flex-end",
        padding:5,
        borderRadius:15,
        width: "80%"
    }
  });