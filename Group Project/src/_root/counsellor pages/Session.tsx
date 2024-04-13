import { useNavigate } from "react-router-dom"
import { Button } from "../../../@/components/ui/button"
import { useUserContext } from "../../../context/AuthContext"

function Session() {
    const navigate = useNavigate()
    const {user} = useUserContext()
  return (
    <div className="common-container">
        <Button onClick={()=>navigate('/summary')} className="flex flex-row justify-between bg-gray-900 w-full h-56 text-xl rounded-2xl hover:bg-gray-800">
            <img
            src={`/assets/summary-2.png`}
            className='m-20'
            />
            <p className="m-56">Session Summary</p>
        </Button>
        <Button onClick={()=>navigate(`/report`)} className="flex flex-row justify-between bg-gray-900 w-full h-56 text-xl rounded-2xl  hover:bg-gray-800">
        <img
            src={`/assets/file.png`}
            className='m-20'
            />
            <p className="m-56">Session reports</p>
        </Button>
    </div>
  )
}

export default Session