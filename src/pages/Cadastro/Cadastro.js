import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

export default function Cadastro() {
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [role, setRole] = useState("USUARIO");
    const navigation = useNavigation();

    const handleCadastro = async () => {
        if (!login || !senha) {
            Alert.alert("Erro", "Preencha todos os campos.");
            return;
        }

        try {
            const resposta = await fetch(
                "https://projeto-inventario-grdrgfgcgpd0cbgu.brazilsouth-01.azurewebsites.net/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ login, senha, role }),
                }
            );

            if (resposta.ok) {
                Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
                navigation.navigate("Login");
            } else {
                const erro = await resposta.text();
                Alert.alert("Erro no cadastro", erro || "Não foi possível cadastrar.");
            }
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            Alert.alert("Erro de rede", "Tente novamente mais tarde.");
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
                <Text style={styles.titulo}>Cadastro de Usuário</Text>
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
                <View style={styles.roleContainer}>
                    <TouchableOpacity
                        style={[
                            styles.roleButton,
                            role === "usuario" && styles.selectedRole,
                        ]}
                        onPress={() => setRole("usuario")}
                    >
                        <Text style={styles.roleText}>Usuário</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.roleButton,
                            role === "ADMIN" && styles.selectedRole,
                        ]}
                        onPress={() => setRole("ADMIN")}
                    >
                        <Text style={styles.roleText}>Administrador</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.btnEntrar} onPress={handleCadastro}>
                    <Text style={styles.entrar}>Cadastrar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnCadastrar}
                    onPress={() => navigation.navigate("Login")}
                >
                    <Text style={styles.cadastrarTexto}>Possui conta? Fazer login</Text>
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
    roleContainer: {
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 15,
    },
    roleButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#000",
        width: "60%",
        margin: 5,
        alignItems: "center",
        backgroundColor: "#fff",
    },
    selectedRole: {
        borderColor: "blue"
    },
    roleText: {
        color: "#000",
        fontWeight: "bold",
    },
    selectedRoleText: {
        color: "#fff",
    },

});