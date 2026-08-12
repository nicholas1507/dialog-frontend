import React, { useEffect, useState } from "react";
import {
    CCard,
    CCardBody,
    CButton,
    CBadge,
    CSpinner
} from "@coreui/react";
import { useNavigate, Outlet } from "react-router-dom";
import { getMyProjects } from "../../api/api";

const MyProjects = () => {
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [pagination, setPagination] = useState({ totalPage: 1, totalData: 0, limit: 10 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    async function load(page = 1, keyword = "") {
        setLoading(true);
        setError(null);
        try {
            const data = await getMyProjects({ page, limit: pagination.limit, search: keyword });
            setProjects(Array.isArray(data) ? data : data.data || []);
            setPagination(Array.isArray(data) ? data : data.pagination || { totalPage: 1, totalData: 0, limit: 10 });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load projects");
        }
        setLoading(false);
    }

    useEffect(() => {
        load(currentPage, search);
    }, [currentPage, search]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "WAITING_PAYMENT": return "warning";
            case "OPEN": return "info";
            case "IN_PROGRESS": return "primary";
            case "OVERDUE": return "danger";
            case "WAITING_REVIEW": return "secondary";
            case "COMPLETED": return "success";
            case "CANCELLED": return "dark";
            case "FAILED": return "danger";
            default: return "light";
        }
    };

    const startItems = pagination.totalData === 0 ? 0 : (currentPage - 1) * pagination.limit + 1;
    const endItems = Math.min(currentPage * pagination.limit, pagination.totalData);

    return (
        <div className="container-fluid px-4 py-4">
            <CCard
                className="border-0 shadow-sm"
                style={{
                    borderRadius: "16px",
                    background: "linear-gradient(to bottom, #ffffff, #fcfdff)"
                }}
            >
                <CCardBody className="p-4 p-lg-5">
                    <div className="mb-4 pb-3 border-bottom">
                        <h2 className="fw-bold text-dark mb-3">My Projects</h2>

                        <div
                            style={{
                                background: "#f5f7fa",
                                borderRadius: "999px",
                                padding: "14px 20px",
                                display: "flex",
                                alignItems: "center"
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={search}
                                onChange={handleSearch}
                                style={{
                                    border: "none",
                                    outline: "none",
                                    background: "transparent",
                                    width: "100%",
                                    fontSize: "16px"
                                }}
                            />
                        </div>
                    </div>

                    {loading && (
                        <div className="text-center py-5">
                            <CSpinner color="primary" />
                        </div>
                    )}

                    {error && <div className="alert alert-danger m-4">{error}</div>}

                    {!loading && !error && (
                        <>
                            {projects.length === 0 ? (
                                <div className="text-center text-muted py-5 fs-5">No projects found</div>
                            ) : (
                                projects.map((project) => (
                                    <CCard key={project.id} className="mb-3 border rounded-3 bg-white shadow-xs">
                                        <CCardBody className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 p-4">
                                            <div>
                                                <h5 className="fw-bold text-dark mb-2">{project.title}</h5>
                                                <div className="text-muted small mb-2">
                                                    Budget: Rp {project.budget || "-"} • {project.durationDays || "-"} Days
                                                </div>
                                                <div>
                                                    <CBadge color={getStatusColor(project.status)} className="px-3 py-2">
                                                        {project.status}
                                                    </CBadge>
                                                </div>
                                            </div>

                                            <CButton
                                                color="primary"
                                                variant="outline"
                                                className="px-4 py-2 fw-semibold align-self-start align-self-md-auto"
                                                onClick={() => navigate(`/my-projects/${project.id}`)}
                                            >
                                                View Detail
                                            </CButton>
                                        </CCardBody>
                                    </CCard>
                                ))
                            )}

                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-4 pt-3 border-top">
                                <span className="text-muted small">
                                    {`Showing ${startItems} to ${endItems} of ${pagination.totalData} entries`}
                                </span>

                                <div className="d-flex gap-2">
                                    <CButton
                                        size="sm"
                                        color="secondary"
                                        variant="outline"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((prev) => prev - 1)}
                                    >
                                        Prev
                                    </CButton>

                                    {Array.from({ length: pagination.totalPage }, (_, i) => (
                                        <CButton
                                            key={i}
                                            size="sm"
                                            color={currentPage === i + 1 ? "primary" : "secondary"}
                                            variant={currentPage === i + 1 ? "solid" : "outline"}
                                            onClick={() => setCurrentPage(i + 1)}
                                        >
                                            {i + 1}
                                        </CButton>
                                    ))}

                                    <CButton
                                        size="sm"
                                        color="secondary"
                                        variant="outline"
                                        disabled={currentPage === pagination.totalPage}
                                        onClick={() => setCurrentPage((prev) => prev + 1)}
                                    >
                                        Next
                                    </CButton>
                                </div>
                            </div>
                        </>
                    )}
                </CCardBody>
            </CCard>
            <Outlet />
        </div>
    );
};

export default MyProjects;