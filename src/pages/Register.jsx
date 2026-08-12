import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilBriefcase } from '@coreui/icons'
import { register } from '../api/api';
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    roleIds: [],
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  
  const navigate = useNavigate();

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess("");

    if (form.password !== form.confirm_password) {
      setError("Password don't match!");
      return;
    }

    setLoading(true);

    try {
      const result = await register(form);
      if (result) {
        setSuccess("Register berhasil! Mengalihkan ke halaman login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError("Register gagal!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4 shadow-sm border-0 rounded-4">
              <CCardBody className="p-4">
                <CForm onSubmit={onSubmit}>
                  <h1 className="fw-bold text-dark">Register</h1>
                  <p className="text-body-secondary mb-4">Create your account</p>

                  {error && <div className="alert alert-danger py-2">{error}</div>}
                  {success && <div className="alert alert-success py-2">{success}</div>}

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput 
                      name="name"
                      type="text"
                      placeholder="Name"
                      autoComplete="username"
                      onChange={onChange}
                      value={form.name}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput 
                      name="email"
                      type="email"
                      placeholder="Email"
                      autoComplete="email"
                      onChange={onChange}
                      value={form.email}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name="password"
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      onChange={onChange}
                      value={form.password}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name="confirm_password"
                      type="password"
                      placeholder="Confirmation Password"
                      autoComplete="new-password"
                      onChange={onChange}
                      value={form.confirm_password}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilBriefcase} />
                    </CInputGroupText>
                    <CFormSelect
                      name="role"
                      onChange={(e) => setForm({...form, roleIds: [Number(e.target.value)]})}
                      value={form.role}
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="2">Client</option>
                      <option value="3">Translator</option>
                    </CFormSelect>
                  </CInputGroup>

                  <div className="d-grid mb-3">
                    <CButton type="submit" color="success" disabled={loading}>
                      {loading ? "Loading...." : "Register"}
                    </CButton>
                  </div>

                  <p className="text-center text-muted mb-0">
                    Already have an account? <Link to="/login" className="text-decoration-none fw-semibold">Login</Link>
                  </p>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register;