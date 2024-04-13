// src/PositiveAffirmationGenerator.js
import { useState } from 'react';
export default function Positive() {
  const affirmations = [
    "I am worthy of love and respect.",
    "I am capable of achieving my goals.",
    "I am grateful for the opportunities life presents to me.",
    "I believe in myself and my abilities.",
    "I radiate positivity and attract good things into my life.",
    "I am surrounded by love and support.",
    "I am enough just as I am.",
    "I choose to focus on the present moment and let go of worries about the future.",
    "I am in control of my thoughts and emotions.",
    "I deserve to take care of myself and prioritize my well-being.",
  ];

  const [affirmation, setAffirmation] = useState("");

  const generateAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setAffirmation(affirmations[randomIndex]);
  };

  return (
    <div className='common-container'>
      <h1 className='bg-gray-900 w-full h-14 rounded-lg text-center pt-4 text-lg'>Positive Affirmation Generator</h1>
      <button className="bg-sky-800 p-4 rounded-xl w-56 h-18" onClick={generateAffirmation}>Generate Affirmation</button>
      {affirmation && <div className='bg-sky-300 w-full h-20 p-20 rounded-lg text-black pt-10 text-lg'>{affirmation}</div>}
    </div>
  );
}
