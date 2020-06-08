import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import User from './components/users/User';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import About from './components/pages/About';
import './App.css';
import axios from 'axios';

class App extends Component {
    state = {
        users: [],
        user: {},
        repos: [],
        loading: false,
        alert: null,
    };

    // Search GitHub Users
    searchUsers = async (text) => {
        this.setState({ loading: true });

        const res = await axios({
            url: `https://api.github.com/search/users?q=${text}`,
            method: 'get',
            auth: {
                username: `${process.env.REACT_APP_GITHUB_CLIENT_ID}`,
                password: `${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`,
            },
        });

        this.setState({ users: res.data.items, loading: false });
    };

    // Get single GitHub user
    getUser = async (username) => {
        this.setState({ loading: true });

        const res = await axios({
            url: `https://api.github.com/users/${username}`,
            method: 'get',
            auth: {
                username: `${process.env.REACT_APP_GITHUB_CLIENT_ID}`,
                password: `${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`,
            },
        });

        this.setState({ user: res.data, loading: false });
    };

    // Get user's repos
    getUserRepos = async (username) => {
        this.setState({ loading: true });

        const res = await axios({
            url: `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc`,
            method: 'get',
            auth: {
                username: `${process.env.REACT_APP_GITHUB_CLIENT_ID}`,
                password: `${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`,
            },
        });

        this.setState({ repos: res.data, loading: false });
    };

    // Clear users from state
    clearUsers = () => this.setState({ users: [], loading: false });

    // Set Alert
    setAlert = (msg, type) => {
        this.setState({ alert: { msg, type } });

        setTimeout(() => this.setState({ alert: null }), 5000);
    };

    render() {
        // Destructuring variable and function names to be used.
        const { users, user, repos, loading, alert } = this.state;
        const { searchUsers, clearUsers, setAlert } = this;

        return (
            <Router>
                <div className='App'>
                    <Navbar />
                    <div className='container'>
                        <Alert alert={alert} />
                        <Switch>
                            <Route
                                exact
                                path='/'
                                render={(props) => (
                                    <Fragment>
                                        <Search
                                            searchUsers={searchUsers}
                                            clearUsers={clearUsers}
                                            showClear={
                                                users.length > 0 ? true : false
                                            }
                                            setAlert={setAlert}
                                        />
                                        <Users
                                            loading={loading}
                                            users={users}
                                        />
                                    </Fragment>
                                )}
                            />
                            <Route exact path='/about' component={About} />
                            <Route
                                exact
                                path='/user/:login'
                                render={(props) => (
                                    <User
                                        {...props}
                                        getUser={this.getUser}
                                        getUserRepos={this.getUserRepos}
                                        user={user}
                                        repos={repos}
                                        loading={loading}
                                    />
                                )}
                            />
                        </Switch>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
