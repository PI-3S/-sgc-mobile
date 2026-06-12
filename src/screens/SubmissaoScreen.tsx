import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { apiFetch, apiUpload } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { colors, fontSize, radius, spacing } from '../styles/theme';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import RegraPicker, { Regra } from '../components/RegraPicker';

export default function SubmissaoScreen() {
  const { user } = useAuth();

  const [regras, setRegras] = useState<Regra[]>([]);
  const [loadingRegras, setLoadingRegras] = useState(true);
  const [regraSelecionada, setRegraSelecionada] = useState<Regra | null>(null);
  const [tipo, setTipo] = useState('');
  const [horas, setHoras] = useState('');
  const [descricao, setDescricao] = useState('');
  const [arquivo, setArquivo] = useState<any>(null);
  const [enviando, setEnviando] = useState(false);

  const carregarRegras = useCallback(async () => {
    try {
      const endpoint = user?.curso_id ? `/api/regras?curso_id=${user.curso_id}` : '/api/regras';
      const data = await apiFetch<{ regras: Regra[] }>(endpoint);
      setRegras(data?.regras ?? (Array.isArray(data) ? data : []));
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar as áreas de atividade.');
    } finally {
      setLoadingRegras(false);
    }
  }, [user?.curso_id]);

  useEffect(() => {
    carregarRegras();
  }, [carregarRegras]);

  const selecionarArquivo = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/*'] });
      if (!res.canceled) setArquivo(res.assets[0]);
    } catch {
      Alert.alert('Erro', 'Não foi possível selecionar o arquivo.');
    }
  };

  const limparFormulario = () => {
    setRegraSelecionada(null);
    setTipo('');
    setHoras('');
    setDescricao('');
    setArquivo(null);
  };

  const enviar = async () => {
    if (!regraSelecionada) return Alert.alert('Atenção', 'Selecione a área da atividade.');
    if (!tipo.trim()) return Alert.alert('Atenção', 'Informe o tipo da atividade.');
    if (!horas || isNaN(Number(horas)) || Number(horas) <= 0)
      return Alert.alert('Atenção', 'Informe uma quantidade de horas válida.');
    if (!arquivo) return Alert.alert('Atenção', 'Anexe o certificado antes de enviar.');

    setEnviando(true);
    try {
      // Etapa 1 — criar a submissão
      const { id } = await apiFetch<{ id: string }>('/api/submissoes', {
        method: 'POST',
        body: {
          regra_id: regraSelecionada.id,
          tipo: tipo.trim(),
          descricao: descricao.trim() || null,
          carga_horaria_solicitada: Number(horas),
        },
      });

      // Etapa 2 — upload do certificado
      const formData = new FormData();
      formData.append('submissao_id', id);
      formData.append('arquivo', {
        uri: arquivo.uri,
        name: arquivo.name,
        type: arquivo.mimeType || 'application/pdf',
      } as any);

      await apiUpload('/api/certificados', formData);

      Alert.alert('Sucesso!', 'Certificado enviado e aguardando validação.', [
        { text: 'OK', onPress: limparFormulario },
      ]);
    } catch (err: any) {
      Alert.alert('Erro ao enviar', err.message || 'Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  if (loadingRegras) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
        <Text style={styles.titulo}>Enviar Certificado</Text>
        <Text style={styles.subtitulo}>Preencha os dados e anexe o comprovante.</Text>

        <Text style={styles.label}>Área da Atividade *</Text>
        <RegraPicker
          regras={regras}
          selecionada={regraSelecionada}
          onSelect={setRegraSelecionada}
        />

        <FormField
          label="Tipo da Atividade *"
          value={tipo}
          onChangeText={setTipo}
          placeholder="Ex: Curso online, Palestra, Evento..."
        />

        <FormField
          label="Horas Solicitadas *"
          value={horas}
          onChangeText={setHoras}
          placeholder="Ex: 20"
          keyboardType="numeric"
        />

        <FormField
          label="Descrição / Observação (opcional)"
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Informações adicionais..."
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Certificado (PDF ou imagem) *</Text>
        <TouchableOpacity style={styles.botaoArquivo} onPress={selecionarArquivo}>
          <Text style={styles.botaoArquivoTexto}>
            {arquivo ? `📎 ${arquivo.name}` : 'Escolher arquivo'}
          </Text>
        </TouchableOpacity>

        <PrimaryButton
          label="Enviar Certificado"
          onPress={enviar}
          loading={enviando}
          style={styles.botaoEnviar}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  titulo: { fontSize: fontSize.xl, fontWeight: 'bold', color: colors.textPrimary, marginBottom: spacing.xs },
  subtitulo: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.lg },
  label: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: '600', marginBottom: spacing.xs },
  botaoArquivo: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  botaoArquivoTexto: { color: colors.textPrimary, fontSize: fontSize.md },
  botaoEnviar: { marginBottom: spacing.xl },
});
