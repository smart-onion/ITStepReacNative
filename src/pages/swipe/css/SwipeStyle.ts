import { StyleSheet } from "react-native";
import { textColor } from "../../../features/values/colors";

const SwipeStyle = StyleSheet.create({
    swipeConteiner: {
        flex: 1,
        display: "flex",
        // flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
    },
    swipeTitel: {
        color: textColor,
    },
    swipeField: {
        borderColor: textColor,
        borderBlockColor:textColor,
        borderLeftColor:textColor,
        borderRightColor: textColor,
        borderRadius: 10.0,
        borderWidth: 1.0,
    },
});

export default SwipeStyle;