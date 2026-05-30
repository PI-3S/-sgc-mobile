import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
 
import DashboardScreen from '../screens/DashboardScreen';
import HistoricoScreen from '../screens/HistoricoScreen';
import SubmissaoScreen from '../screens/SubmissaoScreen';
 
import { colors } from '../styles/theme';
 
const Tab = createBottomTabNavigator();
 
export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.accentGreen,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="Submissao" component={SubmissaoScreen} options={{ title: 'Enviar' }} />
      <Tab.Screen name="Historico" component={HistoricoScreen} options={{ title: 'Histórico' }} />
    </Tab.Navigator>
  );
}