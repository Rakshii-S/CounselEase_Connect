import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../@/components/ui/button';
import { useAddSummary, useGetRecentSummary, useGetStudent, useGetUser } from '../../../@/lib/react_query/queryNmutation';
import { useUserContext } from '../../../context/AuthContext';
import { getSummary } from '../../../@/lib/appwrite/api';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../@/components/ui/form';
import { Input } from '../../../@/components/ui/input';
import { useForm } from 'react-hook-form';
import Loader from '../shared/Loader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../@/components/ui/select';
import { Models } from 'appwrite';
import { v4 } from 'uuid';


export const AddSummarytoDB = z.object({
  studentcode: z.string().min(4).max(2200),
  regno: z.string().min(4).max(3000),
  studentid: z.string().min(4).max(3000),
})

function Summary() {
  let count = 0;
  const [ card, setCard] = useState(false)
  const [code, setCode] = useState()
  const {user} = useUserContext()
  const {mutateAsync: AddSummary, isPending: summaryLoading} = useAddSummary();
  const {data:summary, isPending : isLoading} = useGetRecentSummary();
  const {data:currentuser1} = useGetUser();
  const {data:currentuser2} = useGetStudent();

  const navigate = useNavigate()

   // 1. Define your form.
   const form = useForm<z.infer<typeof AddSummarytoDB>>({
    resolver: zodResolver(AddSummarytoDB),
    defaultValues: {
      studentcode:"",
      regno:"",
      studentid:""
    },
  })

  async function onSubmit(values: z.infer<typeof AddSummarytoDB>) 
  {
    let summaryId = v4();
      const summary = await AddSummary(
        {
          ...values,
          counsellorid: user.accountid,
          summary: '',
          email: '',
          name: '',
          idd: summaryId
        }
      )
      navigate(`/view-summary/${summaryId}`)
  }

  return(
    <>
    {isLoading? 
    (
        <div className='common-container'>
            <Loader/>
        </div>
    ):
    (
      <div className='common-container'>
        <div className='bg-gray-900 w-full h-24 text-lg rounded-2xl p-8 pl-10 pr-10 flex flex-row justify-between'>
            <p>Session Summary</p>
            <Button onClick={()=>setCard(true)} className='flex flex-row'>
              <p>New</p>
              <img
              src="/assets/plus.png"
              className='ml-4 mt-[-4px] w-10 h-10'
              />
            </Button>
        </div>
        <div className='w-full'>
        {summary?.documents.map((summary,index)=>
            <div key={index}>
              {summary.counsellorid == user.accountid &&
              (
                  <>
                    
                    <div className='w-full h-14 text-sm rounded-2xl flex flex-row justify-between items-center mt-4'>
                        <p className="m-2">{count=count+1}{")"}</p>
                        <p className="m-2">{summary.regno}</p>
                        <p className="m-2">{summary.studentcode}</p>
                        {currentuser2?.documents.map((student:Models.Document)=>
                          <>
                            {summary.studentid == student.accountid && summary.counsellorid == user.accountid &&
                            (
                              <>
                                <p className="m-2">{student.username}</p>
                                <img
                                  src={student.imageUrl}
                                  className='w-10 h-10 rounded-full'/>
                                <Button onClick={()=>navigate(`/view-summary/${summary.$id}`)} className="bg-sky-800 ml-2 mt-10 p-2 mb-10 rounded-xl w-32 h-10 text-sm">
                                    Edit
                                </Button>
                              </>
                            )}
                          </>
                        )}
                    </div>
                  </>
              )}
            </div>
        )}
        </div>
        {card == true ?
        (
          <>
          <div className='md:mt-20 p-6 w-[400px] h-[400px] bg-gray-800 self-center absolute rounded-xl shadow-xl shadow-gray-600'>
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-center">

          <FormField
          control={form.control}
          name="studentid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-slate-900 m-2 p-4 mb-10 rounded-xl h-14">
                    <SelectValue placeholder="student email" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="overflow-y-auto max-h-[300px] w-[450px]">
                <>
                {(currentuser1?.documents || []).filter(currentuser1 => currentuser1.role === "student").map((currentuser1: Models.Document, index: number) => (
                    <div key={currentuser1.id}>
                      {currentuser2?.documents && index < currentuser2.documents.length && (
                        <SelectItem value={currentuser1.accountid} className="bg-slate-900 p-4 h-14">
                          <div className="flex flex-row">
                            <img 
                            src = {currentuser2.documents[index].imageUrl || `https://i.pinimg.com/474x/60/b1/e4/60b1e4f0d521cfd16e4de3e59a263470.jpg`}
                            width={30}
                            height={30}
                            className="rounded-full ml-4 mr-8"
                            />
                            <p>{currentuser1.email}</p>
                          </div>
                        </SelectItem>
                      )}
                    </div>
                ))}
                  </>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

            <FormField
                control={form.control}
                name="studentcode"
                render={({ field }) => (
                  <FormItem className='flex flex-row justify-between'>
                    <FormLabel className="m-4">Enter the student code</FormLabel>
                    <FormControl>
                      <Input type="text" className=" text-black m-2 p-4 mb-10 rounded-xl w-56 h-10" {...field}/>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="regno"
                render={({ field }) => (
                  <FormItem className='flex flex-row justify-between'>
                    <FormLabel className="m-4">Enter the register number</FormLabel>
                    <FormControl>
                      <Input type="text" className="text-black  m-2 p-4 mb-10 rounded-xl w-56 h-10" {...field}/>
                    </FormControl>
                  </FormItem>
                )}
              />
            <div className='flex flex-row justify-between ml-10 mt-[-20px] mr-10'>
                      <Button onClick={()=>setCard(false)} className="bg-sky-800 m-2 p-2 mb-10 rounded-xl w-32 h-14 text-sm">
                          Go back
                      </Button>
                      <Button type="submit" className="bg-sky-800 m-2 p-2 mb-10 rounded-xl w-32 h-14 text-sm">
                      {summaryLoading? 
                      (
                        <div>
                          <Loader/>
                        </div>
                      ):(
                        "New"
                      )}
                      </Button>
            </div>
        </form>
    </Form>
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

export default Summary