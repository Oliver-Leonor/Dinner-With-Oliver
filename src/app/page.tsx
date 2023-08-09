"use client"

import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 
import Link from 'next/link'

export default function Home() {
  const [formData, setFormData] = useState({
    reservation_datetime: new Date(),
    reservation_first_name: '',
    reservation_last_name: '',
    phone_number: '',
    number_of_guests: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  }

  const handleDateChange = (date: Date) => {
    setFormData(prevState => ({ ...prevState, reservation_datetime: date }));
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error submitting reservation:", error);
    }
  }

  return (
    <div className="container mx-auto mt-12 text-black">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <DatePicker
          selected={formData.reservation_datetime}
          onChange={handleDateChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          className="p-2 border rounded"
        />
        <input
          name="reservation_first_name"
          type="text"
          placeholder="First Name"
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <input
          name="reservation_last_name"
          type="text"
          placeholder="Last Name"
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <input
          name="phone_number"
          type="text"
          placeholder="Phone Number"
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <input
          name="number_of_guests"
          type="number"
          placeholder="Number of Guests"
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Reserve
        </button>
      </form>

      {/* Add the Link to /all here */}
      <div className="mt-4">
        <Link href="/all">
          <button className="p-2 bg-green-500 text-white rounded">Go to All Reservations</button>
        </Link>
      </div>

    </div>
  )
}
