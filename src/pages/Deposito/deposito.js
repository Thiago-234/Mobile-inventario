import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, Alert } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from "../../components/Header/header";

export default function Deposito() {
    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = useState(false);
    const [nome, setNome] = useState("");
    const [rua, setRua] = useState("");
    const [depositos, setDepositos] = useState([]);
    const [editando, setEditando] = useState(false);
    const [depositoSelecionado, setDepositoSelecionado] = useState(null);

    const carregarDepositos = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await fetch("https://projeto-inventario-grdrgfgcgpd0cbgu.brazilsouth-01.azurewebsites.net/depositos/todos", {
                headers: {
                    "Authorization": "Bearer " + token,
                }
            });
            if (!response.ok) throw new Error("Erro ao carregar depósitos");
            const data = await response.json();
            setDepositos(data);
        } catch (error) {
            Alert.alert("Erro", error.message);
        }
    };

    useEffect(() => {
        carregarDepositos();
    }, []);

    const abrirModalParaEditar = (deposito) => {
        setNome(deposito.nome);
        setRua(deposito.localizacao || deposito.rua);
        setDepositoSelecionado(deposito);
        setEditando(true);
        setModalVisible(true);
    };

    const limparCampos = () => {
        setNome("");
        setRua("");
        setEditando(false);
        setDepositoSelecionado(null);
    };

    const salvarDeposito = async () => {
        if (!nome.trim() || !rua.trim()) {
            Alert.alert("Erro", "Por favor preencha todos os campos");
            return;
        }

        const token = await AsyncStorage.getItem("token");
        const url = editando
            ? `https://projeto-inventario-grdrgfgcgpd0cbgu.brazilsouth-01.azurewebsites.net/depositos/atualizar/${depositoSelecionado.id}`
            : "https://projeto-inventario-grdrgfgcgpd0cbgu.brazilsouth-01.azurewebsites.net/depositos/criar";

        const method = editando ? "PUT" : "POST";

        const novoDeposito = {
            nome,
            localizacao: rua,
        };

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                body: JSON.stringify(novoDeposito),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Erro ao salvar depósito");
            }
            const depositoSalvo = await response.json();

            if (editando) {
                setDepositos(depositos.map(d => d.id === depositoSalvo.id ? depositoSalvo : d));
            } else {
                setDepositos([...depositos, depositoSalvo]);
            }

            setModalVisible(false);
            limparCampos();

        } catch (error) {
            Alert.alert("Erro", error.message);
        }
    };

    const confirmarExcluir = (deposito) => {
        Alert.alert(
            "Confirmar exclusão",
            "Deseja realmente excluir o depósito?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", style: "destructive", onPress: () => excluirDeposito(deposito) }
            ]
        );
    };

    const excluirDeposito = async (deposito) => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(`https://projeto-inventario-grdrgfgcgpd0cbgu.brazilsouth-01.azurewebsites.net/depositos/deletar/${deposito.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token,
                },
            });
            if (!response.ok) {
                throw new Error("Erro ao excluir depósito");
            }
            setDepositos(depositos.filter(d => d.id !== deposito.id));
        } catch (error) {
            Alert.alert("Erro", error.message);
        }
    };

    return (
        <>
            <Header />
            <ScrollView style={styles.depositoContainer}>
                <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.navigate("Home")}>
                    <Icon style={styles.iconVoltar} name="arrow-left" />
                </TouchableOpacity>

                <View style={styles.depositoHeader}>
                    <Text style={styles.titulo}>Depósitos</Text>
                    <TouchableOpacity
                        style={styles.botaoAdicionar}
                        onPress={() => {
                            limparCampos();
                            setModalVisible(true);
                        }}
                    >
                        <Icon name="plus" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.listaDepositos}>
                    <Text style={styles.tituloLista}>Depósitos Cadastrados</Text>
                    {depositos.length === 0 ? (
                        <Text style={styles.semItem}>Nenhum depósito cadastrado.</Text>
                    ) : (
                        depositos.map((deposito) => (
                            <View key={deposito.id} style={styles.card}>
                                <Text style={styles.nomeProduto}>{deposito.nome}</Text>
                                <Text style={styles.infoProduto}>{deposito.localizacao}</Text>
                                <View style={styles.acoes}>
                                    <TouchableOpacity onPress={() => abrirModalParaEditar(deposito)}>
                                        <Icon name="edit" size={25} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => confirmarExcluir(deposito)}>
                                        <Icon name="trash" size={25} color="#f00" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </View>

            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitulo}>{editando ? "Editar Depósito" : "Adicionar Depósito"}</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Nome do Depósito"
                            value={nome}
                            onChangeText={setNome}
                            autoFocus
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Localização"
                            value={rua}
                            onChangeText={setRua}
                        />

                        <TouchableOpacity style={styles.botaoSalvar} onPress={salvarDeposito}>
                            <Text style={styles.salvarTexto}>Salvar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelarTexto}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    depositoContainer: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    btnVoltar: {
        width: 50,
    },
    iconVoltar: {
        fontSize: 15,
        color: "#333",
        margin: 15
    },
    depositoHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
    },
    titulo: {
        color: "#333",
        fontSize: 20,
        fontWeight: "bold",
    },
    botaoAdicionar: {
        backgroundColor: "#4CAF50",
        width: 80,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        borderRadius: 5,
    },
    tituloLista: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginTop: 20,
    },
    semItem: {
        textAlign: "center",
        color: "#777",
        marginTop: 20,
        fontStyle: "italic",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modalContainer: {
        width: "90%",
        backgroundColor: "#f7f7f7",
        borderRadius: 12,
        padding: 20,
        elevation: 10,
    },
    modalTitulo: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#333",
        textAlign: "center",
    },
    input: {
        backgroundColor: "#fff",
        borderColor: "#333",
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        fontSize: 16,
    },
    botaoSalvar: {
        backgroundColor: "#000",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    salvarTexto: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    cancelarTexto: {
        textAlign: "center",
        color: "#777",
        fontSize: 14,
        marginTop: 5,
    },
    card: {
        backgroundColor: "#eee",
        padding: 15,
        borderRadius: 8,
        marginVertical: 20,
        marginHorizontal: 40,
        elevation: 2,
    },
    nomeProduto: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#333",
    },
    infoProduto: {
        fontSize: 14,
        color: "#555",
    },
    acoes: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
});
