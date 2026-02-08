import { StyleSheet } from "react-native";

const AnimStyle = StyleSheet.create({
    animLayout:{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    animRow:{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",

    },
    animItem:{
        flex: 1,
        margin: 10,
        backgroundColor: "#555",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    animBlock: {
        width: 100,
        height: 100,
        backgroundColor: "#888",

    },
})
export default AnimStyle;