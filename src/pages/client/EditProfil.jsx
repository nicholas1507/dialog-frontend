import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, getMyUser, updateProfile, createProfile, updateMyUser } from "../../api/api";
import { CCard, CCardBody, CButton, CFormInput, CFormTextarea, CFormLabel, CAlert, CSpinner } from "@coreui/react";

const EditProfil = () => {
    const [formData, setFormData] = useState({
        phone: "",
        city: "",
        country: "",
        bio: "",
    });
    const [name, setName] = useState("");
    const [hasProfile, setHasProfile] = useState(false);
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
                getMyProfile().catch(() => null),
            ]);

            setName(userRes?.name || "");

            if (profileRes) {
                setHasProfile(true);
                setFormData({
                    phone: profileRes?.phone || "",
                    city: profileRes?.city || "",
                    country: profileRes?.country || "",
                    bio: profileRes?.bio || "",
                });
                setImagePreview(profileRes?.imageURL || profileRes?.image || "");
            } else {
                setHasProfile(false);
            }
        } catch (err) {
            setError("Failed to load profile data.");
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

            if (hasProfile) {
                await updateProfile(payload);
            } else {
                await createProfile(payload);
            }

            if (name) {
                await updateMyUser({ name: name });
            }

            setSuccess("Profile saved successfully!");

            setTimeout(() => {
                navigate("/profile");
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save profile.");
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
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h3 className="fw-bold text-dark mb-1">{hasProfile ? "Edit Profile" : "Create Profile"}</h3>
                    <p className="text-muted fs-6 mb-0">Update your personal account details</p>
                </div>
                <CButton
                    color="light"
                    className="rounded-3 px-3 fw-semibold border"
                    onClick={() => navigate("/profile")}
                >
                    Back to Profile
                </CButton>
            </div>

            {error && <CAlert color="danger" className="rounded-3 mb-4">{error}</CAlert>}
            {success && <CAlert color="success" className="rounded-3 mb-4">{success}</CAlert>}

            <form onSubmit={handleSubmit}>
                <div className="row g-4">
                    <div className="col-lg-4">
                        <CCard className="border-0 shadow-sm rounded-4 h-100 text-center p-4 bg-white">
                            <CCardBody className="p-0 d-flex flex-column align-items-center justify-content-center">
                                <div className="mb-3">
                                    <img
                                        src={
                                            imagePreview ||
                                            "https://dummyimage.com/150x150/e0e0e0/ffffff&text=User"
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
                                    Change Photo
                                </CFormLabel>
                                <input
                                    type="file"
                                    id="avatarInput"
                                    accept="image/*"
                                    className="d-none"
                                    onChange={handleImageChange}
                                />
                                <p className="text-muted small mt-2 mb-0">JPG, PNG or GIF. Max size 2MB.</p>
                            </CCardBody>
                        </CCard>
                    </div>

                    <div className="col-lg-8">
                        <CCard className="border-0 shadow-sm rounded-4 bg-white">
                            <CCardBody className="p-4 p-md-5">
                                <h5 className="fw-bold text-dark mb-4 border-bottom pb-3">
                                    Account Information
                                </h5>

                                <div className="row g-3">
                                    <div className="col-12">
                                        <CFormLabel className="fw-semibold text-dark fs-6 mb-1">
                                            Full Name
                                        </CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter full name"
                                            className="py-2 fs-6 rounded-3"
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <CFormLabel className="fw-semibold text-dark fs-6 mb-1">
                                            Phone Number
                                        </CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="e.g. +62 812 3456 7890"
                                            className="py-2 fs-6 rounded-3"
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <CFormLabel className="fw-semibold text-dark fs-6 mb-1">
                                            City
                                        </CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="e.g. Jakarta"
                                            className="py-2 fs-6 rounded-3"
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <CFormLabel className="fw-semibold text-dark fs-6 mb-1">
                                            Country
                                        </CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            placeholder="e.g. Indonesia"
                                            className="py-2 fs-6 rounded-3"
                                        />
                                    </div>

                                    <div className="col-12">
                                        <CFormLabel className="fw-semibold text-dark fs-6 mb-1">
                                            Bio / Description
                                        </CFormLabel>
                                        <CFormTextarea
                                            name="bio"
                                            rows={4}
                                            value={formData.bio}
                                            onChange={handleChange}
                                            placeholder="Tell us about yourself..."
                                            className="py-2 fs-6 rounded-3"
                                        />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                    <CButton
                                        type="button"
                                        color="light"
                                        className="rounded-3 px-4 fw-semibold fs-6"
                                        onClick={() => navigate("/profile")}
                                    >
                                        Cancel
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
                                                Saving...
                                            </>
                                        ) : (
                                            "Save Changes"
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

export default EditProfil;