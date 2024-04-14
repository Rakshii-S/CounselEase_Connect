import { useParams } from "react-router-dom";
import { useGetCurrentUserCollection, useGetRecentAppointments, useGetRecentCounsellorC } from "../../../@/lib/react_query/queryNmutation";
import Loader from "../shared/Loader";
import { Models } from "appwrite";
import { useUserContext } from "../../../context/AuthContext";
import { Button } from "../../../@/components/ui/button";
import { deleteAppointment, getScheduleById, updateScheduleStatus } from "../../../@/lib/appwrite/api";

function YourAppointments() {
    let Did: any
    let timeSlots = [
        '09:00-09:50', '09:55-10:45', '10:50-11:40', '11:45-12:35',
        '12:40-01:25', '01:30-02:20', '02:25-03:15', '03:20-04:10'
    ];
    let Status: string[] = []
    let booked = 0
    let finalBooked = 0
    let noAppointments = 0
    const {user} = useUserContext();
    const {id} = useParams();
    const {data:appointments, isPending : isLoading} = useGetRecentAppointments();
    const {data: currentUser} = useGetCurrentUserCollection(id || '', user.role);
    const {data:usersC} = useGetRecentCounsellorC();

    async function CancelAppointment(time: string, date: any, $id: string)
    {
        const counsellorID = await getScheduleById($id)
        const getDay = new Date(date);
        const Dayy = getDay.getDay()
        for(let i=0 ;i<8;i++)
            {
              if(time == timeSlots[i])   
                booked = i
            }
            if(counsellorID?.days[Dayy-1] == "Monday")
            {
              finalBooked = booked+0;
            }
            if(counsellorID?.days[Dayy-1] == "Tuesday")
            {
              finalBooked = booked+8;
            }
            if(counsellorID?.days[Dayy-1] == "Wednesday")
            {
              finalBooked = booked+16;
            }
            if(counsellorID?.days[Dayy-1] == "Thursday")
            {
              finalBooked = booked+24;
            }
            if(counsellorID?.days[Dayy-1] == "Friday")
            {
              finalBooked = booked+32;
            }
            if(counsellorID?.days[Dayy-1] == "Saturday")
            {
              finalBooked = booked+40;
            }
    
            //setting the value to booked
            for(let i =0; i<48;i++)
            {
                if(i == finalBooked)
                  Status.push("Unavailable")
                else
                  Status.push(counsellorID?.status[i])
            }
        //update schedule 
        await updateScheduleStatus($id,Status)

        //delete appointment document from appointmenet collection
        for(let i =0 ;i< Number(appointments?.documents.length); i++)
            {
                if(appointments?.documents[i].studentid == user.accountid && appointments?.documents[i].counsellorid == $id)
                {
                    Did = appointments?.documents[i].$id 
                }
            }
        deleteAppointment(Did)
        window.location.reload
    } 


  return (
    <>
        {isLoading?
        (
            <Loader/>
        ):
        (
                <div className="flex flex-col flex-1 items-center overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
                    <div className="text-lg p-6 bg-gray-900 w-full rounded-xl text-center">
                            Appointments
                        </div>
                    {(appointments?.documents || []).map((appointment: Models.Document) => (
                    <div key={appointment.id}>
                    <div className="flex flex-row flex-1 items-center py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
                    {id === appointment.studentid ? (
                        <>
                            <p className="m-2 mt-4 text-sm">{noAppointments = noAppointments+1}{")"} </p>
                            <div className="flex flex-row justify-around">
                                    <img
                                        src="/assets/circular-clock.png"
                                        className="m-4 mt-6 ml-6 invert-white w-6 h-6"
                                    />
                                <p className="ml-2 mt-4 text-sm">{appointment.timeslot}</p>
                            </div>
                            <div className="flex flex-row justify-around">
                                <img
                                    src="/assets/calendar.png"
                                    className="m-4 mt-6 ml-10 invert-white w-6 h-6"
                                />
                                <p className="ml-2 mt-4 text-sm">{appointment.date}</p>
                            </div>
                        <div>
                            {usersC?.documents.map((counsellor:Models.Document) =>
                            <>
                                {counsellor.accountid == appointment.counsellorid ? 
                                (
                                    <>
                                    <div className="flex flex-row justify-around">
                                    <div className="flex flex-row">
                                                <img
                                                    src={counsellor.imageUrl || "/assets/user.png"}
                                                    className="m-4 mt-10 ml-10 w-8 h-8 rounded-full" />
                                                <p className="mt-10 mr-2 text-sm">{counsellor.username}</p>
                                    </div>
                                    <Button onClick={() => {CancelAppointment(appointment.timeslot,appointment.date,counsellor.$id)}}
                                        className="bg-sky-800 text-sm m-10 p-2 mb-10 rounded-xl w-16 h-10">
                                            Cancel
                                    </Button>
                                    </div>
                                    </>
                                ):
                                (
                                    <></>
                                )}
                            </>
                            )}
                        </div>
                        </>
                    ) : (
                    <>
                    </>
                    )}
                        </div>
                    </div>
                ))} 
                {noAppointments == 0?
                (
                    <>
                        <div className='bg-gray-900 w-full h-56 text-lg rounded-2xl mt-20 flex flex-row justify-center items-center'>
                        <p className="schedule-heading">No appointments booked yet.</p>
                        </div>
                    </>
                ):(
                    <></>
                )}
                </div>
        )}
    </>
  )
}

export default YourAppointments