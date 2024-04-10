import { Button } from '../../../@/components/ui/button'
import { useGetCounsellorByIdC, useGetCounsellorByIdU } from '../../../@/lib/react_query/queryNmutation';
import Loader from '../shared/Loader';
import { Link, useNavigate, useParams} from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { AiOutlineCalendar } from "react-icons/ai";
import Tooltip from '@mui/material/Tooltip';
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { useGetSchedulebyId } from "../../../@/lib/react_query/queryNmutation";
import { useUserContext } from '../../../context/AuthContext';
import AppointmentForm from './AppointmentForm';


function ViewAppointment() {
  //hooks and others
  const navigate = useNavigate();
  const {id} = useParams()
  let viewSchedule = false;

   //tanstack query, appwrite and context 
  const {data: userU, isPending: isUserU} = useGetCounsellorByIdU(id || '');
  const {data: userC, isPending: isUserC} = useGetCounsellorByIdC(id || '');

  const {data: counsellorID} = useGetSchedulebyId(userU?.accountid);

  let daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let timeSlots = [
      '9:00-9:50', '9:55-10:45', '10:50-11:40', '11:45-12:35',
      '12:40-1:25', '1:30-2:20', '2:25-3:15', '3:20-4:10'
  ];
  
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
  return (
    <div className="common-container">
        {isUserU && isUserC?(<Loader/>):(
          <>
            <div className='bg-gray-900 w-full h-14 text-2xl rounded-2xl p-8 pl-10 pr-10 flex flex-row justify-center items-center'>
                <p className="schedule-heading">Counsellor information</p>
                <div className="mr-auto"></div> {/* Spacer */}
                <AiOutlineCalendar />
            </div>

            <div className='bg-slate-900 w-full h-[250px]  rounded-xl  flex flex-col md:flex-col lg:flex-row p-10'>
                <img
                src={userC?.imageUrl || `https://i.pinimg.com/474x/60/b1/e4/60b1e4f0d521cfd16e4de3e59a263470.jpg`}
                alt="profile"
                className='ml-10 mr-10 w-40 rounded-full h-40'
                />
                <div className='mt-[-10px] p-4'>
                    <div className='flex flex-row text-xl'>
                    <p className='pl-10 pt-5 pr-5'>Name:</p>
                    <p className='pl-3 pt-5'>{userC?.username}</p>
                </div>
                <div className='flex flex-row text-xl'>
                    <p className='pl-10 pt-5 pr-5'>Email:</p>
                    <p className='pl-3 pt-5'>{userU?.email}</p>
                </div>
                <div className='flex flex-row text-xl'>
                    <p className='pl-10 pt-5 pr-5'>Block:</p>
                    <p className='pl-3 pt-5'>{userC?.block}</p>
                </div>
                </div>
            </div>

            {viewSchedule == true?(
                <>
                <div className='bg-gray-900 w-full h-56 pt-20 pb-20 text-2xl rounded-2xl  flex flex-row justify-center items-center'>
                    <p className="schedule-heading">No schedules updated yet.</p>
                </div>
                <Button onClick={()=>{navigate("/appointment")}} className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-56 h-18">Go Back</Button>
                </>
            ):(
                <>
                    <div>
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
            <AppointmentForm/>
            </>
            )}
        </>
        )}
    </div>
  )
}

export default ViewAppointment

