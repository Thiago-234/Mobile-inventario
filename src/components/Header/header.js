import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";

export default function Header() {
    return (
        <>
            <View style={styles.header}>
                <Text style={styles.logo}>InvenPro</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        marginTop: 30,
        backgroundColor: '#333',
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
})