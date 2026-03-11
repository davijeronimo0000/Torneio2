import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeInDown.delay(100).duration(800)} style={styles.header}>
        <Text style={styles.title}>Torneio</Text>
        <Text style={styles.subtitle}>Praça José Augusto</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).duration(800)} style={styles.sponsorContainer}>
        <Text style={styles.sponsorText}>Apoio Oficial</Text>
        <View style={styles.sponsorBox}>
          <Text style={styles.sponsorLogo}>INFACOZ</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(500).duration(800)} style={styles.messageBox}>
        <Text style={styles.messageTitle}>Apoie o Esporte Local</Text>
        <Text style={styles.messageText}>
          Esta é uma iniciativa voluntária para todos acompanharem o torneio da Quadra José Augusto. A plataforma é 100% gratuita para a comunidade!
          {'\n\n'}
          Se você quiser fortalecer o projeto e a organização, considere fazer um Pix de apoio. Qualquer valor ajuda manter o torneio vivo!
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(800).duration(800)} style={styles.footer}>
        <TouchableOpacity 
          style={styles.buttonAccess}
          activeOpacity={0.8}
          onPress={async () => {
            // Salvar token_acesso "acesso_livre" p/ pular api verificação pix
            await SecureStore.setItemAsync('token_dispositivo', 'free_device_' + Date.now());
            await SecureStore.setItemAsync('token_acesso', 'acesso_livre');
            navigation.replace('Webview');
          }}
        >
          <Text style={styles.buttonAccessText}>Acessar Gratuitamente</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.buttonSupport}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Payment')}
        >
          <Text style={styles.buttonSupportText}>Quero Apoiar com Pix 💙</Text>
        </TouchableOpacity>
        
        <Text style={styles.loginText}>
          Não é necessário criar conta. O acesso é imediato!
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // slate-900
    padding: 24,
  },
  header: {
    marginTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3b82f6', // blue-500
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  sponsorContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  sponsorText: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sponsorBox: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sponsorLogo: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  messageBox: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  messageTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  messageText: {
    color: '#cbd5e1',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  footer: {
    marginBottom: 20,
  },
  buttonAccess: {
    backgroundColor: '#3b82f6',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonAccessText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonSupport: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  buttonSupportText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#64748b',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 12,
  }
});
