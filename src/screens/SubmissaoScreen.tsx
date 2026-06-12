import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { apiFetch, apiUpload } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { colors, fontSize, radius, spacing } from '../styles/theme';

interface Regra {
  id: string;
  area: string;
  limite_horas: number;
}

export default function SubmissaoScreen() {
  const { user } = useAuth();

  const [regras, setRegras] = useState<Regra[]>([]);
  const [loadingRegras, setLoadingRegras] = useState(true);

  const [regraSelecionada, setRegraSelecionada] = useState<Regra | null>(null);
  const [mostrarRegras, setMostrarRegras] = useState(false);
  const [tipo, setTipo] = useState('');
  const [horas, setHoras] = useState('');
  const [descricao, setDescricao] = useState('');
  const [arquivo, setArquivo] = useState<any>(null);
  const [enviando, setEnviando] = useState(false);

  const cursoId = (user as any)?.curso_id;

  const carregarRegras = useCallback(async () => {
    try {
      const endpoint = cursoId ? `/api/regras?curso_id=${cursoId}` : '/api/regras';
      const data = await apiFetch<{ regras: Regra[] }>(endpoint);
      setRegras(data?.regras ?? (Array.isArray(data) ? data : []));
    } catch (err: any) {
      Alert.alert('Erro', 'Não foi possível carregar as áreas de atividade.');
    } finally {
      setLoadingRegras(false);
    }
  }, [cursoId]);

  useEffect(() => {
    carregarRegras();
  }, [carregarRegras]);

  const selecionarArquivo = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
      });
      if (!res.canceled) {
        setArquivo(res.assets[0]);
      }
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
    if (!regraSelecionada) {
      Alert.alert('Atenção', 'Selecione a área da atividade.');
      return;
    }
    if (!tipo.trim()) {
      Alert.alert('Atenção', 'Informe o tipo da atividade.');
      return;
    }
    if (!horas || isNaN(Number(horas)) || Number(horas) <= 0) {
      Alert.alert('Atenção', 'Informe uma quantidade de horas válida.');
      return;
    }
    if (!arquivo) {
      Alert.alert('Atenção', 'Anexe o certificado antes de enviar.');
      return;
    }

    setEnviando(true);
    try {
      // Etapa 1 — criar a submissão
      const submissao = await apiFetch<{ id: string; success: boolean }>('/api/submissoes', {
        method: 'POST',
        body: {
          regra_id: regraSelecionada.id,
          tipo: tipo.trim(),
          descricao: descricao.trim() || null,
          carga_horaria_solicitada: Number(horas),
        },
      });

      const submissaoId = submissao.id;

      // Etapa 2 — upload do certificado
      const formData = new FormData();
      formData.append('submissao_id', submissaoId);
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

        {/* Área / Regra */}
        <Text style={styles.label}>Área da Atividade *</Text>
        <TouchableOpacity
          style={styles.picker}
          onPress={() => setMostrarRegras(!mostrarRegras)}
        >
          <Text style={regraSelecionada ? styles.pickerTexto : styles.pickerPlaceholder}>
            {regraSelecionada
              ? `${regraSelecionada.area} (até ${regraSelecionada.limite_horas}h)`
              : 'Selecionar área...'}
          </Text>
          <Text style={styles.pickerIcon}>{mostrarRegras ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {mostrarRegras && (
          <View style={styles.listaRegras}>
            {regras.map(r => (
              <TouchableOpacity
                key={r.id}
                style={[
                  styles.itemRegra,
                  regraSelecionada?.id === r.id && styles.itemRegraAtivo,
                ]}
                onPress={() => {
                  setRegraSelecionada(r);
                  setMostrarRegras(false);
                }}
              >
                <Text style={styles.itemRegraTexto}>{r.area}</Text>
                <Text style={styles.itemRegraLimite}>Limite: {r.limite_horas}h</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Tipo */}
        <Text style={[styles.label, { marginTop: spacing.md }]}>Tipo da Atividade *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Curso online, Palestra, Evento..."
          placeholderTextColor={colors.textMuted}
          value={tipo}
          onChangeText={setTipo}
        />

        {/* Horas */}
        <Text style={styles.label}>Horas Solicitadas *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 20"
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          value={horas}
          onChangeText={setHoras}
        />

        {/* Descrição */}
        <Text style={styles.label}>Descrição / Observação (opcional)</Text>
        <TextInput
          style={[styles.input, styles.inputMultilinha]}
          placeholder="Informações adicionais..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
          value={descricao}
          onChangeText={setDescricao}
        />

        {/* Arquivo */}
        <Text style={styles.label}>Certificado (PDF ou imagem) *</Text>
        <TouchableOpacity style={styles.botaoArquivo} onPress={selecionarArquivo}>
          <Text style={styles.botaoArquivoTexto}>
            {arquivo ? `📎 ${arquivo.name}` : 'Escolher arquivo'}
          </Text>
        </TouchableOpacity>

        {/* Botão enviar */}
        <TouchableOpacity
          style={[styles.botaoEnviar, enviando && styles.botaoDesabilitado]}
          onPress={enviar}
          disabled={enviando}
        >
          {enviando ? (
            <ActivityIndicator color={colors.textPrimary} />
          ) : (
            <Text style={styles.botaoEnviarTexto}>Enviar Certificado</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },

  titulo: { fontSize: fontSize.xl, fontWeight: 'bold', color: colors.textPrimary, marginBottom: spacing.xs },
  subtitulo: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.lg },

  label: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.xs, fontWeight: '600' },

  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    color: colors.textPrimary,
    fontSize: fontSize.md,
    marginBottom: spacing.md,
  },
  inputMultilinha: { height: 96, textAlignVertical: 'top' },

  picker: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  pickerTexto: { color: colors.textPrimary, fontSize: fontSize.md, flex: 1 },
  pickerPlaceholder: { color: colors.textMuted, fontSize: fontSize.md, flex: 1 },
  pickerIcon: { color: colors.textSecondary, marginLeft: spacing.sm },

  listaRegras: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  itemRegra: {
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemRegraAtivo: { backgroundColor: colors.accent },
  itemRegraTexto: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: '600' },
  itemRegraLimite: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: 2 },

  botaoArquivo: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  botaoArquivoTexto: { color: colors.textPrimary, fontSize: fontSize.md },

  botaoEnviar: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  botaoDesabilitado: { opacity: 0.6 },
  botaoEnviarTexto: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: 'bold' },
});
