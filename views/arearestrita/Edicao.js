import React, {useState,useEffect} from 'react';
import {Text, View, Button, TextInput, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MenuAreaRestrita from "../../assets/components/MenuAreaRestrita";
import { BarCodeScanner } from 'expo-barcode-scanner';
import {css} from '../../assets/css/Css';
import config from '../../config/config';

export default function Edicao({navigation}) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [displayQR, setDisplayQR] = useState('flex');
    const [displayForm, setDisplayForm] = useState('none');
    const [code, setCode] = useState(null);
    const [product, setProduct] = useState(null);
    const [localization, setLocalization] = useState(null);
    const [response, setResponse] = useState(null);
    

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    //Leitura do código QR
    async function handleBarCodeScanned({ type, data }){
        setScanned(true);
        setDisplayQR('none');
        setDisplayForm('flex');
        setCode(data);
        await searchProduct(data)
    }

    async function searchProduct(codigo)
{
    let response=await fetch(config.urlRoot+'searchProduct',{
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: codigo
        })
    });
    let json=await response.json();
    setProduct(json.Products[0].name);
}
//Nova leitura do QRCode
async function readAgain()
{
    setScanned(false);
    setDisplayQR('flex');
    setDisplayForm('none');
    setCode(null);
    setProduct(null);
    setLocalization(null);
}
//Envia o formulário com os dados para edição
async function sendForm() {
    let response=await fetch(config.urlRoot+'update',{
       method: 'POST',
       headers:{
            Accept: 'application/json',
           'Content-type':'application/json'
       },
        body: JSON.stringify({
            code: code,
            product: product,
            local: localization
        })
    });
    let json=await response.json();
    setResponse(json);
}
    //Envia o formulário com os dados para edição
async function sendForm() {
    let response=await fetch(config.urlRoot+'update',{
       method: 'POST',
       headers:{
            Accept: 'application/json',
           'Content-type':'application/json'
       },
        body: JSON.stringify({
            code: code,
            product: product,
            local: localization
        })
    });
    let json=await response.json();
    setResponse(json);
}

    return (
        <View>
            <MenuAreaRestrita title='Edição' navigation={navigation} />

            <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : value=>handleBarCodeScanned(value)}
                style={css.qr__code(displayQR)}
            />

            <View style={css.qr__form(displayForm)}>
                <Text>                                   Código: {code}</Text>
                <Text>{response}</Text>

                

                 
                {scanned &&
    <View style={css.login__button}>
        <Button
                title='Escanear Novamente'
                onPress={()=>readAgain()}
        />
    </View>

    
}
                
            </View>
        </View>
    );
}