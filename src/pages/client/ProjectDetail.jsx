import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CBadge,
  CButton,
  CSpinner,
  CRow,
  CCol
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
  cilCreditCard, 
  cilPeople, 
  cilChartLine, 
  cilCheckCircle 
} from "@coreui/icons";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById, approveProject } from "../../api/api";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [approving, setApproving] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjectById(id);
      setProject(data.data || data);
    } catch (err) {
      setError("Failed to load project");
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [id]);

  const handleApprove = async () => {
    setApproving(true);
    try {
      await approveProject(id);
      load();
    } catch (err) {
      alert("Failed to approve project");
    } finally {
      setApproving(false);
    }
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

  const sourceDocURL = project.projectDocument?.[0]?.fileURL || (typeof project.projectDocument === 'string' ? project.projectDocument : undefined);
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
                    <span className="text-muted small d-block">Budget</span>
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
                  <div className="p-2 bg-warning-subtle text-warning rounded-2">
                    <CIcon icon={cilUser} size="lg" />
                  </div>
                  <div>
                    <span className="text-muted small d-block">Translator</span>
                    <strong className="text-dark fs-6">{project.translator?.user?.name || "Not assigned yet"}</strong>
                  </div>
                </div>
              </CCol>

              <CCol md={6} lg={4}>
                <div className="p-3 border rounded-3 bg-white h-100 d-flex align-items-center gap-3 shadow-xs">
                  <div className="p-2 bg-danger-subtle text-danger rounded-2">
                    <CIcon icon={cilGlobeAlt} size="lg" />
                  </div>
                  <div>
                    <span className="text-muted small d-block">Source & Target Language</span>
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

          {/* Source / Original Supporting Document */}
          {sourceDocURL && (
            <div className="mb-4">
              <h5 className="fw-semibold text-secondary mb-2">Source Document (Original)</h5>
              <div className="p-3 border rounded-3 bg-white d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 bg-light text-dark rounded-2">
                    <CIcon icon={cilFile} size="lg" />
                  </div>
                  <span className="fw-medium text-dark">Original Uploaded File</span>
                </div>
                <CButton
                  color="primary"
                  variant="outline"
                  size="sm"
                  href={sourceDocURL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Document
                </CButton>
              </div>
            </div>
          )}
          {resultDocURL  && (
            <div className="mb-4">
              <h5 className="fw-semibold text-secondary mb-2">Translation Result Document</h5>
              <div className="p-3 border border-success-subtle rounded-3 bg-success-subtle bg-opacity-10 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 bg-success text-white rounded-2">
                    <CIcon icon={cilFile} size="lg" />
                  </div>
                  <div>
                    <span className="fw-medium text-dark d-block">Submitted Translation Result</span>
                    <small className="text-muted">Uploaded by translator for your review</small>
                  </div>
                </div>
                <CButton
                  color="success"
                  variant="outline"
                  size="sm"
                  href={resultDocURL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Result Document
                </CButton>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 pt-3 border-top d-flex flex-wrap gap-2">
            {project.status === "WAITING_PAYMENT" && (
              <CButton color="warning" className="text-white d-flex align-items-center gap-2 px-4 py-2 fw-semibold"
                onClick={() => navigate(`/my-projects/${project.id}/payment`)}
              >
                <CIcon icon={cilCreditCard} /> Pay Now
              </CButton>
            )}

            {project.status === "OPEN" && (
              <CButton 
                color="info" 
                className="text-white d-flex align-items-center gap-2 px-4 py-2 fw-semibold"
                onClick={() => navigate(`/my-projects/${project.id}/applicants`)}
              >
                <CIcon icon={cilPeople} /> View Applicants
              </CButton>
            )}

            {project.status === "IN_PROGRESS" && (
              <CButton color="primary" className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold">
                <CIcon icon={cilChartLine} /> View Progress
              </CButton>
            )}

            {project.status === "WAITING_REVIEW" && (
              <CButton 
                color="success" 
                className="text-white d-flex align-items-center gap-2 px-4 py-2 fw-semibold"
                disabled={approving}
                onClick={handleApprove}
              >
                <CIcon icon={cilCheckCircle} /> {approving ? "Approving..." : "Approve Result"}
              </CButton>
            )}

            {project.status === "COMPLETED" && (
              <CButton color="success" disabled className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold">
                <CIcon icon={cilCheckCircle} /> Completed
              </CButton>
            )}
          </div>

        </CCardBody>
      </CCard>
    </div>
  );
};

export default ProjectDetail;