import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, getMyUser, updateProfile, updateMyUser } from "../../api/api";
import { CCard, CCardBody, CButton, CFormInput, CFormTextarea, CFormLabel, CAlert, CSpinner, CFormSelect } from "@coreui/react";

const EditProfileAdmin = () => {
    const [formData, setFormData] = useState({
        phone: "",
        city: "",
        country: "",
        bio: "",
    });
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [fetching, setFetching] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();

    const loadData = async () => {
        setFetching(true);
        setError(null);
        try {
            const [userRes, profileRes] = await Promise.all([
                getMyUser(),
                getMyProfile(),
            ]);

            setFormData({
                phone: profileRes?.phone || "",
                city: profileRes?.city || "",
                country: profileRes?.country || "",
                bio: profileRes?.bio || "",
            });
            setName(userRes?.name || "");
            setEmail(userRes?.email || "");
            setRole(userRes?.role || "Admin");
            setImagePreview(profileRes?.imageURL || profileRes?.image || "");
        } catch (err) {
            setError("Gagal memuat data profil admin.");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const payload = new FormData();
            payload.append("phone", formData.phone);
            payload.append("city", formData.city);
            payload.append("country", formData.country);
            payload.append("bio", formData.bio);
            if (imageFile) {
                payload.append("image", imageFile);
            }

            // Update profil & detail user admin
            await updateProfile(payload);
            await updateMyUser({ name, email, role });

            setSuccess("Profil admin berhasil diperbarui!");

            setTimeout(() => {
                navigate("/admin/profile");
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || "Gagal memperbarui profil admin.");
        } finally {
            setSubmitting(false);
        }
    };

    if (fetching) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <CSpinner color="primary" />
            </div>
        );
    }

    return (
        <div className="container-fluid p-0">
            {/* Header section */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h3 className="fw-bold text-dark mb-1">Edit Profil Admin</h3>
                    <p className="text-muted fs-6 mb-0">Kelola kredensial dan informasi akun administrator Anda</p>
                </div>
                <CButton
                    color="light"
                    className="rounded-3 px-3 fw-semibold border"
                    onClick={() => navigate("/admin/profile")}
                >
                    Kembali ke Profil
                </CButton>
            </div>

            {error && <CAlert color="danger" className="rounded-3 mb-4">{error}</CAlert>}
            {success && <CAlert color="success" className="rounded-3 mb-4">{success}</CAlert>}

            <form onSubmit={handleSubmit}>
                <div className="row g-4">
                    {/* Foto Profil Admin */}
                    <div className="col-lg-4">
                        <CCard className="border-0 shadow-sm rounded-4 h-100 text-center p-4 bg-white">
                            <CCardBody className="p-0 d-flex flex-column align-items-center justify-content-center">
                                <div className="mb-3">
                                    <img
                                        src={
                                            imagePreview ||
                                            "https://dummyimage.com/150x150/e0e0e0/ffffff&text=Admin"
                                        }
                                        alt="Avatar Preview"
                                        className="rounded-circle border border-4 border-white shadow-sm"
                                        style={{ width: "130px", height: "130px", objectFit: "cover" }}
                                    />
                                </div>

                                <CFormLabel
                                    htmlFor="avatarInput"
                                    className="btn btn-outline-primary btn-sm rounded-3 fw-semibold mb-0 cursor-pointer"
                                    style={{ borderColor: "#4f46e5", color: "#4f46e5" }}
                                >
                                    Ubah Foto Admin
                                </CFormLabel>
                                <input
                                    type="file"
                                    id="avatarInput"
                                    accept="image/*"
                                    className="d-none"
                                    onChange={handleImageChange}
                                />
                                <p className="text-muted small mt-2 mb-0">Format: JPG, PNG, atau GIF. Maks 2MB.</p>
                            </CCardBody>
                        </CCard>
                    </div>

                    {/* Informasi Akun Admin */}
                    <div className="col-lg-8">
                        <CCard className="border-0 shadow-sm rounded-4 bg-white">
                            <CCardBody className="p-4 p-md-5">
                                <h5 className="fw-bold text-dark mb-4 border-bottom pb-3">
                                    Informasi Akun & Otoritas
                                </h5>

                                <div className="row g-3">
                                    {/* Nama Lengkap */}
                                    <div className="col-md-6">
                                        <CFormLabel className="fw-semibold text-dark fs-6 mb-1">
                                            Nama Lengkap
                                        </CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Masukkan nama lengkap"
                                            className="py-2 fs-6 rounded-3"
                                            required
                                        />
                                    </div>

                                    {/* Email Admin */}
                                    <div className="col-md-6">
                                        <CFormLabel className="fw-semibold text-dark fs-6 mb-1">
                                            Email Admin
                                        </CFormLabel>
                                        <CFormInput
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="admin@domain.com"
                                            className="py-2 fs-6 rounded-3"
                                            required
                                        />
                                    </div>

                                    {/* Role / Akses */}
                                    <div className="col-md-6">
                                        <CFormLabel className="fw-semibold text-dark fs-6 mb-1">
                                            Role Administrator
                                        </CFormLabel>
                                        <CFormSelect
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="py-2 fs-6 rounded-3"
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="Superadmin">Superadmin</option>
                                            <option value="Staff">Staff</option>
                                        </CFormSelect>
                                    </div>

                                    {/* Nomor Telepon */}
                                    <div className="col-md-6">
                                        <CFormLabel className="fw-semibold text-dark fs-6 mb-1">
                                            Nomor Telepon / WhatsApp
                                        </CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Contoh: +62 812 3456 7890"
                                            className="py-2 fs-6 rounded-3"
                                        />
                                    </div>

                                    {/* Kota */}
                                    <div className="col-md-6">
                                        <CFormLabel className="fw-semibold text-dark fs-6 mb-1">
                                            Kota
                                        </CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="Contoh: Jakarta"
                                            className="py-2 fs-6 rounded-3"
                                        />
                                    </div>

                                    {/* Negara */}
                                    <div className="col-md-6">
                                        <CFormLabel className="fw-semibold text-dark fs-6 mb-1">
                                            Negara
                                        </CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            placeholder="Contoh: Indonesia"
                                            className="py-2 fs-6 rounded-3"
                                        />
                                    </div>

                                    {/* Bio / Catatan Tambahan */}
                                    <div className="col-12">
                                        <CFormLabel className="fw-semibold text-dark fs-6 mb-1">
                                            Bio / Deskripsi Tugas
                                        </CFormLabel>
                                        <CFormTextarea
                                            name="bio"
                                            rows={4}
                                            value={formData.bio}
                                            onChange={handleChange}
                                            placeholder="Tuliskan deskripsi singkat mengenai peran atau bio Anda..."
                                            className="py-2 fs-6 rounded-3"
                                        />
                                    </div>
                                </div>

                                {/* Tombol Aksi */}
                                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                    <CButton
                                        type="button"
                                        color="light"
                                        className="rounded-3 px-4 fw-semibold fs-6"
                                        onClick={() => navigate("/admin/profile")}
                                    >
                                        Batal
                                    </CButton>
                                    <CButton
                                        type="submit"
                                        disabled={submitting}
                                        className="rounded-3 px-4 fw-semibold fs-6 text-white"
                                        style={{ background: "#4f46e5", border: "none" }}
                                    >
                                        {submitting ? (
                                            <>
                                                <CSpinner size="sm" className="me-2" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            "Simpan Perubahan"
                                        )}
                                    </CButton>
                                </div>
                            </CCardBody>
                        </CCard>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditProfileAdmin;