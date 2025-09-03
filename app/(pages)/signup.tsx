import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
/* function onChangeInput(e) {
  console.log(e.target.value);
} */
/* const onChangeInput = (e) => console.log(e); */
const STORAGE_KEY = "@formData"

export default function signup() {
  //const formData = new FormData({});
  //const formData = useState({});
  const [id, setId] = useState("");
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({form_id: "", form_pwd1: "", form_pwd2: "",
    form_name: "", form_tel: "", form_email: ""
  });

  function onChangeInput(formKey: string, formValue: string) {
    //console.log(e);

    if(!formData.form_id || formData.form_id.trim() == '') {
      return alert("아이디를 입력하세요.");
    } else if(formData.form_id.length < 6) {
      return alert("아이디는 6글자 이상부터 가능합니다.");
    }


    setFormData(newFormData => ({
      ...newFormData,
      [formKey] : formValue,
    }));
  }
  console.log(formData);

  const onSubmitForm = async (formData: any) => {
    // const newFormData = Object.assign({}, formData, {[]});
    const isMatched = (formData.form_pwd1 === formData.form_pwd2);

    if(!isMatched) {
      return alert("비밀번호가 동일하지 않습니다.");
    }

    try {
      const jsonFormValue = JSON.stringify(formData);
      await AsyncStorage.setItem(STORAGE_KEY, jsonFormValue);
      alert("회원가입에 성공했습니다!");
      router.push("/home");

    } catch {
      console.error("🟠 signup.tsx 오류: 회원가입에 오류가 발생했습니다.");
    }
  }

  return(
    <View style={styles.container}>
      <Text style={styles.label}>아이디</Text>
      <TextInput
        onChangeText={(formValue) => onChangeInput("form_id", formValue)}
        placeholder='아이디'
        value={formData.form_id}
        style={styles.input}
        returnKeyType="send"
      />

      <Text style={styles.label}>비밀번호</Text>
      <TextInput
        onChangeText={(formValue) => onChangeInput("form_pwd1", formValue)}
        placeholder='비밀번호'
        value={formData.form_pwd1}
        secureTextEntry={true}
        style={styles.input}
        returnKeyType="send"
      />

      <Text style={styles.label}>비밀번호 확인</Text>
      <TextInput
        onChangeText={(formValue) => onChangeInput("form_pwd2", formValue)}
        placeholder='비밀번호'
        value={formData.form_pwd2}
        secureTextEntry={true}
        style={styles.input}
        returnKeyType="send"
      />

      <Text style={styles.label}>이름</Text>
      <TextInput
        onChangeText={(formValue) => onChangeInput("form_name", formValue)}
        keyboardType="phone-pad"
        placeholder="이름"
        value={formData.form_name}
        style={styles.input}
      />

      <Text style={styles.label}>전화번호</Text>
      <TextInput
        onChangeText={(formValue) => onChangeInput("form_tel", formValue)}
        keyboardType="phone-pad"
        placeholder="전화번호"
        value={formData.form_tel}
        style={styles.input}
        returnKeyType="send"
      />
      
      <Text style={styles.label}>이메일</Text>
      <TextInput
        onChangeText={(formValue) => onChangeInput("form_email", formValue)}
        keyboardType="email-address"
        placeholder="ooo@domain.com"
        value={formData.form_email}
        style={styles.input}
      />
      
      <Button
        onPress={onSubmitForm}
        title="회원가입"
        color="#841584"
        accessibilityLabel="회원가입"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1, 
    // backgroundColor: "#fff",
    alignItems: "center",
  },
  input:{
    width: 220,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  label: {
  fontSize: 16,
  marginBottom: 5,
  fontWeight: 'bold',
  paddingTop: 30,
  },
  btn: {
    marginTop: 100,
  }
})
