import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUserContext } from "../../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel} from "../../../@/components/ui/form";
import { Button } from "../../../@/components/ui/button";
import Loader from "../shared/Loader";
import {  useAddAppointment, useGetCounsellorByIdC, useGetCounsellorByIdU,useGetCurrentUserCollection,useGetSchedulebyId, useUpdateSchedule } from "../../../@/lib/react_query/queryNmutation";
import { useForm } from "react-hook-form";
import { Select, SelectContent,  SelectItem,SelectTrigger, SelectValue } from "../../../@/components/ui/select"
import { useState } from "react";
import { Input } from "../../../@/components/ui/input";
import { updateScheduleStatus } from "../../../@/lib/appwrite/api";

//form validation by zod
export const AppointmentToDB = z.object({
    date:z.string().min(2),
    timeslot: z.string().min(8),
    scontact: z.string().min(10)
  })
  
  function AppointmentForm() 
  {
    //hooks and others
  const navigate = useNavigate();
  const {user} = useUserContext();
  const {id} = useParams()

  //tanstack query, appwrite and context 
  
  const {data: userU} = useGetCounsellorByIdU(id || '');
  const {data: userC} = useGetCounsellorByIdC(id || '');
  const {data: counsellorID} = useGetSchedulebyId(userU?.accountid);
  const {mutateAsync: AddAppointment, isPending: addUser} = useAddAppointment();

  //filter null from the dates
  const filteredDates: string[] = (counsellorID?.dates || []).filter((date: any) => date !== "null") as string[];

  //take the date from the dates formfield and store so that we can choose time slots of that particular date itself 
  let newTimeslot:string[] =[]
  let TimeSlot: string[] =[] 
  let newStatus:string[] =[]
  let Status: string[] = []
  let booked = 0
  let finalBooked = 0

  const [selectedDate, setSelectedDate] = useState("");
  const handleDateChange = (value:any) => {
    setSelectedDate(value); // Update selected date
  };

  const [selectedTime, setSelectedTime] = useState("");
  const handleTimeChange = (value:any) => {
    setSelectedTime(value); // Update selected timeslot
  };

  const getDay = new Date(selectedDate);
  const Dayy = getDay.getDay()
  if(counsellorID?.days[Dayy-1] == "Monday")
  {
      for(let i=0;i<=7;i++)
      {
            newStatus.push(counsellorID?.status[i])
      }
  }
  if(counsellorID?.days[Dayy-1] == "Tuesday")
    {
        for(let i=8;i<=15;i++)
        {
              newStatus.push(counsellorID?.status[i])
        }
    }
    if(counsellorID?.days[Dayy-1] == "Wednesday")
    {
        for(let i=16;i<=23;i++)
        {
            newStatus.push(counsellorID?.status[i])
        }
    }
    if(counsellorID?.days[Dayy-1] == "Thursday")
        {
            for(let i=24;i<=31;i++)
            {
                newStatus.push(counsellorID?.status[i])
            }
        }
    if(counsellorID?.days[Dayy-1] == "Friday")
    {
        for(let i=32;i<=39;i++)
        {
            newStatus.push(counsellorID?.status[i])
        }
    }
    if(counsellorID?.days[Dayy-1] == "Saturday")
    {
        for(let i=40;i<=47;i++)
        {
            newStatus.push(counsellorID?.status[i])
        }
    }

  for(let i=0 ;i<8;i++)
  {
    if(newStatus[i] == "Available")   
        newTimeslot.push(counsellorID?.timeslot[i])
    TimeSlot.push(counsellorID?.timeslot[i])
  }

  

  // 1. Define your form.
  const form = useForm<z.infer<typeof AppointmentToDB>>({
    resolver: zodResolver(AppointmentToDB),
    defaultValues: {
        date: "",
        timeslot: "",
        scontact:""
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AppointmentToDB>) 
  {
      for(let i=0 ;i<8;i++)
      {
        if(selectedTime == TimeSlot[i])   
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
          {
            Status.push("Booked")
          }
          Status.push(counsellorID?.status[i])
      }

      //update schedule 
      await updateScheduleStatus(userU?.accountid,Status)

      //add appointment details
      const appoin = await AddAppointment({
          ...values,
          counsellorid: userU?.accountid,
          studentid: user.accountid,
          ccontact: userC?.contact,
          semail: user.email,
      })
  }

    return (
    <>
        <div className='bg-gray-900 w-full h-14 text-2xl rounded-2xl p-8 pl-10 pr-10 flex flex-row justify-center items-center'>
                <p className="schedule-heading">Book your appointment</p>
        </div>
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-center">
    <FormField
          control={form.control}
          name="scontact"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="m-4 ml-[-2px]">Enter your contact number</FormLabel>
              <FormControl>
                <Input type="text" className="bg-slate-900 m-2 p-4 mb-4 rounded-xl h-14" {...field}/>
              </FormControl>
            </FormItem>
          )}
        />
     {(
      <>
          <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select the date</FormLabel>
              <Select onValueChange={value => { field.onChange(value); handleDateChange(value); }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-slate-900 m-2 p-4 mb-10 rounded-xl h-14">
                    <SelectValue placeholder="date" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="overflow-y-auto max-h-[300px] w-[450px]">
                        {filteredDates.map((scheduleDate:any,index:number)=>
                            <SelectItem key={index} value={scheduleDate} className="bg-slate-900 p-4 h-14">
                                {scheduleDate}
                            </SelectItem>
                        )}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeslot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select the timeslot</FormLabel>
              <Select onValueChange={value => { field.onChange(value); handleTimeChange(value); }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-slate-900 m-2 p-4 mb-4 rounded-xl h-14">
                    <SelectValue placeholder="timeslot" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="overflow-y-auto max-h-[300px] w-[450px]">
                        {newTimeslot.map((timeslot,index)=>
                            <SelectItem key={index} value={timeslot} className="bg-slate-900 p-4 h-14">
                            {timeslot}
                            </SelectItem>
                        )}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </>
     )}
       <center>
          <Button type="submit" className="bg-sky-800 m-4 p-4 mb-10 rounded-xl w-56 h-18">
            {addUser?(
              <div className="pl-20">
                <Loader/>
              </div>
            ):(
              <p>Book</p>
            )}
            </Button>
          <Button type="button" onClick={()=>navigate('/book-appointment')}  className="bg-sky-800 m-4 p-4 mb-10 rounded-xl w-56 h-18">Go back</Button>
          </center>
      </form>
      </Form>
      </>
    )
  }
  
  export default AppointmentForm