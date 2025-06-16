import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Header from "../../components/Header/header";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Produto() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [codigo, setCodigo] = useState("");
  const [medida, setMedida] = useState("");
  const [descricao, setDescricao] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem("token");
    } catch {
      return null;
    }
  };

  const listarProdutos = useCallback(async () => {
    try {
      const token = await getToken();
      const resposta = await fetch(
        "https://projeto-inventario-grdrgfgcgpd0cbgu.brazilsouth-01.azurewebsites.net/produto/todos",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!resposta.ok) throw new Error("Erro ao listar produtos");
      const dados = await resposta.json();
      setProdutos(dados);
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível carregar os produtos.");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      listarProdutos();
    }, [listarProdutos])
  );

  const handleSalvar = async () => {
    if (!nome || !preco || !codigo) {
      Alert.alert("Atenção", "Preencha os campos obrigatórios.");
      return;
    }

    const novoProduto = { nome, preco, codigo, medida, descricao };
    try {
      const token = await getToken();
      const resposta = await fetch(
        "https://projeto-inventario-grdrgfgcgpd0cbgu.brazilsouth-01.azurewebsites.net/produto/cadastrar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(novoProduto),
        }
      );
      if (!resposta.ok) throw new Error();
      setModalVisible(false);
      limparCampos();
      listarProdutos();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar o produto.");
    }
  };

  const handleAtualizar = async () => {
    if (!produtoSelecionado) return;

    const produtoAtualizado = { nome, preco, codigo, medida, descricao };
    try {
      const token = await getToken();
      const resposta = await fetch(
        `https://projeto-inventario-grdrgfgcgpd0cbgu.brazilsouth-01.azurewebsites.net/produto/atualizar/${produtoSelecionado.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(produtoAtualizado),
        }
      );
      if (!resposta.ok) throw new Error();
      setModalVisible(false);
      limparCampos();
      setProdutoSelecionado(null);
      listarProdutos();
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar o produto.");
    }
  };

  const abrirEdicao = (produto) => {
    setProdutoSelecionado(produto);
    setNome(produto.nome);
    setPreco(produto.preco.toString());
    setCodigo(produto.codigo);
    setMedida(produto.medida);
    setDescricao(produto.descricao);
    setModalVisible(true);
  };

  const limparCampos = () => {
    setNome("");
    setPreco("");
    setCodigo("");
    setMedida("");
    setDescricao("");
  };
  return (
    <>
      <Header />
      <ScrollView
        style={styles.produtoContainer}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <TouchableOpacity
          style={styles.btnVoltar}
          onPress={() => navigation.navigate("Home")}
        >
          <Icon style={styles.iconVoltar} name="arrow-left" />
        </TouchableOpacity>

        <View style={styles.produtoHeader}>
          <Text style={styles.titulo}>Produtos</Text>
          <TouchableOpacity
            style={styles.botaoAdicionar}
            onPress={() => {
              limparCampos();
              setProdutoSelecionado(null);
              setModalVisible(true);
            }}
          >
            <Icon name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.listaProdutos}>
          <Text style={styles.tituloLista}>Produtos Cadastrados</Text>
          {produtos.length === 0 ? (
            <Text style={styles.semItem}>Nenhum produto cadastrado.</Text>
          ) : (
            produtos.map((produto) => (
              <View key={produto.id} style={styles.card}>
                <Text style={styles.nomeProduto}>{produto.nome}</Text>
                <Text style={styles.infoProduto}>Preço: R$ {produto.preco}</Text>
                <Text style={styles.infoProduto}>Código: {produto.codigo}</Text>
                <Text style={styles.infoProduto}>Unidade: {produto.medida}</Text>
                <Text style={styles.infoProduto}>{produto.descricao}</Text>
                <View style={styles.acoes}>
                  <TouchableOpacity onPress={() => abrirEdicao(produto)}>
                    <Icon name="edit" size={25} />
                  </TouchableOpacity>
                  <TouchableOpacity>
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
        onRequestClose={() => {
          setModalVisible(false);
          setProdutoSelecionado(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>
              {produtoSelecionado ? "Editar Produto" : "Adicionar Produto"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome do Produto"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              style={styles.input}
              placeholder="Preço"
              keyboardType="numeric"
              value={preco}
              onChangeText={setPreco}
            />
            <TextInput
              style={styles.input}
              placeholder="Código"
              value={codigo}
              onChangeText={setCodigo}
            />
            <TextInput
              style={styles.input}
              placeholder="Unidade de Medida (Kg, L, Ml...)"
              value={medida}
              onChangeText={setMedida}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Descrição..."
              multiline
              value={descricao}
              onChangeText={setDescricao}
            />
            <View style={styles.botaoContainer}>
              <TouchableOpacity
                style={styles.botaoSalvar}
                onPress={produtoSelecionado ? handleAtualizar : handleSalvar}
              >
                <Text style={styles.salvarTexto}>
                  {produtoSelecionado ? "Atualizar" : "Salvar"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => {
                  setModalVisible(false);
                  limparCampos();
                  setProdutoSelecionado(null);
                }}
              >
                <Text style={styles.cancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  produtoContainer: {
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
  produtoHeader: {
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
