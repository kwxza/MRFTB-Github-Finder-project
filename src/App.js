import React, { Component } from 'react';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import './App.css';
import axios from 'axios';

class App extends Component {
    state = {
        users: [],
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

    // Clear users from state
    clearUsers = () => this.setState({ users: [], loading: false });

    // Set Alert
    setAlert = (msg, type) => {
        this.setState({ alert: { msg, type } });

        setTimeout(() => this.setState({ alert: null }), 5000);
    };

    render() {
        // Destructure variable and function names to be used.
        const { users, loading, alert } = this.state;
        const { searchUsers, clearUsers, setAlert } = this;

        return (
            <div className='App'>
                <Navbar />
                <div className='container'>
                    <Alert alert={alert} />
                    <Search
                        searchUsers={searchUsers}
                        clearUsers={clearUsers}
                        showClear={users.length > 0 ? true : false}
                        setAlert={setAlert}
                    />
                    <Users loading={loading} users={users} />
                </div>
            </div>
        );
    }
}

export default App;
