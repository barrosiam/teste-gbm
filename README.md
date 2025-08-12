# 🚢 Teste GBM — Controle de Operações Portuárias

Aplicação desenvolvida como teste técnico para **Controle de Operações Portuárias**, utilizando **React + TypeScript** e integração com uma API simulada via **JSON Server**.

O objetivo é demonstrar domínio de **custom hooks**, **gerenciamento de estado global** (Context API ou Zustand), **componentização acessível** com Radix UI, uso de **TailwindCSS** para estilização responsiva e uma **boa arquitetura de projeto**.

---

## ✨ Funcionalidades

1. **Listar operações** a partir de uma biblioteca que simula uma API externa.
2. **Adicionar nova operação** com:
   - Descrição da carga.
   - Tipo (Embarque ou Descarga).
   - Terminal (ex.: "Terminal Norte", "Terminal Sul", etc.).
3. **Editar e excluir operações** com persistência na API.
4. **Marcar operações como finalizadas** (status).
5. **Listar operações por terminal**.
6. **Filtrar operações** por tipo e status.
7. **Exibir feedbacks visuais** com Radix UI Toasts.

---

## 🛠️ Stack utilizada

- **React** + **Vite** (Front-end SPA)
- **TypeScript** (tipagem estática e segurança no desenvolvimento)
- **TailwindCSS** (estilização rápida e responsiva)
- **Radix UI** (componentes acessíveis e customizáveis)
- **JSON Server** (simulação de API externa para persistência de dados)

---

## 📦 Pré-requisitos

- **Node.js** v18+
- **npm** ou **yarn** instalados

---

## ⚙️ Instalação e uso

1. **Clone o repositório**

   ```bash
   git clone https://github.com/seuusuario/teste-gbm.git
   cd teste-gbm
   ```

2. **Instale as dependências**

   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Inicie o JSON Server** (API simulada)

   ```bash
   npm run server
   # API disponível em http://localhost:3001
   ```

4. **Inicie o front-end**
   ```bash
   npm run dev
   # Aplicação disponível em http://localhost:5173
   ```

---

## 📂 Estrutura do projeto

```
src/
 ├── components/     # Componentes reutilizáveis
 ├── hooks/          # Custom hooks
 ├── pages/          # Páginas da aplicação
 ├── services/       # Integração com API
 ├── types/          # Tipagens TypeScript
 ├── App.tsx         # Roteamento e layout
 └── main.tsx        # Ponto de entrada
```

---

## 🚀 Deploy

// add link do vercel já já

---

## 📄 Licença

Este projeto é de uso interno para avaliação técnica e não possui licença pública.

---

## 👨‍💻 Autor

Desenvolvido por [Samanta Barros](https://www.linkedin.com/in/samanta-barros/).
