import { useNavigate, useParams } from "react-router-dom";
import { useGetAppointmentbyId, useGetCounsellorByIdC, useGetCounsellorByIdU, useGetCurrentUserCollection, useGetRecentAppointments, useGetRecentCounsellorC, useGetRecentStudents, useGetSchedulebyId, useGetUser } from "../../../@/lib/react_query/queryNmutation";
import Loader from "../shared/Loader";
import { Models } from "appwrite";
import { useUserContext } from "../../../context/AuthContext";
import { useState } from "react";
import { Button } from "@mui/material";

function CAppointmentView() {
    const {user} = useUserContext();
    const navigate = useNavigate()

    const {data: appointment} = useGetAppointmentbyId(user.accountid || '');
    const {data: userU} = useGetCounsellorByIdU(user.accountid || '');
    const {data: userC} = useGetCounsellorByIdC(user.accountid || '');
    const {data: students} = useGetUser()
    const {data: currentUser, isLoading} = useGetCurrentUserCollection(appointment?.studentid || '',"student");
    
  return (
    <>
        {isLoading?
        (
            <div className="flex flex-col flex-1 justify-center">
                 <Loader/>
            </div>
        ):
        (
            <>
                <div className="common-container">
                    <div className="flex flex-col justify-around bg-gray-900 h-64 text-xl w-full rounded-lg  m-4">
                    <div className="flex flex-row">
                        <img
                            src={userC?.imageUrl ||"/assets/circular-clock.png"}
                            className="m-2 ml-4 mt-4 rounded-full w-10 h-10"
                        />
                        <p className="ml-2 mt-6 text-sm"><b>Counsellor email: </b></p>
                        <p className="ml-2 mt-6 text-sm">{userU?.email}</p>
                    </div>
                    <div className="flex flex-row">
                        <img
                            src={currentUser?.imageUrl ||"/assets/circular-clock.png"}
                            className="m-2 ml-4 mt-4 rounded-full w-10 h-10"
                        />
                        <p className="ml-2 mt-6 text-sm"><b>Student email: </b></p>
                        {students?.documents.map((student)=>
                        <>
                            {student?.accountid === appointment?.studentid ? 
                                (
                                    <p className="ml-2 mt-6 text-sm">{student?.email}</p>
                                ):(
                                    <></>
                                )
                            }
                        </>
                        )}
                    </div>
                    <div className="flex flex-row">
                        <img
                            src="/assets/circular-clock.png"
                            className="m-2 ml-4 mt-4 invert-white w-10 h-10"
                        />
                        <p className="ml-2 mt-6 text-sm"><b>Time Slot: </b></p>
                        <p className="ml-2 mt-6 text-sm">{appointment?.timeslot}</p>
                    </div>
                    <div className="flex flex-row">
                        <img
                            src="/assets/calendar.png"
                            className="m-2 ml-4 mt-4 invert-white w-10 h-10"
                        />
                        <p className="ml-2 mt-6 text-sm"><b>Date: </b></p>
                        <p className="ml-2 mt-6 text-sm">{appointment?.date}</p>
                    </div>
                    
                    <div className="flex flex-row justify-between mt-6">
                        <button
                            className="bg-sky-800 text-sm m-2 p-2 mb-10 rounded-xl w-48 h-10">
                            Cancel appointment
                        </button>
                        <button 
                            onClick={()=>navigate(`/counsellor-appointments`)}
                            className="bg-sky-800 text-sm m-2 p-2 mb-10 rounded-xl w-48 h-10">
                            Go Back
                        </button>
                    </div>
                    </div>
                </div>
            </>
        )}
    </>
  )
}

export default CAppointmentView
