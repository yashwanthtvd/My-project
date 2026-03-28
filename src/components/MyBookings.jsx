import React, { useEffect, useState } from "react";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(data);
  }, []);

  const cancelBooking = (index) => {
    const updatedBookings = bookings.filter((_, i) => i !== index);
    setBookings(updatedBookings);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));

    
    const hotels = JSON.parse(localStorage.getItem("hotels")) || [];
    const hotelName = bookings[index].name;

    const updatedHotels = hotels.map((h) =>
      h.name === hotelName ? { ...h, available: true } : h
    );

    localStorage.setItem("hotels", JSON.stringify(updatedHotels));
  };

  if (bookings.length === 0) {
    return <p>No bookings yet.</p>;
  }

  return (
    <div>
      <h2>My Bookings</h2>
      {bookings.map((b, i) => (
        <div key={i} className="hotel-card">
          <h3>{b.name}</h3>
          <p>{b.city}</p>
          <p>₹{b.price}</p>
          <button onClick={() => cancelBooking(i)}>Cancel Booking</button>
        </div>
      ))}
    </div>
  );
}

export default MyBookings;