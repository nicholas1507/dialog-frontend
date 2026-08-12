import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTranslator, createTranslator, updateMyTranslator, getLanguages, getSpecializations } from "../../api/api";
import { CCard, CCardBody, CButton, CForm, CFormInput, CFormSelect, CAlert, CSpinner } from "@coreui/react";

const SetupTranslator = () => {
    const navigate = useNavigate();

    const createPair = () => ({ _tempId: Date.now() + Math.random(), sourceLanguageId: "", targetLanguageId: "" });

    const [experience, setExperience] = useState("");
    const [ratePerProject, setRatePerProject] = useState("");
    const [languagePairs, setLanguagePairs] = useState([createPair()]);
    const [specializationIds, setSpecializationIds] = useState([]);
    const [cvURL, setCvURL] = useState("");

    const [availableLanguages, setAvailableLanguages] = useState([]);
    const [availableSpecs, setAvailableSpecs] = useState([]);

    const [hasTranslator, setHasTranslator] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [langs, specs] = await Promise.all([getLanguages(), getSpecializations()]);
                setAvailableLanguages(langs.data || langs);
                setAvailableSpecs(specs.data || specs);

                try {
                    const res = await getMyTranslator();
                    const data = res.data || res;
                    if (data) {
                        setHasTranslator(true);
                        setExperience(data.experience || "");
                        setRatePerProject(data.ratePerProject || "");
                        setCvURL(data.cvUrl || data.cvURL || "");
                        if (data.LanguagePairs?.length) {
                            setLanguagePairs(data.LanguagePairs.map(l => ({
                                _tempId: Date.now() + Math.random(),
                                sourceLanguageId: l.sourceLanguageId,
                                targetLanguageId: l.targetLanguageId
                            })));
                        }
                        if (data.Specializations?.length) {
                            setSpecializationIds(data.Specializations.map(s => s.id));
                        }
                    }
                } catch {
                    setHasTranslator(false); // Belum ada profil (404)
                }
            } catch (err) {
                setError("Gagal memuat data awal.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handlePairChange = (index, field, value) => {
        const updated = [...languagePairs];
        updated[index][field] = value;
        setLanguagePairs(updated);
    };

    const addPair = () => setLanguagePairs([...languagePairs, createPair()]);
    const removePair = (index) => setLanguagePairs(languagePairs.filter((_, i) => i !== index));

    const toggleSpec = (id) => {
        const numId = Number(id);
        setSpecializationIds(prev => prev.includes(numId) ? prev.filter(i => i !== numId) : [...prev, numId]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        // Payload langsung dikirim sesuai nama key di Backend
        const payload = {
            experience: Number(experience),
            ratePerProject: Number(ratePerProject),
            languagePairs: languagePairs.map(p => ({
                sourceLanguageId: Number(p.sourceLanguageId),
                targetLanguageId: Number(p.targetLanguageId)
            })),
            specializationIds,
            cvURL
        };

        try {
            if (hasTranslator) {
                await updateMyTranslator(payload);
            } else {
                await createTranslator(payload);
            }
            navigate("/my-profile");
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menyimpan profil.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-5"><CSpinner color="primary" /></div>;

    return (
        <div className="container py-4 col-lg-8">
            <CCard className="shadow-sm border-0">
                <CCardBody className="p-4">
                    <h4 className="fw-bold mb-3">{hasTranslator ? "Edit Profile Translator" : "Setup Profile Translator"}</h4>
                    {error && <CAlert color="danger">{error}</CAlert>}

                    <CForm onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Experience (Years)</label>
                                <CFormInput type="number" value={experience} onChange={e => setExperience(e.target.value)} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Rate Per Project</label>
                                <CFormInput type="number" value={ratePerProject} onChange={e => setRatePerProject(e.target.value)} required />
                            </div>
                        </div>

                        {/* LANGUAGE PAIRS */}
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <label className="form-label fw-semibold mb-0">Language Pairs</label>
                                <CButton color="light" size="sm" onClick={addPair}>+ Add Pair</CButton>
                            </div>
                            {languagePairs.map((pair, index) => (
                                <div key={pair._tempId} className="d-flex gap-2 mb-2 align-items-center">
                                    <CFormSelect value={pair.sourceLanguageId} onChange={e => handlePairChange(index, "sourceLanguageId", e.target.value)} required>
                                        <option value="">Source Language</option>
                                        {availableLanguages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                    </CFormSelect>
                                    <span>➔</span>
                                    <CFormSelect value={pair.targetLanguageId} onChange={e => handlePairChange(index, "targetLanguageId", e.target.value)} required>
                                        <option value="">Target Language</option>
                                        {availableLanguages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                    </CFormSelect>
                                    {languagePairs.length > 1 && (
                                        <CButton color="danger" variant="ghost" size="sm" onClick={() => removePair(index)}>✕</CButton>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* SPECIALIZATIONS */}
                        <div>
                            <label className="form-label fw-semibold">Specializations</label>
                            <div className="d-flex flex-wrap gap-2 p-2 border rounded bg-light">
                                {availableSpecs.map(spec => {
                                    const selected = specializationIds.includes(spec.id);
                                    return (
                                        <button
                                            type="button"
                                            key={spec.id}
                                            className={`btn btn-sm ${selected ? "btn-success" : "btn-outline-secondary"}`}
                                            onClick={() => toggleSpec(spec.id)}
                                        >
                                            {selected ? "✓ " : "+ "}{spec.name || spec.title}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* CV URL */}
                        <div>
                            <label className="form-label fw-semibold">CV / Portfolio Link</label>
                            <CFormInput type="url" value={cvURL} onChange={e => setCvURL(e.target.value)} placeholder="https://..." />
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <CButton color="secondary" onClick={() => navigate(-1)}>Cancel</CButton>
                            <CButton type="submit" color="primary" disabled={submitting}>
                                {submitting ? "Saving..." : "Save Changes"}
                            </CButton>
                        </div>
                    </CForm>
                </CCardBody>
            </CCard>
        </div>
    );
};

export default SetupTranslator;