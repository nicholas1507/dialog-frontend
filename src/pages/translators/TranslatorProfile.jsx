import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
    getMyUser, 
    getMyProfile, 
    getMyTranslator, 
    getTranslatorById, 
    inviteTranslator
} from "../../api/api";
import { 
    CCard, CCardBody, CButton, CAlert, CSpinner, CBadge,
    CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
    CFormInput, CFormTextarea
} from "@coreui/react";

const TranslatorProfile = () => {
    const { id } = useParams();
    const isOwnProfile = !id;
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [translatorData, setTranslatorData] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [showHireModal, setShowHireModal] = useState(false);
    const [hireProjectId, setHireProjectId] = useState("");
    const [hireMessage, setHireMessage] = useState("");
    const [hireLoading, setHireLoading] = useState(false);

    const loadData = async () => {
        setFetching(true);
        setError(null);
        try {
            if (isOwnProfile) {
                const [userData, profileData, translatorRes] = await Promise.all([
                    getMyUser().catch(() => null),
                    getMyProfile().catch(() => null),
                    getMyTranslator().catch(() => null), 
                ]);
                setUser(userData);
                setProfile(profileData);
                setTranslatorData(translatorRes);
            } else {
                const translatorRes = await getTranslatorById(id);
                setUser(translatorRes.user || translatorRes);
                setProfile(translatorRes.user?.profile || translatorRes);
                setTranslatorData(translatorRes);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load profile details.");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => { loadData(); }, [id]);

    const formatRate = (val) => (val ? `Rp ${Number(val).toLocaleString("id-ID")}` : "-");
    const getCvUrl = () => translatorData?.cvUrl || translatorData?.cv || translatorData?.cvURL || null;

    const handleHireSubmit = async () => {
        if (!hireProjectId) { alert("Project ID is required."); return; }
        setHireLoading(true);
        try {
            await inviteTranslator(translatorData.id, { projectId: hireProjectId, message: hireMessage });
            alert("Translator has been successfully invited!");
            setShowHireModal(false);
            setHireProjectId("");
            setHireMessage("");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to invite translator.");
        } finally {
            setHireLoading(false);
        }
    };

    if (fetching) {
        return <div className="d-flex justify-content-center align-items-center py-5"><CSpinner color="primary" /></div>;
    }

    return (
        <div className="container-fluid p-0">
            {error && <CAlert color="danger" className="rounded-4 mb-4 border-0 shadow-sm">{error}</CAlert>}
            {!isOwnProfile && <div className="mb-3"><CButton color="light" size="sm" className="border shadow-sm d-inline-flex align-items-center gap-2 px-3 py-2 fw-semibold text-dark" onClick={() => navigate("/translators")}>← Back to Translators</CButton></div>}
            <div className="row g-4">
                <div className="col-lg-4">
                    <CCard className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                        <div style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)", height: "100px" }} />
                        <CCardBody className="pt-0 px-4 pb-4 d-flex flex-column align-items-center text-center">
                            <div className="position-relative" style={{ marginTop: "-50px" }}>
                                <img src={profile?.imageURL || profile?.image || "https://dummyimage.com/150x150/e0e0e0/ffffff&text=Translator"} alt="Profile" className="rounded-circle border border-4 border-white shadow-sm" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                            </div>
                            <h5 className="fw-bold text-dark mt-3 mb-0">{user?.name || "Translator"}</h5>
                            <p className="text-muted fs-7 mb-2">{isOwnProfile ? (user?.email || "-") : "Verified Translator"}</p>
                            {isOwnProfile && <CButton color="light" size="sm" className="rounded-3 border w-100 fw-semibold text-dark mb-3" onClick={() => navigate("/my-profile/setup")}>{profile ? "Edit Basic Profile" : "Setup Basic Profile"}</CButton>}
                            {!isOwnProfile && translatorData && <CButton size="sm" className="rounded-3 w-100 fw-semibold text-white shadow-sm mb-3" style={{ background: "#0d9488", border: "none" }} onClick={() => setShowHireModal(true)}>Hire / Contact Translator</CButton>}
                            <div className="w-100 border-top pt-3 d-flex flex-column gap-2 text-start fs-7">
                                <div className="d-flex justify-content-between py-1 border-bottom border-light"><span className="text-muted">City</span><span className="fw-semibold text-dark">{profile?.city || "-"}</span></div>
                                <div className="d-flex justify-content-between py-1 border-bottom border-light"><span className="text-muted">Country</span><span className="fw-semibold text-dark">{profile?.country || "-"}</span></div>
                                {translatorData && (
                                    <>
                                        <div className="d-flex justify-content-between py-1 border-bottom border-light"><span className="text-muted">Experience</span><span className="fw-semibold text-dark">{translatorData.experience ? `${translatorData.experience} Years` : "-"}</span></div>
                                        <div className="d-flex justify-content-between py-1"><span className="text-muted">Rate per Project</span><span className="fw-bold" style={{ color: "#0d9488" }}>{formatRate(translatorData.ratePerProject)}</span></div>
                                    </>
                                )}
                            </div>
                        </CCardBody>
                    </CCard>
                </div>

                <div className="col-lg-8">
                    {!translatorData ? (
                        <CCard className="border-0 shadow-sm rounded-4 bg-white text-center p-5">
                            <CCardBody className="d-flex flex-column align-items-center justify-content-center py-4">
                                <h5 className="fw-bold text-dark mb-2">No Translator Profile Found</h5>
                                <p className="text-muted fs-7 mb-3" style={{ maxWidth: "400px" }}>{isOwnProfile ? "Set up your translator attributes like languages, rate per word, and specializations to start accepting jobs." : "This translator has not set up their professional profile yet."}</p>
                                {isOwnProfile && <CButton size="sm" className="rounded-3 px-3 py-2 fw-semibold text-white shadow-sm" style={{ background: "#0d9488", border: "none" }} onClick={() => navigate("/my-profile/setup-translator")}>Create Translator Profile</CButton>}
                            </CCardBody>
                        </CCard>
                    ) : (
                        <div className="d-flex flex-column gap-4">
                            <div className="row g-3">
                                <div className="col-sm-4"><div className="p-3 bg-white rounded-4 shadow-sm border-0"><div className="text-muted fs-7 fw-semibold text-uppercase mb-1">Experience</div><div className="fs-5 fw-bold text-dark">{translatorData.experience ? `${translatorData.experience} Yrs` : "-"}</div></div></div>
                                <div className="col-sm-4"><div className="p-3 bg-white rounded-4 shadow-sm border-0"><div className="text-muted fs-7 fw-semibold text-uppercase mb-1">Rate Per Project</div><div className="fs-5 fw-bold" style={{ color: "#0d9488" }}>{formatRate(translatorData.ratePerProject)}</div></div></div>
                                <div className="col-sm-4"><div className="p-3 bg-white rounded-4 shadow-sm border-0"><div className="text-muted fs-7 fw-semibold text-uppercase mb-1">Language Pairs</div><div className="fs-5 fw-bold text-dark">{translatorData.languagePairs?.length || 0} Pairs</div></div></div>
                            </div>
                            <CCard className="border-0 shadow-sm rounded-4 bg-white">
                                <CCardBody className="p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                                        <div><h5 className="fw-bold text-dark mb-1">Professional Info</h5><p className="text-muted fs-7 mb-0">Translator skills, services, and biography</p></div>
                                        {isOwnProfile && <CButton size="sm" className="rounded-3 px-3 fw-semibold text-white shadow-sm" style={{ background: "#0d9488", border: "none" }} onClick={() => navigate("/my-profile/setup-translator")}>Edit Translator Info</CButton>}
                                    </div>
                                    <div className="d-flex flex-column gap-4">
                                        <div>
                                            <div className="text-muted fw-bold text-uppercase mb-2" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>Language Pairs</div>
                                            <div className="d-flex flex-wrap gap-2">
                                                {translatorData.languagePairs?.length > 0 ? translatorData.languagePairs.map((lang, idx) => <span key={idx} className="badge bg-light text-dark border px-3 py-2 rounded-3 fs-7 fw-normal">{typeof lang === "object" ? `${lang.sourceLanguage.name} ➔ ${lang.targetLanguage.name}` : lang}</span>) : <span className="text-muted fs-7">-</span>}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-muted fw-bold text-uppercase mb-2" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>Specializations</div>
                                            <div className="d-flex flex-wrap gap-2">
                                                {translatorData.specializations?.length > 0 ? translatorData.specializations.map((spec, idx) => <span key={idx} className="badge px-3 py-2 rounded-3 fs-7 fw-normal border" style={{ backgroundColor: "#f0fdf4", color: "#0f766e", borderColor: "#ccfbf1" }}>{typeof spec === "object" ? (spec.name || spec.title || JSON.stringify(spec)) : spec}</span>) : <span className="text-muted fs-7">-</span>}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-muted fw-bold text-uppercase mb-2" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>Curriculum Vitae (CV)</div>
                                            {getCvUrl() ? (
                                                <a href={getCvUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-sm rounded-3 d-inline-flex align-items-center gap-2 px-3 py-2 fw-semibold text-decoration-none shadow-sm" style={{ backgroundColor: "#f0fdf4", color: "#0d9488", border: "1px solid #ccfbf1" }}>
                                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                    View CV Document
                                                </a>
                                            ) : <span className="text-muted fs-7">-</span>}
                                        </div>
                                        <div>
                                            <div className="text-muted fw-bold text-uppercase mb-2" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>Biography</div>
                                            <div className="p-3 bg-light rounded-3 text-secondary fs-7" style={{ minHeight: "80px", whiteSpace: "pre-line" }}>{profile?.bio || "No biography provided."}</div>
                                        </div>
                                    </div>
                                </CCardBody>
                            </CCard>
                        </div>
                    )}
                </div>
            </div>

            <CModal visible={showHireModal} onClose={() => setShowHireModal(false)} alignment="center" backdrop="static">
                <CModalHeader onClose={() => setShowHireModal(false)}><CModalTitle>Invite to Project</CModalTitle></CModalHeader>
                <CModalBody>
                    <div className="mb-3">
                        <label className="form-label text-muted fs-7 fw-semibold">Project ID</label>
                        <CFormInput type="text" placeholder="Enter your Project ID" value={hireProjectId} onChange={(e) => setHireProjectId(e.target.value)} />
                        <div className="form-text fs-7">Input the ID of your Open Project.</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-muted fs-7 fw-semibold">Message</label>
                        <CFormTextarea rows={3} placeholder="Say something to invite the translator..." value={hireMessage} onChange={(e) => setHireMessage(e.target.value)} />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" variant="ghost" onClick={() => setShowHireModal(false)} disabled={hireLoading}>Cancel</CButton>
                    <CButton style={{ backgroundColor: "#0d9488", borderColor: "#0d9488", color: "#fff" }} onClick={handleHireSubmit} disabled={hireLoading || !hireProjectId}>{hireLoading ? <CSpinner size="sm" color="light" /> : "Send Invite"}</CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default TranslatorProfile;