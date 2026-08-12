import { Outlet, Link, NavLink } from "react-router-dom";
import logoImg from "../assets/logoo.png"; 

const PublicLayout = () => {
  return (
    <div
      className="d-flex flex-column"
      style={{
        minHeight: "100vh",
        width: "100%"
      }}
    >
      {/* NAVBAR */}
      <nav
        className="d-flex align-items-center justify-content-between bg-white border-bottom px-4 px-md-5"
        style={{
          height: 60,
          position: "sticky",
          top: 0,
          zIndex: 1030,
          width: "100%"
        }}
      >
        {/* LEFT */}
        <Link to="/login" className="text-decoration-none d-flex align-items-center py-1">
            <img 
                src={logoImg} 
                alt="DiaLog Logo" 
                style={{ height: "40px", width: "auto", objectFit: "contain" }} 
            />
        </Link>

        {/* RIGHT */}
        <div className="d-flex align-items-center" style={{ gap: "20px" }}>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              "text-decoration-none fw-medium " +
              (isActive ? "text-primary" : "text-secondary")
            }
          >
            Login
          </NavLink>

          <NavLink
            to="/register"
            className={({ isActive }) =>
              "text-decoration-none fw-medium " +
              (isActive ? "text-primary" : "text-secondary")
            }
          >
            Register
          </NavLink>
        </div>
      </nav>

      {/* CONTENT */}
      <main
        className="flex-grow-1"
        style={{
          width: "100%",
          background: "#f8f9fa",
          padding: "24px"
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;