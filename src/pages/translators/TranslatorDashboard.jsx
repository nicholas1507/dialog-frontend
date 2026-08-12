import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getMyTranslator } from "../../api/api";
import { CCard, CCardBody, CButton, CRow, CCol, CSpinner, CBadge } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBriefcase, cilCheckCircle, cilArrowRight, cilSearch, cilPencil } from "@coreui/icons";

const TranslatorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [translator, setTranslator] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTranslator = async () => {
            try {
                const data = await getMyTranslator();
                setTranslator(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTranslator();
    }, []);

    if (loading) {
        return <div className="d-flex justify-content-center py-5"><CSpinner /></div>;
    }

    const projects = translator?.projects || [];
    const completed = projects.filter(p => p.status === "COMPLETED");
    const active = projects.filter(p => !["COMPLETED", "CANCELLED"].includes(p.status));
    const hour = new Date().getHours();
    const greeting = hour < 11 ? "Good morning" : hour < 15 ? "Good afternoon" : hour < 19 ? "Good evening" : "Good evening";

    return (
        <div className="container-fluid px-4 py-4">
            <div
                className="p-4 p-lg-5 mb-4 rounded-4 text-white position-relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #0d6efd 0%, #4f46e5 60%, #7c3aed 100%)" }}
            >
                <div
                    className="position-absolute"
                    style={{ width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", top: "-80px", right: "-60px" }}
                />
                <div className="position-relative">
                    <small className="text-white-50 fw-semibold text-uppercase" style={{ letterSpacing: "0.06em" }}>
                        {greeting}
                    </small>
                    <h2 className="fw-bold mb-2 mt-1">{user?.name || "Translator"} 👋</h2>
                    <p className="mb-4 opacity-75" style={{ maxWidth: "480px" }}>
                        Here's a snapshot of your work. Keep momentum on active projects, or explore fresh opportunities that match your language pairs.
                    </p>
                    <div className="d-flex gap-2 flex-wrap">
                        <CButton color="light" className="fw-semibold rounded-3" onClick={() => navigate("/available-projects")}>
                            <CIcon icon={cilSearch} className="me-2" />
                            Find New Projects
                        </CButton>
                        <CButton
                            variant="outline"
                            className="fw-semibold rounded-3 text-white border-white"
                            onClick={() => navigate("/my-profile/setup-translator")}
                        >
                            <CIcon icon={cilPencil} className="me-2" />
                            Update My Profile
                        </CButton>
                    </div>
                </div>
            </div>

            <CRow className="g-4 mb-4">
                <CCol md={6}>
                    <CCard className="border-0 shadow-sm rounded-4 h-100">
                        <CCardBody className="p-4 d-flex align-items-center gap-3">
                            <div className="p-3 rounded-3" style={{ background: "#e8f1ff", color: "#0d6efd" }}>
                                <CIcon icon={cilBriefcase} size="xl" />
                            </div>
                            <div>
                                <small className="text-muted">Active Projects</small>
                                <h2 className="fw-bold mb-0">{active.length}</h2>
                                <small className="text-muted">Currently in progress</small>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>

                <CCol md={6}>
                    <CCard className="border-0 shadow-sm rounded-4 h-100">
                        <CCardBody className="p-4 d-flex align-items-center gap-3">
                            <div className="p-3 rounded-3" style={{ background: "#e8f8ef", color: "#198754" }}>
                                <CIcon icon={cilCheckCircle} size="xl" />
                            </div>
                            <div>
                                <small className="text-muted">Completed Projects</small>
                                <h2 className="fw-bold mb-0">{completed.length}</h2>
                                <small className="text-muted">Successfully delivered</small>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <CCard className="border-0 shadow-sm rounded-4 mb-4">
                <CCardBody className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h5 className="fw-bold mb-1">Current Projects</h5>
                            <small className="text-muted">A quick look at what you're working on right now</small>
                        </div>
                        <CButton color="link" className="text-decoration-none fw-semibold" onClick={() => navigate("/translator/projects")}>
                            View All <CIcon icon={cilArrowRight} />
                        </CButton>
                    </div>

                    {active.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                            Nothing active right now — browse available projects to pick up new work.
                        </div>
                    ) : (
                        active.slice(0, 3).map(project => (
                            <div key={project.id} className="d-flex justify-content-between align-items-center py-3 border-bottom">
                                <div>
                                    <h6 className="fw-semibold mb-1">{project.title}</h6>
                                    <small className="text-muted">{project.wordCount} words</small>
                                </div>
                                <CBadge color="primary" className="px-3 py-2 rounded-3">{project.status}</CBadge>
                            </div>
                        ))
                    )}
                </CCardBody>
            </CCard>

            <div className="d-flex justify-content-center gap-2">
                <CButton color="primary" className="rounded-3 px-4 fw-semibold" onClick={() => navigate("/available-projects")}>
                    Browse Projects
                </CButton>
                <CButton color="light" className="border rounded-3 px-4 fw-semibold" onClick={() => navigate("/my-projects")}>
                    My Projects
                </CButton>
            </div>
        </div>
    );
};

export default TranslatorDashboard;