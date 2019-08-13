import React, { useEffect,useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage'
import { View, SafeAreaView, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';

export default function Main({ navigation }) {
    const id = navigation.getParam('user');
    const [users, setUsers] = useState([]);

    console.log(id);

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: { 
                    user: id,
                }
            })
            setUsers(response.data);
        }
        loadUsers();
    }, [id]); 

    async function handleLike(){
        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/likes`, null, {
            headers: {user: id },
        })
        setUsers(rest);
    }

    async function handleDislike(){
        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: {user: id },
        })
        setUsers(rest);
    }

    async function handleLogout(){
        await AsyncStorage.clear();

        navigation.navigate('Login');
    }

    return (
        <View style = {styles.container}>
            <TouchableOpacity onPress = {handleLogout}>
                <Image style = {styles.logo} source = {logo}/>
            </TouchableOpacity>
            

            <View style = {styles.cardsContainer}>
                { users.length === 0
                ? <Text style = {styles.empty}>Acabou :(</Text>
                : (
                    users.map((user , index) => (

                        <View key = {user._id} style = {[styles.card, {zIndex: users.length - index}]}>
                        <Image style = {styles.avatar} source = {{uri: user.avatar}}/>
    
                        <View style = {styles.footer}>
                            <Text style = {styles.name}>{user.name}</Text>
                            <Text style = {styles.bio} numberOfLines = {3}>{user.bio}</Text>
                        </View>
                        </View>
                    ))
                ) }
            </View>

            { users.length > 0 && ( 
                    <View style = {styles.buttonsContainer}>
                    <TouchableOpacity onPress = {handleDislike} style = {styles.button} >
                     <Image source = {dislike}></Image>
                    </TouchableOpacity>

                    <TouchableOpacity onPress = {handleLike} style = {styles.button}>
                       <Image source = {like}></Image>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20
    },

    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
    },

    card: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 6,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },

    avatar: {
        flex: 1,
        height: 200
    },

    footer: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 15
    },

    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center'
    },

    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 18,
        textAlign:'center'
    },

    logo: {
        marginTop: 9
    },

    empty:{
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold'

    },

    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 25
    },

    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2
    }

});