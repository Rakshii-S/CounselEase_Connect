import { useNavigate } from "react-router-dom"
import { Button } from "../../../@/components/ui/button"

function ActivityLayout() {
  const navigate = useNavigate()
  return (
    <div className="common-container">
        <Button onClick={()=>navigate('/to-do')} className="flex flex-row justify-around bg-gray-900 w-full h-20 rounded-lg text-center pt-4 text-lg">
            <img
                src="/assets/check.png"
                alt="to-do"
                className="w-14 h-14 ml-20"/>
            <p className="mr-20">To Do list</p>
        </Button>
        <Button onClick={()=>navigate('/meditation-timer')} className="flex flex-row justify-around bg-gray-900 w-full h-20 rounded-lg text-center pt-4 text-lg">
            <img
                src="/assets/meditation.png"
                alt="meditation"
                className="w-14 h-14 ml-20"/>
            <p className="mr-20">Mindfulness Meditation Timer</p>
        </Button>
        <Button onClick={()=>navigate('/positive-affirmation')} className="flex flex-row justify-around bg-gray-900 w-full h-20 rounded-lg text-center pt-4 text-lg">
            <img
                src="/assets/yes.png"
                alt="positive"
                className="w-14 h-14 ml-20"/>
            <p className="mr-20">Positive Affirmation Generator</p>
        </Button>
        <Button onClick={()=>navigate('/mindfull-breathing')} className="flex flex-row justify-around bg-gray-900 w-full h-20 rounded-lg text-center pt-4 text-lg">
            <img
                src="/assets/breathing.png"
                alt="breathing"
                className="w-14 h-14 ml-20"/>
            <p className="mr-20">Mindful Breathing</p>
        </Button>
    </div>
  )
}

export default ActivityLayout