import React from 'react'
import ReactDOM from 'react-dom/client'
import WaCards from './ccaf-whatsapp-cards'

function App() {
  return (
    <div style={{
      maxWidth: '680px',
      margin: '40px auto',
      padding: '0 24px 60px',
    }}>
      {/* Premium Header */}
      <header style={{
        textAlign: 'center',
        marginBottom: '32px',
      }}>
        {/* Premium Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <img 
            src="logo.png" 
            alt="CCAF Share Logo" 
            style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '20px',
              boxShadow: '0 8px 24px -6px rgba(139, 58, 42, 0.2)',
              border: '2px solid #fff',
            }} 
          />
        </div>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 700,
          color: '#8B3A2A', // TC Theme Color
          margin: '0 0 8px 0',
          letterSpacing: '-0.02em',
        }}>
          WhatsApp Cards Builder
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#6B5E59',
          margin: 0,
          lineHeight: '1.5',
        }}>
          Structure your notes, conceptual clicks, traps, and references into formatted WhatsApp markdown cards.
        </p>
      </header>

      {/* Main Card Component Container */}
      <main style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 12px 40px -12px rgba(139, 58, 42, 0.06), 0 1px 3px rgba(0, 0, 0, 0.02)',
        border: '1px solid rgba(139, 58, 42, 0.05)',
      }}>
        <WaCards />
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: '40px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#9CA3AF',
      }}>
        WhatsApp Cards Builder · Ready for instant formatting and copy-pasting.
      </footer>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
