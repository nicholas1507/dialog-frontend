import React, { useEffect, useState } from "react";
import { CButton, CCard, CCardBody, CSpinner, CBadge, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormInput, CFormSelect } from "@coreui/react";
import { getAllUser, createUser, updateUser, deletUser, getAllRoles } from "../../api/api";

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [pagination, setPagination] = useState({ totalPage: 1, totalData: 0, limit: 10 });
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", roleId: "" });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllUser({ page: currentPage, limit: pagination.limit, search });
      setUsers(Array.isArray(res) ? res : res.data || []);
      setPagination(Array.isArray(res) ? pagination : res.pagination || pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    }
    setLoading(false);
  };

  const loadRoles = async () => {
    try {
      const res = await getAllRoles();
      setRoles(Array.isArray(res) ? res : res.data || []);
    } catch (err) {}
  };

  useEffect(() => { loadUsers(); }, [currentPage, search]);
  useEffect(() => { loadRoles(); }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", password: "", roleId: "" });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({ name: user.name || "", email: user.email || "", password: "", roleId: user.roles?.[0]?.id || "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, { name: form.name, email: form.email, roleId: form.roleId });
      } else {
        await createUser({ name: form.name, email: form.email, password: form.password, roleId: form.roleId });
      }
      setShowModal(false);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save user");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    setDeletingId(id);
    try {
      await deletUser(id);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
    setDeletingId(null);
  };

  return (
    <div className="container-fluid px-4 py-4">
      <CCard className="border-0 shadow-sm rounded-4">
        <CCardBody className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-1">Users</h4>
              <p className="text-muted small mb-0">Manage all registered accounts</p>
            </div>
            <CButton color="primary" className="fw-semibold rounded-3" onClick={openCreateModal}>+ Add User</CButton>
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
                    <th>Role</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={4} className="text-center text-muted py-4">No users found</td></tr>
                  ) : users.map((u) => (
                    <tr key={u.id}>
                      <td className="fw-semibold">{u.name}</td>
                      <td className="text-muted">{u.email}</td>
                      <td>{(u.roles || []).map((r) => <CBadge key={r.id || r} color="info" className="me-1">{r.name || r}</CBadge>)}</td>
                      <td className="text-end">
                        <CButton size="sm" color="light" className="border me-2" onClick={() => openEditModal(u)}>Edit</CButton>
                        <CButton size="sm" color="danger" variant="outline" disabled={deletingId === u.id} onClick={() => handleDelete(u.id)}>
                          {deletingId === u.id ? <CSpinner size="sm" /> : "Delete"}
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
        <CModalHeader><CModalTitle>{editingUser ? "Edit User" : "Add User"}</CModalTitle></CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label fw-semibold small">Name</label>
            <CFormInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold small">Email</label>
            <CFormInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          {!editingUser && (
            <div className="mb-3">
              <label className="form-label fw-semibold small">Password</label>
              <CFormInput type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          )}
          <div className="mb-3">
            <label className="form-label fw-semibold small">Role</label>
            <CFormSelect value={form.roleId} onChange={(e) => setForm({ ...form, roleId: e.target.value })}>
              <option value="">Select role</option>
              {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </CFormSelect>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => setShowModal(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleSave} disabled={saving}>{saving ? <CSpinner size="sm" /> : "Save"}</CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default UsersAdmin;