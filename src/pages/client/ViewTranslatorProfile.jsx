// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { getUserById, getProfileById, getTranslatorById, getMyUser, getMyProfile, getMyTranslator } from "../../api/api";
// import { CCard, CCardBody, CButton, CAlert, CSpinner, CBadge } from "@coreui/react";
// import CIcon from "@coreui/icons-react";
// import { cilArrowLeft } from "@coreui/icons";

// const ViewTranslatorProfile = () => {
//     const { id: translatorUserId } = useParams();
//     const navigate = useNavigate();

//     const [user, setUser] = useState(null);
//     const [profile, setProfile] = useState(null);
//     const [translatorData, setTranslatorData] = useState(null);
//     const [fetching, setFetching] = useState(true);
//     const [error, setError] = useState(null);

//     const loadData = async () => {
//         setFetching(true);
//         setError(null);
//         try {
//             let userData, profileData, translatorRes;

//             if (translatorUserId) {
//                 const res = await getUserById(translatorUserId);
//                 userData = res.data || res;
//                 const pRes = await getProfileById(translatorUserId).catch(() => null);
//                 profileData = pRes?.data || pRes;
//                 const tRes = await getTranslatorById(translatorUserId).catch(() => null);
//                 translatorRes = tRes?.data || tRes;
//             } else {
//                 const [uData, pData, tRes] = await Promise.all([
//                     getMyUser().catch(() => null),
//                     getMyProfile().catch(() => null),
//                     getMyTranslator().catch((err) => {
//                         if (err.response?.status === 404) return null;
//                         throw err;
//                     }),
//                 ]);
//                 userData = uData;
//                 profileData = pData;
//                 translatorRes = tRes;
//             }

//             setUser(userData);
//             setProfile(profileData);
//             setTranslatorData(translatorRes);
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to load profile details.");
//         } finally {
//             setFetching(false);
//         }
//     };

//     useEffect(() => {
//         loadData();
//     }, [translatorUserId]);

//     const formatRate = (val) => (val ? `Rp ${Number(val).toLocaleString("id-ID")}` : "-");
//     const getCvUrl = () => translatorData?.cvUrl || translatorData?.cv || translatorData?.cvURL || null;

//     if (fetching) {
//         return <div className="d-flex justify-content-center align-items-center py-5"><CSpinner color="primary" /></div>;
//     }

//     return (
//         <div className="container-fluid p-0">
//             {translatorUserId && (
//                 <div className="mb-4">
//                     <CButton color="light" className="d-flex align-items-center gap-2 px-3 fw-medium text-dark shadow-none border-0" style={{ background: '#f0f2f5' }} onClick={() => navigate(-1)}>
//                         <CIcon icon={cilArrowLeft} /> Back
//                     </CButton>
//                 </div>
//             )}

//             {error && <CAlert color="danger" className="rounded-4 mb-4 border-0 shadow-sm">{error}</CAlert>}

//             <div className="row g-4">
//                 <div className="col-lg-4">
//                     <CCard className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
//                         <div style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)", height: "100px" }} />
//                         <CCardBody className="pt-0 px-4 pb-4 d-flex flex-column align-items-center text-center">
//                             <div className="position-relative" style={{ marginTop: "-50px" }}>
//                                 <img src={profile?.imageURL || profile?.image || "https://dummyimage.com/150x150/e0e0e0/ffffff&text=Translator"} alt="Profile" className="rounded-circle border border-4 border-white shadow-sm" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
//                             </div>

//                             <h5 className="fw-bold text-dark mt-3 mb-0">{user?.name || "Translator"}</h5>
//                             <p className="text-muted fs-7 mb-2">{user?.email || "-"}</p>

//                             <CBadge color={translatorData ? (translatorData.isAvailable ? "success" : "secondary") : "light"} className="px-3 py-1 rounded-pill fw-medium mb-3 text-dark fs-7">
//                                 {translatorData ? (translatorData.isAvailable ? "Available for Hire" : "Currently Unavailable") : "No Translator Profile"}
//                             </CBadge>

//                             {!translatorUserId && (
//                                 <CButton color="light" size="sm" className="rounded-3 border w-100 fw-semibold text-dark mb-3" onClick={() => navigate("/my-profile/setup")}>
//                                     {profile ? "Edit Basic Profile" : "Setup Basic Profile"}
//                                 </CButton>
//                             )}

//                             <div className="w-100 border-top pt-3 d-flex flex-column gap-2 text-start fs-7">
//                                 <div className="d-flex justify-content-between py-1 border-bottom border-light">
//                                     <span className="text-muted">Phone</span>
//                                     <span className="fw-semibold text-dark">{profile?.phone || "-"}</span>
//                                 </div>
//                                 <div className="d-flex justify-content-between py-1 border-bottom border-light">
//                                     <span className="text-muted">City</span>
//                                     <span className="fw-semibold text-dark">{profile?.city || "-"}</span>
//                                 </div>
//                                 <div className="d-flex justify-content-between py-1 border-bottom border-light">
//                                     <span className="text-muted">Country</span>
//                                     <span className="fw-semibold text-dark">{profile?.country || "-"}</span>
//                                 </div>
//                                 {translatorData && (
//                                     <>
//                                         <div className="d-flex justify-content-between py-1 border-bottom border-light">
//                                             <span className="text-muted">Experience</span>
//                                             <span className="fw-semibold text-dark">{translatorData.experience ? `${translatorData.experience} Years` : "-"}</span>
//                                         </div>
//                                         <div className="d-flex justify-content-between py-1">
//                                             <span className="text-muted">Rate per Project</span>
//                                             <span className="fw-bold" style={{ color: "#0d9488" }}>{formatRate(translatorData.ratePerProject)}</span>
//                                         </div>
//                                     </>
//                                 )}
//                             </div>
//                         </CCardBody>
//                     </CCard>
//                 </div>

