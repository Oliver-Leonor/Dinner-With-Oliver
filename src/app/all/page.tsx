"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // <-- Import the Link component from next/link

type Reservation = {
  reservation_id: number;
  reservation_datetime: string;
  reservation_first_name: string;
  reservation_last_name: string;
  phone_number: string;
  number_of_guests: number;
};

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-12 text-white">
      <h2 className="text-2xl mb-4">Reservations:</h2>
      <ul>
        {reservations.map((reservation, index) => (
          <li key={index} className="mb-2">
            <p><strong>Name:</strong> {reservation.reservation_first_name} {reservation.reservation_last_name}</p>
            <p><strong>Date:</strong> {reservation.reservation_datetime}</p>
            <p><strong>Phone:</strong> {reservation.phone_number}</p>
            <p><strong>Number of Guests:</strong> {reservation.number_of_guests}</p>
            <hr className="mt-2 mb-4" />
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <Link href="/" className="p-2 bg-blue-500 rounded text-white">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Reservations;
