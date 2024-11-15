import React, { useState } from 'react';
import './styles.css';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    // Handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5300/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                onLogin(); // Calls the parent component's login function
                alert(data.message);
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error(error);
            alert('Login failed. Please try again.');
        }
    };

    // Handle registration
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5300/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setIsRegistering(false); // Switch back to login mode
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error(error);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <section id="login">
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
            </form>
            <button onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? 'Have an account? Login' : 'No account? Register'}
            </button>
        </section>
    );
}

export default Login;
