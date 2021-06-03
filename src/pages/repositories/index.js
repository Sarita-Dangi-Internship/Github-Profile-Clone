import React, { Component } from "react";

const FILTER_TYPE_MAP = {
  All: () => true,
  Public: (repo) => !repo.private,
  Private: (repo) => repo.private,
  Fork: (repo) => repo.fork,
};
const FILTER_TYPE_NAMES = Object.keys(FILTER_TYPE_MAP);

export default class Repository extends Component {
  state = {
    reposData: [],
    originalReposData: [],
    repoName: "",
    repoDescription: "",
    private: false,
    fork: false,
    updateDate: "",
    isEditMode: false,
    star: 0,
    search: "",
    filterByType: "All",
    filterByLanguage: "",
  };

  componentDidMount = () => {
    this.fetchReposData();
  };

  fetchReposData = async () => {
    const response = await fetch("https://api.github.com/users/saritadc/repos");
    const data = await response.json();

    this.setState({
      reposData: data,
      originalReposData: data,
    });
  };

  handleOnFilter = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  };

  getLanguageName(arrayList, comparisonKey) {
    const uniqueLanguage = arrayList
      .map((element) => element[comparisonKey])
      .map((element, index, array) => array.indexOf(element) === index && index)
      .filter((element) => arrayList[element])
      .map((element) => arrayList[element]);
    return uniqueLanguage;
  }

  handleFilterByLanguage = (event) => {
    this.setState({ filterByLanguage: event.target.value });
    const filteredByLanguage = this.state.originalReposData.filter(
      (repo) => repo.language === event.target.value
    );
    this.setState({ reposData: filteredByLanguage });
  };

  handleSearch = (event) => {
    this.setState({
      search: event.target.value,
    });
    const search = event.target.value;
    const filteredSearch = this.state.originalReposData.filter((repo) => {
      return repo.name.toLowerCase().includes(search.toLowerCase());
    });
    this.setState({ reposData: filteredSearch });
  };

  render() {
    const {
      reposData,
      originalReposData,
      search,
      filterByType,
      filterByLanguage,
    } = this.state;
    const {
      handleOnFilter,
      handleFilterByLanguage,
      getLanguageName,
      handleSearch,
    } = this;

    const uniqueLanguage = getLanguageName(originalReposData, "language");

    // const filterDropDown = reposData.filter(
    //   (result) => result.language === filterByLanguage
    // );

    return (
      <div className="main-container__repositories">
        <form className="repositories-form">
          <input
            type="search"
            id="search"
            placeholder="Find a repository..."
            value={search}
            onChange={handleSearch}
          />
          <select
            value={filterByType}
            onChange={handleOnFilter}
            id="filterByType"
          >
            <optgroup label="Select Type">
              {FILTER_TYPE_NAMES.map((type) => (
                <option role="button" key={type} value={type}>
                  {type}
                </option>
              ))}
            </optgroup>
          </select>

          <select
            value={filterByLanguage}
            onChange={handleFilterByLanguage}
            id="filterByLanguage"
          >
            <optgroup label="Select Languages">
              {uniqueLanguage
                .filter((language) => language.language !== null)
                .map((language) => (
                  <option key={language.id} value={language.language}>
                    {language.language}
                  </option>
                ))}
            </optgroup>
          </select>
        </form>
        <ul className="repositories-list">
          {reposData.filter(FILTER_TYPE_MAP[filterByType]).map((repo) => (
            <li key={repo.id} className="repositories-list__items">
              <h2 className="repo-name"> {repo.name}</h2>{" "}
              <div className="repo-description">
                {" "}
                <h3>{repo.description}</h3>
              </div>
              <div className="repo-language">{repo.language}</div>{" "}
              <div className="repo-date">
                Updated:{" "}
                {(new Date(new Date().toLocaleDateString()).getTime() -
                  new Date(
                    new Date(repo.updated_at).toLocaleDateString()
                  ).getTime()) /
                  (1000 * 3600 * 24)}{" "}
                days ago
              </div>{" "}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
