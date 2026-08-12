import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function register(payload){
    const res = await api.post('/auth/register', payload);
    return res.data;
}
export async function login(payload){
    const res = await api.post('/auth/login', payload);
    return res.data;
}
// Specializations
export async function getSpecializations(params={}){
    const res = await api.get('/specializations',{params});
    return res.data;
}
export async function createSpecialization(payload){
    const res = await api.post('/specializations',payload);
    return res.data;
}
export async function updateSpecialization(id,payload){
    const res = await api.patch(`/specializations/${id}`,payload);
    return res.data;
}
export async function deleteSpecialization(id){
    const res = await api.delete(`/specializations/${id}`);
    return res.data;
}

// Language
export async function getLanguages(params={}){
    const res = await api.get('/languages',{params});
    return res.data;
}
export async function createLanguage(payload){
    const res = await api.post('/languages',payload);
    return res.data;
}
export async function updateLanguage(id,payload){
    const res = await api.patch(`/languages/${id}`,payload);
    return res.data;
}
export async function deleteLanguage(id){
    const res = await api.delete(`/languages/${id}`);
    return res.data;
}

// Project
export async function getProjects(){
    const res = await api.get('/projects');
    return res.data;
}
export async function createProject(payload){
    const res = await api.post('/projects',payload,{
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data
}
export async function getMyProjects(params={}){
    const res = await api.get('/projects/me',{params});
    return res.data;
}
export async function getProjectById(id){
    const res = await api.get(`/projects/${id}`);
    return res.data;
}
export async function getAvailableProjects(params={}){
    const res = await api.get('/projects/availableProjects',{params});
    return res.data;
}
export async function applyProject(projectId,payload){
    const res = await api.post(`/projects/${projectId}/applications`,payload);
    return res.data;
}
export async function getMyProjectCandidates(projectId){
    const res = await api.get(`/projects/${projectId}/candidates`);
    return res.data;
}
export async function approveCandidate(projectId,candidateId){
    const res = await api.patch(`/projects/${projectId}/${candidateId}/approved`);
    return res.data;
}
export async function uploadProjectDocument(projectId,payload){
    const res = await api.post(`/projects/${projectId}/documents`,payload,{
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
}
export async function approveProject(projectId){
    const res = await api.patch(`/projects/${projectId}/approved`);
    return res.data;
}
export async function inviteTranslator(translatorId,payload){
    const res = await api.post(`/projects/${translatorId}/invitations`,payload);
    return res.data;
}
export async function editProject(id,payload){
    const res = await api.patch(`/projects/${id}`,payload);
    return res.data;
}
// Translator
export async function getTranslatorProjects(params={}){
    const res = await api.get('/projects/translatorProject',{params});
    return res.data;
}
export async function getTranslators(params={}){
    const res = await api.get('/translators',{params});
    return res.data;
}
export async function getTranslatorById(id){
    const res = await api.get(`/translators/${id}`);
    return res.data;
}
export async function createTranslator(payload){
    const res = await api.post('/translators',payload);
    return res.data;
}
export async function updateMyTranslator(payload){
    const res = await api.patch('/translators/me',payload);
    return res.data;
}
export async function getMyTranslator(){
    try{
        const res = await api.get('/translators/me');
        return res.data;
    }catch(error){
        return null;
    }
}
export async function getMyInvitations(){
    const res = await api.get('/translators/invitations');
    return res.data;
}
export async function acceptInvitation(projectId){
    const res = await api.patch(`/translators/invitations/${projectId}/accept`);
    return res.data;
}
export async function declineInvitation(projectId){
    const res = await api.patch(`/translators/invitations/${projectId}/decline`);
    return res.data;
}
export async function deleteTranslator(id){
    const res = await api.delete(`/translators/${id}`);
    return res.data;
}
// Payment
export async function getPayments(params ={}){
    const res = await api.get('/payments',{params});
    return res.data;
}
export async function getPaymentById(id){
    const res = await api.get(`/payments/${id}`);
    return res.data;
}
export async function approvePayment(id){
    const res = await api.patch(`/payments/${id}/verify`);
    return res.data;
}
export async function createPayment(projectId,payload){
    const res = await api.post(`/projects/${projectId}/payment`,payload,{
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
}
// Profile
export async function createProfile(payload){
    const res = await api.post('/users/me/profile',payload,{
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
}
export async function getMyProfile(){
    const res = await api.get('/users/me/profile');
    return res.data;
}
export async function updateProfile(payload){
    const res = await api.patch(`/users/me/profile`,payload,{
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
}

// User
export async function getAllUser(params = {}){
    const res = await api.get('/users',{params});
    return res.data;
}
export async function getUserById(id){
    const res = await api.get(`/users/${id}`);
    return res.data;
}
export async function createUser(payload){
    const res = await api.get("/users",payload);
    return res.data;
}
export async function deletUser(id){
    const res = await api.delete(`/users/${id}`);
    return res.data;
}
export async function updateUser(id,payload){
    const res = await api.put(`/users/${id}`,payload);
    return res.data;
}
export async function getMyUser(){
    const res = await api.get('/users/me');
    return res.data;
}
export async function updateMyUser(payload){
    const res = await api.patch('/users/me',payload);
    return res.data;
}

//Roles
export async function getAllRoles(){
    const res = await api.get('/roles');
    return res.data;
}