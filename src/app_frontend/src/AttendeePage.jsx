import { useState, useEffect } from 'react';
import { app_backend } from 'declarations/app_backend';

function AttendeePage({ principal }) {
  const [events, setEvents] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [message, setMessage] = useState('');
  const [userCheckIns, setUserCheckIns] = useState([]);

  useEffect(() => {
    app_backend.getAllEvents().then(setEvents);
    refreshLeaderboard();
  }, []);

  function refreshLeaderboard() {
    app_backend.getLeaderboard().then((data) => {
      setLeaderboard(data.map(([user, count]) => ({ user: user.toText(), count: Number(count) })));
    });
  }

  function handleCheckIn(eventId) {
    if (!principal) {
      setMessage('You must be logged in to check in.');
      return;
    }

    app_backend.checkIn(eventId).then((response) => {
      setMessage(response);
      refreshLeaderboard();
    });
  }



  return (
    <main>
      <h1>Attendee Dashboard</h1>

      <section>
        <h2>All Events</h2>
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              Event Name: {event.name}
                <br />
                <br />
              Event Description: {event.description}
              <br />
              <br />
              Location: {event.location}
              <br />
              <br />
              Start Time: {new Date(Number(event.startTime) / 1_000_000).toLocaleString()}
              <br />
              <br />
              End Time: {new Date(Number(event.endTime) / 1_000_000).toLocaleString()}
              <br />
              <br />
              <button onClick={() => handleCheckIn(event.id)}>Check In</button>
            </li>
          ))}
        </ul>
      </section>


      <section>
        <h2>Leaderboard</h2>
        <ul>
          {leaderboard.map(({ user, count }) => (
            <li key={user}>
              {user}: {count} check-ins
            </li>
          ))}
        </ul>
      </section>

      {message && <p>{message}</p>}
    </main>
  );
}

export default AttendeePage;