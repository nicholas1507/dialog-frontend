import React, { useEffect, useState } from "react";
import {
    CCard,
    CCardBody,
    CButton,
    CSpinner,
    CForm,
    CFormInput,
    CFormLabel,
    CFormTextarea,
    CAlert
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilArrowLeft, cilCloudUpload, cilCreditCard } from "@coreui/icons";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById, createPayment } from "../../api/api";

const ClientPayment = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    async function loadProject() {
        setLoading(true);
        setError(null);
        try {
            const data = await getProjectById(id);
            const projData = data.data || data;
            
            if (projData.status !== "WAITING_PAYMENT") {
                setError("This project is not waiting for payment.");
            }
            
            setProject(projData);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to load project details.");
        }
        setLoading(false);
    }

    useEffect(() => {
        loadProject();
    }, [id]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("Payment proof image or document is required!");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("image", file); 

            await createPayment(id, formData);
            
            setSuccessMessage("Payment proof uploaded successfully! Redirecting...");
            setTimeout(() => {
                navigate(`/my-projects/${id}`);
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to upload payment proof.");
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

    return (
        <div className="container-fluid px-4 py-4">
            <CCard
                className="border-0 shadow-sm"
                style={{
                    borderRadius: "16px",
                    background: "linear-gradient(to bottom, #ffffff, #fcfdff)",
                    maxWidth: "800px",
                    margin: "0 auto"
                }}
            >
                <CCardBody className="p-4 p-lg-5">
                    <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                        <div>
                            <h2 className="fw-bold text-dark mb-1">Project Payment</h2>
                            <p className="text-muted small mb-0">Upload your transfer receipt to proceed with the project.</p>
                        </div>
                        <CButton
                            color="secondary"
                            variant="outline"
                            className="d-flex align-items-center gap-2 px-3"
                            onClick={() => navigate(-1)}
                        >
                            <CIcon icon={cilArrowLeft} size="sm" />
                            Back
                        </CButton>
                    </div>

                    {error && <CAlert color="danger" className="mb-4">{error}</CAlert>}
                    {successMessage && <CAlert color="success" className="mb-4">{successMessage}</CAlert>}

                    {project && (
                        <div className="mb-4 p-4 bg-light rounded-3 border">
                            <h5 className="fw-bold text-dark mb-2">{project.title}</h5>
                            <div className="row g-2 text-muted small">
                                <div className="col-md-6">
                                    <span>Amount to Pay: </span>
                                    <strong className="text-dark fs-5">{project.budget}</strong>
                                </div>
                                <div className="col-md-6">
                                    <span>Duration: </span>
                                    <strong className="text-dark">{project.durationDays} Days</strong>
                                </div>
                            </div>
                        </div>
                    )}

                    <CForm onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <CFormLabel htmlFor="proofFile" className="fw-semibold text-secondary mb-2">
                                Upload Payment Proof (Image / PDF)
                            </CFormLabel>
                            
                            <div className="p-4 border border-dashed rounded-3 bg-white text-center position-relative">
                                <input
                                    type="file"
                                    id="proofFile"
                                    accept="image/*,application/pdf"
                                    onChange={handleFileChange}
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        opacity: 0,
                                        cursor: "pointer"
                                    }}
                                />
                                <div className="d-flex flex-column align-items-center gap-2">
                                    <div className="p-3 bg-primary-subtle text-primary rounded-circle">
                                        <CIcon icon={cilCloudUpload} size="xl" />
                                    </div>
                                    <span className="fw-medium text-dark">
                                        {file ? file.name : "Click here or drag and drop your file here"}
                                    </span>
                                    <span className="text-muted small">Supports: JPG, PNG, PDF</span>
                                </div>
                            </div>

                            {previewUrl && file?.type?.startsWith("image/") && (
                                <div className="mt-3 text-center">
                                    <span className="text-muted small d-block mb-2">Preview:</span>
                                    <img
                                        src={previewUrl}
                                        alt="Payment Proof Preview"
                                        className="img-thumbnail rounded-3"
                                        style={{ maxHeight: "200px" }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                            <CButton
                                color="secondary"
                                variant="outline"
                                onClick={() => navigate(-1)}
                                disabled={submitting}
                            >
                                Cancel
                            </CButton>
                            <CButton
                                type="submit"
                                color="warning"
                                className="text-white d-flex align-items-center gap-2 px-4 fw-semibold"
                                disabled={submitting || !file}
                            >
                                {submitting ? (
                                    <>
                                        <CSpinner size="sm" /> Submitting...
                                    </>
                                ) : (
                                    <>
                                        <CIcon icon={cilCreditCard} /> Submit Payment
                                    </>
                                )}
                            </CButton>
                        </div>
                    </CForm>
                </CCardBody>
            </CCard>
        </div>
    );
};

export default ClientPayment;