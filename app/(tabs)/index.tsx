import AsyncStorage from "@react-native-async-storage/async-storage";
import bcrypt from "bcryptjs";
import { router } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
//import  USERS_KEY  from "../(pages)/signup";

const USERS_KEY = "@usersData";

export default function HomeScreen() {
  const [loginFormData, setLoginFormData] = useState({form_id: "", form_pwd: ""});

  function onChangeLoginInput(formKey: string, formValue: string) {

    const emptyCheck = /\s/;
    //const engCheck = /[a-zA-Z]/;
    const korCheck = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

    /* 넣기전에 입력값조사 */
    if(emptyCheck.test(formValue)) {
      alert("공백 입력은 불가합니다.");
      formValue = formValue.replace(emptyCheck, "");
      return;
    }
    if(korCheck.test(formValue) && formKey === "form_id") {
      alert("영문, 숫자만 입력 가능합니다.");
      formValue = formValue.replace(korCheck, "");
      return;
    }


    setLoginFormData((newLoginFormData) => ({
      ...newLoginFormData,
      [formKey]: formValue,
    }));
  }

  async function onSubmitLoginForm() {

    /* 유효성검사 */
    if(!loginFormData.form_id.trim()) {
      alert("아이디를 입력해 주세요.");
      return;
    };
    if(!loginFormData.form_pwd.trim()) {
      alert("비밀번호를 입력해 주세요");
      return;
    };
    
    try {
      const saveFormData = await AsyncStorage.getItem(USERS_KEY);
      console.log(saveFormData);

      if(!saveFormData) {
        alert("등록된 사용자가 없습니다.");
        return;
      }

      const signupUserArr = JSON.parse(saveFormData);

      const findUserId = (user: { form_id: string; }) => user.form_id === loginFormData.form_id;
      const user = signupUserArr.find(findUserId);

      if(!user) {
        alert("가입되어있지 않은 아이디입니다.")
        return;
      };

      const compareHashPwd = bcrypt.compareSync(loginFormData.form_pwd, user.form_pwd);

      if(!compareHashPwd) {
        alert("비밀번호가 틀렸습니다.");
        return;
      };

      alert("로그인 되었습니다!");
      router.push("/home");


    } catch {
      console.log("🟠 index.tsx 오류: 로그인에 오류가 발생했습니다.");
      alert("로그인 중 오류가 발생했습니다.\n다시 시도해 주세요.");
    };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>안녕하세요</Text>
      <Text style={[styles.title, styles.subtitle]}>로그인</Text>
      <TextInput
        style={styles.input}
        placeholder='아이디'
        onChangeText={(formValue) => {onChangeLoginInput("form_id", formValue)}}
      />
      <TextInput
        style={styles.input}
        placeholder='비밀번호'
        secureTextEntry={true}
        onChangeText={(formValue) => {onChangeLoginInput("form_pwd", formValue)}}
      />
      <Button
        onPress={onSubmitLoginForm}
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
