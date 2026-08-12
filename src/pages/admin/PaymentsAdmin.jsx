import React, { useState, useEffect } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CSpinner,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CPagination,
  CPaginationItem,
} from "@coreui/react";
import { getPayments, getPaymentById, approvePayment } from "../../api/api";

const PaymentsAdmin = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ totalData: 0, totalPage: 1, limit: 10 });

  const [showModal, setShowModal] = useState(false);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  const formatCurrency = (val) =>
    val ? `Rp ${Number(val).toLocaleString("id-ID")}` : "-";

  const loadPayments = async (page = 1, keyword = "") => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPayments({ page, limit: pagination.limit, search: keyword });
      
      setPayments(res.data || (Array.isArray(res) ? res : []));
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load payments!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments(currentPage, search);
  }, [currentPage, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const openDetail = async (id) => {
    setShowModal(true);
    setDetailLoading(true);
    try {
      const res = await getPaymentById(id);
      setDetail(res.data || res);
    } catch (error) {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Verify and approve this payment?")) return;
    setApprovingId(id);
    try {
      await approvePayment(id);
      await loadPayments(currentPage, search);
      if (showModal && detail?.id === id) {
        setShowModal(false);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to verify payment!");
    } finally {
      setApprovingId(null);
    }
  };

  const statusColor = (status) => {
    if (status === "VERIFIED" || status === "SUCCESS" || status === "PAID") return "success";
    if (status === "REJECTED" || status === "FAILED") return "danger";
    if (status === "PENDING" || status === "WAITING_VERIFICATION") return "warning";
    return "secondary";
  };

  return (
    <div className="container-fluid px-4 py-4">
      <CCard className="border-0 shadow-sm rounded-4">
        <CCardBody className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-1">Payments</h4>
              <p className="text-muted small mb-0">Monitor and verify all payment transactions</p>
            </div>
          </div>

          <CFormInput
            placeholder="Search payments..."
            value={search}
            onChange={handleSearch}
            className="mb-4 rounded-3"
            style={{ maxWidth: "320px" }}
          />

          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr className="text-muted small text-uppercase">
                      <th>Project</th>
                      <th>Verified By</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-muted py-4">
                          No payments found
                        </td>
                      </tr>
                    ) : (
                      payments.map((p) => (
                        <tr key={p.id}>
                          <td className="fw-semibold">
                            {p.project?.title || `Project #${p.projectId || "-"}`}
                          </td>
                          <td className="text-muted">
                            {p.verifier?.name || "-"}
                          </td>
                          <td className="fw-semibold" style={{ color: "#0d9488" }}>
                            {formatCurrency(p.amount)}
                          </td>
                          <td>
                            <CBadge color={statusColor(p.status)} className="px-3 py-2">
                              {p.status}
                            </CBadge>
                          </td>
                          <td className="text-end">
                            <CButton
                              size="sm"
                              color="light"
                              className="border me-2"
                              onClick={() => openDetail(p.id)}
                            >
                              View
                            </CButton>
                            {(p.status === "PENDING" || p.status === "WAITING_VERIFICATION") && (
                              <CButton
                                size="sm"
                                color="success"
                                className="text-white"
                                disabled={approvingId === p.id}
                                onClick={() => handleApprove(p.id)}
                              >
                                {approvingId === p.id ? <CSpinner size="sm" /> : "Approve"}
                              </CButton>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {pagination.totalPage > 1 && (
                <div className="d-flex justify-content-end mt-3">
                  <CPagination>
                    <CPaginationItem
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    >
                      Previous
                    </CPaginationItem>
                    {Array.from({ length: pagination.totalPage }, (_, i) => i + 1).map((page) => (
                      <CPaginationItem
                        key={page}
                        active={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </CPaginationItem>
                    ))}
                    <CPaginationItem
                      disabled={currentPage === pagination.totalPage}
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPage))}
                    >
                      Next
                    </CPaginationItem>
                  </CPagination>
                </div>
              )}
            </>
          )}
        </CCardBody>
      </CCard>

      <CModal visible={showModal} onClose={() => setShowModal(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>Payment Detail</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {detailLoading ? (
            <div className="text-center py-4">
              <CSpinner size="sm" />
            </div>
          ) : detail ? (
            <div className="d-flex flex-column gap-3">
              <div>
                <div className="text-muted small fw-semibold text-uppercase mb-1">Payment ID</div>
                <div className="fw-semibold">#{detail.id}</div>
              </div>
              <div>
                <div className="text-muted small fw-semibold text-uppercase mb-1">Project</div>
                <div className="fw-semibold">
                  {detail.project?.title || `Project #${detail.projectId || "-"}`}
                </div>
              </div>
              <div>
                <div className="text-muted small fw-semibold text-uppercase mb-1">Verified By</div>
                <div>{detail.verifier?.name || "-"}</div>
              </div>
              <div>
                <div className="text-muted small fw-semibold text-uppercase mb-1">Amount</div>
                <div className="fw-semibold" style={{ color: "#0d9488" }}>
                  {formatCurrency(detail.amount)}
                </div>
              </div>
              <div>
                <div className="text-muted small fw-semibold text-uppercase mb-1">Status</div>
                <CBadge color={statusColor(detail.status)} className="px-3 py-2">
                  {detail.status}
                </CBadge>
              </div>
              {detail.proofURL && (
                <div>
                  <div className="text-muted small fw-semibold text-uppercase mb-1">Payment Proof</div>
                  <a
                    href={detail.proofURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary mt-1"
                  >
                    View Proof Document / Image
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted py-4">Failed to load detail</div>
          )}
        </CModalBody>
        <CModalFooter>
          {detail && (detail.status === "PENDING" || detail.status === "WAITING_VERIFICATION") && (
            <CButton
              color="success"
              className="text-white"
              disabled={approvingId === detail.id}
              onClick={() => handleApprove(detail.id)}
            >
              {approvingId === detail.id ? <CSpinner size="sm" /> : "Approve Payment"}
            </CButton>
          )}
          <CButton color="secondary" variant="ghost" onClick={() => setShowModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default PaymentsAdmin;