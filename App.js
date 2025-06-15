// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './src/pages/login/login';
import Cadastro from './src/pages/Cadastro/Cadastro';
import Home from './src/pages/Home/home';
import Produtos from './src/pages/Produto/produto';
import Depositos from './src/pages/Deposito/deposito';
import Estoques from './src/pages/Estoque/estoque';
import Movimentações from './src/pages/Movimentacao/movimentacao';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Produtos" component={Produtos} />
        <Stack.Screen name="Depositos" component={Depositos} />
        <Stack.Screen name="Estoques" component={Estoques} />
        <Stack.Screen name="Movimentações" component={Movimentações} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
