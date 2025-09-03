import { Stack } from 'expo-router';

export default function PagesLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="signup" 
        options={{ 
          headerShown: false,  // 헤더 완전히 숨기기
        }} 
      />
      {/* 다른 페이지들도 추가 가능 */}
      <Stack.Screen 
        name="login" 
        options={{ 
          headerShown: false,
        }} 
      />
    </Stack>
  );
}