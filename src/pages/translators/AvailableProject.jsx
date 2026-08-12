import React, { useEffect, useState } from "react";
import {
    CCard,
    CCardBody,
    CButton,
    CBadge,
    CSpinner,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormTextarea
} from "@coreui/react";
import {getAvailableProjects,applyProject} from '../../api/api'

const AvailableProjects = () => {
    const [projects, setProjects] = useState([]);
    const [pagination, setPagination] = useState({ totalPage: 1, totalData: 0, limit: 10 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [visibleModal, setVisibleModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    async function load(page = 1, keyword = "") {
        setLoading(true);
        setError(null);
        try {
            const data = await getAvailableProjects({ page, limit: pagination.limit, search: keyword });
            setProjects(Array.isArray(data) ? data : data.data || []);
            setPagination(Array.isArray(data) ? data : data.pagination || { totalPage: 1, totalData: 0, limit: 10 });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load available projects");
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

    const handleOpenApplyModal = (project) => {
        setSelectedProject(project);
        setMessage("");
        setSuccessMsg("");
        setVisibleModal(true);
    };

    const handleApplySubmit = async () => {
        if (!selectedProject) return;
        setSubmitting(true);
        setError(null);
        try {
            await applyProject(selectedProject.id, { message, type: "APPLICATION" });
            setSuccessMsg("Successfully applied for the project!");
            setTimeout(() => {
                setVisibleModal(false);
                load(currentPage, search); 
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to apply for project");
        }
        setSubmitting(false);
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
                        <h2 className="fw-bold text-dark mb-1">Available Projects</h2>
                        <p className="text-muted small">Browse open translation projects and apply to start working.</p>

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
                                placeholder="Search available projects..."
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

                    {error && <div className="alert alert-danger mb-4">{error}</div>}

                    {!loading && !error && (
                        <>
                            {projects.length === 0 ? (
                                <div className="text-center text-muted py-5 fs-5">No available projects found</div>
                            ) : (
                                projects.map((project) => (
                                    <CCard key={project.id} className="mb-3 border rounded-3 bg-white shadow-xs">
                                        <CCardBody className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 p-4">
                                            <div>
                                                <h5 className="fw-bold text-dark mb-2">{project.title}</h5>
                                                <p className="text-muted small mb-2 text-truncate" style={{ maxWidth: "600px" }}>
                                                    {project.description || "No description provided."}
                                                </p>
                                                <div className="text-muted small mb-3">
                                                    Budget: <strong className="text-success">{project.budget || "-"}</strong> • Duration: {project.durationDays || "-"} Days • Word Count: {project.wordCount || "-"} words
                                                </div>
                                                <div>
                                                    <CBadge color="info" className="px-3 py-2">
                                                        {project.status}
                                                    </CBadge>
                                                </div>
                                            </div>

                                            <CButton
                                                color="primary"
                                                className="px-4 py-2 fw-semibold align-self-start align-self-md-auto text-white"
                                                onClick={() => handleOpenApplyModal(project)}
                                            >
                                                Apply Project
                                            </CButton>
                                        </CCardBody>
                                    </CCard>
                                ))
                            )}

                            {/* Pagination */}
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
            <CModal visible={visibleModal} onClose={() => setVisibleModal(false)} alignment="center">
                <CModalHeader>
                    <CModalTitle className="fw-bold">Apply for Project</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {successMsg && <div className="alert alert-success">{successMsg}</div>}
                    {selectedProject && (
                        <div className="mb-3">
                            <h6 className="fw-bold text-dark">{selectedProject.title}</h6>
                            <p className="text-muted small mb-0">Budget: {selectedProject.budget}</p>
                        </div>
                    )}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Message to Client</label>
                        <CFormTextarea
                            rows={4}
                            placeholder="Write a brief message explaining why you are suitable for this project..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" variant="ghost" onClick={() => setVisibleModal(false)}>
                        Cancel
                    </CButton>
                    <CButton color="primary" onClick={handleApplySubmit} disabled={submitting}>
                        {submitting ? <CSpinner size="sm" /> : "Submit Application"}
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default AvailableProjects;