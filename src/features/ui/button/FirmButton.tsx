import { Children } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { textColor } from "../../values/colors";

export const ButtonTypes = {
  primary: 'primary',
  success: 'success',
  danger: 'danger',
} as const;

export type ButtonTypes = typeof ButtonTypes[keyof typeof ButtonTypes];

export function FirmButton({buttonType, title, action}:{
    buttonType?:ButtonTypes,
    title: string,
    action?: () => void
}) {
    if(!buttonType) {
        buttonType = ButtonTypes.primary;
    }
    return <TouchableOpacity style={[styles.firmButton, 
        (buttonType == ButtonTypes.danger ? styles.danger
        :buttonType == ButtonTypes.success ? styles.success
        :styles.primary 
        )
    ]}>
        <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>;
}

const styles = StyleSheet.create({
    title: {
        color: textColor,
    },
    firmButton: {
        borderRadius: 7.0,
        borderWidth: 1.0,
        padding: 5.0,
        paddingVertical: 10,
        paddingHorizontal: 15,
        width: "auto"
    },
    primary: {
        backgroundColor: "#414db6",
        borderColor: "#00384e"
    },
    success: {
        backgroundColor: "rgb(24, 150, 24)",
        borderColor: "rgb(60, 131, 1)",
    },
    danger: {
        backgroundColor: "rgb(209, 29, 29)",
        borderColor: "rgb(114, 0, 25)",
        

    }
});
