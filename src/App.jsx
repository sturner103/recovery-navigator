import { useState, useEffect } from 'react';

// ============================================
// DATA & CONFIGURATION
// ============================================
const searchPromptLibrary = {
  0: { 
    name: "Awareness & Early Concern", 
    prompts: [
      '"body image counselor" [LOCATION]',
      '"intuitive eating" coach [LOCATION]',
      '"eating disorder prevention" program [LOCATION]',
      '"body positive" therapist [LOCATION]',
      '"mindful eating" class [LOCATION]'
    ] 
  },
  1: { 
    name: "Emerging Patterns", 
    prompts: [
      '"eating disorder therapist" [LOCATION]',
      '"HAES dietitian" [LOCATION]',
      '"non-diet nutritionist" [LOCATION]',
      '"eating disorder support group" [LOCATION]',
      '"body image therapy" [LOCATION]'
    ] 
  },
  2: { 
    name: "Established Patterns", 
    prompts: [
      '"eating disorder specialist" [LOCATION]',
      '"ED dietitian" [LOCATION]',
      '"eating disorder outpatient" [LOCATION]',
      '"anorexia bulimia therapist" [LOCATION]',
      '"eating disorder recovery" program [LOCATION]'
    ] 
  },
  3: { 
    name: "Higher Support Needs", 
    prompts: [
      '"eating disorder intensive outpatient" [LOCATION]',
      '"ED day program" [LOCATION]',
      '"eating disorder treatment center" [LOCATION]',
      '"residential eating disorder" [LOCATION]',
      '"eating disorder PHP IOP" [LOCATION]'
    ] 
  }
};

const questions = [
  { id: 1, text: "How much mental energy do thoughts about food, eating, body shape, or weight take up for you?", subtext: "This includes planning, worrying, calculating, or thinking about these topics throughout the day." },
  { id: 2, text: "How much discomfort or anxiety do you experience when your eating or exercise routines change from what you expected?", subtext: "For example, when plans change, food isn't available, or you can't exercise as planned." },
  { id: 3, text: "How difficult is it for you to respond naturally to hunger, fullness, and other body cues?", subtext: "This includes eating when hungry, stopping when satisfied, or trusting your body's signals." },
  { id: 4, text: "How much stress do you experience around eating with others or in social situations involving food?", subtext: "This might include restaurants, family meals, work events, or casual gatherings." },
  { id: 5, text: "How often does your eating or exercise feel driven or compulsive rather than freely chosen?", subtext: "As if you have to do it a certain way, rather than wanting to." },
  { id: 6, text: "How much do concerns about food or your body affect your mood and how you feel about yourself?", subtext: "Including your self-esteem, confidence, or emotional state." },
  { id: 7, text: "How much do these patterns interfere with your work, relationships, or daily activities?", subtext: "This includes concentration, social life, energy for other things, or quality of life." },
  { id: 8, text: "Have people close to you expressed concern about your eating, exercise, or health?", subtext: "Family, friends, partners, or colleagues noticing or saying something." },
  { id: 9, text: "Do you notice feeling both a desire to change and a resistance or uncertainty about changing?", subtext: "It's common to want things to be different while also feeling unsure or ambivalent." },
  { id: 10, text: "Have you previously sought support for concerns related to eating, food, or body image?", subtext: "This could include therapy, medical visits, programs, or other forms of help." },
  { id: 11, text: "Have you experienced physical symptoms such as dizziness, fainting, exhaustion, heart palpitations, or digestive issues?", subtext: "Physical signs that may be connected to eating or exercise patterns." },
  { id: 12, text: "Are you currently feeling physically unsafe, medically unwell, or at risk of harming yourself?", subtext: "Please answer honestly—this helps us connect you with the right support.", safetyGate: true }
];

const scaleOptions = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Occasionally" },
  { value: 2, label: "Often" },
  { value: 3, label: "Most of the time" }
];

const stageContent = {
  0: { 
    name: "Awareness & Early Concern", 
    description: "Noticing patterns, asking questions, seeking information.",
    positioning: "Your responses suggest you may be in an early stage of noticing patterns or concerns. This is a valuable place to be—awareness is the foundation of wellbeing.", 
    helps: [
      "Psychoeducation about eating, body image, and cultural pressures", 
      "Body-image and media literacy programs", 
      "Gentle embodiment practices like yoga or mindful movement", 
      "Anonymous resources and low-pressure entry points"
    ], 
    monitor: [
      "Increasing preoccupation with food, weight, or body", 
      "Growing rigidity around eating or exercise routines", 
      "Social withdrawal related to food situations"
    ],
    color: "#a8c5b8"
  },
  1: { 
    name: "Emerging Patterns", 
    description: "Recognizable patterns developing, often still high-functioning.",
    positioning: "Your responses suggest emerging patterns that may benefit from structured, supportive help—without jumping straight to intensive treatment.", 
    helps: [
      "Facilitated support groups with gentle accountability", 
      "Somatic and embodiment practices", 
      "Non-diet nutrition education", 
      "Coaching-adjacent supports focused on skills and awareness"
    ], 
    monitor: [
      "Increasing interference with daily life, work, or relationships", 
      "Emergence of physical warning signs", 
      "Growing isolation or secrecy around eating"
    ],
    color: "#7d9a8c"
  },
  2: { 
    name: "Established Patterns", 
    description: "Patterns meaningfully affecting daily life.",
    positioning: "Your responses suggest more established patterns that are meaningfully affecting your life. Consistent, professional support is likely to be helpful.", 
    helps: [
      "Outpatient therapy with an eating disorder-informed clinician", 
      "Dietitian support (ideally non-diet/HAES-aligned)", 
      "Adjunctive somatic or body-based programs", 
      "Family education and involvement if appropriate"
    ], 
    monitor: [
      "Physical health symptoms or medical concerns", 
      "Significant functional impairment", 
      "Thoughts of self-harm or hopelessness"
    ],
    color: "#5a7d6d"
  },
  3: { 
    name: "Higher Support Needs", 
    description: "Significant impact on health and functioning.",
    positioning: "Your responses suggest patterns that may benefit from a higher level of care and professional evaluation. This isn't a judgment—it's information to help you access appropriate support.", 
    helps: [
      "Professional evaluation by an eating disorder specialist", 
      "Consider day programs or intensive outpatient options", 
      "Medical monitoring and oversight", 
      "Structured treatment with a multidisciplinary team"
    ], 
    monitor: [
      "Any medical emergency signs require immediate attention", 
      "Thoughts of self-harm should be shared with a professional immediately"
    ], 
    urgent: true,
    color: "#4a6a5d"
  }
};

