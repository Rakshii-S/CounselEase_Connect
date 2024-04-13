import { Link, useNavigate} from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { AiOutlineCalendar } from "react-icons/ai";
import Tooltip from '@mui/material/Tooltip';
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { useGetRecentSchedule, useGetSchedulebyId } from "../../../@/lib/react_query/queryNmutation";
import { useUserContext } from "../../../context/AuthContext";

function ViewSchedule() {
    //hook and context
    const {user} = useUserContext();
    const navigate = useNavigate();
    
    //tanstack and appwrite 
    const {data: counsellorID} = useGetSchedulebyId(user.accountid || '');

    let daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let timeSlots = [
        '09:00-09:50', '09:55-10:45', '10:50-11:40', '11:45-12:35',
        '12:40-01:25', '01:30-02:20', '02:25-03:15', '03:20-04:10'
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
        if (dbCellsString !== cellsString && counsellorID?.counsellorid == user.accountid) {
            setCells(dbCells); // Update state with dbCells if it's different
        }
    }, [counsellorID, daysOfWeek, timeSlots]); // Removed cells from dependencies

    return (
        <div className="flex flex-wrap lg:flex-row lg:flex-wrap md:flex-row md:flex-wrap flex-col flex-1 gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
            <div className='h3-bold md:h3-bold text-left w-full'>
                <p>Schedule</p>
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