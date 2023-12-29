import React, { useEffect, useState } from "react";
import "./App.css";

const MovieSeatBooking = () => {
  const [selectedMovieIndex, setSelectedMovieIndex] = useState(0);
  const [selectedMoviePrice, setSelectedMoviePrice] = useState(20);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");

  const movies = [
    { title: "Godzilla vs Kong", price: 20 },
    { title: "Radhe", price: 20 },
    { title: "RRR", price: 20 },
    { title: "F9", price: 20 },
  ];

  const primeSeats = [2, 3, 5, 7, 11]; // List of prime-numbered seats

  const updateSelectedCount = () => {
    const selectedSeats = document.querySelectorAll(
      ".row .seat.selected:not(.prime)"
    );
    const seatsIndex = [...selectedSeats].map((seat) =>
      [...seats].indexOf(seat)
    );

    setSelectedSeats(seatsIndex);
    const selectedSeatsCount = selectedSeats.length;
    setCount(selectedSeatsCount);
    setTotal(selectedSeatsCount * selectedMoviePrice);

    localStorage.setItem("selectedSeats", JSON.stringify(seatsIndex));
    localStorage.setItem("selectedMovieIndex", selectedMovieIndex);
  };

  const seats = document.querySelectorAll(".row .seat:not(.sold)");
  const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  };

  useEffect(() => {
    const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));
    const selectedMovieIndex = localStorage.getItem("selectedMovieIndex");

    if (selectedSeats !== null && selectedSeats.length > 0) {
      seats.forEach((seat, index) => {
        if (
          selectedSeats.indexOf(index) > -1 &&
          !seat.classList.contains("prime")
        ) {
          seat.classList.add("selected");
        }
      });
    } else {
      seats.forEach((seat) => {
        seat.classList.remove("selected", "sold");
      });
      updateSelectedCount();
    }

    if (selectedMovieIndex !== null) {
      setSelectedMovieIndex(selectedMovieIndex);
      setSelectedMoviePrice(movies[selectedMovieIndex].price);
    }
  }, [movies, seats]);

  const movieChangeHandler = (e) => {
    setSelectedMovieIndex(e.target.selectedIndex);
    setSelectedMoviePrice(e.target.value);
    updateSelectedCount();
  };

  const seatClickHandler = (e) => {
    if (
      e.target.classList.contains("seat") &&
      !e.target.classList.contains("sold") &&
      !e.target.classList.contains("prime")
    ) {
      const seatNumber = [...seats].indexOf(e.target);
      const isAlreadySelected = e.target.classList.contains("selected");

      if (!isAlreadySelected && seatNumber + 1 <= 5) {
        e.target.classList.toggle("selected");
        updateSelectedCount();
      } else if (!isAlreadySelected) {
        e.target.classlist.toggle("selected");
        updateSelectedCount();
      } else {
        setAlertMessage("You can only select seats between 1 and 5.");
        setTimeout(() => {
          setAlertMessage("");
        }, 3000);
      }
    } else if (e.target.classList.contains("prime")) {
      setAlertMessage("Prime-numbered seats are already sold!");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000);
    }
  };
  const buyTickets = () => {
    const selectedSeats = document.querySelectorAll(".row .seat.selected");
    selectedSeats.forEach((seat) => {
      seat.classList.remove("selected");
      seat.classList.add("sold");
    });
    setCount(0);
    setTotal(0);
  };
  return (
    <div className="container">
      <div className="movie-container">
        <label>Select a movie:</label>
        <select
          id="movie"
          onChange={movieChangeHandler}
          value={selectedMoviePrice}
        >
          {movies.map((movie, index) => (
            <option key={index} value={movie.price}>
              {movie.title} (RS.{movie.price})
            </option>
          ))}
        </select>
      </div>

      <ul className="showcase">
        <li>
          <div className="seat"></div>
          <small>Available</small>
        </li>
        <li>
          <div className="seat selected"></div>
          <small>Selected</small>
        </li>
        <li>
          <div className="seat sold"></div>
          <small>Sold</small>
        </li>
      </ul>
      <div className="container" onClick={seatClickHandler}>
        {[...Array(10).keys()].map((rowIndex) => (
          <div key={rowIndex} className="row">
            {[...Array(rowIndex + 1).keys()].map((seatNumber) => (
              <div
                key={seatNumber}
                className={`seat ${isPrime(rowIndex * 10 + seatNumber + 1) ? "prime sold" : ""
                  }`}
              >
                {isPrime(rowIndex * 10 + seatNumber + 1)
                  ? ""
                  : rowIndex * 10 + seatNumber + 1}
              </div>
            ))}
          </div>
        ))}
      </div>

      <p className="text">
        You have selected <span id="count">{count}</span> seat for a price of
        RS.
        <span id="total">{total}</span>
      </p>

      {alertMessage && <div className="alert">{alertMessage}</div>}

      <button onClick={buyTickets}>Buy Selected Seats</button>
    </div>
  );
};

export default MovieSeatBooking;