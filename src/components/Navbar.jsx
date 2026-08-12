import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";
import logoImg from "../assets/logoo.png";

const Navbar = () => {
    const { logout } = useAuth();
    const { toggle } = useSidebar();

    async function handleLogout() {
        await logout();
    }

    return (
        <nav
            className="d-flex align-items-center justify-content-between bg-white border-bottom px-4 shadow-sm"
            style={{ height: 70, position: "sticky", top: 0, zIndex: 1030 }}
        >
            <div className="d-flex align-items-center gap-3">
                <button
                    onClick={toggle}
                    className="btn btn-light border d-flex align-items-center justify-content-center text-secondary shadow-none"
                    style={{ width: 40, height: 40, borderRadius: 10 }}
                    title="Toggle Sidebar"
                >
                    <span style={{ fontSize: "18px", lineHeight: 1 }}>☰</span>
                </button>

                <Link to="/dashboard" className="text-decoration-none d-flex align-items-center">
                    <img
                        src={logoImg}
                        alt="DiaLog Logo"
                        style={{ height: "40px", width: "auto", objectFit: "contain" }}
                    />
                </Link>
            </div>

            <div className="d-flex align-items-center gap-3">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        "text-decoration-none fw-semibold px-2 py-1 fs-6 " + (isActive ? "text-primary border-bottom border-primary border-2" : "text-muted")
                    }
                >
                    Home
                </NavLink>

                <button
                    className="btn btn-outline-danger btn-sm fw-semibold px-3 py-1.5 rounded-pill ms-2"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;