import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';

// A URL onde vai estar rodando o Front-end "Mobile Friendly" da plataforma.
// Por enquanto, vamos apontar para o admin rodando localmente (que depois pode ter uma rota /app ou ser um projeto Vite separado)
// Exemplo: 'http://192.168.1.8:5173'
const PLATFORM_URL = 'http://192.168.1.8:5173/app';

export default function TournamentWebviewScreen() {
  const [loading, setLoading] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      )}
      <WebView
        source={{ uri: PLATFORM_URL }}
        style={styles.webview}
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Cor do preenchimento da safe area
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  }
});
