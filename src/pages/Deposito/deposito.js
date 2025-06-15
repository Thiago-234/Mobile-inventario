import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';  // Importando do FontAwesome
import { useNavigation } from '@react-navigation/native';
import Header from "../../components/Header/header";

export default function Deposito() {
    return (
        <>
            <Header />
            <View style={styles.depositoContainer}>
                <Text>Página de Depósitos</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    depositoContainer: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
});