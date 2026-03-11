import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert, Image } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';
import * as Clipboard from 'expo-clipboard';
import api from '../services/api';

const VALUES = [1, 2, 5, 10];

export default function PaymentScreen({ navigation }) {
  const [selectedValue, setSelectedValue] = useState(2);
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null); // { qr_code, uuid }
  const [checkingPayment, setCheckingPayment] = useState(false);

  // Simula um UUID unico de devide installation
  const getDeviceToken = async () => {
    let token = await SecureStore.getItemAsync('token_dispositivo');
    if (!token) {
      token = 'device_' + Math.random().toString(36).substring(7);
      await SecureStore.setItemAsync('token_dispositivo', token);
    }
    return token;
  };

  const handleGeneratePix = async () => {
    setLoading(true);
    try {
      const token = await getDeviceToken();
      const response = await api.post('/payment/pix', {
        valor: selectedValue,
        token_dispositivo: token
      });
      setPaymentData(response.data);
      pollPaymentStatus(response.data.uuid);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível gerar o código Pix.');
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = (uuid) => {
    setCheckingPayment(true);
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/payment/check/${uuid}`);
        if (res.data.status === 'aprovado' && res.data.token_acesso) {
          clearInterval(interval);
          setCheckingPayment(false);
          // Salva o token de acesso e redireciona
          await SecureStore.setItemAsync('token_acesso', res.data.token_acesso);
          navigation.replace('Webview');
        }
      } catch (e) {
        console.log("Erro no polling", e);
      }
    }, 3000); // Checa a cada 3 segundos
  };

  const copyToClipboard = async () => {
    if (paymentData?.qr_code) {
      await Clipboard.setStringAsync(paymentData.qr_code);
      Alert.alert("Sucesso", "Código Pix Copia e Cola copiado!");
    }
  };
  
  // SIMULAÇÃO APENAS: Botão que força o webhook local para o MVP não ficar preso
  const simulatePayment = async () => {
    if (!paymentData) return;
    try {
        await api.post('/payment/webhook', {
            pagamento_uuid: paymentData.uuid,
            status: 'approved'
        });
    } catch(e) {
        console.log(e);
    }
  }

  if (paymentData) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.Text entering={FadeInDown} style={styles.headerTitle}>Realize o Pagamento</Animated.Text>
        <Animated.View entering={ZoomIn.duration(500)} style={styles.pixBox}>
            <View style={styles.qrCodePlaceholder}>
                {paymentData.qr_code_base64 ? (
                   <Image 
                     source={{ uri: paymentData.qr_code_base64 }} 
                     style={{ width: 230, height: 230, borderRadius: 8 }} 
                     resizeMode="contain" 
                   />
                ) : (
                   <Text style={styles.qrText}>QR CODE (Ambiente Teste)</Text>
                )}
            </View>
            <TouchableOpacity style={styles.copyButton} activeOpacity={0.8} onPress={copyToClipboard}>
                <Text style={styles.copyButtonText}>Copiar Pix "Copia e Cola"</Text>
            </TouchableOpacity>
            
            <Animated.View entering={FadeIn.delay(400)} style={styles.statusBox}>
                <ActivityIndicator size="small" color="#3b82f6" style={{marginRight: 8}}/>
                <Text style={styles.statusText}>Aguardando confirmação...</Text>
            </Animated.View>
            
            {/* Botao temporário para simular pagamento e liberar acesso no ambiente de teste */}
            <Animated.View entering={FadeIn.delay(1000)}>
                <TouchableOpacity onPress={simulatePayment} style={{marginTop: 40, padding: 10, backgroundColor: '#334155', borderRadius: 8}}>
                    <Text style={{color: '#94a3b8', textAlign: 'center'}}>Simular Pagamento no Backend</Text>
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.Text entering={FadeInDown.delay(100)} style={styles.headerTitle}>Qual valor deseja apoiar?</Animated.Text>
      <Animated.Text entering={FadeInDown.delay(200)} style={styles.subtitleText}>O acesso é o mesmo, independente do valor. Escolha o que sentir no coração.</Animated.Text>

      <View style={styles.valuesGrid}>
        {VALUES.map((val, index) => (
          <Animated.View key={val} entering={FadeInUp.delay(300 + (index * 100))} style={styles.valueBoxContainer}>
            <TouchableOpacity 
              style={[styles.valueBox, selectedValue === val && styles.valueBoxSelected]}
              onPress={() => setSelectedValue(val)}
              activeOpacity={0.8}
            >
               <Text style={[styles.valueText, selectedValue === val && styles.valueTextSelected]}>
                 R$ {val},00
               </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <Animated.View entering={FadeInUp.delay(800)} style={{marginTop: 'auto'}}>
        <TouchableOpacity 
          style={[styles.payButton, loading && styles.payButtonDisabled]} 
          onPress={handleGeneratePix}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.payButtonText}>Gerar Pix de R$ {selectedValue},00</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 24,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 8,
  },
  subtitleText: {
    color: '#94a3b8',
    fontSize: 16,
    marginBottom: 40,
  },
  valuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 40,
    justifyContent: 'space-between',
  },
  valueBoxContainer: {
    width: '47%',
  },
  valueBox: {
    width: '45%',
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#334155',
    alignItems: 'center',
    width: '100%',
  },
  valueBoxSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#1e3a8a',
  },
  valueText: {
    color: '#cbd5e1',
    fontSize: 24,
    fontWeight: 'bold',
  },
  valueTextSelected: {
    color: '#ffffff',
  },
  payButton: {
    backgroundColor: '#22c55e', // green-500
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  payButtonDisabled: {
    backgroundColor: '#166534',
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pixBox: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  qrCodePlaceholder: {
    width: 250,
    height: 250,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  qrText: {
    color: '#64748b',
    fontWeight: 'bold',
  },
  copyButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  copyButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
  },
  statusText: {
    color: '#3b82f6',
    fontWeight: '600',
  }
});
