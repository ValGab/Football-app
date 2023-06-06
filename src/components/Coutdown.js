import React, { useEffect, useState } from "react";

const Countdown = () => {
  const [count, setCount] = useState(60);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, []);

  return (
    <div className="countdown">
      {count > 0 ? (
        <p>
          Limite de requêtes atteintes (10/minute) : veuillez réessayer dans{" "}
          {count} seconde(s)
        </p>
      ) : (
        <p>Limitation terminée, veuillez réessayer.</p>
      )}
    </div>
  );
};

export default Countdown;
