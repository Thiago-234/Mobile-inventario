import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Modal,
    ScrollView,
    Alert
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Header from "../../components/Header/header";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Estoque() {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [estoques, setEstoques] = useState([]);
    const [produtoId, setProdutoId] = useState("");
    const [depositoId, setDepositoId] = useState("");
    const [quantidade, setQuantidade] = useState("");

    useEffect(() => {
        carregarEstoques();
    }, []);

    async function carregarEstoques() {
        const token = await AsyncStorage.getItem("token");

        fetch("https://projeto-inventario-grdrgfgcgpd0cbgu.brazilsouth-01.azurewebsites.net/estoques/todos", {
            headers: { Authorization: "Bearer " + token }
        })
            .then(res => {
                if (!res.ok) throw new Error("Erro ao buscar estoques");
                return res.json();
            })
            .then(data => setEstoques(data))
            .catch(err => alert("Erro: " + err.message));
    }

    async function salvarEstoque() {
        const token = await AsyncStorage.getItem("token");

        fetch("https://projeto-inventario-grdrgfgcgpd0cbgu.brazilsouth-01.azurewebsites.net/estoques/criar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({
                produtoId,
                depositoId,
                quantidade: parseInt(quantidade)
            })
        })
            .then(res => {
                if (!res.ok) throw new Error("Erro ao salvar estoque");
                return res.json();
            })
            .then(novoEstoque => {
                setEstoques(prev => [...prev, novoEstoque]);
                setModalVisible(false);
                setProdutoId("");
                setDepositoId("");
                setQuantidade("");
            })
            .catch(err => alert("Erro: " + err.message));
    }

    return (
        <>
            <Header />
            <ScrollView style={styles.estoqueContainer} contentContainerStyle={{ paddingBottom: 100 }}>
                <TouchableOpacity
                    style={styles.btnVoltar}
                    onPress={() => navigation.navigate("Home")}
                >
                    <Icon style={styles.iconVoltar} name="arrow-left" />
                </TouchableOpacity>

                <View style={styles.estoqueHeader}>
                    <Text style={styles.titulo}>Estoques</Text>
                    <TouchableOpacity
                        style={styles.botaoAdicionar}
                        onPress={() => setModalVisible(true)}
                    >
                        <Icon name="plus" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.listaProdutos}>
                    <Text style={styles.tituloLista}>Estoque de Produtos</Text>

                    {estoques.length === 0 ? (
                        <Text style={styles.semItem}>Nenhum estoque registrado.</Text>
                    ) : (
                        estoques.map((e) => (
                            <View key={e.id} style={styles.card}>
                                <Text style={styles.infoProduto}>Produto: {e.produtoNome}</Text>
                                <Text style={styles.infoProduto}>Depósito: {e.depositoNome}</Text>
                                <Text style={styles.infoProduto}>Quantidade: {e.quantidade}</Text>
                                <View style={styles.acoes}>
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
                        <Text style={styles.modalTitulo}>Registrar Edasdasdystoque</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="ID do Produto"
                            keyboardType="numeric"
                            value={produtoId}
                            onChangeText={setProdutoId}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="ID do Depósito"
                            keyboardType="numeric"
                            value={depositoId}
                            onChangeText={setDepositoId}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Quantidade"
                            keyboardType="numeric"
                            value={quantidade}
                            onChangeText={setQuantidade}
                        />

                        <TouchableOpacity style={styles.botaoSalvar} onPress={salvarEstoque}>
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
    estoqueContainer: {
        flex: 1,
    },
    btnVoltar: {
        width: 50,
    },
    iconVoltar: {
        fontSize: 15,
        color: "#333",
        margin: 15,
    },
    estoqueHeader: {
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
    infoProduto: {
        fontSize: 14,
        color: "#555",
    },
});
