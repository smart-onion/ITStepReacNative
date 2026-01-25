import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Home from "../../pages/home/Home.tsx";
import { Text, View} from "react-native";
import AppStyles from "./AppStyles.ts";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['bottom', 'top']} style={AppStyles.container}>
        <View style={AppStyles.header}>
            <Text style={AppStyles.title}>App bar</Text>
        </View>

        <View style={AppStyles.main}>
            <Home />
        </View>

        <View >
            <Text style={AppStyles.footer}>Home</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


