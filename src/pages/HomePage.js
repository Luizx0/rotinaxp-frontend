import { useEffect, useState } from "react";
import { criarTarefa, getTarefas } from "../services/tarefaService";

function HomePage() {
  const [tarefas, setTarefas] = useState([]);
  const [nome, setNome] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function carregar() {
    setCarregando(true);
    setErro("");

    try {
      const data = await getTarefas();
      setTarefas(data);
    } catch (error) {
      setErro("Nao foi possivel carregar as tarefas.");
    } finally {
      setCarregando(false);
    }
  }

  async function adicionar() {
    if (!nome.trim()) {
      return;
    }

    setErro("");

    try {
      await criarTarefa(nome.trim());
      setNome("");
      await carregar();
    } catch (error) {
      setErro("Nao foi possivel criar a tarefa.");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <main style={{ maxWidth: 520, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Tarefas</h1>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite uma tarefa"
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={adicionar}>Adicionar</button>
      </div>

      {erro ? <p style={{ color: "#b00020" }}>{erro}</p> : null}

      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {tarefas.map((tarefa) => (
            <li key={tarefa.id}>{tarefa.nome}</li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default HomePage;
