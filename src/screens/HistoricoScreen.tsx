import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView, useWindowDimensions} from 'react-native';
import { apiFetch } from '../services/api';
import { colors, fontSize, getStatusStyle, radius } from '../styles/theme';

export default function HistoricoScreen() {
	const { width, height } = useWindowDimensions();
	const [historyList, setHistoryList]  = useState([]);
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		async function load() {
			setLoading(true);
			const history = await apiFetch('/api/submissoes');
			setHistoryList(history.submissoes);
			setLoading(false);
		}
		load()
	}, [])

	function handleDate(jsdate: string){
		const date = new Date(jsdate);
		const newDate = date.toLocaleString('pt-BR');
		return (`${newDate}`)
	}

	function certificateItem({ item }){
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
    <View style={styles.container}>
      <Text style={styles.title}>Histórico{'\n'}</Text> 
    {isLoading ? (
	    <View>
		    <ActivityIndicator size ='large' color={colors.textPrimary}/>
	    </View>
    ) : (
    <View style={styles.listContainer}>
	    <FlatList
	    data={historyList}
	    keyExtractor={item => item.id}
	    renderItem={certificateItem}
	    />
    </View>
    )}
    </View>
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
	  padding: 5,
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
