import React, { Component } from 'react';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import Search from './components/users/Search';
import './App.css';
import axios from 'axios';

class App extends Component {
    state = {
        users: [],
        loading: false,
    };

    async componentDidMount() {
        this.setState({ loading: true });

        const res = await axios({
            url: 'https://api.github.com/users',
            method: 'get',
            auth: {
                username: `${process.env.REACT_APP_GITHUB_CLIENT_ID}`,
                password: `${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`,
            },
        });

        this.setState({ users: res.data, loading: false });
    }

    render() {
        return (
            <div className='App'>
                <Navbar />
                <div className='container'>
                    <Search />
                    <Users
                        loading={this.state.loading}
                        users={this.state.users}
                    />
                </div>
            </div>
        );
    }
}

export default App;
