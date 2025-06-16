import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            const resposta = await fetch(
                "https://projeto-inventario-grdrgfgcgpd0cbgu.brazilsouth-01.azurewebsites.net/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        login: login,
                        senha: senha,
                    }),
                }
            );

            if (resposta.ok) {
                const dados = await resposta.json();

                const token = dados.token;
                const username = dados.username || login; // depende da resposta da API

                await AsyncStorage.setItem("token", token);
                await AsyncStorage.setItem("username", username);

                navigation.navigate("Home");
            } else {
                const erro = await resposta.text();
                Alert.alert("Erro ao fazer login", erro || "Credenciais inválidas.");
            }
        } catch (erro) {
            console.error("Erro de login:", erro);
            Alert.alert("Erro de rede", "Não foi possível conectar ao servidor.");
        }
    };

    return (
        <LinearGradient
            colors={["#ffffff", "#000000"]}
            style={styles.container}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
        >
            <Text style={styles.logo}>InvenPro</Text>

            <View style={styles.loginContainer}>
                <Text style={styles.titulo}>Login de Usuário</Text>

                <View style={styles.inputContainer}>
                    <Icon name="user" size={20} color="#000" style={styles.icon} />
                    <TextInput
                        placeholder="Seu Login"
                        style={styles.input}
                        value={login}
                        onChangeText={setLogin}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="lock" size={20} color="#000" style={styles.icon} />
                    <TextInput
                        placeholder="Sua Senha"
                        style={styles.input}
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity style={styles.btnEntrar} onPress={handleLogin}>
                    <Text style={styles.entrar}>Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.btnCadastrar}
                    onPress={() => navigation.navigate("Cadastro")}
                >
                    <Text style={styles.cadastrarTexto}>Não possui conta? Cadastrar-se</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        color: "#fff",
        fontSize: 40,
        marginBottom: 20,
        fontFamily: "monospace",
        letterSpacing: 2,
    },
    titulo: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center"
    },
    loginContainer: {
        backgroundColor: "#fff",
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderRadius: 10,
        elevation: 5, // sombra Android
        shadowColor: "#000", // sombra iOS
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        width: "80%",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 40,
    },
    btnEntrar: {
        backgroundColor: "#000",
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        alignItems: "center",
    },
    entrar: {
        color: "#fff",
        fontWeight: "bold",
    },
    btnCadastrar: {
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        alignItems: "center",
        textAlign: "center",
    },
    cadastrarTexto: {
        textAlign: "center",
    },
});

