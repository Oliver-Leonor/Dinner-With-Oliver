"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; 
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 
import Swal from 'sweetalert2';

type Reservation = {
  id: number;
  reservation_datetime: string;
  reservation_first_name: string;
  reservation_last_name: string;
  phone_number: string;
  number_of_guests: number;
};

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateDate, setUpdateDate] = useState<{ [key: number]: Date }>({});

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/reservations');
        const data = await response.json();
        setReservations(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleDateChange = (date: Date, id: number) => {
    setUpdateDate(prev => ({ ...prev, [id]: date }));
  }

  const handleUpdate = async (id: number) => {
    try {
      const dateToUpdate = updateDate[id];
      if (!dateToUpdate) {
        console.error(`No date found for reservation with ID: ${id}`);
        return;
      }

      const reservation = reservations.find(res => res.id === id);
      if (!reservation) {
        console.error(`No reservation found with ID: ${id}`);
        return;
      }

      const response = await fetch(`http://127.0.0.1:5000/api/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reservation_datetime: dateToUpdate.toISOString(),
          reservation_first_name: reservation.reservation_first_name,
          reservation_last_name: reservation.reservation_last_name,
          phone_number: reservation.phone_number,
          number_of_guests: reservation.number_of_guests
        })
      });

      if (response.ok) {
        const updatedReservation = await response.json();
        setReservations(prev => prev.map(res => res.id === id ? updatedReservation : res));
        delete updateDate[id];
        setUpdateDate({ ...updateDate });

        Swal.fire({
          icon: 'success',
          title: 'Updated Successfully',
          text: 'The reservation has been updated.',
          timer: 1500,
        });
      } else {
        console.error("Error updating reservation:", await response.text());
      }
    } catch (error) {
      console.error("Error updating reservation:", error);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-12 text-white">
      <h2 className="text-2xl mb-4">Reservations:</h2>
      <ul>
        {reservations.map((reservation) => (
          <li key={reservation.id} className="mb-2">
            <h4><strong>Name:</strong> {reservation.reservation_first_name} {reservation.reservation_last_name}</h4>
            <h5><strong>Date:</strong> 
              <DatePicker
                selected={updateDate[reservation.id] || new Date(reservation.reservation_datetime)}
                onChange={(date: Date) => handleDateChange(date, reservation.id)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="p-2 border rounded text-black"
              />
              <button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg' onClick={() => handleUpdate(reservation.id)}>Update</button>
            </h5>
            <p><strong>Phone:</strong> {reservation.phone_number}</p>
            <p><strong>Number of Guests:</strong> {reservation.number_of_guests}</p>
            <hr className="mt-2 mb-4" />
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <Link href="/" className="p-2 bg-blue-500 rounded text-white">
        Back to Reservations
        </Link>
      </div>
    </div>
  );
}

export default Reservations;
