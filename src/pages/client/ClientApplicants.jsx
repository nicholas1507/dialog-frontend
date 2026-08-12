import React, { useEffect, useState } from "react";
import { CButton, CSpinner, CCard, CCardBody } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilArrowLeft } from "@coreui/icons";
import { useParams, useNavigate } from "react-router-dom";
import { getMyProjectCandidates, approveCandidate } from "../../api/api";

const ClientApplicants = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await getMyProjectCandidates(projectId);
      const data = Array.isArray(res) ? res : res?.data || [];
      setCandidates(data);
    } catch (err) { alert("Error loading data"); }
    setLoading(false);
  };

  useEffect(() => { fetchCandidates(); }, [projectId]);

  const handleApprove = async (candidateId) => {
    if (!window.confirm("Approve this translator?")) return;
    setApprovingId(candidateId);
    try {
      await approveCandidate(projectId, candidateId);
      alert("Success!");
      fetchCandidates();
    } catch (err) { alert("Failed"); }
    setApprovingId(null);
  };

  if (loading) return <div className="text-center py-5"><CSpinner /></div>;

  const applications = candidates.filter(c => c.type === "APPLICATION");
  const invitations = candidates.filter(c => c.type === "INVITATION");

  const CandidateItem = ({ item }) => (
    <CCard className="mb-3 border-0 shadow-sm rounded-3">
      <CCardBody className="p-4">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h5 className="fw-bold mb-1 fs-4">{item.translator?.user?.name || "Unknown"}</h5>
            <div className="text-muted fs-6">Rating: {item.translator?.rating || "No rating yet"}</div>
          </div>
          <div className="d-flex gap-3">
            <CButton color="light" size="lg" onClick={() => navigate(`/translators/${item.translator?.id}`)}>
              View Profile
            </CButton>
            <CButton color="success" className="text-white px-4" size="lg" onClick={() => handleApprove(item.id)} disabled={approvingId === item.id}>
              {approvingId === item.id ? <CSpinner size="sm"/> : "Approve"}
            </CButton>
          </div>
        </div>
        <div className="mt-3 p-3 bg-light rounded-2 text-dark fs-6" style={{ lineHeight: '1.6' }}>
          {item.message || "No message provided."}
        </div>
      </CCardBody>
    </CCard>
  );

  return (
    <div className="container-fluid px-4 py-4" style={{ maxWidth: '1000px' }}>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold mb-0">Candidates</h2>
        <CButton 
          color="light" 
          className="d-flex align-items-center gap-2 px-3 fw-medium text-dark shadow-none border-0" 
          style={{ background: '#f0f2f5' }}
          onClick={() => navigate(-1)}
        >
          <CIcon icon={cilArrowLeft} />
          Back to Project
        </CButton>
      </div>

      <h5 className="fw-bold mb-3 text-secondary">Applications ({applications.length})</h5>
      {applications.length > 0 ? applications.map((c) => <CandidateItem key={c.id} item={c} />) : <div className="text-muted mb-5">No applications yet.</div>}

      <h5 className="fw-bold mb-3 text-secondary">Invitations ({invitations.length})</h5>
      {invitations.length > 0 ? invitations.map((c) => <CandidateItem key={c.id} item={c} />) : <div className="text-muted mb-5">No invitations yet.</div>}
    </div>
  );
};

export default ClientApplicants;