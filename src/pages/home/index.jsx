import React, { Component } from "react";

const FILTER_TYPE_MAP = {
  All: () => true,
  Public: (repo) => !repo.private,
  Private: (repo) => repo.private,
  Fork: (repo) => repo.fork,
};
const FILTER_LANGUAGE_MAP = {
  All: () => true,
  Public: (repo) => !repo.private,
  Private: (repo) => repo.private,
  Fork: (repo) => repo.fork,
};

const FILTER_TYPE_NAMES = Object.keys(FILTER_TYPE_MAP);
export default class Home extends Component {
  state = {
    reposData: [],
    originalReposData: [],
    name: "",
    username: "",
    image: "",
    bio: "",
    company: "",
    location: "",
    email: "",
    website: "",
    twitterUserName: "",
    followers: 0,
    following: 0,
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
    this.fetchUserData();
    this.fetchReposData();
    this.fetchStarred();
  };

  fetchUserData = async () => {
    const response = await fetch("https://api.github.com/users/saritadc");
    const data = await response.json();
    console.log("user details", data);

    this.setState({
      name: data.name,
      userName: data.login,
      image: data.avatar_url,
      bio: data.bio,
      company: data.company,
      location: data.location,
      email: data.email,
      website: data.blog,
      twitterUserName: data.twitter_username,
      followers: data.followers,
      following: data.following,
    });
  };

  fetchReposData = async () => {
    const response = await fetch("https://api.github.com/users/saritadc/repos");
    const data = await response.json();
    console.log("repos", data);
    console.log(data[0].private);

    this.setState({
      reposData: data,
      originalReposData: data,
    });
  };

  fetchStarred = async () => {
    const response = await fetch(
      "https://api.github.com/users/saritadc/starred"
    );
    const data = await response.json();
    console.log("starred", data);
    this.setState({ star: data.length });
  };

  handleOnEdit = () => {
    this.setState({ isEditMode: true });
  };
  handleOnCancel = () => {
    this.setState({ isEditMode: false });
  };

  handleOnSubmit = (event) => {
    const { bio, company, location, email, website, twitterUserName } =
      this.state;
    event.preventDefault();
    fetch("https://api.github.com/user", {
      method: "PATCH",
      headers: new Headers({
        Authorization: "Bearer " + "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",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        bio,
        company,
        location,
        email,
        website,
        twitterUserName,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));

    this.setState({
      isEditMode: false,
    });
  };

  handleOnChange = (event) => {
    console.log("e", event.target.id);
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  handleOnFilter = (event) => {
    this.setState({ [event.target.id]: event.target.value });
    console.log("filter", this.state.filterByLanguage);
  };

  getUnique(arrayList, comparisonKey) {
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
  // handleFilterByType = (event) => {
  //   this.setState({ filterByType: event.target.value });
  //   const filteredByType = this.state.originalReposData.filter(
  //     (repo) => repo.private === event.target.value
  //   );
  //   this.setState({ reposData: filteredByLanguage });
  // };

  render() {
    const {
      reposData,
      originalReposData,
      name,
      userName,
      image,
      bio,
      company,
      location,
      email,
      website,
      twitterUserName,
      followers,
      following,
      isEditMode,
      star,
      search,
      filterByType,
      filterByLanguage,
    } = this.state;
    const {
      handleOnEdit,
      handleOnCancel,
      handleOnSubmit,
      handleOnChange,
      handleOnFilter,
      getUnique,
      handleFilterByLanguage,
    } = this;

    const handleSearch = (event) => {
      this.setState({
        search: event.target.value,
      });
      const search = event.target.value;
      const filteredSearch = originalReposData.filter((repo) => {
        return repo.name.toLowerCase().includes(search.toLowerCase());
      });
      this.setState({ reposData: filteredSearch });
    };

    const uniqueLanguage = getUnique(originalReposData, "language");

    const filterDropDown = reposData.filter(
      (result) => result.language === filterByLanguage
    );

    console.log("languange", filterDropDown);
    return (
      <div>
        <nav className="nav-bar">
          <ul className="nav-bar__list">
            <li>Repositories({reposData.length})</li>
            <li>Projects</li>
          </ul>
        </nav>
        <div style={{ display: "flex" }} className="main-container">
          <div className="main-container__account-details">
            <div className="">
              <img
                src={image}
                alt="profile"
                height={200}
                width={200}
                className="profile-image"
              />
              <h1>{name}</h1>
              <h5>{userName}</h5>
            </div>
            <div>
              {isEditMode ? (
                <>
                  {" "}
                  <form onSubmit={handleOnSubmit}>
                    <textarea
                      defaultValue={bio}
                      onChange={handleOnChange}
                      id="bio"
                    ></textarea>
                    <div>
                      <label htmlFor="company"></label>
                      <input
                        type="text"
                        id="company"
                        placeholder="Company"
                        defaultValue={company}
                        onChange={handleOnChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="location"></label>
                      <input
                        type="text"
                        id="location"
                        placeholder="Location"
                        defaultValue={location}
                        onChange={handleOnChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="email"></label>
                      <input
                        type="email"
                        id="email"
                        defaultValue={email}
                        placeholder="Email"
                        onChange={handleOnChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="website"></label>
                      <input
                        type="text"
                        id="website"
                        placeholder="Website"
                        defaultValue={website}
                        onChange={handleOnChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="twitterUsername"></label>
                      <input
                        type="text"
                        id="twitterUsername"
                        placeholder="Twitter usesrname"
                        defaultValue={twitterUserName}
                        onChange={handleOnChange}
                      />
                    </div>
                    <button type="submit">Save</button>
                    <button onClick={() => handleOnCancel()}>Cancel</button>
                  </form>
                </>
              ) : (
                <>
                  {" "}
                  <p>{bio}</p>
                  <button onClick={() => handleOnEdit()}>Edit Profile</button>
                  <p>{company}</p>
                  <p>{location}</p>
                  <p>{email}</p>
                  <p>{website}</p>
                  <p>{twitterUserName}</p>
                </>
              )}
            </div>
            <div>
              <ul>
                <li>{followers}followers </li>
                <li>{following}following</li>
                <li>{star}</li>
              </ul>
            </div>
          </div>
          <div className="main-container__repositories">
            <form>
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
            <ul>
              {/* {searchedData
                .filter(FILTER_TYPE_MAP[filterByType])
                .map((repo) => (
                  <li key={repo.id}>
                    {repo.name} <div>{repo.description}</div>
                    <div>{repo.language}</div>{" "}
                    <div>
                      Updated:{" "}
                      {(new Date(new Date().toLocaleDateString()).getTime() -
                        new Date(
                          new Date(repo.updated_at).toLocaleDateString()
                        ).getTime()) /
                        (1000 * 3600 * 24)}{" "}
                      days ago
                    </div>
                  </li>
                ))} */}

              {reposData.filter(FILTER_TYPE_MAP[filterByType]).map((repo) => (
                <li key={repo.id}>
                  {repo.name} <div>{repo.description}</div>
                  <div>{repo.language}</div>{" "}
                  <div>
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
        </div>
      </div>
    );
  }
}
