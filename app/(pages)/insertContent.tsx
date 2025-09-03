import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const insertContent = () => {
  return(
    <View>
      <TextInput
        multiline
        placeholder=""
        
      />
    </View>
  );
}

export default insertContent;