import { Link} from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { AiOutlineCalendar } from "react-icons/ai";
import Tooltip from '@mui/material/Tooltip';
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { useAddSchedule, useGetSchedulebyId, useUpdateSchedule } from "../../../@/lib/react_query/queryNmutation";
import { useUserContext } from "../../../context/AuthContext";
import Loader from "../shared/Loader";

function Schedule() {
    //context 
    const {user} = useUserContext();
    const [view,setView] = useState(false)
    const [newSchedule, setNewSchedule] = useState(false);

    //date and day functions
    let date0 = new Date();
    date0.getDate();
    let day0 = date0.getDay()
    let dates:any[] = []
    if(day0 == 0)//sunday
        day0=1

    //tanstack and appwrite 
    const {mutateAsync: AddSchedule, isPending: addUser} = useAddSchedule();
    const {data: counsellorID} = useGetSchedulebyId(user.accountid || '');
    const {mutateAsync: updateSchedule, isPending: isLoadingUpdate} = useUpdateSchedule();

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

    const defaultCells = daysOfWeek.map(day =>
        timeSlots.map(time => ({ day, time, option: 'Available', color: 'lightblue', editing: false }))
      );
    
    //add to appwrite
      async function handleAddtoDB() {
        let status: string[] =[]
        let dt: string[] = []
        for(let i=0;i<6;i++)
            {
                for(let j=0;j<8;j++)
                    {
                        if(i+1 >= day0)
                        {
                            let date = new Date();
                            date.setDate(date.getDate() + i-1);
                            let date_0 = date.toISOString().split('T')[0]
                            dt.push(date_0)
                            status.push(cells[i][j].option)
                        }
                        else
                        {
                            dt.push("null")
                            status.push("null")
                        }
                    }
            }
            const val = await AddSchedule({
                counsellorid: user.accountid,
                days: daysOfWeek,
                timeslot: timeSlots,
                status: status,
                dates: dates
            })
            console.log(val)
    }
    //update 
    async function handleUpdatetoDB() {
        let status: string[] =[]
        let dt: string[] = []
        for(let i=0;i<6;i++)
            {
                for(let j=0;j<8;j++)
                    {
                        if(i+1 >= day0)
                        {
                            let date = new Date();
                            date.setDate(date.getDate() + i-1);
                            let date_0 = date.toISOString().split('T')[0]
                            dt.push(date_0)
                            status.push(cells[i][j].option)
                        }
                        else
                        {
                            dt.push("null")
                            status.push("null")
                        }
                    }
            }
            const val = await updateSchedule({
                counsellorid: user.accountid,
                days: daysOfWeek,
                timeslot: timeSlots,
                status: status,
                dates: dates
            })
            console.log(val)
    }

    //retrieve the schedule data from the database
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

    const handleEditClick = (day: string, time: string) => {
        const updatedCells = cells.map(row =>
            row.map(cell =>
                cell.day === day && cell.time === time
                    ? { ...cell, editing: true }
                    : cell
            )
        );
        setCells(updatedCells);
    };

    const handleOptionClick = (day: string, time: string, option: string) => {
        const updatedCells = cells.map(row =>
            row.map(cell =>
                cell.day === day && cell.time === time
                    ? { ...cell, option, color: option === 'Available' ? 'lightblue' : 'lightcoral', editing: false }
                    : cell
            )
        );
        setCells(updatedCells);
    };

    const handleReset = () => {
        setCells(defaultCells);
    };

    const handleView = () => {
        if(counsellorID?.counsellorid )
        {
            setCells(dbCells);
        }else
        {
            setView(true)
        }
    };

    return (
        <div className="flex flex-wrap lg:flex-row lg:flex-wrap md:flex-row md:flex-wrap flex-col flex-1 gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
            <div className='bg-gray-900 w-full h-14 text-2xl rounded-2xl p-8 pl-10 pr-10 flex flex-row justify-center items-center'>
                <Tooltip title="Go Back">
                    <Link to="/view-schedule" className="mr-auto"><GoArrowLeft /></Link>
                </Tooltip>
                <p className="schedule-heading">My Schedule</p>
                <div className="mr-auto"></div> {/* Spacer */}
                <AiOutlineCalendar />
            </div>
            {view == true? 
            (
                <>
                    <div className='bg-gray-900 w-full h-56 text-2xl rounded-2xl  flex flex-row justify-center items-center'>
                        <p className="schedule-heading">No schedules updated yet.</p>
                    </div>
                    <button onClick={()=> {setNewSchedule(true)}} className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-56 h-14">
                                Add new schedule
                    </button>
                </>
            ):(
            <div>
                <div>
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
                                            {cell.editing ? (
                                                <>
                                                    <button onClick={() => handleOptionClick(cell.day, cell.time, 'Available')} className={`${cell.option == "Available" && 'bg-sky-100 p-2 rounded-xl'} m-2`}>Available</button>
                                                    <button onClick={() => handleOptionClick(cell.day, cell.time, 'Unavailable')} className={`${cell.option == "Unavailable" && 'bg-sky-100 p-2 rounded-xl'} m-2`}>Unavailable</button>
                                                </>
                                            ) : (
                                                <> 
                                                {cell.option}
                                                    <EditIcon onClick={() => handleEditClick(cell.day, cell.time)} />
                                                </>
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex flex-row justify-between mt-10">
                        <button onClick={handleView} className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-56 h-14">
                            View
                        </button>
                        <button onClick={handleReset} className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-56 h-14">
                                Reset
                        </button>
                        <button onClick={handleUpdatetoDB} className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-56 h-14">
                            {isLoadingUpdate ?
                            (
                                <div className="pl-20"><Loader/></div>
                            ):
                             "Update"}
                        </button>
                    </div>
                </div>
            </div>)}
            {newSchedule ? 
            (
                <div>
                <div>
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
                                            {cell.editing ? (
                                                <>
                                                    <button onClick={() => handleOptionClick(cell.day, cell.time, 'Available')} className={`${cell.option == "Available" && 'bg-sky-100 p-2 rounded-xl'} m-2`}>Available</button>
                                                    <button onClick={() => handleOptionClick(cell.day, cell.time, 'Unavailable')} className={`${cell.option == "Unavailable" && 'bg-sky-100 p-2 rounded-xl'} m-2`}>Unavailable</button>
                                                </>
                                            ) : (
                                                <> 
                                                {cell.option}
                                                    <EditIcon onClick={() => handleEditClick(cell.day, cell.time)} />
                                                </>
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex flex-row justify-between mt-10">
                        <button onClick={handleReset} className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-56 h-14">
                                Reset
                        </button>
                        <button onClick={handleAddtoDB} className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-56 h-14">
                        {addUser ?
                            (
                                <div className="pl-20"><Loader/></div>
                            ):
                             "Upload Schedule"}
                        </button>
                    </div>
                </div>
            </div>
            ):(
                <></>
            )}
        </div >
    );
}

export default Schedule;





