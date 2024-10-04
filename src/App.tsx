import Login from './components/Login.tsx';
import LoginBanner from './components/LoginBanner.tsx';
import XboxDashboard from './components/XboxDashboard';

function App() {
  return (
    <>
      <div className='login-container'>
        <LoginBanner />
      </div>
      <XboxDashboard />
    </>
  );
}


export default App
