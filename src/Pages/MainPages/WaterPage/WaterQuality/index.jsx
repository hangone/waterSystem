import React from 'react';

const WaterQuality = () => {
  return (
    <div style={{
      width:"100%"
    }}>
      <iframe
        src="https://nextchat-three-beta.vercel.app/#/chat"
        style={{ width: '100%', height: '100vh', border: 'none' }}
        title="Water Quality AI"
      ></iframe>
    </div>
  );
};

export default WaterQuality;