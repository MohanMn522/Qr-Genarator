import { useState, useRef, useCallback } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

function App() {
  const [url, setUrl] = useState('')
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [isGenerated, setIsGenerated] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  const handleGenerate = useCallback(() => {
    if (!url.trim()) return
    setIsAnimating(true)
    setIsGenerated(false)

    setTimeout(() => {
      setGeneratedUrl(url.trim())
      setIsGenerated(true)
      setIsAnimating(false)
    }, 600)
  }, [url])

  const handleDownload = useCallback(() => {
    const canvas = qrRef.current?.querySelector('canvas')
    if (!canvas) return

    const padding = 40
    const size = canvas.width + padding * 2
    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = size
    exportCanvas.height = size
    const ctx = exportCanvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)
    ctx.drawImage(canvas, padding, padding)

    const link = document.createElement('a')
    link.download = 'qr-code.png'
    link.href = exportCanvas.toDataURL('image/png')
    link.click()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleGenerate()
  }

  return (
    <div className="app">
      {/* Animated background orbs */}
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="orb orb-4"></div>
      </div>

      {/* Floating particles */}
      <div className="particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

      <header className="header">
        <div className="logo">
          <div className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="2" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.9"/>
              <rect x="18" y="2" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.7"/>
              <rect x="2" y="18" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.7"/>
              <rect x="12" y="12" width="4" height="4" rx="1" fill="currentColor" opacity="0.5"/>
              <rect x="18" y="18" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.9"/>
            </svg>
          </div>
          <span className="logo-text">QR Generator</span>
        </div>
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-btn"
          id="digital-heroes-btn"
        >
          <span className="hero-btn-glow"></span>
          <svg className="hero-btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          Built for Digital Heroes
        </a>
      </header>

      <main className="main">
        <div className="hero-section">
          <h1 className="title">
            <span className="title-line">Generate</span>
            <span className="title-line title-gradient">QR Codes</span>
            <span className="title-line">Instantly</span>
          </h1>
          <p className="subtitle">
            Transform any URL into a scannable QR code in seconds.
            <br />
            Beautiful, fast, and free.
          </p>
        </div>

        <div className="generator-card">
          <div className="card-glow"></div>
          <div className="input-section">
            <div className="input-wrapper">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              <input
                id="url-input"
                type="url"
                className="url-input"
                placeholder="Paste your URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {url && (
                <button
                  className="clear-btn"
                  onClick={() => { setUrl(''); setIsGenerated(false); setGeneratedUrl(''); }}
                  aria-label="Clear input"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
            <button
              id="generate-btn"
              className={`generate-btn ${isAnimating ? 'generating' : ''}`}
              onClick={handleGenerate}
              disabled={!url.trim() || isAnimating}
            >
              {isAnimating ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                  </svg>
                  Generate QR Code
                </>
              )}
            </button>
          </div>

          {isGenerated && generatedUrl && (
            <div className="result-section">
              <div className="divider">
                <span className="divider-text">Your QR Code</span>
              </div>
              <div className="qr-display" ref={qrRef}>
                <div className="qr-frame">
                  <QRCodeCanvas
                    value={generatedUrl}
                    size={220}
                    bgColor="#ffffff"
                    fgColor="#0f0f23"
                    level="H"
                    marginSize={2}
                  />
                </div>
                <p className="qr-url">{generatedUrl}</p>
              </div>
              <button
                id="download-btn"
                className="download-btn"
                onClick={handleDownload}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download PNG
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-info">
            <p className="footer-name">Bathalapalli Mohan</p>
            <a href="mailto:bathalapallimohan73@gmail.com" className="footer-email">bathalapallimohan73@gmail.com</a>
          </div>
          <div className="footer-divider"></div>
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
