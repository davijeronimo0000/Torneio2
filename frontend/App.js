import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import api from './src/services/api';

import WelcomeScreen from './src/screens/WelcomeScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import TournamentWebviewScreen from './src/screens/TournamentWebviewScreen';
import { ActivityIndicator, View, Text } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const tokenDispositivo = await SecureStore.getItemAsync('token_dispositivo');
      const tokenAcesso = await SecureStore.getItemAsync('token_acesso');

      if (tokenDispositivo && tokenAcesso) {
        // Se o token for a flag de acesso livre, não precisa consultar a API de verificação de pix
        if (tokenAcesso === 'acesso_livre') {
          setHasAccess(true);
          setIsLoading(false);
          return;
        }

        // Verifica no backend se ainda é válido o pagamento Pix
        const response = await api.post('/payment/verify-access', {
          token_dispositivo: tokenDispositivo,
          token_acesso: tokenAcesso
        });
        
        if (response.data.has_access) {
          setHasAccess(true);
        } else {
          // Token inválido/revogado
          await SecureStore.deleteItemAsync('token_acesso');
        }
      }
    } catch (e) {
      console.log('Erro ao verificar acesso:', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a'}}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{color: 'white', marginTop: 16}}>Verificando acesso...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {hasAccess ? (
          <Stack.Screen name="Webview" component={TournamentWebviewScreen} />
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="Webview" component={TournamentWebviewScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
