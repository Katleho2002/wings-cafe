import React, { useState, useEffect } from 'react';
import './UsersManagement.css';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [updateUser, setUpdateUser] = useState({ oldUsername: '', newUsername: '', newPassword: '' });
    const [deleteUsername, setDeleteUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch all users from the backend
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5300/users');
            const data = await response.json();

            if (response.ok) {
                // Ensure users is always an array
                setUsers(Array.isArray(data.users) ? data.users : []);
            } else {
                setMessage(data.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setMessage('Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(); // Load users on component mount
    }, []);

    // Update an existing user
    const updateExistingUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5300/updateUser', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateUser),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                setUpdateUser({ oldUsername: '', newUsername: '', newPassword: '' });
                fetchUsers(); // Refresh user list
            } else {
                setMessage(data.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            setMessage('Failed to update user.');
        } finally {
            setLoading(false);
        }
    };

    // Delete a user
    const deleteUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5300/deleteUser', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: deleteUsername }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                setDeleteUsername('');
                fetchUsers(); // Refresh user list
            } else {
                setMessage(data.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            setMessage('Failed to delete user.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="usersManagement">
            <h2>Users Management</h2>
            {message && <div className="message">{message}</div>}

            {/* Container for Update and Delete User Forms */}
            <div className="form-container">
                {/* Update User Form */}
                <form id="updateUserForm" onSubmit={updateExistingUser}>
                    <label>Current Username:</label>
                    <input
                        type="text"
                        value={updateUser.oldUsername}
                        onChange={(e) => setUpdateUser({ ...updateUser, oldUsername: e.target.value })}
                        required
                    />
                    <label>New Username:</label>
                    <input
                        type="text"
                        value={updateUser.newUsername}
                        onChange={(e) => setUpdateUser({ ...updateUser, newUsername: e.target.value })}
                        required
                    />
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={updateUser.newPassword}
                        onChange={(e) => setUpdateUser({ ...updateUser, newPassword: e.target.value })}
                        required
                    />
                    <button type="submit" disabled={loading}>Update User</button>
                </form>

                {/* Delete User Form */}
                <form id="deleteUserForm" onSubmit={deleteUser}>
                    <label>Username to delete:</label>
                    <input
                        type="text"
                        value={deleteUsername}
                        onChange={(e) => setDeleteUsername(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>Delete User</button>
                </form>
            </div>

            {/* Users List Table */}
            <h3>Users List:</h3>
            <table id="usersList">
                <thead>
                    <tr>
                        <th>Username</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.username}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="1">No users found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    );
};

export default UsersManagement;
