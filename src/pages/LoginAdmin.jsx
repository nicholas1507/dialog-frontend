import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilShieldAlt } from '@coreui/icons'
import { useAuth } from "../contexts/AuthContext";

const LoginAdmin = () => {
  const [form, setForm] = useState({
      email: "",
      password: "",
  });
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function onChange(e){
      setForm({...form, [e.target.name]: e.target.value});
  }

  async function onSubmit(e){
      e.preventDefault();
      setError(null);
      setLoading(true);
      const result = await login(form);
      setLoading(false);
      if(result.success){
        const role = result.user.roles[0];
          if(role === "Admin"){
            navigate("/dashboard")
          }else{
            setError("You are not authorized to access the admin panel.");
          }
      }else{
          setError(result.message || "Login Failed");
      }
  }

  return (
    <div
      className="min-vh-100 d-flex flex-row align-items-center"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #312e81 100%)" }}
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCard className="border-0 shadow-lg rounded-4 overflow-hidden">
              <div
                className="p-4 text-center text-white"
                style={{ background: "linear-gradient(135deg, #1e293b 0%, #4338ca 100%)" }}
              >
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{ width: "60px", height: "60px", background: "rgba(255,255,255,0.12)" }}
                >
                  <CIcon icon={cilShieldAlt} size="xl" />
                </div>
                <h3 className="fw-bold mb-1">Admin Panel</h3>
                <p className="mb-0 opacity-75 small">Sign in with your administrator credentials</p>
              </div>

              <CCardBody className="p-4 p-lg-5">
                <CForm onSubmit={onSubmit}>
                  {error && <div className="alert alert-danger rounded-3">{error}</div>}

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      name="email"
                      type="email"
                      placeholder="Admin email"
                      autoComplete="username"
                      onChange={onChange}
                      value={form.email}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name="password"
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      onChange={onChange}
                      value={form.password}
                      required
                    />
                  </CInputGroup>

                  <CButton
                    type="submit"
                    color="primary"
                    className="w-100 fw-semibold rounded-3 py-2"
                    style={{ background: "#4338ca", border: "none" }}
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </CButton>

                  <p className="text-center text-muted small mt-4 mb-0">
                    Restricted access — administrators only.
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

export default LoginAdmin