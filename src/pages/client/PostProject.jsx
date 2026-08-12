import React, { useState, useEffect } from "react";
import {
    CButton,
    CCol,
    CForm,
    CFormInput,
    CFormSelect,
    CFormTextarea,
    CSpinner
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilPencil,
    cilFile,
    cilGlobeAlt,
    cilCompass,
    cilChartPie,
    cilStar,
    cilDollar,
    cilClock,
    cilCloudUpload,
    cilCommentSquare,
    cilCheckCircle
} from "@coreui/icons";
import { getLanguages, getSpecializations, createProject } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";

const PostProject = () => {
    const { user } = useAuth();
    const [languages, setLanguages] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        title: "", description: "", sourceLanguageId: "",
        targetLanguageId: "", wordCount: "", specializationId: "",
        budget: "", durationDays: "", notes: ""
    });

    const [file, setFile] = useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const [langs, specs] = await Promise.all([getLanguages(), getSpecializations()]);
            setLanguages(Array.isArray(langs) ? langs : langs.data);
            setSpecializations(Array.isArray(specs) ? specs : specs.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = new FormData();
            Object.keys(form).forEach((key) => payload.append(key, form[key]));
            if (file) payload.append("file", file);

            await createProject(payload);
            alert("Project created successfully!");
            setForm({
                title: "", description: "", sourceLanguageId: "",
                targetLanguageId: "", wordCount: "", specializationId: "",
                budget: "", durationDays: "", notes: ""
            });
            setFile(null);
        } catch (err) {
            alert(err.response?.data?.error || "Failed to create project");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container py-4" style={{ maxWidth: 1000 }}>
            <div className="border-0 shadow-sm bg-white p-4 p-md-5" style={{ borderRadius: "20px", borderTop: "5px solid #3b82f6" }}>
                <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                    <div>
                        <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2" style={{ fontSize: "24px" }}>
                            <CIcon icon={cilPencil} height={24} className="text-primary" /> Post a New Project
                        </h3>
                        <p className="text-muted mb-0" style={{ fontSize: "15px" }}>Fill in the details below to find the right professional translator.</p>
                    </div>
                </div>

                <CForm className="row g-4" onSubmit={handleSubmit}>
                    <CCol xs={12}>
                        <CFormInput name="title" className="py-3 px-4 shadow-none border-light-subtle" style={{ fontSize: "15px" }} label={<span className="d-flex align-items-center gap-2 fw-semibold text-secondary mb-1" style={{ fontSize: "15px" }}><CIcon icon={cilPencil} height={18} />Project Title</span>} placeholder="e.g. Legal Contract Translation English to Indonesian" value={form.title} onChange={handleChange} required />
                    </CCol>

                    <CCol xs={12}>
                        <CFormTextarea name="description" rows={4} className="py-3 px-4 shadow-none border-light-subtle" style={{ fontSize: "15px" }} label={<span className="d-flex align-items-center gap-2 fw-semibold text-secondary mb-1" style={{ fontSize: "15px" }}><CIcon icon={cilFile} height={18} />Description</span>} placeholder="Briefly explain what the project is about..." value={form.description} onChange={handleChange} />
                    </CCol>

                    <CCol md={6}>
                        <CFormSelect name="sourceLanguageId" className="py-3 px-4 shadow-none border-light-subtle" style={{ fontSize: "15px" }} label={<span className="d-flex align-items-center gap-2 fw-semibold text-secondary mb-1" style={{ fontSize: "15px" }}><CIcon icon={cilGlobeAlt} height={18} />Source Language</span>} value={form.sourceLanguageId} onChange={handleChange} required>
                            <option value="">Select source language</option>
                            {languages.map((l) => (<option key={l.id} value={l.id}>{l.name}</option>))}
                        </CFormSelect>
                    </CCol>

                    <CCol md={6}>
                        <CFormSelect name="targetLanguageId" className="py-3 px-4 shadow-none border-light-subtle" style={{ fontSize: "15px" }} label={<span className="d-flex align-items-center gap-2 fw-semibold text-secondary mb-1" style={{ fontSize: "15px" }}><CIcon icon={cilCompass} height={18} />Target Language</span>} value={form.targetLanguageId} onChange={handleChange} required>
                            <option value="">Select target language</option>
                            {languages.map((l) => (<option key={l.id} value={l.id}>{l.name}</option>))}
                        </CFormSelect>
                    </CCol>

                    <CCol md={6}>
                        <CFormInput type="number" name="wordCount" className="py-3 px-4 shadow-none border-light-subtle" style={{ fontSize: "15px" }} label={<span className="d-flex align-items-center gap-2 fw-semibold text-secondary mb-1" style={{ fontSize: "15px" }}><CIcon icon={cilChartPie} height={18} />Word Count</span>} placeholder="e.g. 1500" value={form.wordCount} onChange={handleChange} />
                    </CCol>

                    <CCol md={6}>
                        <CFormSelect name="specializationId" className="py-3 px-4 shadow-none border-light-subtle" style={{ fontSize: "15px" }} label={<span className="d-flex align-items-center gap-2 fw-semibold text-secondary mb-1" style={{ fontSize: "15px" }}><CIcon icon={cilStar} height={18} />Specialization</span>} value={form.specializationId} onChange={handleChange} required>
                            <option value="">Select specialization</option>
                            {specializations.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                        </CFormSelect>
                    </CCol>

                    <CCol md={6}>
                        <CFormInput type="number" name="budget" className="py-3 px-4 shadow-none border-light-subtle" style={{ fontSize: "15px" }} label={<span className="d-flex align-items-center gap-2 fw-semibold text-secondary mb-1" style={{ fontSize: "15px" }}><CIcon icon={cilDollar} height={18} />Budget (Rp)</span>} placeholder="e.g. 500000" value={form.budget} onChange={handleChange} required />
                    </CCol>

                    <CCol md={6}>
                        <CFormInput type="number" name="durationDays" className="py-3 px-4 shadow-none border-light-subtle" style={{ fontSize: "15px" }} label={<span className="d-flex align-items-center gap-2 fw-semibold text-secondary mb-1" style={{ fontSize: "15px" }}><CIcon icon={cilClock} height={18} />Duration (Days)</span>} placeholder="e.g. 3" value={form.durationDays} onChange={handleChange} required />
                    </CCol>

                    <CCol xs={12}>
                        <div className="p-5 rounded-4" style={{ background: "#f8fafc", border: "2px dashed #cbd5e1" }}>
                            <CFormInput type="file" className="shadow-none bg-transparent border-0" style={{ fontSize: "15px" }} label={<span className="d-flex align-items-center gap-2 fw-semibold text-secondary mb-2" style={{ fontSize: "15px" }}><CIcon icon={cilCloudUpload} height={18} />Upload Document Source</span>} onChange={handleFileChange} required />
                        </div>
                    </CCol>

                    <CCol xs={12}>
                        <CFormTextarea name="notes" rows={3} className="py-3 px-4 shadow-none border-light-subtle" style={{ fontSize: "15px" }} label={<span className="d-flex align-items-center gap-2 fw-semibold text-secondary mb-1" style={{ fontSize: "15px" }}><CIcon icon={cilCommentSquare} height={18} />Additional Notes for Translator</span>} placeholder="Any specific instructions or style guidelines..." value={form.notes} onChange={handleChange} />
                    </CCol>

                    <CCol xs={12} className="text-end pt-2">
                        <CButton type="submit" color="primary" className="px-5 py-3 fw-semibold text-white shadow-sm d-inline-flex align-items-center gap-2" style={{ borderRadius: "10px", height: "50px", fontSize: "16px" }} disabled={submitting}>
                            {submitting ? (<><CSpinner size="sm" />Posting...</>) : (<><CIcon icon={cilCheckCircle} height={20} />Post Project</>)}
                        </CButton>
                    </CCol>
                </CForm>
            </div>
        </div>
    );
};

export default PostProject;