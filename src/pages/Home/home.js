import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Header from "../../components/Header/header";

export default function Home() {
    const navigation = useNavigation(); //Hook de navegação

    return (
        <>
            <View style={styles.container}>
                <Header />

                <View style={styles.main}>
                    <Text style={styles.username}>Bem Vindo, (Username)!</Text>

                    <View style={styles.cardNavegacao}>
                        <TouchableOpacity onPress={() => navigation.navigate('Produtos')}>
                            <Text style={styles.cardTexto}>Ver Produtos 📦</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cardNavegacao}>
                        <TouchableOpacity onPress={() => navigation.navigate('Depositos')}>
                            <Text style={styles.cardTexto}>Ver Depósitos 🏭</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cardNavegacao}>
                        <TouchableOpacity onPress={() => navigation.navigate('Movimentações')}>
                            <Text style={styles.cardTexto}>Ver Movimentações 🔁</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cardNavegacao}>
                        <TouchableOpacity onPress={() => navigation.navigate('Estoques')}>
                            <Text style={styles.cardTexto}>Ver Estoque 🚚</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cardNavegacao}>
                        <TouchableOpacity>
                            <Text style={styles.cardTexto}>Valor total 💰</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    main: {
        flex: 1,
    },
    username: {
        color: '#333',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
    },
    cardNavegacao: {
        marginTop: 20,
        backgroundColor: '#333',
        color: '#fff',
        width: '80%',
        borderRadius: 10,
        alignSelf: 'center',
        padding: 15,
    },
    cardTexto: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 15,
    },
});
