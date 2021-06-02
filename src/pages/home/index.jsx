import React, { Component } from "react";

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
    repoName: "",
    repoDescription: "",
    public: true,
    updateDate: "",
    isEditMode: false,
    star: 0,
  };

  componentDidMount = () => {
    this.fetchUserData();
    this.fetchReposData();
    this.fetchStarred();
  };

  fetchUserData = async () => {
    const response = await fetch("https://api.github.com/users/saritadc");
    const data = await response.json();
    console.log(data);

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
    console.log(data);

    this.setState({
      reposData: data,
      repoName: data[0].name,
      repoDescription: data.description,
      private: data.private,
      updateDate: data.updated_at,
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
        <nav>
          <ul>
            <li>Repositories({reposData.length})</li>
            <li>Projects</li>
          </ul>
        </nav>
        <div style={{ display: "flex" }}>
          <div>
            <img src={image} alt="profile" height={200} width={200} />
            <h1>{name}</h1>
            <h5>{userName}</h5>

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

            <ul>
              <li>{followers}followers </li>
              <li>{following}following</li>
              <li>{star}</li>
            </ul>
          </div>
          <div>
            <form>
              <input type="search" placeholder="Find a repository..." />
              <select>
                <optgroup label="Select Type">
                  <option value="all">All</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="forks">Forks</option>
                </optgroup>
              </select>

              <select>
                <optgroup label="Select Languages">
                  <option value="all">All</option>
                  <option value="SCSS">SCSS</option>
                  <option value="javascript">Javascript</option>
                  <option value="python">Python</option>
                </optgroup>
              </select>
            </form>
            <ul>
              {reposData.map((repo) => (
                <li key={repo.id}>
                  {repo.name} <div>{repo.language}</div>{" "}
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
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
