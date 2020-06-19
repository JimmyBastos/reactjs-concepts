import React, { useState, useEffect } from "react";
import api from "./services/api";

import "./styles.css";

function App() {
  let [repositoryList, setRepositoryList] = useState([]);

  useEffect(() => {
    api.get("repositories").then(({ data }) => {
      setRepositoryList(data);
    })
  }, [])

  async function handleAddRepository() {
    let payload = {
      title: "New repository - " + (new Date()).toLocaleTimeString(),
      url: "https://spartandev.com.br/repolist",
      techs: ["react", "node", "javascript"],
    }

    let { data: repository } = await api.post(`repositories`, payload)
    setRepositoryList([...repositoryList, repository])
  }

  async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`)
    setRepositoryList(
      repositoryList.filter(repository => repository.id !== id)
    )
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositoryList.map(repository => (
          <li key={repository.id}>
            {repository.title}

            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
