import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { RiSearchLine } from "react-icons/ri"; // Importing search icon
import { AiOutlinePlus } from "react-icons/ai"; // Importing Add icon
import Tooltip from '@mui/material/Tooltip';
import { BsPlus } from "react-icons/bs"; // Importing plus icon
import jsPDF from 'jspdf';

interface Student {
    tokenNo: string;
    studentName: string;
    registerNumber: string;
}

interface DateTimeEntry {
    date: string;
    from: string;
    to: string;
}

function Report() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
    const [isNewFormVisible, setIsNewFormVisible] = useState<boolean>(false);

    const [tokenNo, setTokenNo] = useState<string>("");
    const [studentName, setStudentName] = useState<string>("");
    const [registerNumber, setRegisterNumber] = useState<string>("");
    const [students, setStudents] = useState<Student[]>([]);
    const [isBoxVisible, setIsBoxVisible] = useState<boolean>(false);
    const [dateTimeEntries, setDateTimeEntries] = useState<DateTimeEntry[]>([{ date: "---", from: "---", to: "---" }]);
    const [newDate, setNewDate] = useState<string>("");
    const [newFrom, setNewFrom] = useState<string>("");
    const [newTo, setNewTo] = useState<string>("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Perform search functionality with searchQuery
    };

    const handleAddClick = () => {
        setIsFormVisible(true);
    };

    const handleBsClick = () => {
        setIsNewFormVisible(true);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Perform form submission logic
        const newStudent: Student = {
            tokenNo: tokenNo,
            studentName: studentName,
            registerNumber: registerNumber
        };
        setStudents([...students, newStudent]);
        // Reset form fields
        setTokenNo("");
        setStudentName("");
        setRegisterNumber("");
        setIsFormVisible(false);
    };

    const handleStudentClick = (student: Student) => {
        setStudentName(student.studentName);
        setRegisterNumber(student.registerNumber);
        setIsBoxVisible(true);
    };

    const handleBoxSubmit = () => {
        setIsBoxVisible(false);
    };

    const handleNewFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Update date, from, and to with new values
        setDateTimeEntries([...dateTimeEntries, { date: newDate, from: newFrom, to: newTo }]);
        // Clear new date and time inputs
        setNewDate("");
        setNewFrom("");
        setNewTo("");
        // Hide the new form
        setIsNewFormVisible(false);
    };

    const handleGeneratePDF = () => {
        const doc = new jsPDF();
        // Add content to the PDF document
        dateTimeEntries.forEach((entry, index) => {
            const yOffset = index * 60; // Adjust the y position for each entry
            doc.text(`Student Name: ${studentName}`, 10, 10 + yOffset);
            doc.text(`Register Number: ${registerNumber}`, 10, 20 + yOffset);
            doc.text(`Date: ${entry.date}`, 10, 30 + yOffset);
            doc.text(`From: ${entry.from}`, 10, 40 + yOffset);
            doc.text(`To: ${entry.to}`, 10, 50 + yOffset);
        });
        // Save the PDF
        doc.save('student_details.pdf');
    };

    return (
        <div className="flex flex-col lg:flex-row lg:flex-wrap flex-1 gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
            <div className='bg-gray-900 w-full h-24 text-2xl rounded-2xl p-8 pl-10 pr-10 flex flex-row justify-center items-center'>
                <Tooltip title="Go Back">
                    <Link to="/counsellor" className="mr-auto"><GoArrowLeft /></Link>
                </Tooltip>
                <p className="schedule-heading">Sessions</p>
                <div className="mr-auto"></div> {/* Spacer */}
            </div>

            {/* Search bar and Add icon div */}
            <div className="flex flex-col justify-start items-start bg-gray-900 h-full rounded-lg p-4 lg:w-full">
                <div>
                    <form onSubmit={handleSearchSubmit} className="flex items-center">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search..."
                            className="text-white bg-transparent border-none focus:outline-none"
                        />
                        <button type="submit" className="text-white">
                            <RiSearchLine className="text-xl" />
                        </button>
                    </form>
                </div>
                <div className="ml-auto">
                    <AiOutlinePlus className=" text-white text-xl cursor-pointer" onClick={handleAddClick} />
                </div>
                {/* Table-like format */}
                <table className="w-full text-white mt-4">
                    <thead>
                        <tr>
                            <th>Token No</th>
                            <th>Student Name</th>
                            <th>Register Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={index} onClick={() => handleStudentClick(student)}>
                                <td className="text-center">{student.tokenNo}</td>
                                <td className="text-center">{student.studentName}</td>
                                <td className="text-center">{student.registerNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Small box */}
            {isBoxVisible && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 shadow-lg shadow-slate-700">
                    <div className="bg-grey p-6 rounded-lg">
                        <div className="flex justify-end">
                            <BsPlus className="text-white text-xl cursor-pointer" onClick={handleBsClick} />
                        </div>
                        <h2 className="text-xl mb-4">Student Details</h2>
                        {/* Table-like format for student details */}
                        <table className="w-full text-white mt-4">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Register Number</th>
                                    <th>Date</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th> </th>
                                </tr>
                            </thead>
                            <tbody>
                                {dateTimeEntries.map((entry, index) => (
                                    <tr key={index}>
                                        <td>{studentName}</td>
                                        <td>{registerNumber}</td>
                                        <td>{entry.date}</td>
                                        <td>{entry.from}</td>
                                        <td>{entry.to}</td>
                                        <td>
                                            <button onClick={handleGeneratePDF} className="bg-green-300 text-black px-4 py-2 ml-2 rounded-md">Generate</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={handleBoxSubmit} className="bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 mt-4 rounded-md">Submit</button>
                    </div>
                </div>
            )}
            {/* Form */}
            {isFormVisible && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black rounded-lg p-6 shadow-md">
                    <h2 className="text-xl mb-4">Add Student</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="tokenNo">Token No:</label>
                            <input type="text" id="tokenNo" value={tokenNo} onChange={(e) => setTokenNo(e.target.value)} className="ml-2 text-black" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="studentName">Student Name:</label>
                            <input type="text" id="studentName" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="ml-2 text-black" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="registerNumber">Register Number:</label>
                            <input type="text" id="registerNumber" value={registerNumber} onChange={(e) => setRegisterNumber(e.target.value)} className="ml-2 text-black" />
                        </div>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded-md">Submit</button>
                    </form>
                </div>
            )}

            {/* Adding Date and Time */}
            {isNewFormVisible && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black rounded-lg p-6 shadow-md">
                        <h2 className="text-xl mb-4">Edit Schedule</h2>
                        <form onSubmit={handleNewFormSubmit}>
                            <div className="mb-4">
                                <label htmlFor="newDate">Date:</label>
                                <input
                                    type="text"
                                    id="newDate"
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                    className="ml-2 text-black"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="newFrom">From:</label>
                                <input
                                    type="text"
                                    id="newFrom"
                                    value={newFrom}
                                    onChange={(e) => setNewFrom(e.target.value)}
                                    className="ml-2 text-black"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="newTo">To:</label>
                                <input
                                    type="text"
                                    id="newTo"
                                    value={newTo}
                                    onChange={(e) => setNewTo(e.target.value)}
                                    className="ml-2 text-black"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded-md"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default  Report
