import React, { useEffect, useState } from "react";
import { CButton, CCard, CCardBody, CSpinner, CBadge, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormInput } from "@coreui/react";
import { getTranslators, getTranslatorById, deleteTranslator } from "../../api/api";

const TranslatorsAdmin = () => {
  const [translators, setTranslators] = useState([]);
  const [pagination, setPagination] = useState({ totalPage: 1, totalData: 0, limit: 10 });
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const formatRate = (val) => (val ? `Rp ${Number(val).toLocaleString("id-ID")}` : "-");

  const loadTranslators = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTranslators({ page: currentPage, limit: pagination.limit, search });
      setTranslators(Array.isArray(res) ? res : res.data || []);
      setPagination(Array.isArray(res) ? pagination : res.pagination || pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load translators");
    }
    setLoading(false);
  };

  useEffect(() => { loadTranslators(); }, [currentPage, search]);

  const openDetail = async (id) => {
    setShowModal(true);
    setDetailLoading(true);
    try {
      const res = await getTranslatorById(id);
      setDetail(res);
    } catch (err) {
      setDetail(null);
    }
    setDetailLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this translator profile?")) return;
    setDeletingId(id);
    try {
      await deleteTranslator(id);
      loadTranslators();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete translator");
    }
    setDeletingId(null);
  };

  return (
    <div className="container-fluid px-4 py-4">
      <CCard className="border-0 shadow-sm rounded-4">
        <CCardBody className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-1">Translators</h4>
              <p className="text-muted small mb-0">Manage all registered translator profiles</p>
            </div>
          </div>

          <CFormInput
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
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
                    <th>Name</th>
                    <th>Email</th>
                    <th>Experience</th>
                    <th>Rate</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {translators.length === 0 ? (
                    <tr><td colSpan={5} className="text-center text-muted py-4">No translators found</td></tr>
                  ) : translators.map((t) => (
                    <tr key={t.id}>
                      <td className="fw-semibold">{t.user?.name || "-"}</td>
                      <td className="text-muted">{t.user?.email || "-"}</td>
                      <td>{t.experience ? `${t.experience} Years` : "-"}</td>
                      <td className="fw-semibold" style={{ color: "#0d9488" }}>{formatRate(t.ratePerProject)}</td>
                      <td className="text-end">
                        <CButton size="sm" color="light" className="border me-2" onClick={() => openDetail(t.id)}>View</CButton>
                        <CButton size="sm" color="danger" variant="outline" disabled={deletingId === t.id} onClick={() => handleDelete(t.id)}>
                          {deletingId === t.id ? <CSpinner size="sm" /> : "Delete"}
                        </CButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
            <span className="text-muted small">Page {currentPage} of {pagination.totalPage}</span>
            <div className="d-flex gap-2">
              <CButton size="sm" color="secondary" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Prev</CButton>
              <CButton size="sm" color="secondary" variant="outline" disabled={currentPage === pagination.totalPage} onClick={() => setCurrentPage((p) => p + 1)}>Next</CButton>
            </div>
          </div>
        </CCardBody>
      </CCard>

      <CModal visible={showModal} onClose={() => setShowModal(false)} alignment="center">
        <CModalHeader><CModalTitle>Translator Detail</CModalTitle></CModalHeader>
        <CModalBody>
          {detailLoading ? (
            <div className="text-center py-4"><CSpinner size="sm" /></div>
          ) : detail ? (
            <div className="d-flex flex-column gap-3">
              <div>
                <div className="text-muted small fw-semibold text-uppercase mb-1">Name</div>
                <div className="fw-semibold">{detail.user?.name || "-"}</div>
              </div>
              <div>
                <div className="text-muted small fw-semibold text-uppercase mb-1">Email</div>
                <div>{detail.user?.email || "-"}</div>
              </div>
              <div>
                <div className="text-muted small fw-semibold text-uppercase mb-1">Experience</div>
                <div>{detail.experience ? `${detail.experience} Years` : "-"}</div>
              </div>
              <div>
                <div className="text-muted small fw-semibold text-uppercase mb-1">Rate per Project</div>
                <div className="fw-semibold" style={{ color: "#0d9488" }}>{formatRate(detail.ratePerProject)}</div>
              </div>
              <div>
                <div className="text-muted small fw-semibold text-uppercase mb-1">Language Pairs</div>
                <div className="d-flex flex-wrap gap-2">
                  {detail.languagePairs?.length > 0 ? detail.languagePairs.map((lang, idx) => (
                    <CBadge key={idx} color="light" className="text-dark border px-3 py-2">
                      {typeof lang === "object" ? `${lang.sourceLanguage?.name} ➔ ${lang.targetLanguage?.name}` : lang}
                    </CBadge>
                  )) : <span className="text-muted small">-</span>}
                </div>
              </div>
              <div>
                <div className="text-muted small fw-semibold text-uppercase mb-1">Specializations</div>
                <div className="d-flex flex-wrap gap-2">
                  {detail.specializations?.length > 0 ? detail.specializations.map((spec, idx) => (
                    <CBadge key={idx} color="info">{typeof spec === "object" ? (spec.name || spec.title) : spec}</CBadge>
                  )) : <span className="text-muted small">-</span>}
                </div>
              </div>
              {detail.cvURL && (
                <div>
                  <a href={detail.cvURL} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-light border">View CV</a>
                </div>
              )}
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

export default TranslatorsAdmin;