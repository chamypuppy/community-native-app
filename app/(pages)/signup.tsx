import AsyncStorage from '@react-native-async-storage/async-storage';
import bcrypt from 'bcryptjs';
import { router } from 'expo-router';
import React, { useEffect, useState } from "react";
import { Button, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
/* function onChangeInput(e) {
  console.log(e.target.value);
} */
/* const onChangeInput = (e) => console.log(e); */
const STORAGE_KEY = "@formData"
const USERS_KEY = "@usersData";

export default function signup() {
  //const formData = new FormData({});
  //const formData = useState({});
  const [id, setId] = useState("");
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({form_id: "", form_pwd1: "", form_pwd2: "",
    form_name: "", form_tel: "", form_email: ""});
  const [errorPwdComment, setErrorPwdComment] = useState("");
  const [errorEmailComment, setErrorEmailComment] = useState("");
  const recommDomainList = [
    "@gmail.com", "@naver.com", "@daum.net",
    "@hanmail.net", "@yahoo.com", "@outlook.com",
    "@nate.com", "@kakao.com"];
  const [newEmail, setNewEmail] = useState<string[]>([]);

  function onChangeInput(formKey: string, formValue: string) {

    const emptyCheck = /\s/;
    //const engCheck = /[a-zA-Z]/;
    const korCheck = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    const numCheck = /[0-9]/;
    const notNumber = /[^0-9]+$/;


    /* 공통) 입력값 조사 */
    if(emptyCheck.test(formValue)) {
      alert("공백 사용은 불가합니다.");
      formValue = formValue.replace(emptyCheck, "");
      return;
    } else if (korCheck.test(formValue) && formKey !== "form_name") {
      alert("영문과 숫자만 가능합니다.");
      formValue = formValue.replace(korCheck, "");
      return;
    }

    /* 개인) 입력값 조사 */
    if(formKey === "form_tel" && !numCheck.test(formValue)) {
      alert("전화번호는 숫자만 입력 가능합니다.");
      formValue = formValue.replace(notNumber, "");
    }
    /* 위 조건 통과 시) Save */
    setFormData(newFormData => ({
      ...newFormData,
      [formKey] : formValue,
      /* form_email : selectedEmail,
      [formKey]: formKey !== "form_email" ? formValue : newFormData[formKey], */
    }));
  };
  console.log(formData);

  function onChangeEmail(formEmailValue: string) {
    //setEmail(formEmailValue);

    const userEmail = recommDomainList.map((domainAddress) => {
      const pureId = formEmailValue.split("@")[0];
      return email.includes("@") ? pureId + domainAddress : formEmailValue + domainAddress;
    });
    setNewEmail(userEmail);
  };

  const onSubmitForm = async (formData: any) => {

    const formObject: any = {form_id: "아이디", form_pwd1: "비밀번호", form_pwd2: "비밀번호 확인",
    form_name: "이름", form_tel: "전화번호", form_email: "이메일"};

    const formKeys = Object.keys(formObject);
    for(let key of formKeys) {
      if(!formData[key] || formData[key].trim() === '') {
        alert(`${formObject[key]}을/를 입력해 주세요!`);
        return;
      }
    }

    try {
    /* 아이디, 비번 최후 검증 */
    const formIdValue = formData.form_id.trim(); // input value
    if(formIdValue && formIdValue.length < 6) {
      return alert("아이디는 6글자 이상으로 입력해 주세요.");
    } 
    const formPwd1Value = formData.form_pwd1.trim();
    const formPwd2Value = formData.form_pwd2.trim();
    const isMatched = (formPwd1Value === formPwd2Value);
      if(!isMatched && formPwd1Value && formPwd2Value) {
        return alert("비밀번호가 동일하지 않습니다.");
      } else if(formPwd1Value.length < 6 || formPwd1Value.length < 6) {
        return alert("비밀번호를 6글자 이상으로 입력해 주세요.");
      }


      /* 저장 전 아이디 동일여부확인 */
      const originUsersData = await AsyncStorage.getItem(USERS_KEY);
      let usersArrList = originUsersData ? JSON.parse(originUsersData) : [];
      const isExisting = (user: { form_id: string; }) => user.form_id === formData.form_id;
      const isExistingUser = usersArrList.some(isExisting);

      if(isExistingUser) {
        setId("이미 존재하는 아이디입니다.");
        return;
      }

      /* 비밀번호 hash화 */
      const hashPwd = bcrypt.hashSync(formData.form_pwd1, 10);

      /* setFormData(newFormData => ({
      ...newFormData,
      form_pwd1: hashPwd,
      form_pwd2: hashPwd
      })); */
      const hashFormData = {
        ...formData,
        form_pwd1: hashPwd,
        form_pwd2: hashPwd
      };
      setFormData(hashFormData);

      usersArrList.push(hashFormData);

      

      //const jsonFormValue = JSON.stringify(formData);
      const jsonValue = JSON.stringify(usersArrList);

      await AsyncStorage.setItem(USERS_KEY, jsonValue);
      //await AsyncStorage.setItem(STORAGE_KEY, jsonFormValue);
      alert("회원가입에 성공했습니다!");
      const saveFormData = await AsyncStorage.getItem(USERS_KEY);
      console.log(saveFormData);
      router.push("/");

    } catch {
      console.error("🟠 signup.tsx 오류: 회원가입에 오류가 발생했습니다.");
    }
  }

  useEffect(() => {
    const formIdValue = formData.form_id.trim();
    if(formIdValue && formIdValue.length < 6) {
      setId("아이디는 6글자 이상부터 가능합니다.");
    } else {
      setId("");
    }
  }, [formData.form_id]);

  useEffect(() => {
    const formPwd1Value = formData.form_pwd1.trim();
    const formPwd2Value = formData.form_pwd2.trim();
    const isMatched = (formPwd1Value === formPwd2Value);
      if(!isMatched && formPwd1Value && formPwd2Value) {
        setErrorPwdComment("비밀번호가 동일하지 않습니다.");
      } else if(formPwd1Value.length < 6 || formPwd1Value.length < 6){
        setErrorPwdComment("비밀번호는 최소 6글자 이상이어야 합니다.");
      } 
      else {
        setErrorPwdComment("");
      }
  }, [formData.form_pwd1, formData.form_pwd2]);

  useEffect(() => {
    //emailMarkCheck
    const isEmailMark = formData.form_email.includes("@");
    if(formData.form_email && !isEmailMark) {
      setErrorEmailComment("이메일 도메인 주소를 입력해 주세요.");
    } else {
      setErrorEmailComment("");
    }
  }, [formData.form_email]);

  return(
    <KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
  keyboardVerticalOffset={60}  // 필요시 조정
>
    <ScrollView
    keyboardShouldPersistTaps="handled"
    >
      <View style={styles.formContainer}>
        <Text style={styles.label}>아이디</Text>
        <Text style={styles.errorComment}>{id}</Text>
        <TextInput
          onChangeText={(formValue) => onChangeInput("form_id", formValue)}
          placeholder='아이디'
          accessibilityLabel="아이디 입력 input"
          value={formData.form_id}
          style={styles.input}
          returnKeyType="send"
        />

        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          onChangeText={(formValue) => {
            onChangeInput("form_pwd1", formValue);
            setPwd1(formValue);
          }}
          placeholder='비밀번호'
          accessibilityLabel="비밀번호 입력 input"
          value={formData.form_pwd1}
          secureTextEntry={true}
          style={styles.input}
          returnKeyType="send"
        />

        <Text style={styles.label}>비밀번호 확인</Text>
        <Text style={styles.errorComment}>{errorPwdComment}</Text>
        <TextInput
          onChangeText={(formValue) => {
            onChangeInput("form_pwd2", formValue);
            setPwd2(formValue);
            }}
          placeholder='비밀번호 확인'
          accessibilityLabel="비밀번호 확인 입력 input"
          value={formData.form_pwd2}
          secureTextEntry={true}
          style={styles.input}
          returnKeyType="send"
        />

        <Text style={styles.label}>이름</Text>
        <TextInput
          onChangeText={(formValue) => onChangeInput("form_name", formValue)}
          placeholder="이름"
          accessibilityLabel="이름 입력 input"
          value={formData.form_name}
          style={styles.input}
        />

        <Text style={styles.label}>전화번호</Text>
        <TextInput
          onChangeText={(formValue) => onChangeInput("form_tel", formValue)}
          keyboardType="phone-pad"
          placeholder="전화번호"
          accessibilityLabel="전화번호 입력 input"
          value={formData.form_tel}
          style={styles.input}
          returnKeyType="send"
        />
        
        <Text style={styles.label}>이메일</Text>
        <Text style={styles.errorComment}>{errorEmailComment}</Text>
        <TextInput
          onChangeText={(formValue) => {
            onChangeInput("form_email", formValue);
            onChangeEmail(formValue);          
          }}
          keyboardType="email-address"
          placeholder="ooo@domain.com"
          accessibilityLabel="이메일 입력 input"
          value={formData.form_email}
          style={styles.input}
        />
        
        {newEmail.map((formEmailValue, index) => (
          <TouchableOpacity
            key={index}  // 또는 key={item}
            onPress={() => {
              setFormData((newFormData) => ({
                ...newFormData,
                form_email: formEmailValue,
              }))
              setNewEmail([]);
            }}>
            <Text>{formEmailValue}</Text>
          </TouchableOpacity>
        ))}
        
        
        <Button
          onPress={() => onSubmitForm(formData)}
          title="회원가입"
          accessibilityLabel="회원가입 완료 버튼"
          color="#841584"
        />
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
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
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  label: {
  fontSize: 16,
  marginBottom: 5,
  fontWeight: 'bold',
  paddingTop: 10,
  },
  errorComment: {
    color: "#cd5c5c",
  },
  btn: {
    marginTop: 100,
  },

})
