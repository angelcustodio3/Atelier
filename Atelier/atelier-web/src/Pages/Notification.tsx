import React, { useState, useEffect, useRef } from 'react';

function Notification() {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div onClick={() => setShowPopup(!showPopup)}>Notification Icon</div>
      {showPopup && (
        <div ref={popupRef} style={{ border: '1px solid black', padding: '10px', position: 'absolute', top: '50px', left: '50px' }}>
          <h3>Notifications</h3>
          <p>Notification 1</p>
          <p>Notification 2</p>
          <p>Notification 3</p>
        </div>
      )}
    </div>
  );
}

export default Notification;
