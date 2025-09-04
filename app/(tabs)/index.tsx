import { router } from "expo-router";
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>안녕하세요</Text>
      <Text style={[styles.title, styles.subtitle]}>로그인</Text>
      <TextInput
        style={styles.input}
        placeholder='아이디'
        
      />
      <TextInput
        style={styles.input}
        placeholder='비밀번호'
        secureTextEntry={true} 
      />
      <Button
        onPress={() => {}}
        title="로그인"
        color="#841584"
        accessibilityLabel="로그인"
      />
      <Text style={[styles.title, styles.subtitle]}>회원이 아니신가요?</Text>
      <Button
        onPress={() => {router.push("/signup")}}
        title="회원가입"
        color="#841584"
        accessibilityLabel="회원가입"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1, 
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 100,
  },
  title: {
    fontSize: 38,
  },
  subtitle: {
    paddingTop: 50,
  },
  input: {
    width: 200,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    /* borderColor: "#fff", */
  },

  
});
