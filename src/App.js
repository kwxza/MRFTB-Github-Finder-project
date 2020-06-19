import React, { Fragment, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import User from './components/users/User';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import About from './components/pages/About';

import GithubState from './context/github/GithubState';

import './App.css';
import axios from 'axios';

const App = () => {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({});
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    // Search GitHub Users

    // Get single GitHub user
    const getUser = async (username) => {
        setLoading(true);

        const res = await axios({
            url: `https://api.github.com/users/${username}`,
            method: 'get',
            auth: {
                username: `${process.env.REACT_APP_GITHUB_CLIENT_ID}`,
                password: `${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`,
            },
        });

        setUser(res.data);
        setLoading(false);
    };

    // Get user's repos
    const getUserRepos = async (username) => {
        setLoading(true);

        const res = await axios({
            url: `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc`,
            method: 'get',
            auth: {
                username: `${process.env.REACT_APP_GITHUB_CLIENT_ID}`,
                password: `${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`,
            },
        });

        setRepos(res.data);
        setLoading(false);
    };

    // Clear users from state
    const clearUsers = () => {
        setUsers([]);
        setLoading(false);
    };

    // Set Alert
    const showAlert = (msg, type) => {
        setAlert({ msg, type });

        setTimeout(() => setAlert(null), 5000);
    };

    // Destructuring variable and function names to be used.

    return (
        <GithubState>
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
                                            clearUsers={clearUsers}
                                            showClear={
                                                users.length > 0 ? true : false
                                            }
                                            showAlert={showAlert}
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
                                        getUser={getUser}
                                        getUserRepos={getUserRepos}
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
        </GithubState>
    );
};

export default App;
