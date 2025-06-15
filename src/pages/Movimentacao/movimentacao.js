import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';  // Importando do FontAwesome
import { useNavigation } from '@react-navigation/native';
import Header from "../../components/Header/header";

export default function Movimentacao() {
    return (
        <>
            <Header />
            <View style={styles.movimentacaoContainer}>
                <Text>Página de Movimentações</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    movimentacaoContainer: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
});