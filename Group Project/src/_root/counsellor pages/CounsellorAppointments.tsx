import { useNavigate, useParams } from "react-router-dom";
import { useGetCounsellorByIdC, useGetCounsellorByIdU, useGetCurrentUserCollection, useGetRecentAppointments, useGetRecentCounsellorC, useGetRecentStudents } from "../../../@/lib/react_query/queryNmutation";
import Loader from "../shared/Loader";
import { Models } from "appwrite";
import { useUserContext } from "../../../context/AuthContext";
import { useState } from "react";
import { Button } from "@mui/material";

function CounsellorAppointments() {
    const {user} = useUserContext();
    const navigate = useNavigate()
    const {data:appointments, isPending : isLoading} = useGetRecentAppointments();
    const {data: userU} = useGetCounsellorByIdU(user.accountid || '');
    const {data: userC} = useGetCounsellorByIdC(user.accountid || '');
    const {data:students} = useGetRecentStudents();

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
                <div className="flex flex-col flex-1 items-center overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
                    <div className="text-lg p-6">
                        Appointments
                    </div>
                    {(appointments?.documents || []).map((appointment: Models.Document, index: number) => (
                    <div key={appointment.id}>
                      {students?.documents && index < students.documents.length && (
                        <>
                            {user.accountid == appointment.counsellorid?(
                                <>
                                <button onClick={()=>navigate(`/counsellor-appointment/${appointment.$id}`)}
                                    className="flex flex-row justify-around bg-gray-900 w-full h-16 text-xl rounded-lg pt-2 m-4">
                                    <div className="m-4 ml-6 text-white text-sm">
                                        {index+1}{")"}
                                    </div>
                                    <div className="flex flex-row">
                                        <img
                                            src="/assets/circular-clock.png"
                                            className="m-2 ml-4 mt-4 invert-white w-6 h-6"
                                        />
                                        <p className="ml-2 mt-4 text-sm">{appointment.timeslot}</p>
                                    </div>
                                    <div className="flex flex-row">
                                        <img
                                            src="/assets/calendar.png"
                                            className="m-2 ml-4 mt-4 invert-white w-6 h-6"
                                        />
                                        <p className="ml-2 mt-4 text-sm">{appointment.date}</p>
                                    </div>
                                    {appointment.studentid == students.documents[index].accountid? 
                                    (
                                        <div className="flex flex-row">
                                        <img
                                            src={students.documents[index].imageUrl||"/assets/user.png"}
                                            className="m-2 ml-6 w-10 h-10 rounded-full"
                                        />
                                        <p className="ml-2 mt-4 mr-6 text-sm">{students.documents[index].username}</p>
                                    </div>
                                    ):(
                                        <></>
                                    )}
                                    <div className="flex flex-row">
                                        <img
                                            src={userC?.imageUrl||"/assets/user.png"}
                                            className="m-2 ml-4 w-10 h-10 rounded-full"
                                        />
                                        <p className="ml-2 mt-4 text-sm">{userC?.username}</p>
                                    </div>
                                </button>
                                </>
                            ):
                            (
                                <></>
                            )}
                            </>
                        )}
                    </div>
                    ))} 
                </div>
            </>
        )}
    </>
  )
}

export default CounsellorAppointments