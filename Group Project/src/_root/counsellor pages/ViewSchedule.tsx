import { Link, useNavigate} from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { AiOutlineCalendar } from "react-icons/ai";
import Tooltip from '@mui/material/Tooltip';
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { useGetSchedulebyId } from "../../../@/lib/react_query/queryNmutation";
import { useUserContext } from "../../../context/AuthContext";

function ViewSchedule() {
    //hook and context
    const {user} = useUserContext();
    const navigate = useNavigate();
    
    //tanstack and appwrite 
    const {data: counsellorID} = useGetSchedulebyId(user.accountid || '');

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
                const index = rowIndex * row.length + colIndex; // Calculate the index based on the row and column index
                const option = counsellorID?.status[index % counsellorID?.status.length]; // Use modulo operator to loop through the options array
    
                return {
                    ...cell,
                    option,
                    color: option === 'Available' ? 'lightblue' : option === 'null' ? 'grey' : 'lightcoral',
                    editing: false
                };
            })
        );
        if(counsellorID?.counsellorid == user.accountid)
        {
            setCells(dbCells); // Update state with the new cells
        }else{
            console.log("hi")
        }
    }, [counsellorID, daysOfWeek, timeSlots, cells]); // Add dependencies if needed

    return (
        <div className="flex flex-wrap lg:flex-row lg:flex-wrap md:flex-row md:flex-wrap flex-col flex-1 gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
            <div className='bg-gray-900 w-full h-14 text-2xl rounded-2xl p-8 pl-10 pr-10 flex flex-row justify-center items-center'>
                <Tooltip title="Go Back">
                    <Link to="/" className="mr-auto"><GoArrowLeft /></Link>
                </Tooltip>
                <p className="schedule-heading">Schedule</p>
                <div className="mr-auto"></div> {/* Spacer */}
                <AiOutlineCalendar />
            </div>
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
                    <div className="flex flex-row justify-between mt-10">
                        <button onClick={()=> navigate(`/schedule`)} className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-56 h-14">
                                Update
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default ViewSchedule