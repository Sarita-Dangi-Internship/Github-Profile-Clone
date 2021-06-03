import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Link, Router } from "react-router-dom";
import Repository from "./../repositories/index";
import Project from "./../projects/index";

const FILTER_TYPE_MAP = {
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
    this.setState({
      [event.target.id]: event.target.value,
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
      handleFilterByLanguage,
      getLanguageName,
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

    const uniqueLanguage = getLanguageName(originalReposData, "language");

    // const filterDropDown = reposData.filter(
    //   (result) => result.language === filterByLanguage
    // );

    return (
      <div>
        <nav className="nav-bar">
          <ul className="nav-bar__list">
            <Link to={"/repos"} className="nav-bar__list-link">
              <li>Repositories({reposData.length})</li>
            </Link>
            <Link to={"/projects"} className="nav-bar__list-link">
              <li>Projects</li>
            </Link>
          </ul>
        </nav>
        <div className="main-container">
          <div className="main-container__account-details">
            <div className="account-details__username">
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
            <div className="account-details__edit-form">
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
                    <button type="submit" className="save-button">
                      Save
                    </button>
                    <button
                      onClick={() => handleOnCancel()}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
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
            <div className="account-details__follower-following">
              <ul className="follower-following__list">
                <li className="follower-following__list__item">
                  {followers} followers{" "}
                </li>
                <li>{following} following</li>
                <li>{star}</li>
              </ul>
            </div>
          </div>

          <Switch>
            <Route path={"/repos"}>
              {" "}
              <Repository
                search={search}
                handleSearch={handleSearch}
                filterByType={filterByType}
                handleOnFilter={handleOnFilter}
                FILTER_TYPE_NAMES={FILTER_TYPE_NAMES}
                FILTER_TYPE_MAP={FILTER_TYPE_MAP}
                filterByLanguage={filterByLanguage}
                handleFilterByLanguage={handleFilterByLanguage}
                uniqueLanguage={uniqueLanguage}
                reposData={reposData}
              />
            </Route>
            <Route path={"/projects"} component={Project} />
          </Switch>
        </div>
      </div>
    );
  }
}
