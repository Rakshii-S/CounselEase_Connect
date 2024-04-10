import { useParams } from "react-router-dom";
import { useGetCounsellorByIdC, useGetCounsellorByIdU, useGetCurrentUserCollection, useGetRecentAppointments, useGetRecentCounsellorC } from "../../../@/lib/react_query/queryNmutation";
import Loader from "../shared/Loader";
import { Models } from "appwrite";
import { useUserContext } from "../../../context/AuthContext";
import { useState } from "react";

function YourAppointments() {
    const {user} = useUserContext();
    const {id} = useParams();
    const {data:appointments, isPending : isLoading} = useGetRecentAppointments();
    const {data: currentUser} = useGetCurrentUserCollection(id || '', user.role);
    const {data:usersC} = useGetRecentCounsellorC();

  return (
    <>
        {isLoading?
        (
            <Loader/>
        ):
        (
            <>
                <div className="flex flex-col flex-1 items-center overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
                    <div className="text-lg p-6">
                        Appointments
                    </div>
                    {(appointments?.documents || []).map((appointment: Models.Document, index: number) => (
                    <div key={appointment.id}>
                      {usersC?.documents && index < usersC.documents.length && (
                            <div className="flex flex-row justify-around bg-gray-900 w-auto h-16 text-xl rounded-lg pt-2 m-4">
                            {id == appointment.studentid?(
                                <>
                                    <div className="m-4 ml-6 text-white text-sm">
                                        {index+1}{" )"}
                                    </div>
                                    <div className="flex flex-row">
                                        <img
                                            src="/assets/circular-clock.png"
                                            className="m-2 ml-6 invert-white w-10 h-10"
                                        />
                                        <p className="ml-2 mt-4 text-sm">{appointment.timeslot}</p>
                                    </div>
                                    <div className="flex flex-row">
                                        <img
                                            src="/assets/calendar.png"
                                            className="m-2 ml-6 invert-white w-10 h-10"
                                        />
                                        <p className="ml-2 mt-4 text-sm">{appointment.date}</p>
                                    </div>
                                    <div className="flex flex-row">
                                        <img
                                            src={currentUser?.imageUrl||"/assets/user.png"}
                                            className="m-2 ml-6 w-10 h-10 rounded-full"
                                        />
                                        <p className="ml-2 mt-4 text-sm">{currentUser?.username}</p>
                                    </div>
                                    {appointment.counsellorid == usersC.documents[index].$id? 
                                    (
                                        <div className="flex flex-row">
                                        <img
                                            src={usersC.documents[index].imageUrl||"/assets/user.png"}
                                            className="m-2 ml-6 w-10 h-10 rounded-full"
                                        />
                                        <p className="ml-2 mt-4 mr-6 text-sm">{usersC.documents[index].username}</p>
                                    </div>
                                    ):(
                                        <></>
                                    )}
                                </>
                            ):
                            (
                                <></>
                            )}
                            </div>
                            )}
                    </div>
                    ))} 
                </div>
            </>
        )}
    </>
  )
}

export default YourAppointments