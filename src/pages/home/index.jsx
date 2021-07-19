import React, { Component } from "react";
import { Route, Switch, Link } from "react-router-dom";

import CONSTANTS from "./../../constants/appConstant";
import { REPOS, PROJECTS } from "./../../constants/routes";
import Repository from "./../repositories/index";
import Project from "./../projects/index";

const { baseURL } = CONSTANTS;

export default class Home extends Component {
  state = {
    reposData: [],
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
  };

  componentDidMount = () => {
    this.fetchUserData();
    this.fetchReposData();
    this.fetchStarred();
  };

  fetchUserData = async () => {
    const response = await fetch(`${baseURL}/saritadc`);
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
    const response = await fetch(`${baseURL}/saritadc/repos`);
    const data = await response.json();

    this.setState({
      reposData: data,
      originalReposData: data,
    });
  };

  fetchStarred = async () => {
    const response = await fetch(`${baseURL}/saritadc/starred`);
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

  render() {
    const {
      reposData,
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
    } = this.state;

    const { handleOnEdit, handleOnCancel, handleOnSubmit, handleOnChange } =
      this;

    return (
      <div>
        <nav className="nav-bar">
          <ul className="nav-bar__list">
            <Link to={REPOS} className="nav-bar__list-link">
              <li>Repositories({reposData.length})</li>
            </Link>
            <Link to={PROJECTS} className="nav-bar__list-link">
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
            <Route path={"/repos"} component={Repository} />
            <Route path={"/projects"} component={Project} />
          </Switch>
        </div>
      </div>
    );
  }
}
