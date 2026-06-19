import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiFetch } from '../services/api';
import { colors, fontSize, getStatusStyle, radius, spacing } from '../styles/theme';

interface Submissao {
	id: string;
	data_envio: string;
	tipo: string;
	carga_horaria_solicitada: number;
	status: 'correcao' | 'pendente' | 'aprovado' | 'reprovado';
	observacao?: string;
}

export default function HistoricoScreen() {
	const [historyList, setHistoryList]  = useState<Submissao[]>([]);
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState<String | null>(null);

	async function load() {
		setLoading(true);
		setError(null);
		try {
		const history = await apiFetch('/api/submissoes');
		setHistoryList(history.submissoes);

		} catch (err){
			setError('Não foi possível carregar o histórico. Tente novamente mais tarde.');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load();
	}, []);

	function handleDate(jsdate: string){
		const date = new Date(jsdate);
		const newDate = date.toLocaleString('pt-BR');
		return (`${newDate}`)
	}

	function certificateItem({ item } : { item: Submissao }){
		const status = item.status == 'correcao';
		return (
			<View style={styles.item}>
				<View style={styles.certificateTextContainer}>
				<Text style={styles.certificateText}><Text style={styles.dataTittle}>Data de envio: </Text>{handleDate(item.data_envio)}</Text>
				<Text style={styles.certificateText}><Text style={styles.dataTittle}>Tipo: </Text>{item.tipo}</Text>
				<Text style={styles.certificateText}><Text style={styles.dataTittle}>CH: {item.carga_horaria_solicitada}h</Text></Text>
				<Text style={styles.certificateText}><Text style={styles.dataTittle}>Estado: </Text><Text style={ getStatusStyle(item.status) }>{item.status}</Text></Text>
				{status && (
					<Text style={styles.certificateText}><Text style={styles.dataTittle}>Observação: </Text>{item.observacao}</Text>
				)}
				</View>
			</View>
		)
	};
  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
  <View style={styles.container}>
  <Text style={styles.title}>Histórico{'\n'}</Text> 
    {isLoading ? (
    <View>
	    <ActivityIndicator size ='large' color={colors.textPrimary}/>
    </View>
    ) : error ? (
    <View style={styles.centerContainer}>
	    <Text style={styles.errorText}>{error}</Text>
	    <Button title="Tentar novamente" onPress={load} color={colors.textPrimary} />
    </View>
    ) : (
    <View style={styles.listContainer}>
	    <FlatList
	    data={historyList}
	    keyExtractor={item => item.id}
	    renderItem={certificateItem}
	    ListEmptyComponent={<Text>Você ainda não cadastrou certificados.</Text>}
	    />
    </View>
    )}
    </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    paddingRight: 20,
    paddingLeft: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fontSize.xl,
    alignSelf: 'center',
    top: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  listContainer: {
	  flex: 1,
	  padding: 5,
  },
  centerContainer: {
	  flex: 1,
	  justifyContent: 'center',
	  alignItems: 'center',
	  padding: 20,
  },
  errorText: {
	  color: colors.error,
	  backgroundColor: colors.background,
	  fontSize: fontSize.sm,
	  textAlign: 'center',
	  marginBottom: spacing.xl,
  },
    button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  certificateTextContainer: {
	  paddingTop: 3,
	  paddingLeft: 15,
  },
  item: {
	  top: 5,
	  flex: 1,
	  borderWidth: 5,
	  borderRadius: radius.sm,
	  borderColor: colors.border,
	  backgroundColor: colors.card,
	  marginTop:10,
  },
  certificateText: {
	  color: colors.textSecondary,
	  fontSize: fontSize.sm,
	  paddingTop: 2,
  },
  dataTittle: {
	  fontWeight: 'bold',
  }
});
