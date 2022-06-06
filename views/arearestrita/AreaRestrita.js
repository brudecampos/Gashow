import React, {useState,useEffect} from 'react';
import {Text, View, Button, BackHandler, Alert} from 'react-native';
import {css} from '../../assets/css/Css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {Profile,Cadastro,Edicao} from '../index';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function AreaRestrita({navigation}) {

    const Tab = createMaterialBottomTabNavigator();
    const [user,setUser]=useState(null);

    useEffect(()=>{
        async function getUser()
        {
            let response=await AsyncStorage.getItem('userData');
            let json=JSON.parse(response);
            setUser(json.name);
        }
        getUser();
    },[]);


    //mensagem de backhandler, ao clicar em voltar, ele alerta o usuário
    useEffect(() => {
        const backAction = () => {
            Alert.alert("Alerta!", "Deseja mesmo sair do app?", [
                {
                    text: "Não",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: "Sim", onPress: () => {
                    navigation.navigate('Home');
                    BackHandler.exitApp();
                    }
                }
            ]);
            return true;
        };
    
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
    
        return () => backHandler.remove();
    }, []);

    return (
        <Tab.Navigator
                activeColor='#999'
                inactiveColor='#fff'
                barStyle={css.area__tab}
        >
            <Tab.Screen
                    name="Mudar Senha"
                    component={Profile}
                    options={{
                    tabBarIcon:()=>(
                        <Icon name="address-card" size={20} color="#FFA500" />
                    )
                }}
            />
            <Tab.Screen
                    name="Novo Produto"
                    component={Cadastro}
                    options={{
                    tabBarIcon:()=>(
                        <Icon name="cloud" size={20} color="#FFA500" />
                    )
                }}
            />
            <Tab.Screen
                    name=" Ler QRCode"
                    component={Edicao}
                    options={{
                    tabBarIcon:()=>(
                        <Icon name="qrcode" size={20} color="#FFA500" />
                    )
                }}
            />
        </Tab.Navigator>
    );
}