import React, { useEffect, useState } from "react";
import {
    CCard,
    CCardBody,
    CBadge,
    CButton,
    CSpinner,
    CRow,
    CCol,
    CFormInput,
    CFormTextarea,
    CAlert
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilArrowLeft,
    cilMoney,
    cilClock,
    cilUser,
    cilGlobeAlt,
    cilTags,
    cilFile,
    cilCloudUpload,
    cilCheckCircle
} from "@coreui/icons";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById, uploadProjectDocument } from "../../api/api";

const ProjectDetailTranslator = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [resultFile, setResultFile] = useState(null);
    const [note, setNote] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const data = await getProjectById(id);
            setProject(data.data || data);
            // console.log(data);
        } catch (err) {
            setError("Failed to load project details.");
        }
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, [id]);

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

    const handleUploadResult = async () => {
        if (!resultFile) return;
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("file", resultFile);
            formData.append("note", note);
            formData.append("projectId", id);

            await uploadProjectDocument(id,formData);
            alert("Result submitted successfully! Waiting for client review.");
            load();
        } catch (err) {
            alert("Failed to submit result.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <CSpinner color="primary" />
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger m-4">{error}</div>;
    }

    if (!project) return null;
    const resultDocURL = project.projectDocument?.[1]?.fileURL || undefined;

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
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
                        <div>
                            <div className="d-flex align-items-center gap-3 mb-2">
                                <h2 className="fw-bold text-dark mb-0">{project.title || project.name}</h2>
                                <CBadge color={getStatusColor(project.status)} className="px-3 py-2 fs-6">
                                    {project.status}
                                </CBadge>
                            </div>
                            <p className="text-muted mb-0 small">Project ID: #{project.id}</p>
                        </div>

                        <CButton
                            color="secondary"
                            variant="outline"
                            className="d-flex align-items-center gap-2 px-3 align-self-start align-self-md-auto"
                            onClick={() => navigate(-1)}
                        >
                            <CIcon icon={cilArrowLeft} size="sm" />
                            Back
                        </CButton>
                    </div>

                    <div className="mb-4">
                        <h5 className="fw-semibold text-secondary mb-2">Project Description</h5>
                        <div className="p-3 bg-light rounded-3 text-dark" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
                            {project.description || "No description provided."}
                        </div>
                    </div>

                    <div className="mb-4">
                        <h5 className="fw-semibold text-secondary mb-3">Detailed Information</h5>
                        <CRow className="g-3">
                            <CCol md={6} lg={4}>
                                <div className="p-3 border rounded-3 bg-white h-100 d-flex align-items-center gap-3 shadow-xs">
                                    <div className="p-2 bg-primary-subtle text-primary rounded-2">
                                        <CIcon icon={cilMoney} size="lg" />
                                    </div>
                                    <div>
                                        <span className="text-muted small d-block">Fee / Budget</span>
                                        <strong className="text-dark fs-6">{project.budget || "-"}</strong>
                                    </div>
                                </div>
                            </CCol>

                            <CCol md={6} lg={4}>
                                <div className="p-3 border rounded-3 bg-white h-100 d-flex align-items-center gap-3 shadow-xs">
                                    <div className="p-2 bg-info-subtle text-info rounded-2">
                                        <CIcon icon={cilClock} size="lg" />
                                    </div>
                                    <div>
                                        <span className="text-muted small d-block">Duration</span>
                                        <strong className="text-dark fs-6">{project.durationDays || "-"} Days</strong>
                                    </div>
                                </div>
                            </CCol>

                            <CCol md={6} lg={4}>
                                <div className="p-3 border rounded-3 bg-white h-100 d-flex align-items-center gap-3 shadow-xs">
                                    <div className="p-2 bg-success-subtle text-success rounded-2">
                                        <CIcon icon={cilUser} size="lg" />
                                    </div>
                                    <div>
                                        <span className="text-muted small d-block">Client</span>
                                        <strong className="text-dark fs-6">{project.client?.name || "-"}</strong>
                                    </div>
                                </div>
                            </CCol>

                            <CCol md={6} lg={4}>
                                <div className="p-3 border rounded-3 bg-white h-100 d-flex align-items-center gap-3 shadow-xs">
                                    <div className="p-2 bg-danger-subtle text-danger rounded-2">
                                        <CIcon icon={cilGlobeAlt} size="lg" />
                                    </div>
                                    <div>
                                        <span className="text-muted small d-block">Translation</span>
                                        <strong className="text-dark fs-6">
                                            {project.sourceLanguage?.name || "-"} ➔ {project.targetLanguage?.name || "-"}
                                        </strong>
                                    </div>
                                </div>
                            </CCol>

                            <CCol md={6} lg={4}>
                                <div className="p-3 border rounded-3 bg-white h-100 d-flex align-items-center gap-3 shadow-xs">
                                    <div className="p-2 bg-secondary-subtle text-secondary rounded-2">
                                        <CIcon icon={cilTags} size="lg" />
                                    </div>
                                    <div>
                                        <span className="text-muted small d-block">Specialization</span>
                                        <strong className="text-dark fs-6">{project.specialization?.name || "-"}</strong>
                                    </div>
                                </div>
                            </CCol>
                        </CRow>
                    </div>

                    {project.projectDocument && (
                        <div className="mb-4">
                            <h5 className="fw-semibold text-secondary mb-2">Source Document (Original)</h5>
                            <div className="p-3 border rounded-3 bg-white d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 bg-light text-dark rounded-2">
                                        <CIcon icon={cilFile} size="lg" />
                                    </div>
                                    <span className="fw-medium text-dark">Original File</span>
                                </div>
                                <CButton
                                    color="primary"
                                    variant="outline"
                                    size="sm"
                                    href={project.projectDocument[0]?.fileURL || project.projectDocument?.fileURL || project.projectDocument}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Download / Open Source
                                </CButton>
                            </div>
                        </div>
                    )}

                    {resultDocURL && (
                        <div className="mb-4">
                            <h5 className="fw-semibold text-secondary mb-2">Translation Result Document</h5>
                            <div className="p-3 border border-success-subtle rounded-3 bg-success-subtle bg-opacity-10 d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 bg-success text-white rounded-2">
                                        <CIcon icon={cilFile} size="lg" />
                                    </div>
                                    <span className="fw-medium text-dark">Submitted Translation Result</span>
                                </div>
                                <CButton
                                    color="success"
                                    variant="outline"
                                    size="sm"
                                    href={resultDocURL}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Open Result
                                </CButton>
                            </div>
                        </div>
                    )}

                    <div className="mt-4 pt-4 border-top">
                        {project.status === "IN_PROGRESS" && (
                            <div>
                                <h5 className="fw-bold text-dark mb-3">Submit Translation Result</h5>
                                <CAlert color="info" className="d-flex align-items-center gap-2 mb-3 border-0 shadow-sm rounded-3">
                                    <CIcon icon={cilCloudUpload} size="xl" />
                                    <div>
                                        <strong>Ready to submit?</strong> Upload your final translated document and include a note for the client.
                                    </div>
                                </CAlert>
                                <div className="d-flex flex-column gap-3 mb-3">
                                    <div>
                                        <label className="form-label fw-semibold text-dark">Translation File</label>
                                        <CFormInput
                                            type="file"
                                            id="resultFile"
                                            onChange={(e) => setResultFile(e.target.files[0])}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label fw-semibold text-dark">Note / Remark</label>
                                        <CFormTextarea
                                            rows={3}
                                            placeholder="Add a note or remark for the client..."
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <CButton
                                            color="primary"
                                            className="px-4 py-2 fw-semibold d-flex align-items-center gap-2 justify-content-center"
                                            disabled={!resultFile || submitting}
                                            onClick={handleUploadResult}
                                        >
                                            {submitting ? <CSpinner size="sm" /> : <CIcon icon={cilCloudUpload} />}
                                            {submitting ? "Uploading..." : "Submit Result"}
                                        </CButton>
                                    </div>
                                </div>
                            </div>
                        )}

                        {project.status === "WAITING_REVIEW" && (
                            <CAlert color="secondary" className="mb-0 d-flex align-items-center gap-2 border-0 shadow-sm rounded-3">
                                <CIcon icon={cilClock} size="lg" />
                                <strong>Waiting for Review:</strong> You have submitted the result. Please wait for the client to review and approve your work.
                            </CAlert>
                        )}

                        {project.status === "COMPLETED" && (
                            <div className="d-inline-flex">
                                <CButton color="success" disabled className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold opacity-100">
                                    <CIcon icon={cilCheckCircle} /> Project Completed
                                </CButton>
                            </div>
                        )}
                    </div>

                </CCardBody>
            </CCard>
        </div>
    );
};

export default ProjectDetailTranslator;