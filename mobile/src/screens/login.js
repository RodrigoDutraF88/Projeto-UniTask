import { View, Text, TextInput, Button } from 'react-native';

export default function Login() {
  return (
    <View>
      <Text>Email</Text>
      <TextInput />

      <Text>Senha</Text>
      <TextInput secureTextEntry />

      <Button title="Entrar" />
    </View>
  );
}

