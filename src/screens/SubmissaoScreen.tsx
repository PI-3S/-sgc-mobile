import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para pegar o token na hora do certificado

export default function SubmissaoCertificado() {
  const [oNome, setONome] = useState("");
  const [asHora, setAsHora] = useState("");
  const [oqAchei, setOqAchei] = useState("");
  const [oArquivo, setOArquivo] = useState<any>(null);

  //  escolher o PDF/Imagem no celular
  const pegarArquivo = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({});
      if (!res.canceled) {
        setOArquivo(res.assets[0]);
        Alert.alert("Sucesso", "Certificado selecionado!");
      }
    } catch (e) {
      Alert.alert("Erro", "Não foi possível selecionar o arquivo.");
    }
  };

  const enviarTudo = async () => {
    // obrigatorio
    if (oNome === "" || asHora === "" || !oArquivo) {
      Alert.alert("Erro", "Por favor, preencha o nome, as horas e anexe o arquivo!");
      return;
    }
   // back
    try {
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();
      formData.append('arquivo', {
        uri: oArquivo.uri,
        name: oArquivo.name,
        type: oArquivo.mimeType || 'application/pdf'
      } as any);

      // Faz a requisição para a internet 
      const resposta = await fetch('https://back-end-banco-five.vercel.app/api/certificados', {
        method: 'POST',// enviando o certificado n get
        headers: {  'Authorization': `Bearer ${token}` 
        },
        body: formData
      });

      // 5. Verifica se deu certo 
      if (resposta.ok) {
        Alert.alert("Sucesso", `Certificado "${oNome}" enviado com sucesso!`);
        
        // Limpa a tela para o próximo envio
        setONome('');
        setAsHora('');
        setOqAchei('');
        setOArquivo(null);
      } else {
        Alert.alert("Erro", "O servidor recusou o arquivo. Verifique o tamanho Máx 4MB.");
      }
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível conectar com o servidor.");
      console.log(erro);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Submissão de Certificados</Text>
      <Text style={styles.subtitulo}>Insira as informações e seu certificado para validação.</Text>

      <View style={styles.formulario}>
        <View style={styles.campo}>
          <Text style={styles.label}>Nome do Certificado:</Text>
          <TextInput style={styles.input} value={oNome} onChangeText={setONome} />
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Quantidade de Horas:</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={asHora} onChangeText={setAsHora} />
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Anexar Certificado:</Text>
          <TouchableOpacity style={styles.botaoArquivo} onPress={pegarArquivo}>
            <Text style={styles.textoBotaoArquivo}>Escolher Arquivo</Text>
          </TouchableOpacity>
          {oArquivo && <Text style={styles.textoSucesso}>Selecionado: {oArquivo.name}</Text>}
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Comentário / Observação:</Text>
          <TextInput style={[styles.input, styles.inputMultilinha]} multiline={true} numberOfLines={4} value={oqAchei} onChangeText={setOqAchei} />
        </View>

        <TouchableOpacity style={styles.botaoEnviar} onPress={enviarTudo}>
          <Text style={styles.textoBotaoEnviar}>Adicionar Certificado</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 30,
  },
  titulo: {
    fontSize: 26,
    color: 'black',
  },
  subtitulo: {
    fontSize: 16,
    color: 'gray',
  },
  formulario: {
    marginTop: 20,
  },
  campo: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 5,
  },
  inputMultilinha: {
    height: 80,
  },
  botaoArquivo: {
    backgroundColor: 'gray',
    padding: 10,
    alignItems: 'center',
  },
  textoBotaoArquivo: {
    color: 'white',
  },
  textoSucesso: {
    color: 'green',
  },
  botaoEnviar: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
  },
  textoBotaoEnviar: {
    color: 'white',
    fontSize: 18,
  },
});