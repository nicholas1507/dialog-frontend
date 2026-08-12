import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, getMyUser } from "../../api/api";
import { CCard, CCardBody, CButton, CAlert, CSpinner } from "@coreui/react";

const ClientProfile = () => {
    const [user, setUser] = useState([]);
    const [profileData, setProfileData] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const loadProfile = async () => {
        setFetching(true);
        setError(null);
        try {
            const res = await getMyProfile();
            setProfileData(res);
        } catch (err) {
            if (err.response?.status !== 404) setError("Failed to load profile details.");
        } finally {
            setFetching(false);
        }
    };

    const loadUser = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMyUser();
            setUser(data);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to load user");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
        loadProfile();
    }, []);

    if (fetching) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <CSpinner color="primary" />
            </div>
        );
    }

    return (
        <div className="container-fluid p-0">
            {error && <CAlert color="danger" className="rounded-3 mb-3">{error}</CAlert>}

            <div className="row g-4">
                <div className="col-lg-4">
                    <CCard className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                        <div
                            style={{
                                background: "linear-gradient(160deg, #4338ca 0%, #6d28d9 60%, #7c3aed 100%)",
                                padding: "2.5rem 1.5rem",
                            }}
                            className="d-flex flex-column align-items-center text-center"
                        >
                            <img
                                src={profileData?.imageURL || profileData?.image || "https://dummyimage.com/150x150/e0e0e0/ffffff&text=User"}
                                alt="Avatar"
                                className="rounded-circle border border-4 border-white shadow"
                                style={{ width: "120px", height: "120px", objectFit: "cover" }}
                            />
                            <h4 className="fw-bold text-white mt-3 mb-1">{user?.name || "Client Account"}</h4>
                            <p className="text-white-50 fs-6 mb-0">{user?.email || "-"}</p>
                        </div>

                        <CCardBody className="px-4 py-4 d-flex flex-column justify-content-between">
                            <CButton
                                color="primary"
                                className="rounded-3 w-100 fw-semibold py-2 fs-6 shadow-sm"
                                style={{ background: "#4f46e5", border: "none" }}
                                onClick={() => navigate("/profile/edit")}
                            >
                                Edit Profile
                            </CButton>

                            <div className="mt-4 pt-3 border-top">
                                <div className="d-flex justify-content-between py-2 fs-6">
                                    <span className="text-muted fw-medium">City</span>
                                    <span className="fw-bold text-dark">{profileData?.city || "-"}</span>
                                </div>
                                <div className="d-flex justify-content-between py-2 fs-6">
                                    <span className="text-muted fw-medium">Country</span>
                                    <span className="fw-bold text-dark">{profileData?.country || "-"}</span>
                                </div>
                            </div>
                        </CCardBody>
                    </CCard>
                </div>

                <div className="col-lg-8">
                    <CCard className="border-0 shadow-sm rounded-4 h-100">
                        <CCardBody className="p-4 p-md-5">
                            <h4 className="fw-bold text-dark mb-1">Contact Information</h4>
                            <p className="text-muted fs-6 mb-4">Personal details saved on your account</p>

                            <div className="d-flex flex-column gap-4">
                                <div className="pb-3 border-bottom">
                                    <div className="text-muted fw-semibold text-uppercase mb-1" style={{ fontSize: "0.8rem", letterSpacing: "0.05em" }}>
                                        Phone Number
                                    </div>
                                    <div className="fs-5 fw-semibold text-dark">{profileData?.phone || "-"}</div>
                                </div>

                                <div className="pb-3 border-bottom">
                                    <div className="text-muted fw-semibold text-uppercase mb-1" style={{ fontSize: "0.8rem", letterSpacing: "0.05em" }}>
                                        City
                                    </div>
                                    <div className="fs-5 fw-semibold text-dark">{profileData?.city || "-"}</div>
                                </div>

                                <div className="pb-3 border-bottom">
                                    <div className="text-muted fw-semibold text-uppercase mb-1" style={{ fontSize: "0.8rem", letterSpacing: "0.05em" }}>
                                        Country
                                    </div>
                                    <div className="fs-5 fw-semibold text-dark">{profileData?.country || "-"}</div>
                                </div>

                                <div>
                                    <div className="text-muted fw-semibold text-uppercase mb-2" style={{ fontSize: "0.8rem", letterSpacing: "0.05em" }}>
                                        Bio / Description
                                    </div>
                                    <div className="p-3 bg-light rounded-3 fs-6 fw-medium text-dark" style={{ minHeight: "90px" }}>
                                        {profileData?.bio || "-"}
                                    </div>
                                </div>
                            </div>
                        </CCardBody>
                    </CCard>
                </div>
            </div>
        </div>
    );
};

export default ClientProfile;