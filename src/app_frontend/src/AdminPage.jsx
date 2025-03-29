import { useState, useEffect } from 'react';
import { app_backend } from 'declarations/app_backend';

function AdminPage() {
  const [events, setEvents] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    app_backend.getAllEvents().then(setEvents);
    app_backend.getLeaderboard().then((data) => {
      setLeaderboard(data.map(([user, count]) => ({ user: user.toText(), count: Number(count) })));
    });
  }, []);

  function handleCreateEvent(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const eventId = formData.get('eventId');
    const eventName = formData.get('eventName');
    const description = formData.get('description');
    const startTime = BigInt(Date.parse(formData.get('startTime')) * 1_000_000);
    const endTime = BigInt(Date.parse(formData.get('endTime')) * 1_000_000);
    const location = formData.get('location');

    app_backend
      .createEvent(eventId, eventName, description, startTime, endTime, location)
      .then(setMessage)
      .then(() => app_backend.getAllEvents().then(setEvents));
  }

  function handleDeleteEvent(eventId) {
    app_backend.deleteEvent(eventId).then((response) => {
      setMessage(response);
      app_backend.getAllEvents().then(setEvents);
    });
  }

  return (
    <main>
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Create Event</h2>
        <form onSubmit={handleCreateEvent}>
          <input name="eventId" placeholder="Event ID" required />
          <input name="eventName" placeholder="Event Name" required />
          <textarea name="description" placeholder="Description" required />
          <input name="startTime" type="datetime-local" required />
          <input name="endTime" type="datetime-local" required />
          <input name="location" placeholder="Location" required />
          <button type="submit">Create Event</button>
        </form>
      </section>

      <section>
        <h2>All Events</h2>
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <br />
              <br />
              Event Name: {event.name}
              <br />
              <br />
              Event Description: {event.description}
              <br />
              <br />
              Location: {event.location}
              <br />
              <br />
              <button onClick={() => handleDeleteEvent(event.id)}>Delete Event</button>
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

export default AdminPage;