function getStage(score) {
  if (score <= 7) return 0;
  if (score <= 14) return 1;
  if (score <= 22) return 2;
  return 3;
}

// Generate unique job ID
function generateJobId() {
  return 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Export results to PDF
async function exportToPDF(elementId, filename) {
  const element = document.getElementById(elementId);
  if (!element || !window.html2pdf) {
    console.error('PDF export failed: element or html2pdf not found');
    alert('PDF export is not available. Please try again.');
    return;
  }

  // Temporarily hide buttons for cleaner PDF
  const buttons = element.querySelectorAll('.resource-detail-button, .results-actions');
  buttons.forEach(btn => btn.style.display = 'none');

  const opt = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: filename || 'support-navigator-report.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true,
      letterRendering: true,
      logging: false
    },
    jsPDF: { 
      unit: 'in', 
      format: 'letter', 
      orientation: 'portrait' 
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  try {
    await window.html2pdf().set(opt).from(element).save();
  } catch (err) {
    console.error('PDF export error:', err);
    alert('Failed to generate PDF. Please try again.');
  } finally {
    // Restore buttons
    buttons.forEach(btn => btn.style.display = '');
  }
}

// ============================================
// TOP NAVIGATION
// ============================================
function TopNav({ currentPage, onNavigate, onStartAssessment, inAssessment }) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'stages', label: 'The Stages' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'limitations', label: 'Our Limitations', scrollTo: 'limitations' },
    { id: 'resources', label: 'Resources' },
  ];

  return (
    <nav className="top-nav">
      <div className="top-nav-container">
        <button className="nav-logo" onClick={() => onNavigate('home')}>
          <div className="nav-logo-icon">
            <svg viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" fill="url(#logoGradient)"/>
              <path d="M16 6 L18 14 L16 16 L14 14 Z" fill="white"/>
              <path d="M16 26 L14 18 L16 16 L18 18 Z" fill="rgba(255,255,255,0.5)"/>
              <path d="M6 16 L14 14 L16 16 L14 18 Z" fill="rgba(255,255,255,0.5)"/>
              <path d="M26 16 L18 18 L16 16 L18 14 Z" fill="white"/>
              <circle cx="16" cy="16" r="2" fill="white"/>
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7d9a8c"/>
                  <stop offset="100%" stopColor="#5a7d6d"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span>Support Navigator</span>
        </button>
        
        <button className="nav-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <path d="M6 18L18 6M6 6l12 12"/> : <path d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
        
        <div className={`top-nav-links ${menuOpen ? 'open' : ''}`}>
          {navItems.map(item => (
            <button 
              key={item.id} 
              className={`top-nav-link ${currentPage === item.id && !inAssessment ? 'active' : ''}`}
              onClick={() => { 
                if (item.scrollTo) {
                  onNavigate('how-it-works', item.scrollTo);
                } else {
                  onNavigate(item.id); 
                }
                setMenuOpen(false); 
              }}
            >
              {item.label}
            </button>
          ))}
          <button className="nav-cta" onClick={() => { onStartAssessment(); setMenuOpen(false); }}>
            {inAssessment ? 'Restart' : 'Start Assessment'}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ============================================
// CONTEXT NAV
// ============================================
function ContextNav({ context, data }) {
  if (context === 'assessment') {
    const progress = ((data.currentQuestion) / data.totalQuestions) * 100;
    return (
      <div className="context-nav">
        <div className="context-nav-container">
          <div className="context-breadcrumb">
            <span className="context-label">Assessment</span>
            <span className="context-separator">→</span>
            <span className="context-current">Question {data.currentQuestion + 1} of {data.totalQuestions}</span>
          </div>
          <div className="context-progress">
            <div className="context-progress-bar">
              <div className="context-progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <button onClick={data.onExit} className="context-exit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Exit
          </button>
        </div>
      </div>
    );
  }

  if (context === 'results') {
    return (
      <div className="context-nav">
        <div className="context-nav-container">
          <div className="context-breadcrumb">
            <span className="context-label">Your Results</span>
            <span className="context-separator">→</span>
            <span className="context-current">{data.stageName}</span>
          </div>
          <div className="context-actions">
            <button 
              className={`context-tab ${data.view === 'results' ? 'active' : ''}`}
              onClick={() => data.setView('results')}
            >
              Summary
            </button>
            <button 
              className={`context-tab ${data.view === 'search' ? 'active' : ''}`}
              onClick={() => data.setView('search')}
            >
              Find Resources
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (context === 'search') {
    return (
      <div className="context-nav">
        <div className="context-nav-container">
          <div className="context-breadcrumb">
            <span className="context-label">Find Resources</span>
            <span className="context-separator">→</span>
            <span className="context-current">{data.location || 'Enter location'}</span>
          </div>
          <button onClick={data.onBack} className="context-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  if (context === 'page') {
    return (
      <div className="context-nav">
        <div className="context-nav-container">
          <div className="context-breadcrumb">
            <span className="context-current">{data.title}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ============================================
// SEARCH LOADING
// ============================================
function SearchLoading({ elapsedTime, status }) {
  const stages = [
    { name: "Starting search", minTime: 0 },
    { name: "Searching for therapists", minTime: 5 },
    { name: "Finding treatment programs", minTime: 15 },
    { name: "Looking for dietitians", minTime: 25 },
    { name: "Searching support groups", minTime: 35 },
    { name: "Compiling results", minTime: 45 }
  ];

  const currentStageIndex = stages.reduce((acc, stage, idx) => 
    elapsedTime >= stage.minTime ? idx : acc, 0);

  return (
    <div className="search-loading-container">
      <div className="search-loading-spinner">
        <svg viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke="#e8f0ec" strokeWidth="4"/>
          <circle cx="25" cy="25" r="20" fill="none" stroke="#7d9a8c" strokeWidth="4" strokeLinecap="round" strokeDasharray="80" strokeDashoffset="60" className="spinner-circle"/>
        </svg>
      </div>
      <h2>Searching for Resources</h2>
      
      <div className="search-stages">
        {stages.map((stage, idx) => (
          <div key={idx} className={`search-stage ${idx < currentStageIndex ? 'complete' : ''} ${idx === currentStageIndex ? 'active' : ''}`}>
            <span className="stage-indicator">
              {idx < currentStageIndex ? '✓' : idx === currentStageIndex ? '●' : '○'}
            </span>
            <span className="stage-name">{stage.name}</span>
          </div>
        ))}
      </div>
      
      <p className="search-loading-time">{Math.floor(elapsedTime)} seconds</p>
      
      <div className="search-loading-note">
        <p>This comprehensive search can take 120+ seconds. Please be patient.</p>
        <p>We are searching for resources and building you a dynamic report.</p>
      </div>
    </div>
  );
}

// ============================================
// FLOATING HELPER
// ============================================
function FloatingHelper({ isOpen, onToggle }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    try {
      const response = await fetch('/.netlify/functions/site-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || "I'm here to help." }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't respond." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button className="floating-help-button" onClick={onToggle}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>
        </svg>
        <span>Help with Site</span>
      </button>
    );
  }

  return (
    <>
      <button className="floating-help-button open" onClick={onToggle}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 18L18 6M6 6l12 12"/>
        </svg>
        <span>Close</span>
      </button>
      <div className="floating-help-panel">
        <div className="floating-help-header"><h3>How can I help?</h3></div>
        <div className="floating-help-content">
          {messages.length === 0 && <div className="help-welcome"><p>I can answer questions about this tool or help you navigate.</p></div>}
          {messages.map((msg, idx) => <div key={idx} className={`help-message ${msg.role}`}>{msg.content}</div>)}
          {isLoading && <div className="help-message assistant loading">Thinking...</div>}
        </div>
        <div className="floating-help-input">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Ask anything..." disabled={isLoading}/>
          <button onClick={sendMessage} disabled={isLoading || !input.trim()}>Send</button>
        </div>
      </div>
    </>
  );
}

// ============================================
// HELP PANEL
// ============================================
function HelpPanel({ isOpen, onClose, question, questionText }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    try {
      const response = await fetch('/.netlify/functions/question-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, questionText, userMessage })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || "I'm here to help." }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't respond." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="help-panel-side">
      <div className="help-panel-header">
        <h3>Question Helper</h3>
        <button onClick={onClose} className="help-close-button">×</button>
      </div>
      <div className="help-current-question">
        <span className="help-question-label">Question {question}:</span>
        <p>{questionText}</p>
      </div>
      <div className="help-panel-content">
        {messages.length === 0 && <div className="help-welcome"><p>I can help clarify what this question is asking.</p></div>}
        {messages.map((msg, idx) => <div key={idx} className={`help-message ${msg.role}`}>{msg.content}</div>)}
        {isLoading && <div className="help-message assistant loading">Thinking...</div>}
      </div>
      <div className="help-panel-input">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Ask about this question..." disabled={isLoading}/>
        <button onClick={sendMessage} disabled={isLoading || !input.trim()}>Send</button>
      </div>
    </div>
  );
}

// ============================================
// LANDING PAGE
// ============================================
function LandingPage({ onStartAssessment, onNavigate }) {
  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">Free · Private · No sign-up required</p>
          <h1>Support Navigator helps you explore support for eating disorders and related concerns</h1>
          <p className="hero-subtitle">A free tool to help you connect with resources—therapists, support groups, and programs—anywhere in the world.</p>
          <div className="hero-actions">
            <button className="primary-button large" onClick={onStartAssessment}>
              Take the Assessment
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button className="secondary-button" onClick={() => onNavigate('stages')}>Learn about the stages</button>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-content">
          <h2>Is this for me?</h2>
          <div className="audience-grid">
            <div className="audience-card"><div className="audience-icon">🤔</div><h4>If you're questioning</h4><p>Noticing thoughts or behaviors around food that feel different or consuming</p></div>
            <div className="audience-card"><div className="audience-icon">💭</div><h4>If you're struggling</h4><p>Trying to figure out what level of help makes sense for where you are</p></div>
            <div className="audience-card"><div className="audience-icon">🤝</div><h4>If you're supporting</h4><p>Helping a family member or friend understand what resources exist</p></div>
            <div className="audience-card"><div className="audience-icon">👩‍⚕️</div><h4>If you're a practitioner</h4><p>Looking for a referral tool when eating concerns fall outside your scope</p></div>
          </div>
        </div>
      </section>

      <section className="landing-section alt-bg">
        <div className="section-content">
          <h2>How it works</h2>
          <div className="process-cards">
            <div className="process-card">
              <div className="process-icon">📝</div>
              <h4>Answer 12 questions</h4>
              <p>About patterns in your life. Takes about 5 minutes.</p>
            </div>
            <div className="process-card">
              <div className="process-icon">🧭</div>
              <h4>Get your support stage</h4>
              <p>Understand where you are on a spectrum of support needs.</p>
            </div>
            <div className="process-card">
              <div className="process-icon">🔍</div>
              <h4>Find real resources</h4>
              <p>We search for therapists, groups, and programs near you.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section cta-section">
        <div className="section-content centered">
          <h2>Ready to explore?</h2>
          <p>No sign-up, no email, completely private.</p>
          <button className="primary-button large" onClick={onStartAssessment}>Begin the Assessment<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <p><strong>Support Navigator</strong> — A free navigation tool for eating disorder support.</p>
          <p>This is not a medical service. If you're in crisis, please contact a <button onClick={() => onNavigate('resources')} className="footer-link">crisis helpline</button>.</p>
          <p><button onClick={() => onNavigate('contact')} className="footer-link">Contact</button></p>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// STAGES PAGE
// ============================================
function StagesPage({ onStartAssessment, onQuickSearch, highlightStage = null }) {
  return (
    <div className="content-page">
      <div className="page-content wide">
        <section className="content-section">
          <h2 className="stages-title">Understanding the Four Stages</h2>
          <div className="stages-explainer">
            <p>We're not clinicians, and these stages aren't diagnoses. So why use them?</p>
            <p>To search effectively for resources—therapists, programs, support groups—our search engine needs to understand the <em>intensity</em> of support that might be helpful. Our four categories help our AI search engine return better and more personalized results in your area.</p>
          </div>
        </section>
        <div className="stages-grid-2x2">
          {[0, 1, 2, 3].map(stage => (
            <div key={stage} className={`stage-card ${highlightStage === stage ? 'highlighted' : ''}`}>
              <div className="stage-card-header" style={{ borderLeftColor: stageContent[stage].color }}>
                <span className="stage-number" style={{ background: stageContent[stage].color }}>{stage}</span>
                <div><h3>{stageContent[stage].name}</h3><p className="stage-description">{stageContent[stage].description}</p></div>
                {highlightStage === stage && <span className="your-result-badge">Your result</span>}
              </div>
              <div className="stage-card-body">
                <p>{stageContent[stage].positioning}</p>
                <div className="stage-helps"><h4>What typically helps:</h4><ul>{stageContent[stage].helps.map((help, idx) => <li key={idx}>{help}</li>)}</ul></div>
              </div>
            </div>
          ))}
        </div>
        <div className="page-cta page-cta-dual">
          <button className="primary-button large" onClick={onStartAssessment}>Take the Assessment<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
          <button className="secondary-button large" onClick={onQuickSearch}>Search Now – I Know the Stage</button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HOW IT WORKS PAGE (includes Limitations)
// ============================================
function HowItWorksPage({ onStartAssessment }) {
  return (
    <div className="content-page how-it-works-page">
      <div className="page-content wide">
        
        {/* Hero Section */}
        <div className="hiw-hero">
          <h1>How Support Navigator Works</h1>
          <p>A simple, private and dynamic way to explore your options and find support that fits.</p>
        </div>

        {/* Process Steps - Now first */}
        <div className="hiw-process">
          <h2>The Process</h2>
          <div className="hiw-steps-simple">
            <div className="hiw-step-simple">
              <div className="hiw-step-icon">📝</div>
              <div className="hiw-step-content">
                <h4>Take the Assessment</h4>
                <p>Answer 12 questions about your patterns and experiences. Takes about 5 minutes.</p>
              </div>
            </div>
            <div className="hiw-step-arrow">→</div>
            <div className="hiw-step-simple">
              <div className="hiw-step-icon">🔍</div>
              <div className="hiw-step-content">
                <h4>Find Resources</h4>
                <p>We build a personalized report of therapists, programs, and support groups in your area.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy - Simplified, no cards */}
        <div className="hiw-philosophy">
          <div className="philosophy-item">
            <div className="philosophy-icon">🧭</div>
            <div className="philosophy-text">
              <h3>Our Philosophy</h3>
              <p>Finding support for eating concerns shouldn't require you to already know what you need.</p>
            </div>
          </div>
          
          <div className="philosophy-item">
            <div className="philosophy-icon">💬</div>
            <div className="philosophy-text">
              <h3>Navigation, Not Diagnosis</h3>
              <p>Our engine tries to identify patterns and then point users to resources that tend to help people in similar situations.</p>
            </div>
          </div>
        </div>

        <div className="hiw-cta">
          <button className="primary-button large" onClick={onStartAssessment}>
            Start the Assessment
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <p>Free · Private · No sign-up required</p>
        </div>

        {/* Limitations Section */}
        <div id="limitations" className="limitations-embedded">
          <div className="limitations-header">
            <h2>Our Limitations</h2>
            <p className="limitations-subtitle">What this tool is—and what it isn't</p>
          </div>

          <div className="limitations-grid">
            <div className="limitation-card not">
              <h3>This is NOT</h3>
              <ul>
                <li>A medical diagnosis or clinical assessment</li>
                <li>A substitute for professional evaluation</li>
                <li>A recommendation for specific treatment</li>
                <li>An endorsement of any provider or program</li>
                <li>A guarantee that resources are currently available</li>
                <li>Medical, psychological, or nutritional advice</li>
              </ul>
            </div>
            <div className="limitation-card is">
              <h3>This IS</h3>
              <ul>
                <li>A navigation tool to help you explore options</li>
                <li>A starting point for finding support</li>
                <li>A way to understand different levels of care</li>
                <li>A personalized report built from real-time sources</li>
                <li>Free, private, and anonymous</li>
                <li>Built with care, but by non-clinicians</li>
              </ul>
            </div>
          </div>

          <div className="methodology-header">
            <h2>About Our Methodology</h2>
          </div>

          <div className="limitations-details">
            <div className="limitations-detail-card">
              <h3>About Our Search Results</h3>
              <p>When you search for resources, we use AI to search the web in real-time. This means:</p>
              <ul>
                <li>Results are only as good as what's publicly available online</li>
                <li>We cannot verify credentials, availability, or quality of care</li>
                <li>Some excellent providers may not appear in results</li>
                <li>Information may be outdated—always verify directly</li>
                <li>We have no financial relationship with any provider listed</li>
              </ul>
            </div>

            <div className="limitations-detail-card">
              <h3>About Our "Stages"</h3>
              <p>We use four stages to help match you with appropriate resources.</p>
              <ul>
                <li>These stages are <strong>not</strong> clinical diagnoses or official categories</li>
                <li>They're a practical framework to help our search tool understand what type of support might be relevant</li>
                <li>Only a qualified healthcare professional can assess your specific situation and recommend appropriate care</li>
              </ul>
            </div>

            <div className="limitations-detail-card">
              <h3>Your Responsibility</h3>
              <p>Please use this tool as a starting point, not an ending point. We encourage you to:</p>
              <ul>
                <li>Verify any provider's credentials and current availability</li>
                <li>Consult with a healthcare professional about your specific needs</li>
                <li>Trust your instincts—if something doesn't feel right, keep looking</li>
                <li>Seek emergency care if you're in crisis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// RESOURCES PAGE
// ============================================
function ResourcesPage() {
  return (
    <div className="content-page">
      <div className="page-content resources-coming-soon">
        <div className="resources-buttons">
          <a href="https://findahelpline.com/" target="_blank" rel="noopener noreferrer" className="knowledge-map-link-large crisis-resources-btn">
            <span className="km-icon-large">🆘</span>
            <div className="km-content-large">
              <h3>Crisis Support</h3>
              <p>Find help in your country</p>
            </div>
            <span className="km-arrow-large">→</span>
          </a>
          
          <a href="https://ed-knowledge-map.netlify.app/" target="_blank" rel="noopener noreferrer" className="knowledge-map-link-large">
            <span className="km-icon-large">🗺️</span>
            <div className="km-content-large">
              <h3>ED Knowledge Map</h3>
              <p>Interactive resource explorer</p>
            </div>
            <span className="km-arrow-large">→</span>
          </a>
        </div>
        
        <div className="coming-soon-section">
          <h2>Coming Soon</h2>
          <p>We're building a comprehensive resource center with curated support options by region.</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ============================================
// CONTACT PAGE
// ============================================
function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'contact',
          ...formData
        }).toString()
      });
      
      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="content-page">
        <div className="page-content">
          <div className="contact-success">
            <div className="success-icon">✓</div>
            <h1>Message Sent</h1>
            <p>Thanks for reaching out.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-page">
      <div className="page-content">
        <h1>Contact</h1>
        
        <form 
          className="contact-form" 
          name="contact" 
          method="POST" 
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="form-name" value="contact" />
          <p hidden><label>Don't fill this out: <input name="bot-field" /></label></p>
          
          <div className="form-group">
            <label>Name (optional)</label>
            <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          
          <div className="form-group">
            <label>Email (optional)</label>
            <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          
          <div className="form-group">
            <label>Message *</label>
            <textarea name="message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows="5" required />
          </div>
          
          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================
// STAGE SELECTOR
// ============================================
function StageSelector({ selectedStage, assessedStage, onSelect }) {
  return (
    <div className="stage-selector">
      <label className="stage-selector-label">Search for resources matching:</label>
      <div className="stage-selector-cards">
        {[0, 1, 2, 3].map(stage => (
          <button key={stage} className={`stage-selector-card ${selectedStage === stage ? 'selected' : ''}`} onClick={() => onSelect(stage)}>
            <span className="stage-selector-number" style={{ background: stageContent[stage].color }}>{stage}</span>
            <span className="stage-selector-name">{stageContent[stage].name}</span>
            {assessedStage === stage && <span className="stage-selector-badge">Your result</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// QUICK SEARCH MODAL
// ============================================
function QuickSearchModal({ isOpen, onClose, onSelectStage }) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content quick-search-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Quick Search</h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        <div className="modal-body">
          <p className="quick-search-intro">Select the stage that best matches your needs:</p>
          <div className="quick-search-stages">
            {[0, 1, 2, 3].map(stage => (
              <button 
                key={stage} 
                className="quick-search-stage-card"
                onClick={() => onSelectStage(stage)}
              >
                <div className="quick-stage-header">
                  <span className="quick-stage-num" style={{ background: stageContent[stage].color }}>{stage}</span>
                  <h3>{stageContent[stage].name}</h3>
                </div>
                <p>{stageContent[stage].description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SEARCH PROMPTS MODAL
// ============================================
function SearchPromptsPanel({ stage, location, isOpen, onClose }) {
  if (!isOpen) return null;
  const prompts = searchPromptLibrary[stage];
  const loc = location || '[YOUR CITY]';
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h2>Search It Yourself</h2><button onClick={onClose} className="modal-close">×</button></div>
        <div className="modal-body">
          <p className="search-prompts-intro">Copy these search terms into Google to find resources:</p>
          <div className="search-prompts-list">
            {prompts.prompts.map((prompt, idx) => {
              const filled = prompt.replace('[LOCATION]', loc);
              return <div key={idx} className="search-prompt-item"><code>{filled}</code><button className="copy-button" onClick={() => navigator.clipboard.writeText(filled)}>Copy</button></div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// RESOURCE DETAIL MODAL
// ============================================
function ResourceDetailModal({ resource, stageName, location, isOpen, onClose }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && resource && !summary) {
      fetchDetails();
    }
  }, [isOpen, resource]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSummary(null);
      setError(null);
    }
  }, [isOpen]);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/.netlify/functions/resource-detail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: resource.url || null,
          resourceName: resource.name,
          resourceType: resource.type,
          stageName: stageName,
          location: location
        })
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSummary(data.summary);
      }
    } catch (err) {
      setError('Could not load additional details.');
    } finally {
      setLoading(false);
    }
  };

  // Parse markdown-style formatting in summary
  const renderSummary = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        return <h3 key={idx}>{trimmed.replace(/\*\*/g, '')}</h3>;
      }
      if (trimmed.startsWith('- ')) {
        return <li key={idx}>{trimmed.substring(2)}</li>;
      }
      return <p key={idx}>{trimmed}</p>;
    });
  };

  // Check if phone is valid
  const isValidPhone = (phone) => {
    if (!phone || phone.trim() === '') return false;
    const lower = phone.toLowerCase();
    if (lower.includes('not specified') || lower.includes('n/a') || 
        lower.includes('contact') || lower.includes('website') ||
        lower.includes('see ') || lower.includes('visit') || 
        lower.includes('available')) return false;
    if (!phone.match(/\d/)) return false;
    return true;
  };

  if (!isOpen || !resource) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="resource-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-area">
            <h2>{resource.name}</h2>
            {resource.type && <span className="modal-resource-type">{resource.type}</span>}
          </div>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <div className="modal-body">
          <div className="detail-summary">
            {/* Always show what we have from the search results */}
            <div className="detail-existing">
              {resource.description && (
                <div className="detail-section">
                  <h3>Overview</h3>
                  <p>{resource.description}</p>
                </div>
              )}
              {resource.notes && (
                <div className="detail-section">
                  <h3>Notes</h3>
                  <p>{resource.notes}</p>
                </div>
              )}
            </div>

            {/* AI-enhanced details section */}
            <div className="detail-ai-section">
              {loading && (
                <div className="detail-loading-inline">
                  <div className="detail-spinner-small"></div>
                  <span>Getting more details...</span>
                </div>
              )}
              {error && !summary && (
                <div className="detail-error-inline">
                  <span>{error}</span>
                  <button onClick={fetchDetails} className="text-button">Try again</button>
                </div>
              )}
              {summary && (
                <div className="detail-content">
                  <div className="ai-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                    AI-Enhanced Details
                  </div>
                  {renderSummary(summary)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {resource.url && (
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="primary-button">
              Visit Website
            </a>
          )}
          {isValidPhone(resource.phone) && (
            <a href={`tel:${resource.phone.replace(/\s/g, '')}`} className="secondary-button">
              {resource.phone}
            </a>
          )}
          <button onClick={onClose} className="text-button">Close</button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [inAssessment, setInAssessment] = useState(false);
  const [resultsView, setResultsView] = useState('results');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showUrgentCrisis, setShowUrgentCrisis] = useState(false);
  const [showSoftCrisis, setShowSoftCrisis] = useState(false);
  const [location, setLocation] = useState('');
  const [searchPreference, setSearchPreference] = useState('both');
  const [searchStage, setSearchStage] = useState(null);
  
  // Background search state
  const [searchJobId, setSearchJobId] = useState(null);
  const [searchStatus, setSearchStatus] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [searchStartTime, setSearchStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpQuestionIndex, setHelpQuestionIndex] = useState(0);
  const [floatingHelpOpen, setFloatingHelpOpen] = useState(false);
  const [searchPromptsOpen, setSearchPromptsOpen] = useState(false);
  const [highlightStage, setHighlightStage] = useState(null);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  
  // Resource detail modal state
  const [detailResource, setDetailResource] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Poll for search results
  useEffect(() => {
    let pollInterval;
    let timeInterval;

    if (searchJobId && (searchStatus === 'pending' || searchStatus === 'searching')) {
      // Update elapsed time every second
      timeInterval = setInterval(() => {
        if (searchStartTime) {
          setElapsedTime((Date.now() - searchStartTime) / 1000);
        }
      }, 500);

      // Poll for results every 3 seconds
      pollInterval = setInterval(async () => {
        try {
          const response = await fetch(`/.netlify/functions/search-status?jobId=${searchJobId}`);
          const data = await response.json();
          
          if (data.status === 'complete') {
            setSearchStatus('complete');
            setSearchResults(data.results);
            clearInterval(pollInterval);
            clearInterval(timeInterval);
          } else if (data.status === 'error') {
            setSearchStatus('error');
            // Convert raw errors to friendly messages
            let friendlyError = data.error || 'Search failed';
            if (data.error && data.error.includes('rate_limit')) {
              friendlyError = "Our search service is busy right now. Please wait a minute and try again.";
            } else if (data.error && data.error.includes('timeout')) {
              friendlyError = "The search took too long. Please try again with a more specific location.";
            }
            setSearchError(friendlyError);
            clearInterval(pollInterval);
            clearInterval(timeInterval);
          } else {
            setSearchStatus(data.status);
          }
        } catch (err) {
          console.error('Poll error:', err);
        }
      }, 3000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      if (timeInterval) clearInterval(timeInterval);
    };
  }, [searchJobId, searchStatus, searchStartTime]);

  const navigate = (page, scrollTo = null) => { 
    setCurrentPage(page); 
    setInAssessment(false); 
    setShowResults(false); 
    setResultsView('results'); 
    if (scrollTo) {
      // Delay scroll to allow page to render, offset for sticky header
      setTimeout(() => {
        const element = document.getElementById(scrollTo);
        if (element) {
          const headerOffset = 120; // Account for sticky header + some padding
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0); 
    }
  };
  
  const startAssessment = () => {
    setShowUrgentCrisis(false); setShowSoftCrisis(false); setShowResults(false); setSearchResults(null);
    setSearchStage(null); setSearchJobId(null); setSearchStatus(null); setCurrentQuestion(0); setAnswers({});
    setHelpOpen(false); setInAssessment(true); setResultsView('results'); window.scrollTo(0, 0);
  };

  const handleQuickSearch = (stage) => {
    setQuickSearchOpen(false);
    setSearchStage(stage);
    setShowUrgentCrisis(false); setShowSoftCrisis(false); setShowResults(true); setSearchResults(null);
    setSearchJobId(null); setSearchStatus(null); setAnswers({});
    setInAssessment(true); setResultsView('results'); window.scrollTo(0, 0);
  };

  const calculateScore = () => { let score = 0; for (let i = 1; i <= 11; i++) score += answers[i] || 0; return score; };

  const handleAnswer = (value) => {
    const q = questions[currentQuestion];
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);
    if (q.safetyGate) { 
      if (value >= 2) { setShowUrgentCrisis(true); setShowSoftCrisis(false); } 
      else if (value === 1) { setShowSoftCrisis(true); setShowUrgentCrisis(false); }
      else { setShowSoftCrisis(false); setShowUrgentCrisis(false); }
    }
    if (currentQuestion < questions.length - 1) { setCurrentQuestion(currentQuestion + 1); }
    else { const score = Object.keys(newAnswers).filter(k => k !== '12').reduce((sum, k) => sum + (newAnswers[k] || 0), 0); const stage = getStage(score); setSearchStage(stage); setHighlightStage(stage); setShowResults(true); }
  };

  const exitAssessment = () => { setInAssessment(false); setCurrentPage('home'); setShowUrgentCrisis(false); setShowSoftCrisis(false); setShowResults(false); setAnswers({}); setCurrentQuestion(0); setHighlightStage(null); setResultsView('results'); };

  // Start background search
  const performSearch = async () => {
    if (!location.trim()) return;
    const stage = searchStage !== null ? searchStage : getStage(calculateScore());
    const stageInfo = stageContent[stage];
    const jobId = generateJobId();
    
    setSearchJobId(jobId);
    setSearchStatus('pending');
    setSearchError(null);
    setSearchResults(null);
    setSearchStartTime(Date.now());
    setElapsedTime(0);

    try {
      // Call background function directly - it returns 202 immediately
      const response = await fetch('/.netlify/functions/search-resources-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          stage,
          stageName: stageInfo.name,
          stageHelps: stageInfo.helps,
          location: location.trim(),
          preference: searchPreference
        })
      });

      // Background functions return 202
      if (response.status !== 202 && !response.ok) {
        throw new Error('Failed to start search');
      }
      
      // Polling will take over from here via useEffect
    } catch (err) {
      setSearchStatus('error');
      setSearchError(err.message || 'Failed to start search');
    }
  };

  const getContext = () => {
    if (inAssessment && !showResults) return { type: 'assessment', data: { currentQuestion, totalQuestions: questions.length, onExit: exitAssessment } };
    if (showResults && resultsView === 'results') { const stage = searchStage !== null ? searchStage : getStage(calculateScore()); return { type: 'results', data: { stageName: stageContent[stage].name, view: resultsView, setView: setResultsView } }; }
    if (showResults && resultsView === 'search') return { type: 'search', data: { location, onBack: () => setResultsView('results') } };
    if (!inAssessment && currentPage !== 'home') { const titles = { 'stages': 'Understanding the Stages', 'how-it-works': 'How This Works', 'limitations': 'Our Limitations', 'resources': 'Other Resources', 'contact': 'Contact Us' }; return { type: 'page', data: { title: titles[currentPage] || '' } }; }
    return null;
  };
  const context = getContext();

  // Non-assessment pages
  if (!inAssessment) {
    return (
      <div className="app-wrapper">
        <TopNav currentPage={currentPage} onNavigate={navigate} onStartAssessment={startAssessment} inAssessment={inAssessment} />
        {context && <ContextNav context={context.type} data={context.data} />}
        <main className="main-content">
          {currentPage === 'home' && <LandingPage onStartAssessment={startAssessment} onNavigate={navigate} />}
          {currentPage === 'stages' && <StagesPage onStartAssessment={startAssessment} onQuickSearch={() => setQuickSearchOpen(true)} highlightStage={highlightStage} />}
          {currentPage === 'how-it-works' && <HowItWorksPage onStartAssessment={startAssessment} />}
          {currentPage === 'resources' && <ResourcesPage />}
          {currentPage === 'contact' && <ContactPage />}
        </main>
        <FloatingHelper isOpen={floatingHelpOpen} onToggle={() => setFloatingHelpOpen(!floatingHelpOpen)} />
        <QuickSearchModal 
          isOpen={quickSearchOpen} 
          onClose={() => setQuickSearchOpen(false)} 
          onSelectStage={handleQuickSearch}
        />
      </div>
    );
  }

  // Search view
  if (showResults && resultsView === 'search') {
    const assessedStage = getStage(calculateScore());
    const selectedStage = searchStage !== null ? searchStage : assessedStage;

    // Show loading while searching
    if (searchStatus === 'pending' || searchStatus === 'searching') {
      return (
        <div className="app-wrapper">
          <TopNav currentPage={currentPage} onNavigate={navigate} onStartAssessment={startAssessment} inAssessment={inAssessment} />
          <ContextNav context="search" data={{ location, onBack: () => { setResultsView('results'); setSearchJobId(null); setSearchStatus(null); } }} />
          <main className="main-content"><div className="search-page"><SearchLoading elapsedTime={elapsedTime} status={searchStatus} /></div></main>
        </div>
      );
    }

    // Show results
    if (searchResults) {
      return (
        <div className="app-wrapper">
          <TopNav currentPage={currentPage} onNavigate={navigate} onStartAssessment={startAssessment} inAssessment={inAssessment} />
          <ContextNav context="search" data={{ location, onBack: () => setResultsView('results') }} />
          <main className="main-content">
            {showUrgentCrisis && (
              <div className="urgent-crisis-notice" style={{maxWidth: '1200px', margin: '0 auto 1.5rem', padding: '0 1.5rem'}}>
                <h3>You don't have to face this alone</h3>
                <p>If you are in immediate danger or thinking about harming yourself, please reach out for support.</p>
                <a href="https://findahelpline.com/" target="_blank" rel="noopener noreferrer" className="crisis-button urgent">Find Crisis Support in Your Country →</a>
              </div>
            )}
            {showSoftCrisis && !showUrgentCrisis && (
              <div className="soft-crisis-notice" style={{maxWidth: '1200px', margin: '0 auto 1.5rem', padding: '0 1.5rem'}}>
                <h3>Support is available</h3>
                <p>If you ever need someone to talk to, free confidential support is available.</p>
                <a href="https://findahelpline.com/" target="_blank" rel="noopener noreferrer" className="crisis-button">Find Support →</a>
              </div>
            )}
            <div className="resource-results-container" id="resource-results-container">
              <div className="resource-results-header">
                <div className="results-header-top">
                  <div>
                    <h1>Resources for You</h1>
                    <p className="results-context">Based on {stageContent[selectedStage].name} in {location}</p>
                  </div>
                  <button 
                    onClick={() => exportToPDF('resource-results-container', `support-navigator-${location.replace(/\s+/g, '-').toLowerCase()}.pdf`)}
                    className="secondary-button pdf-button"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                    </svg>
                    Save as PDF
                  </button>
                </div>
              </div>
              {(searchResults.introduction || searchResults.additionalNotes) && (
                <div className="results-insights">
                  <div className="insights-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                    <h2>What We Found</h2>
                  </div>
                  <div className="insights-content">
                    {searchResults.introduction && <p>{searchResults.introduction}</p>}
                    {searchResults.additionalNotes && <p>{searchResults.additionalNotes}</p>}
                  </div>
                </div>
              )}
              {searchResults.categories && searchResults.categories.map((cat, idx) => (
                <div key={idx} className="resource-category">
                  <h2>{cat.name}</h2>
                  <div className="resource-list">
                    {cat.resources && cat.resources.map((r, rIdx) => (
                      <div key={rIdx} className="resource-card">
                        <div className="resource-card-header"><h3>{r.name}</h3>{r.type && <span className="resource-type">{r.type}</span>}</div>
                        <p className="resource-description">{r.description}</p>
                        {r.notes && <p className="resource-notes">{r.notes}</p>}
                        <div className="resource-links">
                          <button 
                            className="resource-detail-button"
                            onClick={() => {
                              setDetailResource(r);
                              setDetailModalOpen(true);
                            }}
                          >
                            More Detail
                          </button>
                          {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="resource-link-button">Visit Website</a>}
                          {r.phone && 
                            r.phone.trim() !== '' && 
                            !r.phone.toLowerCase().includes('not specified') && 
                            !r.phone.toLowerCase().includes('n/a') && 
                            !r.phone.toLowerCase().includes('contact') && 
                            !r.phone.toLowerCase().includes('website') && 
                            !r.phone.toLowerCase().includes('see ') && 
                            !r.phone.toLowerCase().includes('visit') && 
                            !r.phone.toLowerCase().includes('available') && 
                            r.phone.match(/\d/) && (
                            <a href={`tel:${r.phone.replace(/\s/g, '')}`} className="resource-phone-link">{r.phone}</a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="diy-search-section"><h2>Want to search yourself?</h2><p>Try these search terms for more options:</p><button className="secondary-button" onClick={() => setSearchPromptsOpen(true)}>View Search Prompts</button></div>
              <div className="resource-results-footer">
                <div className="results-caveat"><p>These are options to explore, not recommendations. Please verify before contacting any provider.</p></div>
                <div className="results-actions">
                  <button 
                    onClick={() => exportToPDF('resource-results-container', `support-navigator-${location.replace(/\s+/g, '-').toLowerCase()}.pdf`)}
                    className="secondary-button pdf-button"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                    </svg>
                    Save as PDF
                  </button>
                  <button onClick={() => { setSearchResults(null); setSearchJobId(null); setSearchStatus(null); }} className="secondary-button">Search Again</button>
                  <button onClick={exitAssessment} className="primary-button">Done</button>
                </div>
              </div>
            </div>
          </main>
          <SearchPromptsPanel stage={selectedStage} location={location} isOpen={searchPromptsOpen} onClose={() => setSearchPromptsOpen(false)} />
          <ResourceDetailModal 
            resource={detailResource}
            stageName={stageContent[selectedStage].name}
            location={location}
            isOpen={detailModalOpen}
            onClose={() => { setDetailModalOpen(false); setDetailResource(null); }}
          />
        </div>
      );
    }

    // Search form
    return (
      <div className="app-wrapper">
        <TopNav currentPage={currentPage} onNavigate={navigate} onStartAssessment={startAssessment} inAssessment={inAssessment} />
        <ContextNav context="search" data={{ location, onBack: () => setResultsView('results') }} />
        <main className="main-content">
          <div className="search-page">
            <div className="search-form-container">
              <h1>Find Resources</h1>
              <p className="search-intro">We'll search for real therapists, support groups, and programs in your area.</p>
              <div className="search-form">
                <div className="form-group"><label>Where are you located?</label><input type="text" placeholder="City, region, or country" value={location} onChange={(e) => setLocation(e.target.value)} className="location-input"/></div>
                <StageSelector selectedStage={selectedStage} assessedStage={assessedStage} onSelect={(s) => setSearchStage(s)}/>
                <div className="form-group">
                  <label>Type of support:</label>
                  <div className="preference-options">
                    {['both', 'local', 'remote'].map(pref => <button key={pref} className={`preference-option ${searchPreference === pref ? 'selected' : ''}`} onClick={() => setSearchPreference(pref)}><span className="preference-icon">{pref === 'both' ? '🌐' : pref === 'local' ? '📍' : '💻'}</span><span>{pref === 'both' ? 'Both' : pref === 'local' ? 'In-person' : 'Remote'}</span></button>)}
                  </div>
                </div>
                {searchError && <div className="search-error"><p>{searchError}</p><button className="text-button" onClick={() => setSearchPromptsOpen(true)}>Try DIY search prompts →</button></div>}
                <button className="primary-button large full-width" onClick={performSearch} disabled={!location.trim()}>Search for Resources</button>
                <div className="search-note"><p>This comprehensive search can take 120+ seconds. Please be patient.</p></div>
              </div>
            </div>
          </div>
        </main>
        <SearchPromptsPanel stage={selectedStage} location={location} isOpen={searchPromptsOpen} onClose={() => setSearchPromptsOpen(false)} />
      </div>
    );
  }

  // Results summary
  if (showResults && resultsView === 'results') {
    const score = calculateScore();
    const stage = getStage(score);
    const content = stageContent[stage];
    return (
      <div className="app-wrapper">
        <TopNav currentPage={currentPage} onNavigate={navigate} onStartAssessment={startAssessment} inAssessment={inAssessment} />
        <ContextNav context="results" data={{ stageName: content.name, view: resultsView, setView: setResultsView }} />
        <main className="main-content">
          <div className="results-page">
            {showUrgentCrisis && (
              <div className="urgent-crisis-notice">
                <h3>You don't have to face this alone</h3>
                <p>If you are in immediate danger or thinking about harming yourself, please reach out for support.</p>
                <a href="https://findahelpline.com/" target="_blank" rel="noopener noreferrer" className="crisis-button urgent">Find Crisis Support in Your Country →</a>
              </div>
            )}
            {showSoftCrisis && !showUrgentCrisis && (
              <div className="soft-crisis-notice">
                <h3>Support is available</h3>
                <p>If you ever need someone to talk to, free confidential support is available.</p>
                <a href="https://findahelpline.com/" target="_blank" rel="noopener noreferrer" className="crisis-button">Find Support →</a>
              </div>
            )}
            
            <div className="results-top">
              <div className="results-main">
                <div className="results-header"><span className="results-label">Your Results</span><h1>{content.name}</h1></div>
                <div className="results-positioning"><p>{content.positioning}</p></div>
                {content.urgent && <div className="urgent-notice"><p>We encourage you to seek professional evaluation soon.</p></div>}
              </div>
              <div className="results-cta-box">
                <h3>Find Resources</h3>
                <p>We will build you a report with options in your area.</p>
                <button className="primary-button large full-width" onClick={() => setResultsView('search')}>Build My Report →</button>
              </div>
            </div>
            
            <div className="results-details">
              <div className="results-section"><h2>What often helps</h2><ul>{content.helps.map((item, idx) => <li key={idx}>{item}</li>)}</ul></div>
              <div className="results-section"><h2>What to watch for</h2><ul>{content.monitor.map((item, idx) => <li key={idx}>{item}</li>)}</ul></div>
            </div>
            
            <div className="results-footer"><button className="text-button" onClick={() => navigate('stages')}>View all stages →</button><p className="disclaimer">This is not a diagnosis. Please consult a healthcare provider for clinical assessment.</p></div>
          </div>
        </main>
      </div>
    );
  }

  // Assessment - All questions on one page
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;
  
  const handleSingleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    // Check safety gate for question 12
    const q = questions.find(q => q.id === questionId);
    if (q && q.safetyGate) {
      if (value >= 2) {
        setShowUrgentCrisis(true);
        setShowSoftCrisis(false);
      } else if (value === 1) {
        setShowSoftCrisis(true);
        setShowUrgentCrisis(false);
      } else {
        setShowSoftCrisis(false);
        setShowUrgentCrisis(false);
      }
    }
  };
  
  const handleSubmitAssessment = () => {
    if (!allAnswered) return;
    const score = Object.keys(answers).filter(k => k !== '12').reduce((sum, k) => sum + (answers[k] || 0), 0);
    const stage = getStage(score);
    setSearchStage(stage);
    setHighlightStage(stage);
    setShowResults(true);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-wrapper">
      <TopNav currentPage={currentPage} onNavigate={navigate} onStartAssessment={startAssessment} inAssessment={inAssessment} />
      <div className="assessment-header-bar">
        <div className="assessment-header-content">
          <span className="assessment-progress-text">{answeredCount} of {questions.length} answered</span>
          <button onClick={exitAssessment} className="context-exit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Exit
          </button>
        </div>
      </div>
      <main className="main-content">
        <div className="assessment-single-page">
          <div className="assessment-intro">
            <h1>Assessment</h1>
            <p>Answer each question based on your experience over the past few weeks. There are no right or wrong answers.</p>
          </div>
          
          <div className="questions-list">
            {questions.map((q, idx) => (
              <div key={q.id} className={`question-row ${answers[q.id] !== undefined ? 'answered' : ''}`}>
                <div className="question-number">{idx + 1}</div>
                <div className="question-content">
                  <div className="question-header">
                    <p className="question-text-inline">{q.text}</p>
                  </div>
                  {q.subtext && <p className="question-subtext-inline">{q.subtext}</p>}
                  <div className="answer-options-text">
                    {scaleOptions.map((option) => (
                      <button 
                        key={option.value} 
                        className={`answer-option-text ${answers[q.id] === option.value ? 'selected' : ''}`}
                        onClick={() => handleSingleAnswer(q.id, option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <button 
                    className="question-help-icon" 
                    onClick={() => { setHelpQuestionIndex(idx); setHelpOpen(true); }}
                    title="Get help with this question"
                  >
                    <span className="help-icon-text">?</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="assessment-submit">
            <button 
              className={`primary-button large ${!allAnswered ? 'disabled' : ''}`}
              onClick={handleSubmitAssessment}
              disabled={!allAnswered}
            >
              {allAnswered ? 'See My Results →' : `Answer all questions (${answeredCount}/${questions.length})`}
            </button>
            <p className="assessment-note">Your answers are private and never stored.</p>
          </div>
        </div>
      </main>
      <HelpPanel isOpen={helpOpen} onClose={() => setHelpOpen(false)} question={helpQuestionIndex + 1} questionText={questions[helpQuestionIndex].text} />
    </div>
  );
}

export default App;
