import React, {useEffect, useState} from "react";
import { useNavigate,useParams } from "react-router-dom";
import {getTranslators} from '../../api/api';
import {
    CCard,
    CCardBody,
    CButton,
    CSpinner,
    CForm,
    CFormInput,
    CFormLabel,
    CAlert
} from "@coreui/react";

const ListTranslators = () => {
    const [translators,setTranslators] = useState([]);
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(false);
    const [pagination,setPagination] = useState({totalData: 0,limit: 10,totalPage: 0});
    const [currentPage,setCurrentPage] = useState(1);
    const [search,setSearch] = useState("");
    const [hoveredCardId, setHoveredCardId] = useState(null);
    const {id} = useParams();
    const navigate = useNavigate();

    const loadTranslators = async(page = 1, keyword = "") => {
        setLoading(true);
        setError(null);
        try{
            const data = await getTranslators({page,limit: pagination.limit, search: keyword});
            setTranslators(Array.isArray(data) ? data : data.data);
            setPagination(Array.isArray(data) ? data : data.pagination);
        }catch(error){
            setError(error.response?.data?.message || "Failed to load translators!");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        loadTranslators(currentPage,search)
    },[currentPage,search]);
    const startItems = (currentPage - 1) * pagination.limit + 1;
    const endItems = Math.min((currentPage * pagination.limit),pagination.totalData)

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            <div className="row g-4">
                
                <div className="col-12 col-md-3">
                    <CCard className="border-0 shadow-sm rounded-4">
                        <CCardBody className="p-4">
                            <h5 className="fw-bold mb-1 text-dark">Filter Interpreters</h5>
                            <p className="text-muted small mb-4">Pick your languages and filters to find the best interpreter.</p>
                            
                            <CForm className="d-flex flex-column gap-3">
                                <div>
                                    <CFormLabel className="small fw-semibold text-secondary mb-1">Search Name</CFormLabel>
                                    <CFormInput 
                                        type="text" 
                                        placeholder="Search translators..." 
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="rounded-3"
                                    />
                                </div>
                                <CButton color="link" size="sm" className="text-muted text-decoration-none p-0 align-self-start" onClick={() => setSearch("")}>
                                    ✕ Clear filters
                                </CButton>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </div>

                <div className="col-12 col-md-9">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted small">
                            Showing {pagination.totalData > 0 ? startItems : 0}-{endItems} of {pagination.totalData} interpreters
                        </span>
                    </div>

                    {error && (
                        <CAlert color="danger" className="mb-3 rounded-3">
                            {error}
                        </CAlert>
                    )}

                    {loading ? (
                        <div className="text-center py-5">
                            <CSpinner color="primary" />
                            <div className="mt-2 text-muted small">Loading interpreters...</div>
                        </div>
                    ) : (
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                            {translators?.map((item) => {
                                const isHovered = hoveredCardId === item.id;
                                return (
                                    <div className="col" key={item.id}>
                                        <CCard 
                                            onMouseEnter={() => setHoveredCardId(item.id)}
                                            onMouseLeave={() => setHoveredCardId(null)}
                                            onClick={() => navigate(`/translators/${item.id}`)}
                                            className="h-100 rounded-4 transition-all"
                                            style={{
                                                transition: "all 0.2s ease-in-out",
                                                border: isHovered ? "2px solid #2563eb" : "1px solid #e5e7eb",
                                                boxShadow: isHovered ? "0 10px 25px -5px rgba(37, 99, 235, 0.15)" : "0 1px 3px rgba(0,0,0,0.05)",
                                                cursor: "pointer"
                                            }}
                                        >
                                            <CCardBody className="d-flex flex-column justify-content-between p-4">
                                                <div>
                                                    <div className="d-flex align-items-start gap-3 mb-3">
                                                        <img
                                                            src={item.user?.profile?.imageURL || "https://dummyimage.com/150x150"}
                                                            alt={item.user?.name}
                                                            className="rounded-circle"
                                                            style={{ width: "64px", height: "64px", objectFit: "cover" }}
                                                        />
                                                        <div>
                                                            <h6 
                                                                className="fw-bold mb-1"
                                                                style={{ color: isHovered ? "#2563eb" : "#1e293b", transition: "color 0.2s" }}
                                                            >
                                                                {item.user?.name} <span style={{ color: "#2563eb" }}>✓</span>
                                                            </h6>
                                                            <p className="text-muted small mb-0">
                                                                {item.experience} years experience
                                                            </p>
                                                            {item.user?.profile?.country && (
                                                                <small className="text-muted d-block mt-1" style={{ fontSize: "11px" }}>
                                                                    {item.user?.profile?.city ? `${item.user.profile.city}, ` : ''}{item.user.profile.country}
                                                                </small>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="d-flex flex-wrap gap-1 mb-3">
                                                        {item.specializations?.map((spec) => (
                                                            <span 
                                                                key={spec.id} 
                                                                className="badge rounded-pill fw-medium"
                                                                style={{ 
                                                                    backgroundColor: "#eff6ff", 
                                                                    color: "#1d4ed8", 
                                                                    border: "1px solid #dbeafe",
                                                                    fontSize: "10px"
                                                                }}
                                                            >
                                                                ✓ {spec.name}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <div className="mb-3">
                                                        {item.languagePairs?.map((pair) => (
                                                            <span 
                                                                key={pair.id} 
                                                                className="badge rounded-3 fw-semibold me-1 mb-1"
                                                                style={{ 
                                                                    backgroundColor: "#f1f5f9", 
                                                                    color: "#334155",
                                                                    fontSize: "11px"
                                                                }}
                                                            >
                                                                {pair.sourceLanguage?.name} ⇄ {pair.targetLanguage?.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <strong className="fs-5 text-dark">
                                                            Rp {Number(item.ratePerProject).toLocaleString('id-ID')}
                                                        </strong>
                                                        <small className="text-muted"> /project</small>
                                                    </div>
                                                    <CButton 
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                        className="rounded-3 border-0 px-3 py-1.5 fw-semibold"
                                                        style={{
                                                            backgroundColor: isHovered ? "#2563eb" : "#f8fafc",
                                                            color: isHovered ? "#ffffff" : "#475569",
                                                            border: isHovered ? "none" : "1px solid #e2e8f0"
                                                        }}
                                                    >
                                                        Hire
                                                    </CButton>
                                                </div>
                                            </CCardBody>
                                        </CCard>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {pagination.totalPage > 1 && (
                        <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
                            <CButton 
                                color="secondary" 
                                variant="outline" 
                                size="sm" 
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                            >
                                Previous
                            </CButton>
                            <span className="small text-muted">
                                Page {currentPage} of {pagination.totalPage}
                            </span>
                            <CButton 
                                color="secondary" 
                                variant="outline" 
                                size="sm" 
                                disabled={currentPage === pagination.totalPage}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                            >
                                Next
                            </CButton>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default ListTranslators;