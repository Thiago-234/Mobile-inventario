import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';  // Importando do FontAwesome
import { useNavigation } from '@react-navigation/native';
import Header from "../../components/Header/header";

export default function Estoque() {
    return (
        <>
            <Header /> 
            <View style={styles.estoqueContainer}>
                <Text>Página de Estoques</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    estoqueContainer: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
});