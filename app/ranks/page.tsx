"use client";

import React from 'react';
import KanbanBoard from './KanbanBoard';

 const KanbanPage = () => {
  return (
    <div style={{
      display: 'flex',
      gap: '32px',
      padding: '64px 32px',
      minHeight: '100vh',
      background: 'linear-gradient(45deg, #0f0f1a 0%, #1a1a2f 100%)',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Column 1 - Height Ranking */}
      <div style={{
        flex: 1,
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '24px',
        backdropFilter: 'blur(12px)',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{
          margin: '0 0 32px 0',
          fontSize: '24px',
          fontWeight: 700,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <span style={{
            background: 'linear-gradient(45deg, #FFD700, #FFEC8B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Top Height</span>
          📏
        </h2>
        <KanbanBoard rankingKey="height" />
      </div>

      {/* Column 2 - Brest Ranking */}
      <div style={{
        flex: 1,
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '24px',
        backdropFilter: 'blur(12px)',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{
          margin: '0 0 32px 0',
          fontSize: '24px',
          fontWeight: 700,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <span style={{
            background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Top Brest</span>
          🔥
        </h2>
        <KanbanBoard rankingKey="brest" />
      </div>
      {/* Column 2 - Brest Ranking */}
      <div style={{
        flex: 1,
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '24px',
        backdropFilter: 'blur(12px)',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{
          margin: '0 0 32px 0',
          fontSize: '24px',
          fontWeight: 700,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <span style={{
            background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Top Face</span>
          🔥
        </h2>
        <KanbanBoard rankingKey="face" />
      </div>
      {/* Column 2 - Brest Ranking */}
      <div style={{
        flex: 1,
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '24px',
        backdropFilter: 'blur(12px)',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{
          margin: '0 0 32px 0',
          fontSize: '24px',
          fontWeight: 700,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <span style={{
            background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Top Ass</span>
          🔥
        </h2>
        <KanbanBoard rankingKey="ass" />
      </div>
      <div style={{
        flex: 1,
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '24px',
        backdropFilter: 'blur(12px)',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{
          margin: '0 0 32px 0',
          fontSize: '24px',
          fontWeight: 700,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <span style={{
            background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Top Wife</span>
          🔥
        </h2>
        <KanbanBoard rankingKey="wife" />
      </div>
    </div>
  );
  
};

export default KanbanPage;