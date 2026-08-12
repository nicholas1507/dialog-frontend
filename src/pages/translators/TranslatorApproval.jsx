import React, { useEffect, useState } from "react";
import { CButton, CSpinner, CCard, CCardBody } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilArrowLeft } from "@coreui/icons";
import { useNavigate } from "react-router-dom";
import { getMyInvitations, acceptInvitation, declineInvitation } from "../../api/api";

const TranslatorApproval = () => {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const res = await getMyInvitations();
      const data = Array.isArray(res) ? res : res?.data || [];
      setInvitations(data);
    } catch (err) { 
      alert("Error loading data"); 
    }
    setLoading(false);
  };

  useEffect(() => { 
    fetchInvitations(); 
  }, []);

  const handleAccept = async (item) => {
    if (!window.confirm("Accept this invitation?")) return;
    setProcessingId(item.id);
    try {
      const projectId = item.projectId || item.project?.id;
      await acceptInvitation(projectId);
      alert("Success!");
      fetchInvitations();
    } catch (err) { 
      alert("Failed"); 
    }
    setProcessingId(null);
  };

  const handleDecline = async (item) => {
    if (!window.confirm("Decline this invitation?")) return;
    setProcessingId(item.id);
    try {
      const projectId = item.projectId || item.project?.id;
      await declineInvitation(projectId);
      alert("Invitation declined.");
      fetchInvitations();
    } catch (err) { 
      alert("Failed"); 
    }
    setProcessingId(null);
  };

  if (loading) return <div className="text-center py-5"><CSpinner /></div>;

  return (
    <div className="container-fluid px-4 py-4" style={{ maxWidth: '1000px' }}>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold mb-0">Invitations</h2>
        <CButton 
          color="light" 
          className="d-flex align-items-center gap-2 px-3 fw-medium text-dark shadow-none border-0" 
          style={{ background: '#f0f2f5' }}
          onClick={() => navigate(-1)}
        >
          <CIcon icon={cilArrowLeft} />
          Back
        </CButton>
      </div>

      <h5 className="fw-bold mb-3 text-secondary">Pending Invitations ({invitations.length})</h5>
      {invitations.length === 0 ? (
        <div className="text-muted">No invitations yet.</div>
      ) : (
        invitations.map((item) => (
          <CCard key={item.id} className="mb-3 border-0 shadow-sm rounded-3">
            <CCardBody className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="fw-bold mb-1 fs-4">{item.project?.title || "Untitled Project"}</h5>
                  <div className="text-muted fs-6">From: {item.client?.user?.name || "Unknown Client"}</div>
                </div>
                <div className="d-flex gap-3">
                  <CButton color="light" size="lg" onClick={() => navigate(`/projects/${item.project?.id}`)}>
                    View Project
                  </CButton>
                  <CButton color="success" className="text-white px-4" size="lg" onClick={() => handleAccept(item)} disabled={processingId === item.id}>
                    {processingId === item.id ? <CSpinner size="sm"/> : "Accept"}
                  </CButton>
                  <CButton color="danger" className="text-white px-4" size="lg" onClick={() => handleDecline(item)} disabled={processingId === item.id}>
                    {processingId === item.id ? <CSpinner size="sm"/> : "Decline"}
                  </CButton>
                </div>
              </div>
              <div className="mt-3 p-3 bg-light rounded-2 text-dark fs-6" style={{ lineHeight: '1.6' }}>
                {item.message || "No message provided."}
              </div>
            </CCardBody>
          </CCard>
        ))
      )}
    </div>
  );
};

export default TranslatorApproval;