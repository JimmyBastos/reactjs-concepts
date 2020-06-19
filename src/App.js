import React, { useState, useEffect } from "react";
import api from "./services/api";

import "./styles.css";

function App() {
  let defaultFormData = { title: "", url: "", techs: "" }

  let [repositoryList, setRepositoryList] = useState([]);
  let [formData, setFormData] = useState({ ...defaultFormData });

  useEffect(() => {
    api.get("repositories").then(({ data }) => {
      setRepositoryList(data);
    })
  }, [])

  function handleInputChange(prop) {
    return (event) => {
      setFormData({ ...formData, [prop]: event.target.value })
    }
  }

  async function handleAddRepository(event) {
    event.preventDefault()
    event.stopPropagation()
    let payload = { ...formData, techs: formData.techs.split(",") }
    let { data: repository } = await api.post(`repositories`, payload)
    setRepositoryList([...repositoryList, repository])
    setFormData({ ...defaultFormData })
  }

  async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`)
    setRepositoryList(
      repositoryList.filter(repository => repository.id !== id)
    )
  }

  return (
    <div className="container">
      <form className="repository-form" onSubmit={handleAddRepository}>
        <h3>Novo Repositório</h3>
        <input
          type="text"
          placeholder="Titulo"
          required
          value={formData.title}
          onChange={handleInputChange("title")}
        />

        <input type="text"
          placeholder="Url"
          required
          value={formData.url}
          onChange={handleInputChange("url")}
        />

        <input
          type="text"
          placeholder="Tecnologias (Ex: React.js, React Native, Node.js)"
          value={formData.techs}
          onChange={handleInputChange("techs")}
        />

        <button className="btn">Adicionar</button>
      </form>

      <ul className="repository-list" data-testid="repository-list">
        {repositoryList.map(repository => (
          <li className="repository" key={repository.id}>
            <h3 >
              {repository.title}
              <small style={{ display: "block", color: "gray" }}>
                {repository.techs.join(", ")}
              </small>
            </h3>

            <div>
              <button className="btn btn--small btn--danger" onClick={() => handleRemoveRepository(repository.id)}>
                Remover
              </button>

              <a href={repository.url} target="_blank" className="btn btn--small" >
                Acessar
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
