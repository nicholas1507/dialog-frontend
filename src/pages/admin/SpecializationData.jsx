import React, { useState, useEffect } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormTextarea,
  CPagination,
  CPaginationItem,
} from "@coreui/react";
import {
  getSpecializations,
  createSpecialization,
  updateSpecialization,
  deleteSpecialization,
} from "../../api/api";

const SpecializationData = () => {
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ totalData: 0, totalPage: 1, limit: 10 });

  // Modal State
  const [visible, setVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const loadSpecializations = async (page = 1, keyword = "") => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSpecializations({ page, limit: pagination.limit, search: keyword });
      setSpecializations(res.data || (Array.isArray(res) ? res : []));
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load specializations!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpecializations(currentPage, search);
  }, [currentPage, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleOpenAdd = () => {
    setSelectedData(null);
    setFormData({ name: "", description: "" });
    setFormError(null);
    setVisible(true);
  };

  const handleEdit = (item) => {
    setSelectedData(item);
    setFormData({ name: item.name || "", description: item.description || "" });
    setFormError(null);
    setVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this specialization?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteSpecialization(id);
      await loadSpecializations(currentPage, search);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete specialization!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Specialization name is required!");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      if (selectedData?.id) {
        await updateSpecialization(selectedData.id, formData);
      } else {
        await createSpecialization(formData);
      }
      setVisible(false);
      await loadSpecializations(currentPage, search);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save specialization!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid px-4 py-4">
      <CCard className="border-0 shadow-sm rounded-4">
        <CCardBody className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-1">Specializations</h4>
              <p className="text-muted small mb-0">Manage specialization categories for translators</p>
            </div>
            <CButton color="primary" onClick={handleOpenAdd}>
              + Add Specialization
            </CButton>
          </div>

          <CFormInput
            placeholder="Search specialization..."
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
                      <th>Name</th>
                      <th>Description</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specializations.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center text-muted py-4">
                          No specializations found
                        </td>
                      </tr>
                    ) : (
                      specializations.map((item) => (
                        <tr key={item.id}>
                          <td className="fw-semibold">{item.name}</td>
                          <td className="text-muted">{item.description || "-"}</td>
                          <td className="text-end">
                            <CButton
                              size="sm"
                              color="light"
                              className="border me-2"
                              onClick={() => handleEdit(item)}
                            >
                              Edit
                            </CButton>
                            <CButton
                              size="sm"
                              color="danger"
                              className="text-white"
                              onClick={() => handleDelete(item.id)}
                            >
                              Delete
                            </CButton>
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

      {/* Modal Add / Edit */}
      <CModal visible={visible} onClose={() => setVisible(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>{selectedData ? "Edit Specialization" : "Add Specialization"}</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit}>
          <CModalBody className="d-flex flex-column gap-3">
            {formError && <div className="alert alert-danger mb-0">{formError}</div>}

            <div>
              <label className="form-label fw-semibold small text-uppercase">Specialization Name</label>
              <CFormInput
                placeholder="e.g. Legal"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="form-label fw-semibold small text-uppercase">Description</label>
              <CFormTextarea
                rows={3}
                placeholder="Brief description of the specialization..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" variant="ghost" onClick={() => setVisible(false)} disabled={submitting}>
              Cancel
            </CButton>
            <CButton color="primary" type="submit" disabled={submitting}>
              {submitting ? <CSpinner size="sm" /> : "Save"}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </div>
  );
};

export default SpecializationData;