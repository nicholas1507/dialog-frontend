import React, { useEffect, useState } from "react";
import { CButton, CCard, CCardBody, CSpinner, CBadge, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormInput } from "@coreui/react";
import { getProjects, getProjectById } from "../../api/api";

const ProjectsAdmin = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const formatBudget = (val) => (val ? `Rp ${Number(val).toLocaleString("id-ID")}` : "-");

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProjects();
      setProjects(Array.isArray(res) ? res : res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects");
    }
    setLoading(false);
  };

  useEffect(() => { loadProjects(); }, []);

  const filtered = projects.filter((p) => p.title?.toLowerCase().includes(search.toLowerCase()));

  const openDetail = async (id) => {
    setShowModal(true);
    setDetailLoading(true);
    try {
      const res = await getProjectById(id);
      setDetail(res);
    } catch (err) {
      setDetail(null);
    }
    setDetailLoading(false);
  };

  const statusColor = (status) => {
    if (status === "COMPLETED") return "success";
    if (status === "CANCELLED") return "danger";
    if (status === "WAITING_PAYMENT" || status === "WAITING_REVIEW") return "warning";
    if (status === "IN_PROGRESS" || status === "ASSIGNED") return "info";
    return "secondary";
  };

  return (
    <div className="container-fluid px-4 py-4">
      <CCard className="border-0 shadow-sm rounded-4">
        <CCardBody className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-1">Projects</h4>
              <p className="text-muted small mb-0">Monitor and manage all projects</p>
            </div>
          </div>

          <CFormInput
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 rounded-3"
            style={{ maxWidth: "320px" }}
          />

          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="text-center py-5"><CSpinner color="primary" /></div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr className="text-muted small text-uppercase">
                    <th>Title</th>
                    <th>Client</th>
                    <th>Budget</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="text-center text-muted py-4">No projects found</td></tr>
                  ) : filtered.map((p) => (
                    <tr key={p.id}>
                      <td className="fw-semibold">{p.title}</td>
                      <td className="text-muted">{p.client?.name || p.client?.user?.name || "-"}</td>
                      <td className="fw-semibold" style={{ color: "#0d9488" }}>{formatBudget(p.budget)}</td>
                      <td><CBadge color={statusColor(p.status)} className="px-3 py-2">{p.status}</CBadge></td>
                      <td className="text-end">
                        <CButton size="sm" color="light" className="border" onClick={() => openDetail(p.id)}>View</CButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CCardBody>
      </CCard>

      <CModal visible={showModal} onClose={() => setShowModal(false)} alignment="center">
        <CModalHeader><CModalTitle>Project Detail</CModalTitle></CModalHeader>
        <CModalBody>
          {detailLoading ? (
            <div className="text-center py-4"><CSpinner size="sm" /></div>
          ) : detail ? (
            <div className="d-flex flex-column gap-3">
              <div>
                <div className="text-muted small fw-semibold text-uppercase mb-1">Title</div>
                <div className="fw-semibold">{detail.title}</div>
              </div>
              <div>
                <div className="text-muted small fw-semibold text-uppercase mb-1">Description</div>
                <div className="p-3 bg-light rounded-3 text-secondary small">{detail.description || "-"}</div>
              </div>
              <div>
                <div className="text-muted small fw-semibold text-uppercase mb-1">Client</div>
                <div>{detail.client?.name || detail.client?.user?.name || "-"}</div>
              </div>
              <div>
                <div className="text-muted small fw-semibold text-uppercase mb-1">Translator</div>
                <div>{detail.translator?.user?.name || "Not assigned yet"}</div>
              </div>
              <div>
                <div className="text-muted small fw-semibold text-uppercase mb-1">Budget</div>
                <div className="fw-semibold" style={{ color: "#0d9488" }}>{formatBudget(detail.budget)}</div>
              </div>
              <div>
                <div className="text-muted small fw-semibold text-uppercase mb-1">Word Count</div>
                <div>{detail.wordCount || "-"} words</div>
              </div>
              <div>
                <div className="text-muted small fw-semibold text-uppercase mb-1">Status</div>
                <CBadge color={statusColor(detail.status)} className="px-3 py-2">{detail.status}</CBadge>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted py-4">Failed to load detail</div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => setShowModal(false)}>Close</CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ProjectsAdmin;