import { Button } from '../../../@/components/ui/button'
import {  useGetCounsellorByIdC, useGetCounsellorByIdU, useGetRecentAppointments } from '../../../@/lib/react_query/queryNmutation';
import Loader from '../shared/Loader';
import { useNavigate, useParams} from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { useGetSchedulebyId } from "../../../@/lib/react_query/queryNmutation";
import { useUserContext } from '../../../context/AuthContext';
import AppointmentForm from './AppointmentForm';


function ViewAppointment() {
  //hooks and others
  const date = new Date();
  const day0 = date.getDay();
  const {user} = useUserContext()
  const navigate = useNavigate();
  const {id} = useParams()
  let viewSchedule = false;
  let Cid = false
   //tanstack query, appwrite and context 
  const {data: userU, isPending: isUserU} = useGetCounsellorByIdU(id || '');
  const {data: userC, isPending: isUserC} = useGetCounsellorByIdC(id || '');
  const {data: counsellorID} = useGetSchedulebyId(id || '');
  const {data:appointments} = useGetRecentAppointments();
  for(let i =0 ;i< Number(appointments?.documents.length); i++)
  {
     if(appointments?.documents[i].counsellorid == userC?.accountid && appointments?.documents[i].studentid == user.accountid)
        Cid = true
  }

  let daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let timeSlots = [
    '09:00-09:50', '09:55-10:45', '10:50-11:40', '11:45-12:35',
    '12:40-01:25', '01:30-02:20', '02:25-03:15', '03:20-04:10'
];
  
    //desktop view
  const [cells, setCells] = useState(() =>
    daysOfWeek.map(day =>
        timeSlots.map(time => ({ day, time, option: 'Available', color: 'lightblue', editing: false }))
    )
);

// Retrieve the schedule data from the database
useEffect(() => {
    const dbCells = cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
            const index = rowIndex * row.length + colIndex;
            const option = counsellorID?.status[index % counsellorID?.status.length];

            return {
                ...cell,
                option,
                color: option === 'Available' ? 'lightblue' : (option === 'null' ? 'grey' : (option === 'Booked' ? 'yellow' : 'lightcoral')),
                editing: false
            };
        })
    );

    // Check if dbCells is different from the current cells state
    const dbCellsString = JSON.stringify(dbCells);
    const cellsString = JSON.stringify(cells);
    if (dbCellsString !== cellsString && counsellorID?.counsellorid == userC?.accountid) {
        setCells(dbCells); // Update state with dbCells if it's different
    }
}, [counsellorID, daysOfWeek, timeSlots]); // Removed cells from dependencies

    if(counsellorID?.counsellorid != userC?.accountid)
    {
        viewSchedule=true
    }

    //mobile view
    const [cells1, setCells1] = useState(() =>
        daysOfWeek.map(day =>
            timeSlots.map(time => ({ day, time, option: 'Available', color: 'lightblue', editing: false }))
        )
    );
    
    // Retrieve the schedule data from the database
    useEffect(() => {
        const dbCells2 = cells1.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
                const index = rowIndex * row.length + colIndex;
                const option = counsellorID?.status[index % counsellorID?.status.length];
    
                return {
                    ...cell,
                    option: option === 'Available' ? 'A' : (option === 'null'? 'N' : (option === 'Booked' ? 'B' : option === 'Unavailable' ? 'UN': option)),
                    color: option === 'Available' ? 'lightblue' : (option === 'null' ? 'grey' : (option === 'Booked' ? 'yellow' : 'lightcoral')),
                    editing: false
                  };
                  
            })
        );
    
        // Check if dbCells is different from the current cells state
        const dbCellsString = JSON.stringify(dbCells2);
        const cellsString = JSON.stringify(cells1);
        if (dbCellsString !== cellsString && counsellorID?.counsellorid == userC?.accountid) {
            setCells1(dbCells2);
        }
    }, [counsellorID, daysOfWeek, timeSlots]); // Removed cells from dependencies
    
        if(counsellorID?.counsellorid != userC?.accountid)
        {
            viewSchedule=true
        }
  return (
    <div className="common-container">
        {isUserU && isUserC?(
        <div className='common-container'>
            <Loader/>
        </div>):(
          <>
        <div className='h3-bold md:h3-bold text-left w-full'>
          <p>Counsellor information</p>
        </div>
            <div className='bg-slate-900 w-full h-full  rounded-xl  flex flex-col md:flex-col lg:flex-row p-10'>
                <img
                src={userC?.imageUrl || `https://i.pinimg.com/474x/60/b1/e4/60b1e4f0d521cfd16e4de3e59a263470.jpg`}
                alt="profile"
                className='ml-10 mr-10 w-40 rounded-full h-40'
                />
                <div className='p-4 md:pt-10 md:pl-40'>
                <div className='text-xl text-center'>
                <p>{userC?.username}</p>
              </div>
              <div className='text-lg text-light-3 text-center'>
                <p className='pt-3'>{userU?.email}</p>
              </div>
              <div className='text-lg text-light-3 text-center'>
                <p className='pt-2'>{userC?.block}</p>
              </div>
                </div>
            </div>

            {viewSchedule == true?(
                <>
                <div className='w-full h-56 text-lg rounded-2xl mt-20 flex flex-row justify-center items-center'>
                        <p className="schedule-heading">No schedules updated yet.</p>
                </div>
                <Button onClick={()=>{navigate("/appointment")}} className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-56 h-18">Go Back</Button>
                </>
            ): Cid == true ?(
                <>
                <div className='w-full h-56 text-lg rounded-2xl mt-20 flex flex-row justify-center items-center'>
                        <p className="schedule-heading">You have already booked an appointment.</p>
                </div>
                <Button onClick={()=>{navigate("/appointment")}} className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-56 h-18">Go Back</Button>
                </>  
            ): day0 != 0 ?(
                <>
                <div className='hidden sm:hidden md:hidden lg:block xl:block'>
                <div >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ color: 'white' }}>Day</TableCell>
                                {timeSlots.map(slot => (
                                    <TableCell key={slot} style={{ color: 'white' }}>{slot}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cells.map(row => (
                                <TableRow key={row[0].day}>
                                    <TableCell style={{ color: 'white' }}>{row[0].day}</TableCell>
                                    {row.map(cell => (
                                        <TableCell key={`${cell.day}-${cell.time}`} style={{ backgroundColor: cell.color }}>  
                                                {cell.option}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className='lg:hidden visible text-center'>
                <div>
                    <p className="schedule-heading text-base">Available: A</p>
                    <p className="schedule-heading text-base">Unavailable: UA</p>
                    <p className="schedule-heading text-base">Booking: B</p>
                    <p className="schedule-heading text-base mb-10">Null: N</p>
                </div>
                <div >
                    <Table className='ml-56'>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ color: 'white' }}>Day</TableCell>
                                {timeSlots.map(slot => (
                                    <TableCell key={slot} style={{ color: 'white' }}>{slot}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cells1.map(row => (
                                <TableRow key={row[0].day}>
                                    <TableCell style={{ color: 'white' }}>{row[0].day}</TableCell>
                                    {row.map(cell => (
                                        <TableCell key={`${cell.day}-${cell.time}`} style={{ backgroundColor: cell.color }}>  
                                                {cell.option}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <AppointmentForm/>
            </>
            ):(
                <>
                <div className='w-full h-56 text-lg rounded-2xl mt-20 flex flex-row justify-center items-center'>
                        <p className="schedule-heading">You cannot book appointments on sunday.</p>
                </div>
                <Button onClick={()=>{navigate("/appointment")}} className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-56 h-18">Go Back</Button>
                </>  
            )}
        </>
        )}
    </div>
  )
}

export default ViewAppointment

