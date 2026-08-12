import React from "react";
import { useAuth } from "../contexts/AuthContext";
import ClientDashboard from "../pages/client/ClientDashboard";
import TranslatorDashboard from "../pages/translators/TranslatorDashboard";
import AdminDashboard from '../pages/admin/AdminDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    const role = user?.roles?.[0];

    if (role === "Client") {
        return <ClientDashboard />;
    }

    if (role === "Translator") {
        return <TranslatorDashboard />;
    }
    if(role === "Admin"){
        return <AdminDashboard />
    }

    return (
        <div className="container-fluid px-4 py-4">
            <div className="alert alert-warning">
                Unknown user role: {role || "Unknown"}
            </div>
        </div>
    );
};

export default Dashboard;