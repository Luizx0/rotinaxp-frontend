# RotinaXP - Frontend

## 📌 Visão Geral

Aplicação React para interação com a API RotinaXP.

---

## 🏗️ Tecnologias

- React
- JavaScript
- Axios
- React Router
- Context API

---

## 📁 Estrutura


/src
/components
/pages
/services
/context
/routes


---

## ⚙️ Configuração

### 1. Instalar dependências


npm install


### 2. Rodar projeto


npm start


---

## 🔐 Autenticação

- Login salva JWT no localStorage
- Rotas protegidas

---

## 📱 Telas

### 🔐 Auth
- Login
- Cadastro

---

### 🏠 Dashboard
- Pontos
- Progresso diário

---

### ✅ Tarefas
- Listagem
- Criar
- Editar
- Concluir

---

### 🎁 Recompensas
- Listar
- Resgatar

---

### 📊 Progresso
- Histórico

---

### 👤 Perfil
- Editar dados

---

## 🔌 Integração com API

### Exemplo (Axios)

```js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
📌 Fluxo
Usuário loga
Token salvo
Requests com token
API responde dados
🧠 Estado Global
Usuário logado
Tarefas
Pontos
🚀 Melhorias Futuras
UI/UX melhor
Gráficos (charts)
Dark mode
Notificações