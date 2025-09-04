import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function PagesLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}