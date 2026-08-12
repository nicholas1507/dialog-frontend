import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CSpinner,
  CBadge,
  CButton,
} from "@coreui/react";
import {
  cilGroup,
  cilLanguage,
  cilFolder,
  cilGlobeAlt,
  cilBookmark,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useNavigate } from "react-router-dom";
import * as api from "../../api/api";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTranslators: 0,
    activeProjects: 0,
    totalLanguages: 0,
    totalSpecializations: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const navigate = useNavigate();

  const fetchSafely = async (apiFunc) => {
    if (typeof apiFunc !== "function") return [];
    try {
      const res = await apiFunc();
      return res?.data || res || [];
    } catch (err) {
      return [];
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);

    const usersData = await fetchSafely(api.getAllUser);
    const translatorsData = await fetchSafely(api.getTranslators);
    const projectsData = await fetchSafely(api.getProjects);
    const languagesData = await fetchSafely(api.getLanguages);
    const specData = await fetchSafely(api.getSpecializations);

    const totalUsers = Array.isArray(usersData) ? usersData.length : 0;
    const totalTranslators = Array.isArray(translatorsData) ? translatorsData.length : 0;
    const activeProjects = Array.isArray(projectsData)
      ? projectsData.filter((p) => p.status !== "completed" && p.status !== "cancelled").length
      : 0;
    const totalLanguages = Array.isArray(languagesData) ? languagesData.length : 0;
    const totalSpecializations = Array.isArray(specData) ? specData.length : 0;

    setStats({
      totalUsers,
      totalTranslators,
      activeProjects,
      totalLanguages,
      totalSpecializations,
    });

    if (Array.isArray(projectsData)) {
      setRecentProjects(projectsData.slice(0, 5));
    }

    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString("id-ID"),
      icon: cilGroup,
      color: "primary",
      path: "/admin/users",
    },
    {
      title: "Translators",
      value: stats.totalTranslators.toLocaleString("id-ID"),
      icon: cilLanguage,
      color: "info",
      path: "/admin/translators",
    },
    {
      title: "Active Projects",
      value: stats.activeProjects.toLocaleString("id-ID"),
      icon: cilFolder,
      color: "warning",
      path: "/admin/projects",
    },
    {
      title: "Total Languages",
      value: stats.totalLanguages.toLocaleString("id-ID"),
      icon: cilGlobeAlt,
      color: "success",
      path: "/admin/languages",
    },
    {
      title: "Specializations",
      value: stats.totalSpecializations.toLocaleString("id-ID"),
      icon: cilBookmark,
      color: "danger",
      path: "/admin/specializations",
    },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: "300px" }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Admin Dashboard</h2>
        <p className="text-muted mb-0">Platform data overview</p>
      </div>

      <CRow className="g-3 mb-4">
        {statCards.map((item, idx) => (
          <CCol sm={6} md={4} lg={2} className="col-lg" key={idx}>
            <CCard
              className="border-0 shadow-sm rounded-4 h-100 cursor-pointer"
              onClick={() => navigate(item.path)}
            >
              <CCardBody className="p-3 d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted fw-semibold small text-uppercase mb-1">{item.title}</p>
                  <h3 className="fw-bold text-dark mb-0">{item.value}</h3>
                </div>
                <div
                  className={`p-3 rounded-circle bg-${item.color} bg-opacity-10 text-${item.color} d-flex align-items-center justify-content-center`}
                  style={{ width: "48px", height: "48px" }}
                >
                  <CIcon icon={item.icon} size="lg" />
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      <CRow className="g-4">
        <CCol lg={8}>
          <CCard className="border-0 shadow-sm rounded-4 h-100">
            <CCardBody className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">Recent Projects</h5>
                <CButton color="link" className="p-0 text-decoration-none fw-semibold" onClick={() => navigate("/admin/projects")}>
                  View All
                </CButton>
              </div>

              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr className="text-muted small text-uppercase">
                      <th>Project Title</th>
                      <th>Client</th>
                      <th className="text-end">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProjects.length > 0 ? (
                      recentProjects.map((project, index) => (
                        <tr key={project.id || index}>
                          <td className="fw-semibold text-dark">{project.title || project.name || "Untitled Project"}</td>
                          <td className="text-muted">{project.clientName || project.user?.name || "-"}</td>
                          <td className="text-end">
                            <CBadge
                              color={
                                project.status === "completed"
                                  ? "success"
                                  : project.status === "pending"
                                    ? "warning"
                                    : "info"
                              }
                              className="px-3 py-2 rounded-pill"
                            >
                              {project.status || "N/A"}
                            </CBadge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-muted py-4">
                          No recent projects available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={4}>
          <CCard className="border-0 shadow-sm rounded-4 h-100">
            <CCardBody className="p-4 d-flex flex-column justify-content-between">
              <div>
                <h5 className="fw-bold text-dark mb-3">Quick Navigation</h5>
                <div className="d-grid gap-2">
                  <CButton
                    color="light"
                    className="text-start border fw-semibold py-2 px-3 rounded-3"
                    onClick={() => navigate("/admin/users")}
                  >
                    User Management
                  </CButton>
                  <CButton
                    color="light"
                    className="text-start border fw-semibold py-2 px-3 rounded-3"
                    onClick={() => navigate("/admin/translators")}
                  >
                    Translator Verification
                  </CButton>
                  <CButton
                    color="light"
                    className="text-start border fw-semibold py-2 px-3 rounded-3"
                    onClick={() => navigate("/admin/languages")}
                  >
                    Manage Languages
                  </CButton>
                  <CButton
                    color="light"
                    className="text-start border fw-semibold py-2 px-3 rounded-3"
                    onClick={() => navigate("/admin/specializations")}
                  >
                    Manage Specializations
                  </CButton>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default AdminDashboard;