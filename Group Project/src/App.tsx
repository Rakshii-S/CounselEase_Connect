import './index.css'
import AddCounsellors from './_root/admin pages/AddCounsellors'
import { Route, Routes } from 'react-router-dom'

//private
import RootLayout from './_root/RootLayout'
//admin
import AdminLayout from './_root/admin pages/AdminLayout'
import AddBuddy from './_root/admin pages/AddBuddy'
import CreateGroup from './_root/admin pages/CreateGroup'
import ViewGroup from './_root/admin pages/ViewGroup'
import ViewCounsellor from './_root/admin pages/ViewCounsellor'
import ViewBuddy from './_root/admin pages/ViewBuddy'
import Group from './_root/admin pages/Group'
import Counsellor from './_root/admin pages/Counsellor'
import Buddy from './_root/admin pages/Buddy'
import CreatePost from './_root/admin pages/CreatePost'
import Home from './_root/Home'
import EditGroups from './_root/admin pages/EditGroups'
import EditCounsellor from './_root/admin pages/EditCounsellor'
import EditBuddy from './_root/admin pages/EditBuddy'
import AuthLayout from './_auth/AuthLayout'
import LoginForm from './_auth/forms/LoginForm'
import RegisterForm from './_auth/forms/RegisterForm'
import EditPost from './_root/admin pages/EditPost'
import PostDetails from './_root/admin pages/PostDetails'
import { Toast } from '../@/components/ui/toast'
import Profile from './_root/admin pages/Profile'
import EditProfile from './_root/admin pages/EditProfile'

//counsellor
import CounsellorLayout from './_root/counsellor pages/CounsellorLayout'
import MGroup from './_root/groups/MGroup'
import EditEmail_password from './_root/admin pages/EditEmail_password'
import MGroupView from './_root/groups/MGroupView'
import MCreatePost from './_root/groups/MCreatePost'
import MPostDetails from './_root/groups/MPostDetails'
import MEditPost from './_root/groups/MEditPost'
import Schedule from './_root/counsellor pages/Schedule'
import ViewSchedule from './_root/counsellor pages/ViewSchedule'

import StudentLayout from './_root/student pages/StudentLayout'
import AppointmentDisplay from './_root/student pages/AppointmentDisplay'
import ViewAppointment from './_root/student pages/ViewAppointment'

function App() {

  return (
    <main className='flex h-screen'>
      <Toast/>
        <Routes>
          {/*public routes*/}
          <Route element={<AuthLayout/>}>
            <Route path='/login' element={<LoginForm/>}/>
            <Route path='/register' element={<RegisterForm/>}/>
          </Route>

          {/*private routes*/}
          <Route element={<RootLayout/>}>
          <Route index path="/" element={<Home/>}/>

          <Route path="/counsellor" element={<Counsellor/>}/>
          <Route path="/view-counsellor/:id" element={<ViewCounsellor/>}/>

          <Route path="/buddy" element={<Buddy/>}/>
          <Route path="/view-buddy/:id" element={<ViewBuddy/>}/>

          <Route path="/profile/:id" element={<Profile/>}/>
          <Route path="/edit-profile/:id" element={<EditProfile/>}/>
          <Route path="/edit-email-password/:id" element={<EditEmail_password/>}/>

          <Route path="/mgroups" element={<MGroup/>}/>
          <Route path="/view-group/:id" element={<ViewGroup/>}/>
          <Route path="/view-Mgroup/:id" element={<MGroupView/>}/>
          <Route path="/mcreate-post/:id" element={<MCreatePost/>}/>
          <Route path="/Mpost/:id" element={<MPostDetails/>}/>
          <Route path="/Medit-post/:id" element={<MEditPost/>}/>

            {/*admin layout*/}
              <Route element={<AdminLayout/>}>
                  <Route path="/groups" element={<Group/>}/>
                  <Route path="/create-group" element={<CreateGroup/>}/>
                  <Route path="/edit-group/:id" element={<EditGroups/>}/>
                  <Route path="/add-counsellor" element={<AddCounsellors/>}/>
                  <Route path="/edit-counsellor/:id" element={<EditCounsellor/>}/>
                  <Route path="/add-buddy" element={<AddBuddy/>}/>
                  <Route path="/edit-buddy/:id" element={<EditBuddy/>}/>
                  <Route path="/create-post" element={<CreatePost/>}/>
                  <Route path="/edit-post/:id" element={<EditPost/>}/>
                  <Route path="/post/:id" element={<PostDetails/>}/>
              </Route>

              {/*counsellor layout*/}
              <Route element={<CounsellorLayout/>}>
                  <Route path="/schedule" element={<Schedule/>}/>
                  <Route path="/view-schedule" element={<ViewSchedule/>}/>
              </Route>

              {/*student layout */}
              <Route element={<StudentLayout/>}>
                  <Route path="/appointment" element={<AppointmentDisplay/>}/>
                  <Route path="/view-appointment/:id" element={<ViewAppointment/>}/>
              </Route>
          </Route>
        </Routes>
    </main>
  )
}

export default App
