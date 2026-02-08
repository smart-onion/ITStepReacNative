import { View, Text, Animated, Pressable } from "react-native"
import AnimStyle from "./css/AnimStyle"

const opacityValue = new Animated.Value(1);

export default function Anim(){

    const opacityPress = () => {
        Animated.timing(opacityValue, {
            toValue: 0,
            useNativeDriver: true,
            duration: 1000,

        })
    }
    

    return <View style={AnimStyle.animLayout}>
        <View style={AnimStyle.animRow}>
            <View style={AnimStyle.animItem}>
                <Pressable onPress={opacityPress}>
                    <View style={[AnimStyle.animBlock, {opacity: opacityValue}]} />
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