//                 <div className="col-lg-8">
//                     {!translatorData ? (
//                         <CCard className="border-0 shadow-sm rounded-4 bg-white text-center p-5">
//                             <CCardBody className="d-flex flex-column align-items-center justify-content-center py-4">
//                                 <h5 className="fw-bold text-dark mb-2">No Translator Profile Found</h5>
//                                 <p className="text-muted fs-7 mb-3" style={{ maxWidth: "400px" }}>
//                                     {translatorUserId ? "This user has not set up a translator profile yet." : "Set up your translator attributes like languages and specializations to start accepting jobs."}
//                                 </p>
//                                 {!translatorUserId && (
//                                     <CButton size="sm" className="rounded-3 px-3 py-2 fw-semibold text-white shadow-sm" style={{ background: "#0d9488", border: "none" }} onClick={() => navigate("/translator-profile/create")}>
//                                         Create Translator Profile
//                                     </CButton>
//                                 )}
//                             </CCardBody>
//                         </CCard>
//                     ) : (
//                         <div className="d-flex flex-column gap-4">
//                             <div className="row g-3">
//                                 <div className="col-sm-4">
//                                     <div className="p-3 bg-white rounded-4 shadow-sm border-0">
//                                         <div className="text-muted fs-7 fw-semibold text-uppercase mb-1">Experience</div>
//                                         <div className="fs-5 fw-bold text-dark">{translatorData.experience ? `${translatorData.experience} Yrs` : "-"}</div>
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-4">
//                                     <div className="p-3 bg-white rounded-4 shadow-sm border-0">
//                                         <div className="text-muted fs-7 fw-semibold text-uppercase mb-1">Rate Per Project</div>
//                                         <div className="fs-5 fw-bold" style={{ color: "#0d9488" }}>{formatRate(translatorData.ratePerProject)}</div>
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-4">
//                                     <div className="p-3 bg-white rounded-4 shadow-sm border-0">
//                                         <div className="text-muted fs-7 fw-semibold text-uppercase mb-1">Language Pairs</div>
//                                         <div className="fs-5 fw-bold text-dark">{translatorData.languagePairs?.length || 0} Pairs</div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <CCard className="border-0 shadow-sm rounded-4 bg-white">
//                                 <CCardBody className="p-4">
//                                     <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
//                                         <div>
//                                             <h5 className="fw-bold text-dark mb-1">Professional Info</h5>
//                                             <p className="text-muted fs-7 mb-0">Translator skills, services, and biography</p>
//                                         </div>
//                                         {!translatorUserId && (
//                                             <CButton size="sm" className="rounded-3 px-3 fw-semibold text-white shadow-sm" style={{ background: "#0d9488", border: "none" }} onClick={() => navigate("/my-profile/setup-translator")}>
//                                                 Edit Translator Info
//                                             </CButton>
//                                         )}
//                                     </div>

//                                     <div className="d-flex flex-column gap-4">
//                                         <div>
//                                             <div className="text-muted fw-bold text-uppercase mb-2" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>Language Pairs</div>
//                                             <div className="d-flex flex-wrap gap-2">
//                                                 {translatorData.languagePairs?.length > 0 ? (
//                                                     translatorData.languagePairs.map((lang, idx) => (
//                                                         <span key={idx} className="badge bg-light text-dark border px-3 py-2 rounded-3 fs-7 fw-normal">
//                                                             {typeof lang === "object" ? `${lang.sourceLanguage.name} ➔ ${lang.targetLanguage.name}` : lang}
//                                                         </span>
//                                                     ))
//                                                 ) : <span className="text-muted fs-7">-</span>}
//                                             </div>
//                                         </div>

//                                         <div>
//                                             <div className="text-muted fw-bold text-uppercase mb-2" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>Specializations</div>
//                                             <div className="d-flex flex-wrap gap-2">
//                                                 {translatorData.specializations?.length > 0 ? (
//                                                     translatorData.specializations.map((spec, idx) => (
//                                                         <span key={idx} className="badge px-3 py-2 rounded-3 fs-7 fw-normal border" style={{ backgroundColor: "#f0fdf4", color: "#0f766e", borderColor: "#ccfbf1" }}>
//                                                             {typeof spec === "object" ? (spec.name || spec.title || JSON.stringify(spec)) : spec}
//                                                         </span>
//                                                     ))
//                                                 ) : <span className="text-muted fs-7">-</span>}
//                                             </div>
//                                         </div>

//                                         <div>
//                                             <div className="text-muted fw-bold text-uppercase mb-2" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>Curriculum Vitae (CV)</div>
//                                             {getCvUrl() ? (
//                                                 <a href={getCvUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-sm rounded-3 d-inline-flex align-items-center gap-2 px-3 py-2 fw-semibold text-decoration-none shadow-sm" style={{ backgroundColor: "#f0fdf4", color: "#0d9488", border: "1px solid #ccfbf1" }}>
//                                                     View CV Document
//                                                 </a>
//                                             ) : <span className="text-muted fs-7">-</span>}
//                                         </div>

//                                         <div>
//                                             <div className="text-muted fw-bold text-uppercase mb-2" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>Biography</div>
//                                             <div className="p-3 bg-light rounded-3 text-secondary fs-7" style={{ minHeight: "80px", whiteSpace: "pre-line" }}>
//                                                 {profile?.bio || "No biography provided."}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </CCardBody>
//                             </CCard>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ViewTranslatorProfile;