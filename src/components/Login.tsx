import { useEffect, useState } from "react";

const Login = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Set a timer to activate the login after 1 second
    const timer = setTimeout(() => {
      setActive(true);
      // Play sound
      const audio = new Audio('src/assets/media/Achievement-mp3-sound.mp3');
      audio.play();
    }, 1000);

    // Cleanup the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`login ${active ? 'out' : ''}`}>
      <span className="circle">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </span>
      <span className="xbox-logo"></span>
      <span className="user-name">RandomUser<br />Welcome to my website</span>
    </div>
  );
};

export default Login;
