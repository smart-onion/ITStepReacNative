import { View, Text, Animated, Pressable } from "react-native"
import AnimStyle from "./css/AnimStyle"

let opacityValue = new Animated.Value(1);

export default function Anim(){

    const opacityPress = () => {
        Animated.timing(opacityValue, {
            toValue: 0,
            useNativeDriver: true,
            duration: 1000,

        }).start();
    }
    

    return <View style={AnimStyle.animLayout}>
        <View style={AnimStyle.animRow}>
            <View style={AnimStyle.animItem}>
                <Pressable onPress={opacityPress}>
                    <Animated.View style={{opacity: opacityValue}}>
                    <View style={AnimStyle.animBlock} />
                    </Animated.View>
                </Pressable>
            </View>
            <View style={AnimStyle.animItem}></View>
        </View> 
        <View style={AnimStyle.animRow}>
            <View style={AnimStyle.animItem}></View>
            <View style={AnimStyle.animItem}></View>
        </View>
    </View>
}