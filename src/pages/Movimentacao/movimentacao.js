import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Header from "../../components/Header/header";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Movimentacao() {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);

    const [movimentacoes, setMovimentacoes] = useState([]);

    const [dataHora, setDataHora] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [quantidade, setQuantidade] = useState("");
    const [tipo, setTipo] = useState("");
    const [produtoId, setProdutoId] = useState("");
    const [depositoOrigemId, setDepositoOrigemId] = useState("");
    const [depositoDestinoId, setDepositoDestinoId] = useState("");

    async function carregarMovimentacoes() {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        fetch(`https://projeto-inventario-grdrgfgcgpd0cbgu.brazilsouth-01.azurewebsites.net/movimentacoes/todos`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => setMovimentacoes(data))
            .catch(err => console.log("Erro ao buscar movimentações", err));
    }

    async function salvarMovimentacao() {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            alert("Token não encontrado");
            return;
        }

        const body = {
            dataHora: dataHora.toISOString(),
            quantidade: parseInt(quantidade),
            tipo: tipo.toUpperCase(),
            produtoId: parseInt(produtoId),
            depositoOrigemId: parseInt(depositoOrigemId),
            depositoDestinoId: parseInt(depositoDestinoId),
        };

        fetch(`https://projeto-inventario-grdrgfgcgpd0cbgu.brazilsouth-01.azurewebsites.net/movimentacoes/registrar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })
            .then(async res => {
                if (!res.ok) throw new Error(await res.text());
                return res.json();
            })
            .then(() => {
                setModalVisible(false);
                carregarMovimentacoes();
            })
            .catch(err => {
                console.error("Erro ao salvar movimentação:", err.message);
                alert("Erro: " + err.message);
            });
    }

    useEffect(() => {
        carregarMovimentacoes();
    }, []);

    useEffect(() => {
        if (modalVisible) {
            setDataHora(new Date());
            setQuantidade("");
            setTipo("");
            setProdutoId("");
            setDepositoOrigemId("");
            setDepositoDestinoId("");
        }
    }, [modalVisible]);

    function onChangeDate(event, selectedDate) {
        if (event.type === "dismissed") {
            setShowPicker(false);
            return;
        }
        if (selectedDate) {
            const now = new Date();
            const newDateTime = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                now.getHours(),
                now.getMinutes(),
                now.getSeconds()
            );
            setDataHora(newDateTime);
        }
        setShowPicker(false);
    }

    return (
        <>
            <Header />
            <ScrollView style={styles.movimentacaoContainer} contentContainerStyle={{ paddingBottom: 100 }}>
                <TouchableOpacity
                    style={styles.btnVoltar}
                    onPress={() => navigation.navigate("Home")}
                >
                    <Icon style={styles.iconVoltar} name="arrow-left" />
                </TouchableOpacity>
                <View style={styles.movimentacaoHeader}>
                    <Text style={styles.titulo}>Movimentações</Text>
                    <TouchableOpacity
                        style={styles.botaoAdicionar}
                        onPress={() => setModalVisible(true)}
                    >
                        <Icon name="plus" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
                <View style={styles.listaProdutos}>
                    <Text style={styles.tituloLista}>Movimentações Registradas</Text>

                    {movimentacoes.map((mov, id) => (
                        <View key={id} style={styles.card}>
                            <Text style={styles.infoProduto}>Data: {new Date(mov.dataHora).toLocaleString()}</Text>
                            <Text style={styles.infoProduto}>Quantidade: {mov.quantidade}</Text>
                            <Text style={styles.infoProduto}>Tipo: {mov.tipo}</Text>
                            <Text style={styles.infoProduto}>Produto ID: {mov.produtoId}</Text>
                            <Text style={styles.infoProduto}>Depósito Origem ID: {mov.depositoOrigemId}</Text>
                            <Text style={styles.infoProduto}>Depósito Destino ID: {mov.depositoDestinoId}</Text>
                        </View>
                    ))}

                    {movimentacoes.length === 0 && (
                        <Text style={styles.semItem}>Nenhuma movimentação registrada.</Text>
                    )}
                </View>
            </ScrollView>

            {/* Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitulo}>Realizar Movimentação</Text>

                        <TouchableOpacity
                            style={[styles.input, { justifyContent: "center" }]}
                            onPress={() => setShowPicker(true)}
                        >
                            <Text>{dataHora.toLocaleString()}</Text>
                        </TouchableOpacity>

                        {showPicker && (
                            <DateTimePicker
                                value={dataHora}
                                mode="date"
                                display="default"
                                onChange={onChangeDate}
                            />
                        )}

                        <TextInput
                            style={styles.input}
                            placeholder="Quantidade"
                            keyboardType="numeric"
                            value={quantidade}
                            onChangeText={setQuantidade}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="ex: (ENTRADA, SAIDA, TRANSFERENCIA)"
                            value={tipo}
                            onChangeText={setTipo}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="ID do Produto"
                            keyboardType="numeric"
                            value={produtoId}
                            onChangeText={setProdutoId}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="ID do Depósito de Origem"
                            keyboardType="numeric"
                            value={depositoOrigemId}
                            onChangeText={setDepositoOrigemId}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="ID do Depósito de Destino"
                            keyboardType="numeric"
                            value={depositoDestinoId}
                            onChangeText={setDepositoDestinoId}
                        />

                        <TouchableOpacity style={styles.botaoSalvar} onPress={salvarMovimentacao}>
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
    movimentacaoContainer: {
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
    movimentacaoHeader: {
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
    acoes: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
});