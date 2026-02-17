import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import AuthStyle from './css/AuthStyle';
import { useContext, useEffect, useState } from 'react';
import { textColor } from '../../features/values/colors';
import AppContext from '../../features/context/AppContext';


export default function Auth() {
    const [login, setLogin] = useState("user");
    const [password, setPassword] = useState("123");
    const [isFormValid, setFormValid] = useState(false);
    const {user, setUser} = useContext(AppContext);

    useEffect(() => {
        setFormValid(login.length > 2 && password.length > 2);
    }, [login, password]);

    const signInClick = () => {
        if(login == 'user' && password == '123') {
            setUser({
                name: 'User',
                token: '123',
                email: "user@local.lan",
                phone: "+380637891653",
                currency: "UAH"
            });
        }
    };

    const signOutClick = () => {
        setUser(null);
    }

    return !!user 
    ? <View style={AuthStyle.authContainer}>
        <View style={AuthStyle.userDetails}>
            <Text style={AuthStyle.authRowText}>Вітання, {user.name}</Text>
            <Text style={AuthStyle.authRowText}>Email: {user.email}</Text>
            <Text style={AuthStyle.authRowText}>Phone number: {user.phone}</Text>
            {user.currency && <Text style={AuthStyle.authRowText}>Your currency: {user.currency}</Text>}
            <TouchableOpacity style={AuthStyle.authButton} onPress={signOutClick}>
                <Text style={[AuthStyle.authButtonText, {color: textColor}]}>Вихід</Text>
            </TouchableOpacity>
        </View>
    </View>

    : <View style={AuthStyle.authContainer}>
        <View style={AuthStyle.authRow}>
            <Text style={AuthStyle.authRowText}>Логін</Text>
            <TextInput style={AuthStyle.authRowInput} value={login} onChangeText={setLogin} />
        </View>

        <View style={AuthStyle.authRow}>
            <Text style={AuthStyle.authRowText}>Пароль</Text>
            <TextInput secureTextEntry={true} style={AuthStyle.authRowInput} value={password} onChangeText={setPassword} />
        </View>

        <TouchableOpacity style={AuthStyle.authButton} onPress={isFormValid ? signInClick : undefined}>
            <Text style={[AuthStyle.authButtonText, {color: isFormValid ? textColor : "#777"}]}>Вхід</Text>
        </TouchableOpacity>

    </View>;
}
/*
Д.З. Розширити дані, що характеризують користувача:
додати номер телефону, E-mail, інші дані (за профілем застосунку)
вивести відповідні дані на сторінці-профілі,
до звіту з ДЗ додати скріншот
*/