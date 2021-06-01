import React, { Component } from "react";

export default class Home extends Component {
  state = {
    githubData: [],
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
    console.log("name", this.state.name);
    console.log("name", this.state.userName);
  };
  render() {
    const {
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
    } = this.state;
    return (
      <div>
        <nav>
          <ul>
            <li>Repositories({followers})</li>
            <li>Projects</li>
          </ul>
        </nav>
        <div style={{ display: "flex" }}>
          <div>
            <img src={image} alt="profile image" height={200} width={200} />
            <h1>{name}</h1>
            <h5>{userName}</h5>
            <p>{bio}</p>
            <button>Edit Profile</button>
            <form>
              <textarea defaultValue={bio}></textarea>
              <div>
                <label htmlFor="company"></label>
                <input type="text" id="company" placeholder="Company" />
              </div>
              <div>
                <label htmlFor="location"></label>
                <input type="text" id="location" placeholder="Location" />
              </div>
              <div>
                <label htmlFor="email"></label>
                <input type="email" id="email" defaultValue={email} />
              </div>
              <div>
                <label htmlFor="website"></label>
                <input type="text" id="website" placeholder="Website" />
              </div>
              <div>
                <label htmlFor="twitterUsername"></label>
                <input
                  type="text"
                  id="twitterUsername"
                  placeholder="Twitter usesrname"
                />
              </div>
              <button type="submit">Save</button>
              <button>Cancel</button>
            </form>
            <ul>
              <li>{ followers }followers </li>
              <li>{following}following</li>
              <li>{ }</li>
            </ul>
          </div>
          <div>
            <input type="text" placeholder="Find a repository..." />
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
          </div>
        </div>
      </div>
    );
  }
}
