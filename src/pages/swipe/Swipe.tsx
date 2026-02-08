import { Text, TouchableWithoutFeedback, useWindowDimensions, View } from "react-native";
import SwipeStyle from "./css/SwipeStyle";
import { GestureResponderEvent } from "react-native";
import { useState } from "react";

let startEvent : GestureResponderEvent | null = null
const minSwipeLength = 100;     // dip 
const minSwipeVelocity = 0.2;   // 100 dip / 500 ms

interface ISwipeData {
    eventDetails: string,
    eventMessage: string,
}

export default function Swipe() {
    const {width, height} = useWindowDimensions();
    const [data, setData] = useState<ISwipeData>({
        eventDetails: "",
        eventMessage: "",
    });

    const shortSide = Math.min(width, height);
    const fieldSide = 0.94 * shortSide;             // 94% from min side
    const direction = width < height ? "column" : "row";

    const beginGesture = (e:GestureResponderEvent) => {
        startEvent = e;
    };

    const endGesture = (e: GestureResponderEvent) => {
        if(startEvent != null){
            const dx = e.nativeEvent.pageX - startEvent.nativeEvent.pageX;
            const dy = e.nativeEvent.pageY - startEvent.nativeEvent.pageY;
            const dt = e.nativeEvent.timestamp - startEvent.nativeEvent.timestamp;
            
            if (Math.abs(dx) > 2 * Math.abs(dy)) {          // horizontal
                if(Math.abs(dx) / dt > minSwipeVelocity && Math.abs(dx) > minSwipeLength){
                    if (dx > 0){
                        data.eventMessage = "right";
                    }else{
                        data.eventMessage = "left";
                    }
                }else{
                    data.eventMessage = "horizontal limited";
                }

            }else if (Math.abs(dy) > 2 * Math.abs(dx)) {    // vertival
                if(Math.abs(dy) / dt > minSwipeVelocity && Math.abs(dy) > minSwipeLength){
                    if (dy > 0){
                        data.eventMessage = "down";
                    }else{
                        data.eventMessage = "up";
                    }
                } else{
                    data.eventMessage = "vertical limited";
                }
            }
            else { // not sure -- diagonal
                data.eventMessage = "diagonal";
            }
            startEvent = null
            setData({...data, 
                eventDetails: `dx=${dx.toFixed(1)}, dy=${dy.toFixed(1)}, dt=${dt}`
            })
        }
    };

    return <View style={[SwipeStyle.swipeConteiner, {flexDirection: direction}]}>
        <Text style={SwipeStyle.swipeTitel}>Swipe {data.eventMessage}</Text>

        <TouchableWithoutFeedback onPressIn={beginGesture} onPressOut={endGesture}>
            <View style={[SwipeStyle.swipeField, {width: fieldSide, height: fieldSide}]}>
            </View>
        </TouchableWithoutFeedback>

        <Text style={SwipeStyle.swipeTitel}>{data.eventDetails}</Text>
        <View />
    </View>
};