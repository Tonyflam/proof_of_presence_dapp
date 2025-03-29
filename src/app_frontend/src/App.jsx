import { useEffect, useState } from 'react';
import AdminPage from './AdminPage';
import AttendeePage from './AttendeePage';
import { AuthClient } from '@dfinity/auth-client';

function App() {
  const [role, setRole] = useState(null);
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState(null);

  useEffect(() => {
    AuthClient.create().then((client) => {
      console.log('AuthClient created:', client);
      setAuthClient(client);
      client.isAuthenticated().then((authenticated) => {
        console.log('Is authenticated:', authenticated);
        setIsAuthenticated(authenticated);
        if (authenticated) {
          const identity = client.getIdentity();
          setPrincipal(identity.getPrincipal().toText());
          console.log('Principal:', identity.getPrincipal().toText());
        }
      });
    });
  }, []);

  const handleLogin = (selectedRole) => {
    if (authClient) {
      console.log('Logging in as:', selectedRole);
      authClient.login({
        identityProvider: 'https://identity.ic0.app',
        onSuccess: () => {
          console.log('Login successful');
          setIsAuthenticated(true);
          setRole(selectedRole);
          const identity = authClient.getIdentity();
          setPrincipal(identity.getPrincipal().toText());
          console.log('Principal:', identity.getPrincipal().toText());
        },
      });
    }
  };

  const handleLogout = () => {
    if (authClient) {
      authClient.logout();
      setIsAuthenticated(false);
      setRole(null);
      setPrincipal(null);
      console.log('User logged out');
    }
  };

  if (!isAuthenticated) {
    console.log('User not authenticated, showing login options.');
    return (
      <main>
        <h1>Welcome to Event Management</h1>
        <p>Please select your role:</p>
        <button onClick={() => handleLogin('admin')}>Login as Admin</button>
        <button onClick={() => handleLogin('attendee')}>Login as Attendee</button>
      </main>
    );
  }

  if (role === 'admin') {
    console.log('Rendering AdminPage with Principal:', principal);
    return (
      <>
        <button onClick={handleLogout}>Logout</button>
        <AdminPage principal={principal} />
      </>
    );
  }

  if (role === 'attendee') {
    console.log('Rendering AttendeePage with Principal:', principal);
    return (
      <>
        <button onClick={handleLogout}>Logout</button>
        <AttendeePage principal={principal} />
      </>
    );
  }

  console.log('No role selected, showing fallback UI.');
  return (
    <main>
      <h1>Welcome to Event Management</h1>
      <p>Something went wrong. Please select your role again:</p>
      <button onClick={() => handleLogin('admin')}>Login as Admin</button>
      <button onClick={() => handleLogin('attendee')}>Login as Attendee</button>
    </main>
  );
}

export default App;
