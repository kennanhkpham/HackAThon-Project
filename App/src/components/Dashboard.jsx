import React from "react";
import Notes from "./Notes";

const Dashboard = ({ currentUser, signOut }) => {
    return (
        <div className="dashboard-root">
            <header className="dashboard-header">
                <h2>Welcome, {currentUser?.username}!</h2>
                <button className="nav-button" onClick={signOut}>
                    Sign out
                </button>
            </header>

            <main className="dashboard-content">
                <Notes />
            </main>
        </div>
    );
};

export default Dashboard;
