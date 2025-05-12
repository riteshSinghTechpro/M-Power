import React from 'react'
import { Routes, Route, BrowserRouter } from "react-router-dom"
import Dashboard from './Page/Dashboard'
import Management from './Page/Management'
import Live from './Page/Live'
import Reports from './Page/Reports'
import Login from './Component/Login/Login'
import Registration from './Component/Resister/Registration'
import Forgotpassword from './Component/Forgotpassword/Forgotpassword'
import Settings from './Page/Settings'
import Resetpassword from './Component/Forgotpassword/Resetpassword'
import RoleMaster from './Page/RoleMaster'
import SkillMaster from './Page/SkillMaster'
import GeneratedCV from './Page/GeneratedCV'

import UserRoleMapping from './Page/UserRoleMapping'
import UserManagement from './Page/UserManagement'
import PersonalDetails from './Page/PersonalDetails'
import EducationDeatils from './Page/EducationDeatils'
import ExperienceDetails from './Page/ExperienceDetails'
import DesignationMaster from './Page/DesignationMaster'
import DocumentTypeMaster from './Page/DocumentTypeMaster'
import TransactionMaster from './Page/TransactionMaster'
import Profile from './Page/Profile'
import ChangePassword from './Page/ChangePassword'
import UserandRoleMapping from './Page/UserandRoleMapping'
import UserRoleAccess from './Page/UserRoleAccess'
import Master from './Page/Master'
import UploadDocuments from './Page/UploadDocuments'
import TemplateMaster from './Page/TemplateMaster'
import ClientMaster from './Page/ClientMaster'
import ObjectiveMaster from './Page/ObjectiveMaster'
import CreateCV from './Page/CreateCV'
import EmployeeDetails from './Page/EmployeeDetails'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material';
import ViewDetailsList from './Component/ViewDetailsList';
import CvPdfList from './Component/CvPdfList'
import DepartmentMaster from './Component/DepartmentMaster'
import EmployeeRoleMaster from './Component/EmployeeRoleMaster'
import LeaveRequest from './Component/LeaveRequest'
import HolidayMaster from './Page/HolidayMaster'
import LeaveTypeMaster from './Component/LeaveTypeMaster'
import LeaveApprovalMaster from './Component/LeaveApprovalMaster'
import ViewLeaveApproval from './Component/ViewLeaveApproval'
import SavePdf from './Component/CV/GeneratedCV/SavePdf';
import LeaveOnBehalf from './Component/LeaveOnBehalf';
import LeaveBalanceReport from './Component/LeaveBalanceReport';
import LeaveAppliedReport from './LeaveAppliedReport'
export default function App() {
  
  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/forgotpassword" element={<Forgotpassword />} />
          <Route path="/resetpassword" element={<Resetpassword />} />
          <Route path='/dashboard' element={<Dashboard />}></Route>
          <Route path='/live' element={<Live />}></Route>
          <Route path='/management' element={<Management />}></Route>
          <Route path='/setting' element={<Settings />}></Route>
          <Route path='/report' element={<Reports />}></Route>
          <Route path='*' element={<Login />} />

          <Route path='/usermanagement' element={<UserManagement />}></Route>
          <Route path='/personalDetails' element={<PersonalDetails />}></Route>
          <Route path='/educationDeatils' element={<EducationDeatils />}></Route>
          <Route path='/experienceDetails' element={<ExperienceDetails />}></Route>
          <Route path='/master' element={<Master />}></Route>
          <Route path='/uploaddocument' element={<UploadDocuments />}></Route>
          {/* Role Management Module */}
          <Route path='/rolemaster' element={<RoleMaster />}></Route>
          
              <Route path='/userrolemapping' element={<UserRoleMapping />}></Route>
              <Route path='/userandrolemapping' element={<UserandRoleMapping />}></Route>
              <Route path='/userroleaccess' element={<UserRoleAccess />}></Route>

              {/* Employee Management Module */}
              <Route path='/designationMaster' element={<DesignationMaster />}></Route>
              <Route path='/documentTypeMaster' element={<DocumentTypeMaster />}></Route>
              <Route path="/DepartmentMaster" element={<DepartmentMaster />} />
              <Route path="/EmployeeRoleMaster" element={<EmployeeRoleMaster />} />
              <Route path='/skillMaster' element={<SkillMaster />}></Route>
              <Route path='/employeedetails' element={<EmployeeDetails />}></Route>
              <Route path='/transactionMaster' element={<TransactionMaster />}></Route>

              {/* User Management Module */}
              <Route path='/Profile' element={<Profile />}></Route>
              <Route path='/changepassword' element={<ChangePassword />}></Route>

              
              {/* Leave Management Module */}
            
              <Route path='/HolidayMaster' element={<HolidayMaster />}></Route>
              <Route path='/LeaveTypeMaster' element={<LeaveTypeMaster />}></Route>
              <Route path='/LeaveApprovalMaster' element={<LeaveApprovalMaster />}></Route>
              <Route path='/leaveRequest' element={<LeaveRequest />}></Route>
              <Route path='/ViewLeaveApproval' element={<ViewLeaveApproval />}></Route>
              <Route path='/leaveOnBehalf' element={<LeaveOnBehalf />}></Route>
              <Route path='/leaveBalanceReport' element={<LeaveBalanceReport />}></Route>
              <Route path='/leaveAppliedReport' element={<LeaveAppliedReport />}></Route>

              {/* CV Generation Module */}
              <Route path='/templatemaster' element={<TemplateMaster />}></Route>
              <Route path='/Objectivemaster' element={<ObjectiveMaster />}></Route>
              <Route path='/clientmaster' element={<ClientMaster />}></Route>
              <Route path='/createCV' element={<CreateCV />}></Route>
              <Route path='/generatedCV' element={<GeneratedCV />}></Route>
              <Route path='/ViewDetailsList' element={<ViewDetailsList />}></Route>
              <Route path='/CvPdfList' element={<CvPdfList />}></Route>
              <Route path='/SavePdf' element={<SavePdf />}></Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}


