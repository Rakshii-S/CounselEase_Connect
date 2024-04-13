import { useNavigate } from "react-router-dom"
import { Button } from "../../../@/components/ui/button"
import { useUserContext } from "../../../context/AuthContext"

function Appointments() {
    const navigate = useNavigate()
    const {user} = useUserContext()
  return (
    <div className="common-container">
        <Button onClick={()=>navigate('/book-appointment')} className="flex flex-row justify-between bg-gray-900 w-full h-56 text-xl rounded-2xl hover:bg-gray-800">
            <img
            src={`/assets/file.png`}
            className='m-10'
            />
            <p className="m-4 md:m-24 text-base">Book an appointment</p>
        </Button>
        <Button onClick={()=>navigate(`/your-appointments/${user.accountid}`)} className="flex flex-row justify-between bg-gray-900 w-full h-56 text-xl rounded-2xl  hover:bg-gray-800">
        <img
            src={`/assets/appointments.png`}
            className='m-10'
            />
            <p className="m-4 md:m-24 text-base">View your appointments</p>
        </Button>
    </div>
  )
}

export default Appointments