import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    getMyUser,
    getMyProfile,
    updateMyUser,
    updateProfile,
    createProfile
} from "../../api/api";
import {
    CCard,
    CCardBody,
    CButton,
    CForm,
    CFormInput,
    CFormTextarea,
    CAlert,
    CSpinner
} from "@coreui/react";

const SetupProfile = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [bio, setBio] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [hasProfile, setHasProfile] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const loadData = async () => {
        setFetching(true);
        setError(null);
        try {
            const [userData, profileData] = await Promise.all([
                getMyUser().catch(() => null),
                getMyProfile().catch((err) => {
                    if (err.response?.status === 404) return null;
                    throw err;
                }),
            ]);
            if (userData) {
                setName(userData.name || "");
                setEmail(userData.email || "");
            }
            if (profileData) {
                setHasProfile(true);
                setPhone(profileData.phone || "");
                setCity(profileData.city || "");
                setCountry(profileData.country || "");
                setBio(profileData.bio || "");
                setImagePreview(profileData.imageURL || profileData.image || "");
            } else {
                setHasProfile(false);
            }
        } catch (err) {
            setError("Failed to fetch profile information.");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccessMsg(null);

        try {
            if (name) {
                await updateMyUser({ name });
            }
            let payload;
            if (image) {
                payload = new FormData();
                payload.append("phone", phone);
                payload.append("city", city);
                payload.append("country", country);
                payload.append("bio", bio);
                payload.append("image", image);
            } else {
                payload = { phone, city, country, bio };
            }
            if (hasProfile) {
                await updateProfile(payload);
            } else {
                await createProfile(payload);
            }

            setSuccessMsg(hasProfile ? "Profile updated successfully!" : "Profile created successfully!");
            setTimeout(() => {
                navigate("/my-profile");
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
            <div className="row justify-content-center">
                <div className="col-lg-8 col-xl-7">
                    <CCard className="border-0 shadow-sm rounded-4 bg-white overflow-hidden">
                        <div style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)", height: "100px" }} />
                        <CCardBody className="p-4 p-md-5 pt-0">
                            
                            {/* Header */}
                            <div className="d-flex flex-column align-items-center text-center mb-4" style={{ marginTop: "-50px" }}>
                                <div className="position-relative mb-3">
                                    <img
                                        src={imagePreview || "https://dummyimage.com/150x150/e0e0e0/ffffff&text=User"}
                                        alt="Avatar Preview"
                                        className="rounded-circle border border-4 border-white shadow-sm"
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    />
                                </div>
                                <h4 className="fw-bold text-dark mb-1">
                                    {hasProfile ? "Edit Basic Profile" : "Setup Basic Profile"}
                                </h4>
                                <p className="text-muted fs-7">
                                    {hasProfile ? "Update your general profile and contact details" : "Fill in your profile details to get started"}
                                </p>
                            </div>

                            {/* Alerts */}
                            {error && <CAlert color="danger" className="rounded-3 border-0 shadow-sm fs-7">{error}</CAlert>}
                            {successMsg && <CAlert color="success" className="rounded-3 border-0 shadow-sm fs-7">{successMsg}</CAlert>}

                            {/* Form */}
                            <CForm onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-dark fs-7">Full Name</label>
                                        <CFormInput
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-muted fs-7">Email Address</label>
                                        <CFormInput
                                            type="email"
                                            value={email}
                                            disabled
                                            className="bg-light text-muted"
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-dark fs-7">Phone Number</label>
                                        <CFormInput
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+62 812 3456 7890"
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-dark fs-7">Profile Picture</label>
                                        <CFormInput
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-dark fs-7">City</label>
                                        <CFormInput
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="e.g. Jakarta"
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-dark fs-7">Country</label>
                                        <CFormInput
                                            type="text"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            placeholder="e.g. Indonesia"
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-semibold text-dark fs-7">Biography</label>
                                        <CFormTextarea
                                            rows={4}
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            placeholder="Write a short bio..."
                                        />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                    <CButton
                                        type="button"
                                        color="light"
                                        className="rounded-3 border fw-semibold px-4 text-dark fs-7"
                                        onClick={() => navigate(-1)}
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </CButton>
                                    <CButton
                                        type="submit"
                                        className="rounded-3 fw-semibold px-4 text-white fs-7 shadow-sm d-flex align-items-center gap-2"
                                        style={{ background: "#0d9488", border: "none" }}
                                        disabled={submitting}
                                    >
                                        {submitting && <CSpinner size="sm" />}
                                        {submitting ? "Saving..." : "Save Changes"}
                                    </CButton>
                                </div>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </div>
            </div>
        </div>
    );
};

export default SetupProfile;