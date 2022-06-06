import React, {useState,useEffect} from 'react';
import {Text, View,TextInput, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {css} from '../../assets/css/Css';
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuAreaRestrita from "../../assets/components/MenuAreaRestrita";
import config from "../../config/config";

export default function Profile({navigation}) {

    const [idUser, setIdUser] = useState(null);
    const [senhaAntiga, setSenhaAntiga] = useState(null);
    const [novaSenha, setNovaSenha] = useState(null);
    const [confNovaSenha, setConfNovaSenha] = useState(null);
    const [msg, setMsg] = useState(null);

    useEffect(()=>{
       async function getIdUser()
       {
           let response=await AsyncStorage.getItem('userData');
           let json=JSON.parse(response);
           setIdUser(json.id);
       }
       getIdUser();
    });

    async function sendForm()
    {
        let response=await fetch(`${config.urlRoot}verifyPass`,{
            method:'POST',
            body:JSON.stringify({
                id: idUser,
                senhaAntiga: senhaAntiga,
                novaSenha: novaSenha,
                confNovaSenha: confNovaSenha
            }),
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });
        let json=await response.json();
        setMsg(json);
    }

    return (
        <View style={[css.container, css.containerTop]}>
            <MenuAreaRestrita title='Perfil' navigation={navigation} />

            <View style={[css.area__title, ]}>
                <Text>{msg}</Text>
                <TextInput style={[css.login__button,css.area__title]} placeholder='Senha Antiga:' onChangeText={text=>setSenhaAntiga(text)} />
                <TextInput style={[css.login__button,css.area__title]} placeholder='Nova Senha:' onChangeText={text=>setNovaSenha(text)} />
                <TextInput style={[css.login__button,css.area__title]} placeholder='Confirmar Senha:' onChangeText={text=>setConfNovaSenha(text)} />
                <TouchableOpacity onPress={()=>sendForm()}>
                    <Text style={[css.login__button,css.login__buttonText]}>Trocar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}