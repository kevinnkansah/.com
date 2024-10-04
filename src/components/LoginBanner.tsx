import { useState, useEffect } from "react";

const LoginBanner = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Set a timer to activate the login after 1 second
    const timer = setTimeout(() => {
      setActive(true);
      // Play sound
      const audio = new Audio('src/assets/media/Achievement-mp3-sound.mp3?v=' + new Date().getTime());
      audio.play();
    }, 1000);

    // Cleanup the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="login-banner">
      <div className="login-icon">
        <span className="icon"><span className="icon-lock"></span></span>
      </div>
      <div className="login-text">
        <p className="login-notification">Login successful</p>
        <p className="login-name">Welcome to my website</p>
      </div>
    </div>
  );
};

export default LoginBanner;