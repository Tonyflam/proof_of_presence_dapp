import Text "mo:base/Text";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import List "mo:base/List";

actor pop_dapp {
  type Event = {
    id: Text;
    name: Text;
    description: Text;
    startTime: Time.Time;
    endTime: Time.Time;
    location: Text;
    organizer: Principal;
    createdAt: Time.Time;
  };

  type CheckIn = {
    user: Principal;
    timestamp: Time.Time;
    eventId: Text;
  };

  type Attendance = {
    user: Principal;
    counts: Nat;
  };

  stable var checkIns: List.List<CheckIn> = List.nil<CheckIn>();
  stable var events: List.List<Event> = List.nil<Event>();
  stable var attendanceCounts: List.List<Attendance> = List.nil<Attendance>();

  public shared(msg) func createEvent(eventId: Text, eventName: Text, description: Text, startTime: Time.Time, endTime: Time.Time, location: Text) : async Text {
    let eventA = List.find<Event>(events, func(e: Event): Bool { e.id == eventId });
    if (eventA != null) {
      return "Event ID already exists.";
    };
    
    let newEvent = {
      id = eventId;
      name = eventName;
      description = description;
      startTime = startTime;
      endTime = endTime;
      location = location;
      organizer = msg.caller;
      createdAt = Time.now();
    };
    
    events := List.push(newEvent, events);
    return "Event Created!";
  };

  public shared(msg) func deleteEvent(eventId: Text) : async Text {
    let filteredEvents = List.filter<Event>(events, func(e: Event): Bool { e.id != eventId and e.organizer != msg.caller });
    if (List.size(filteredEvents) == List.size(events)) {
      return "Event not found or unauthorized to delete.";
    };
    
    events := filteredEvents;
    return "Event deleted successfully.";
  };

  public query func getEvent(eventId: Text) : async ?Event {
    return List.find<Event>(events, func(e: Event): Bool { e.id == eventId });
  };

  public query func getAllEvents() : async [Event] {
    return List.toArray(events);
  };

  public shared(msg) func checkIn(eventId: Text) : async Text {
    let eventcheck = List.find<Event>(events, func(e: Event): Bool { e.id == eventId });
    if (eventcheck == null) {
        return "Event does not exist.";
    };

    let caller = msg.caller;
    let now = Time.now();

    let alreadyCheckedIn = List.find<CheckIn>(checkIns, func(c: CheckIn): Bool { c.eventId == eventId and c.user == caller });
    if (alreadyCheckedIn != null) {
        return "User already checked in.";
    };

    let newCheckIn = {
        user = caller;
        timestamp = now;
        eventId = eventId;
    };

    checkIns := List.push(newCheckIn, checkIns);

    // Step 1: Remove previous record for the user
    let filteredAttendance = List.filter<Attendance>(attendanceCounts, func(a: Attendance): Bool {
        a.user != caller
    });

    // Step 2: Determine the previous count (only using the filtered list)
    let previousCount = switch (List.find<Attendance>(attendanceCounts, func(a: Attendance): Bool { a.user == caller })) {
        case (?record) record.counts;
        case null 0;
    };

    // Step 3: Push the updated record
    attendanceCounts := List.push({ user = caller; counts = previousCount + 1 }, filteredAttendance);

    return "Check-in Successful!";
};



  public query func getUserCheckIns(user: Principal) : async [(Text, Time.Time)] {
    let userCheckIns = List.filter<CheckIn>(checkIns, func (c: CheckIn) : Bool {
        c.user == user
    });

    let history = List.map<CheckIn, (Text, Time.Time)>(userCheckIns, func (c: CheckIn) : (Text, Time.Time) {
        (c.eventId, c.timestamp)
    });

    return List.toArray(history);
  };

  public query func getLeaderboard() : async [(Principal, Nat)] {
    let ranking = List.map<Attendance, (Principal, Nat)>(attendanceCounts, func (a: Attendance) : (Principal, Nat) {
        (a.user, a.counts)
    });
    
    return List.toArray(ranking);
  };
  public shared func resetData() : async Text {
    events := List.nil<Event>();
    checkIns := List.nil<CheckIn>();
    attendanceCounts := List.nil<Attendance>();
    return "All data has been reset.";
};

};