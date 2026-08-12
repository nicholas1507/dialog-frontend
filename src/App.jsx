import { useState } from 'react'
import {Route, Routes} from 'react-router-dom'
import './App.css';
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PrivateLayout from './layouts/PrivateLayout'
import PrivateRoute from './components/PrivateRoute'
import PublicLayout from './layouts/PublicLayout'
import RoleBasedRoute from './components/RoleBasedRoute';
import ClientDashboard from './pages/client/ClientDashboard';
import PostProject from './pages/client/PostProject';
import MyProjects from './pages/client/MyProject';
import ProjectDetail from './pages/client/ProjectDetail';
import ClientPayment from './pages/client/ClientPayment';
import TranslatorDashboard from './pages/translators/TranslatorDashboard';
import TranslatorProject from './pages/translators/TranslatorProject'
import AvailableProjects from './pages/translators/AvailableProject';
import ListTranslators from './pages/client/ListTranslators';
import ClientProfile from './pages/client/ClientProfile';
import EditProfil from './pages/client/EditProfil';
import TranslatorProfile from './pages/translators/TranslatorProfile';
import SetupProfile from './pages/translators/SetupProfile';
import SetupTranslator from './pages/translators/SetupTranslator';
import ClientApplicants from './pages/client/ClientApplicants';
import ProjectDetailTranslator from './pages/translators/ProjectDetailTranslator';
import TranslatorApproval from './pages/translators/TranslatorApproval';
import LoginAdmin from './pages/LoginAdmin';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersAdmin from './pages/admin/UsersAdmin';
import TranslatorsAdmin from './pages/admin/TranslatorsAdmin';
import ProjectsAdmin from './pages/admin/ProjectsAdmin';
import PaymentsAdmin from './pages/admin/PaymentsAdmin';
import LanguageData from './pages/admin/LanguageData';
import SpecializationData from './pages/admin/SpecializationData';
import AdminProfile from './pages/admin/AdminProfile';
import EditProfileAdmin from './pages/admin/EditProfileAdmin';
function App() {

  return (
    <>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/login/admin' element={<LoginAdmin />}/>
          </Route>
          <Route element={<PrivateRoute />}>
            <Route element={<PrivateLayout />}>
              <Route path='/dashboard' element={<Dashboard />}/>
              <Route element={ <RoleBasedRoute allowedRoles={["Client"]}/>}>
                <Route path='/dashboard'element={<ClientDashboard />}/>
                <Route path='/post-project' element={<PostProject />}/>
                <Route path='/my-projects' element={<MyProjects />}/>
                <Route path="/my-projects/:id" element={<ProjectDetail />} />
                <Route path="/my-projects/:id/payment" element={<ClientPayment />} />
                <Route path="/my-projects/:id/applicants" element={<ClientApplicants />} />
                <Route path='/translators' element={<ListTranslators />}/>
                <Route path='/translators/:id' element={<TranslatorProfile />}/>
                <Route path='/profile' element={<ClientProfile />}/> 
                <Route path='/profile/edit' element={<EditProfil />}/> 
              </Route>
              <Route element={ <RoleBasedRoute allowedRoles={["Translator"]}/>}>
                <Route path='/dashboard'element={<TranslatorDashboard />}/>
                <Route path='/translator/projects'element={<TranslatorProject />}/>
                <Route path='/translator/projects/:id'element={<ProjectDetailTranslator />}/>
                <Route path='/available-projects'element={<AvailableProjects />}/>
                <Route path='/invitations'element={<TranslatorApproval />}/>
                <Route path='/my-profile' element={<TranslatorProfile />}/>
                <Route path='/my-profile/setup' element={<SetupProfile />}/>
                <Route path='/my-profile/setup-translator' element={<SetupTranslator />}/>
              </Route>
              <Route element={ <RoleBasedRoute allowedRoles={["Admin"]}/>}>
                {/* <Route path='/login/admin' element={<LoginAdmin />}/> */}
                <Route path='/dashboard'element={<AdminDashboard/>}/>
                <Route path='/admin/profile'element={<AdminProfile/>}/>
                <Route path='/admin/profile/edit' element={<EditProfileAdmin />}/> 
                <Route path='/admin/users'element={<UsersAdmin/>}/>
                <Route path='/admin/translators'element={<TranslatorsAdmin/>}/>
                <Route path='/admin/projects'element={<ProjectsAdmin/>}/>
                <Route path='/admin/payments'element={<PaymentsAdmin/>}/>
                <Route path='/admin/languages'element={<LanguageData/>}/>
                <Route path='/admin/specializations'element={<SpecializationData/>}/>
              </Route>
            </Route>
          </Route>
        </Routes>
    </>
  )
}

export default App
