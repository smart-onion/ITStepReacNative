import { Image, Text, TouchableOpacity, View } from "react-native";
import HomeStyle from "./css/HomeStyle";
import { useContext } from "react";
import AppContext from "../../features/context/AppContext";
import { ImageSourcePropType } from "react-native";

export default function Home() {
    const {navigate} = useContext(AppContext);

    return <View style={HomeStyle.homeContainer}>
        
        <MenuItem   title="Calculator"  imageSource={require(`../../features/assets/img/calc.png`)}     slug="calc" />
        <MenuItem  title="Swipe"        imageSource={require(`../../features/assets/img/swipe.png`)}    slug="swipe" />
        <MenuItem  title="Animation"    imageSource={require(`../../features/assets/img/anim.png`)}     slug="anim" />

    </View>;
}

function MenuItem({title, imageSource, slug}: {title:string, imageSource:ImageSourcePropType, slug:string}) {
    const {navigate} = useContext(AppContext);

    return <TouchableOpacity 
            onPress={() => navigate({slug:slug})} 
            style={HomeStyle.menuItem}>

            <Image 
                source={imageSource} 
                style={HomeStyle.homeImage} />

            <Text style={HomeStyle.homeLabel}>{title}</Text>

        </TouchableOpacity>
}