import React from 'react';
import { Image, ImageSourcePropType } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from '../screens/DashboardScreen';
import HistoricoScreen from '../screens/HistoricoScreen';
import SubmissaoScreen from '../screens/SubmissaoScreen';
import { colors } from '../styles/theme';

const Tab = createBottomTabNavigator();

const icons: Record<string, ImageSourcePropType> = {
  Dashboard: require('../../assets/icons/home.png'),
  Submissao: require('../../assets/icons/submissao.png'),
  Historico: require('../../assets/icons/historico.png'),
};

function TabIcon({ name, focused, size }: { name: string; focused: boolean; size: number }) {
  return (
    <Image
      source={icons[name]}
      style={{ width: 48, height: 48, opacity: focused ? 1 : 0.45 }}
      resizeMode="contain"
    />
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.accentGreen,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ focused, size }) => (
          <TabIcon name={route.name} focused={focused} size={size} />
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="Submissao" component={SubmissaoScreen} options={{ title: 'Enviar' }} />
      <Tab.Screen name="Historico" component={HistoricoScreen} options={{ title: 'Histórico' }} />
    </Tab.Navigator>
  );
}