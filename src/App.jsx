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
    premature: "Intensive treatment programs or clinical interventions may not be necessary at this stage and could feel overwhelming.", 
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
    premature: "Waiting until things feel 'bad enough' to seek support. Early engagement often leads to better outcomes.", 
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
    premature: "Trying to manage this entirely alone, or relying only on self-help resources without professional guidance.", 
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
    premature: "Delaying professional evaluation or trying to manage significant symptoms without clinical support.", 
    monitor: [
      "Any medical emergency signs require immediate attention", 
      "Thoughts of self-harm should be shared with a professional immediately"
    ], 
    urgent: true,
    color: "#4a6a5d"
  }
};

const crisisResources = {
  nz: { name: "New Zealand", resources: [
    { name: "Need to Talk?", phone: "1737", description: "Free call or text, 24/7" }, 
    { name: "Lifeline", phone: "0800 543 354", description: "24/7 crisis support" }
  ]},
  au: { name: "Australia", resources: [
    { name: "Lifeline", phone: "13 11 14", description: "24/7 crisis support" }, 
    { name: "Butterfly Foundation", phone: "1800 33 4673", description: "ED support, 8am-midnight" }
  ]},
  us: { name: "United States", resources: [
    { name: "988 Suicide & Crisis Lifeline", phone: "988", description: "Call or text, 24/7" }, 
    { name: "NEDA Helpline", phone: "1-800-931-2237", description: "Mon-Thu 9am-9pm ET" }
  ]},
  uk: { name: "United Kingdom", resources: [
    { name: "Samaritans", phone: "116 123", description: "Free, 24/7" }, 
    { name: "Beat", phone: "0808 801 0677", description: "Weekdays 9am-8pm" }
  ]},
  international: { name: "International", resources: [
    { name: "IASP Crisis Centres", url: "https://www.iasp.info/resources/Crisis_Centres/", description: "Find support worldwide" }
  ]}
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

// ============================================
// TOP NAVIGATION (Site-wide)
// ============================================
function TopNav({ currentPage, onNavigate, onStartAssessment, inAssessment }) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'stages', label: 'The Stages' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'resources', label: 'Resources' },
  ];

  return (
    <nav className="top-nav">
      <div className="top-nav-container">
        <button className="nav-logo" onClick={() => onNavigate('home')}>
          <div className="nav-logo-icon">
            <svg viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" fill="url(#logoGradient)"/>
              <path d="M16 8 L16 16 L22 16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="16" cy="16" r="2" fill="white"/>
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7d9a8c"/>
                  <stop offset="100%" stopColor="#5a7d6d"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span>Recovery Navigator</span>
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
              onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
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
// CONTEXT NAV (Page-specific second tier)
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
// SEARCH PROGRESS COMPONENT
// ============================================
function SearchProgress({ status, progress, elapsedTime }) {
  const stages = [
    { key: 'starting', label: 'Starting search...' },
    { key: 'therapists', label: 'Finding therapists & specialists' },
    { key: 'programs', label: 'Searching treatment programs' },
    { key: 'dietitians', label: 'Looking for dietitians' },
    { key: 'groups', label: 'Finding support groups' },
    { key: 'compiling', label: 'Compiling results' },
  ];

  // Estimate which stage based on elapsed time
  const getActiveStage = () => {
    if (elapsedTime < 3) return 0;
    if (elapsedTime < 8) return 1;
    if (elapsedTime < 15) return 2;
    if (elapsedTime < 22) return 3;
    if (elapsedTime < 30) return 4;
    return 5;
  };

  const activeStage = getActiveStage();
  const progressPercent = Math.min(95, (elapsedTime / 35) * 100);

  return (
    <div className="search-progress-container">
      <div className="search-progress-header">
        <div className="search-progress-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spinning">
            <circle cx="12" cy="12" r="10" strokeDasharray="50" strokeDashoffset="20"/>
          </svg>
        </div>
        <h2>Searching for Resources</h2>
        <p className="search-progress-subtitle">
          We're searching the web for real providers in your area. This takes 20-40 seconds.
        </p>
      </div>

      <div className="search-progress-bar-container">
        <div className="search-progress-bar">
          <div className="search-progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <span className="search-progress-time">{Math.floor(elapsedTime)}s</span>
      </div>

      <div className="search-stages">
        {stages.map((stage, idx) => (
          <div 
            key={stage.key} 
            className={`search-stage ${idx < activeStage ? 'complete' : ''} ${idx === activeStage ? 'active' : ''}`}
          >
            <div className="search-stage-icon">
              {idx < activeStage ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 12l5 5L20 7"/>
                </svg>
              ) : idx === activeStage ? (
                <div className="search-stage-spinner"></div>
              ) : (
                <div className="search-stage-dot"></div>
              )}
            </div>
            <span className="search-stage-label">{stage.label}</span>
          </div>
        ))}
      </div>

      <div className="search-progress-note">
        <strong>Why does this take time?</strong>
        <p>
          We're not showing you a pre-made list. We're actively searching the web for 
          real therapists, clinics, and support groups in your specific area — including 
          smaller practices that might not appear in generic directories.
        </p>
      </div>
    </div>
  );
}

// ============================================
// FLOATING HELP ASSISTANT
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
    } catch (error) {
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
        <span>Help</span>
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
        <div className="floating-help-header">
          <h3>How can I help?</h3>
        </div>
        <div className="floating-help-content">
          {messages.length === 0 && (
            <div className="help-welcome">
              <p>I can answer questions about this tool, eating disorder support, or help you navigate.</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`help-message ${msg.role}`}>{msg.content}</div>
          ))}
          {isLoading && <div className="help-message assistant loading">Thinking...</div>}
        </div>
        <div className="floating-help-input">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()} 
            placeholder="Ask anything..." 
            disabled={isLoading} 
          />
          <button onClick={sendMessage} disabled={isLoading || !input.trim()}>Send</button>
        </div>
      </div>
    </>
  );
}

// ============================================
// HELP PANEL (Assessment Questions)
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
    } catch (error) {
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
        {messages.length === 0 && (
          <div className="help-welcome">
            <p>I can help clarify what this question is asking. I won't judge your answer.</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`help-message ${msg.role}`}>{msg.content}</div>
        ))}
        {isLoading && <div className="help-message assistant loading">Thinking...</div>}
      </div>
      <div className="help-panel-input">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()} 
          placeholder="Ask about this question..." 
          disabled={isLoading} 
        />
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
          <h1>Understand your relationship with food and find support that fits</h1>
          <p className="hero-subtitle">
            A free tool to help you understand where you are and connect you with real 
            resources—therapists, support groups, and programs—anywhere in the world.
          </p>
          <div className="hero-actions">
            <button className="primary-button large" onClick={onStartAssessment}>
              Take the Assessment
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button className="secondary-button" onClick={() => onNavigate('stages')}>
              Learn about the stages
            </button>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-content">
          <h2>Is this for me?</h2>
          <div className="audience-grid">
            <div className="audience-card">
              <div className="audience-icon">🤔</div>
              <h4>If you're questioning</h4>
              <p>Noticing thoughts or behaviors around food that feel different or consuming</p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">💭</div>
              <h4>If you're struggling</h4>
              <p>Trying to figure out what level of help makes sense for where you are</p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">🤝</div>
              <h4>If you're supporting</h4>
              <p>Helping a family member or friend understand what resources exist</p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">👩‍⚕️</div>
              <h4>If you're a practitioner</h4>
              <p>Looking for a referral tool when eating concerns fall outside your scope</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section alt-bg">
        <div className="section-content">
          <h2>How it works</h2>
          <div className="process-timeline">
            <div className="process-step">
              <div className="process-number">1</div>
              <div className="process-content">
                <h4>Answer 12 questions</h4>
                <p>About patterns in your life. Takes about 5 minutes.</p>
              </div>
            </div>
            <div className="process-step">
              <div className="process-number">2</div>
              <div className="process-content">
                <h4>Get your support stage</h4>
                <p>We identify where you fall on a spectrum of support needs.</p>
              </div>
            </div>
            <div className="process-step">
              <div className="process-number">3</div>
              <div className="process-content">
                <h4>Find real resources</h4>
                <p>We search for therapists, support groups, and programs in your area.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section cta-section">
        <div className="section-content centered">
          <h2>Ready to explore?</h2>
          <p>No sign-up, no email, completely private.</p>
          <button className="primary-button large" onClick={onStartAssessment}>
            Begin the Assessment
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <p><strong>Recovery Navigator</strong> — A free navigation tool for eating disorder support.</p>
          <p>This is not a medical service. If you're in crisis, please contact a <button onClick={() => onNavigate('resources')} className="footer-link">crisis helpline</button>.</p>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// STAGES PAGE
// ============================================
function StagesPage({ onStartAssessment, highlightStage = null }) {
  return (
    <div className="content-page">
      <div className="page-content">
        <section className="content-section">
          <p className="stages-intro">
            We use four stages to describe different patterns of eating concerns—not to label people, 
            but to help match you with appropriate resources.
          </p>
        </section>

        <div className="stages-grid">
          {[0, 1, 2, 3].map(stage => (
            <div key={stage} className={`stage-card ${highlightStage === stage ? 'highlighted' : ''}`}>
              <div className="stage-card-header" style={{ borderLeftColor: stageContent[stage].color }}>
                <span className="stage-number" style={{ background: stageContent[stage].color }}>{stage}</span>
                <div>
                  <h3>{stageContent[stage].name}</h3>
                  <p className="stage-description">{stageContent[stage].description}</p>
                </div>
                {highlightStage === stage && <span className="your-result-badge">Your result</span>}
              </div>
              <div className="stage-card-body">
                <p>{stageContent[stage].positioning}</p>
                <div className="stage-helps">
                  <h4>What typically helps:</h4>
                  <ul>
                    {stageContent[stage].helps.map((help, idx) => <li key={idx}>{help}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="page-cta">
          <button className="primary-button large" onClick={onStartAssessment}>
            Take the Assessment
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HOW IT WORKS PAGE
// ============================================
function HowItWorksPage({ onStartAssessment }) {
  return (
    <div className="content-page">
      <div className="page-content">
        <section className="content-section">
          <h2>Our Philosophy</h2>
          <p>
            Finding help for eating concerns shouldn't require you to already know what you need. 
            Recovery Navigator sits in the gap between "not sick enough" and "too complicated for general advice."
          </p>
        </section>

        <section className="content-section">
          <h2>Navigation, Not Diagnosis</h2>
          <p>
            We don't tell you what's "wrong" with you. We describe patterns and point toward resources 
            that tend to help people experiencing similar patterns.
          </p>
        </section>

        <section className="content-section">
          <h2>The Resource Search</h2>
          <p>
            After the assessment, we search the web in real-time for therapists, support groups, programs, 
            and organizations in your area. We can find resources anywhere in the world.
          </p>
        </section>

        <div className="page-cta">
          <button className="primary-button large" onClick={onStartAssessment}>
            Take the Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// RESOURCES PAGE
// ============================================
function ResourcesPage() {
  const regions = [
    { name: "New Zealand", resources: [
      { name: "EDANZ", desc: "Eating Disorders Association of NZ", url: "https://www.ed.org.nz" },
      { name: "1737", desc: "Free call or text, 24/7", url: "https://1737.org.nz" }
    ]},
    { name: "Australia", resources: [
      { name: "Butterfly Foundation", desc: "Australia's leading ED organization", url: "https://butterfly.org.au" }
    ]},
    { name: "United States", resources: [
      { name: "NEDA", desc: "National Eating Disorders Association", url: "https://www.nationaleatingdisorders.org" },
      { name: "988 Lifeline", desc: "Crisis support - call or text 988", url: "https://988lifeline.org" }
    ]},
    { name: "United Kingdom", resources: [
      { name: "Beat", desc: "UK's eating disorder charity", url: "https://www.beateatingdisorders.org.uk" }
    ]},
    { name: "International", resources: [
      { name: "F.E.A.S.T.", desc: "Global family support network", url: "https://www.feast-ed.org" }
    ]}
  ];

  return (
    <div className="content-page wide">
      <div className="page-content">
        <div className="resources-grid">
          {regions.map((region, idx) => (
            <section key={idx} className="resource-region">
              <h2>{region.name}</h2>
              <div className="region-resources">
                {region.resources.map((r, rIdx) => (
                  <a key={rIdx} href={r.url} target="_blank" rel="noopener noreferrer" className="resource-item">
                    <h4>{r.name}</h4>
                    <p>{r.desc}</p>
                    <span className="resource-arrow">→</span>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
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
          <button 
            key={stage}
            className={`stage-selector-card ${selectedStage === stage ? 'selected' : ''}`}
            onClick={() => onSelect(stage)}
          >
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
// SEARCH PROMPTS MODAL
// ============================================
function SearchPromptsPanel({ stage, location, isOpen, onClose }) {
  if (!isOpen) return null;
  
  const prompts = searchPromptLibrary[stage];
  const loc = location || '[YOUR CITY]';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Search It Yourself</h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        <div className="modal-body">
          <p className="search-prompts-intro">
            Copy these search terms into Google to find resources:
          </p>
          <div className="search-prompts-list">
            {prompts.prompts.map((prompt, idx) => {
              const filled = prompt.replace('[LOCATION]', loc);
              return (
                <div key={idx} className="search-prompt-item">
                  <code>{filled}</code>
                  <button className="copy-button" onClick={() => navigator.clipboard.writeText(filled)}>Copy</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================
function App() {
  // Navigation state
  const [currentPage, setCurrentPage] = useState('home');
  const [inAssessment, setInAssessment] = useState(false);
  const [resultsView, setResultsView] = useState('results'); // 'results' or 'search'
  
  // Assessment state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [showSoftCrisis, setShowSoftCrisis] = useState(false);
  
  // Search state
  const [location, setLocation] = useState('');
  const [searchPreference, setSearchPreference] = useState('both');
  const [searchStage, setSearchStage] = useState(null);
  const [searchJobId, setSearchJobId] = useState(null);
  const [searchStatus, setSearchStatus] = useState(null); // 'pending', 'searching', 'complete', 'error'
  const [searchResults, setSearchResults] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [searchStartTime, setSearchStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // UI state
  const [helpOpen, setHelpOpen] = useState(false);
  const [floatingHelpOpen, setFloatingHelpOpen] = useState(false);
  const [searchPromptsOpen, setSearchPromptsOpen] = useState(false);
  const [highlightStage, setHighlightStage] = useState(null);

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
      }, 1000);

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
            setSearchError(data.error || 'Search failed');
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

  // Navigation
  const navigate = (page) => {
    setCurrentPage(page);
    setInAssessment(false);
    setShowResults(false);
    setResultsView('results');
    window.scrollTo(0, 0);
  };

  // Start assessment
  const startAssessment = () => {
    setShowCrisis(false);
    setShowSoftCrisis(false);
    setShowResults(false);
    setSearchResults(null);
    setSearchStage(null);
    setSearchStatus(null);
    setSearchJobId(null);
    setCurrentQuestion(0);
    setAnswers({});
    setHelpOpen(false);
    setInAssessment(true);
    setResultsView('results');
    window.scrollTo(0, 0);
  };

  // Calculate score
  const calculateScore = () => {
    let score = 0;
    for (let i = 1; i <= 11; i++) {
      score += answers[i] || 0;
    }
    return score;
  };

  // Handle answer
  const handleAnswer = (value) => {
    const q = questions[currentQuestion];
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);

    if (q.safetyGate) {
      if (value >= 2) {
        setShowCrisis(true);
        return;
      }
      if (value === 1) {
        setShowSoftCrisis(true);
      }
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const score = Object.keys(newAnswers)
        .filter(k => k !== '12')
        .reduce((sum, k) => sum + (newAnswers[k] || 0), 0);
      const stage = getStage(score);
      setSearchStage(stage);
      setHighlightStage(stage);
      setShowResults(true);
    }
  };

  // Exit assessment
  const exitAssessment = () => {
    setInAssessment(false);
    setCurrentPage('home');
    setShowCrisis(false);
    setShowSoftCrisis(false);
    setShowResults(false);
    setAnswers({});
    setCurrentQuestion(0);
    setHighlightStage(null);
    setResultsView('results');
  };

  // Start search (using background function)
  const startSearch = async () => {
    if (!location.trim()) return;

    const jobId = generateJobId();
    const stage = searchStage !== null ? searchStage : getStage(calculateScore());
    const stageInfo = stageContent[stage];

    setSearchJobId(jobId);
    setSearchStatus('pending');
    setSearchError(null);
    setSearchResults(null);
    setSearchStartTime(Date.now());
    setElapsedTime(0);

    try {
      await fetch('/.netlify/functions/search-start', {
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
      // Polling will handle the rest
    } catch (err) {
      setSearchStatus('error');
      setSearchError('Failed to start search. Please try again.');
    }
  };

  // Get context for ContextNav
  const getContext = () => {
    if (showCrisis) return null;
    
    if (inAssessment && !showResults) {
      return {
        type: 'assessment',
        data: {
          currentQuestion,
          totalQuestions: questions.length,
          onExit: exitAssessment
        }
      };
    }
    
    if (showResults && resultsView === 'results') {
      const stage = searchStage !== null ? searchStage : getStage(calculateScore());
      return {
        type: 'results',
        data: {
          stageName: stageContent[stage].name,
          view: resultsView,
          setView: setResultsView
        }
      };
    }
    
    if (showResults && resultsView === 'search') {
      return {
        type: 'search',
        data: {
          location,
          onBack: () => setResultsView('results')
        }
      };
    }
    
    if (!inAssessment && currentPage !== 'home') {
      const titles = {
        'stages': 'Understanding the Stages',
        'how-it-works': 'How This Works',
        'resources': 'Other Resources'
      };
      return {
        type: 'page',
        data: { title: titles[currentPage] || '' }
      };
    }
    
    return null;
  };

  const context = getContext();

  // ============================================
  // RENDER: Crisis Screen
  // ============================================
  if (showCrisis) {
    return (
      <div className="app-wrapper">
        <TopNav currentPage={currentPage} onNavigate={navigate} onStartAssessment={startAssessment} inAssessment={inAssessment} />
        <main className="main-content">
          <div className="crisis-container">
            <div className="crisis-header">
              <div className="crisis-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                </svg>
              </div>
              <h1>You don't have to face this alone</h1>
            </div>
            <p className="crisis-message">Based on your response, connecting with someone who can help right now is important.</p>
            <div className="crisis-resources">
              {Object.entries(crisisResources).map(([key, region]) => (
                <div key={key} className="crisis-region">
                  <h3>{region.name}</h3>
                  {region.resources.map((r, idx) => (
                    <div key={idx} className="crisis-resource">
                      <span className="resource-name">{r.name}</span>
                      {r.phone && <a href={`tel:${r.phone.replace(/\s/g, '')}`} className="resource-phone">{r.phone}</a>}
                      {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="resource-link">Find support →</a>}
                      <span className="resource-desc">{r.description}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="crisis-footer">
              <button onClick={exitAssessment} className="secondary-button">Return home</button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ============================================
  // RENDER: Non-assessment pages
  // ============================================
  if (!inAssessment) {
    return (
      <div className="app-wrapper">
        <TopNav currentPage={currentPage} onNavigate={navigate} onStartAssessment={startAssessment} inAssessment={inAssessment} />
        {context && <ContextNav context={context.type} data={context.data} />}
        <main className="main-content">
          {currentPage === 'home' && <LandingPage onStartAssessment={startAssessment} onNavigate={navigate} />}
          {currentPage === 'stages' && <StagesPage onStartAssessment={startAssessment} highlightStage={highlightStage} />}
          {currentPage === 'how-it-works' && <HowItWorksPage onStartAssessment={startAssessment} />}
          {currentPage === 'resources' && <ResourcesPage />}
        </main>
        <FloatingHelper isOpen={floatingHelpOpen} onToggle={() => setFloatingHelpOpen(!floatingHelpOpen)} />
      </div>
    );
  }

  // ============================================
  // RENDER: Results - Search View
  // ============================================
  if (showResults && resultsView === 'search') {
    const assessedStage = getStage(calculateScore());
    const selectedStage = searchStage !== null ? searchStage : assessedStage;

    // Show search progress
    if (searchStatus === 'pending' || searchStatus === 'searching') {
      return (
        <div className="app-wrapper">
          <TopNav currentPage={currentPage} onNavigate={navigate} onStartAssessment={startAssessment} inAssessment={inAssessment} />
          <ContextNav context="search" data={{ location, onBack: () => { setResultsView('results'); setSearchStatus(null); } }} />
          <main className="main-content">
            <div className="search-page">
              <SearchProgress status={searchStatus} progress={null} elapsedTime={elapsedTime} />
            </div>
          </main>
        </div>
      );
    }

    // Show search results
    if (searchStatus === 'complete' && searchResults) {
      return (
        <div className="app-wrapper">
          <TopNav currentPage={currentPage} onNavigate={navigate} onStartAssessment={startAssessment} inAssessment={inAssessment} />
          <ContextNav context="search" data={{ location, onBack: () => setResultsView('results') }} />
          <main className="main-content">
            <div className="resource-results-container">
              <div className="resource-results-header">
                <h1>Resources for You</h1>
                <p className="results-context">Based on {stageContent[selectedStage].name} in {location}</p>
              </div>
              
              {searchResults.introduction && (
                <div className="results-intro"><p>{searchResults.introduction}</p></div>
              )}
              
              {searchResults.categories && searchResults.categories.map((cat, idx) => (
                <div key={idx} className="resource-category">
                  <h2>{cat.name}</h2>
                  <div className="resource-list">
                    {cat.resources.map((r, rIdx) => (
                      <div key={rIdx} className="resource-card">
                        <div className="resource-card-header">
                          <h3>{r.name}</h3>
                          {r.type && <span className="resource-type">{r.type}</span>}
                        </div>
                        <p className="resource-description">{r.description}</p>
                        {r.notes && <p className="resource-notes">{r.notes}</p>}
                        <div className="resource-links">
                          {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="resource-link-button">Visit website →</a>}
                          {r.phone && <a href={`tel:${r.phone.replace(/\s/g, '')}`} className="resource-phone-link">{r.phone}</a>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {searchResults.additionalNotes && (
                <div className="results-additional-notes">
                  <p>{searchResults.additionalNotes}</p>
                </div>
              )}
              
              <div className="diy-search-section">
                <h2>Want to search yourself?</h2>
                <p>Try these search terms for more options:</p>
                <button className="secondary-button" onClick={() => setSearchPromptsOpen(true)}>View Search Prompts →</button>
              </div>
              
              <div className="resource-results-footer">
                <div className="results-caveat">
                  <p>These are options to explore, not recommendations. Please verify before contacting any provider.</p>
                </div>
                <div className="results-actions">
                  <button onClick={() => { setSearchStatus(null); setSearchResults(null); }} className="secondary-button">Search again</button>
                  <button onClick={exitAssessment} className="primary-button">Done</button>
                </div>
              </div>
            </div>
          </main>
          <SearchPromptsPanel stage={selectedStage} location={location} isOpen={searchPromptsOpen} onClose={() => setSearchPromptsOpen(false)} />
        </div>
      );
    }

    // Show search form
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
                <div className="form-group">
                  <label>Where are you located?</label>
                  <input 
                    type="text" 
                    placeholder="City, region, or country" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    className="location-input" 
                  />
                </div>
                
                <StageSelector 
                  selectedStage={selectedStage}
                  assessedStage={assessedStage}
                  onSelect={(s) => setSearchStage(s)}
                />
                
                <div className="form-group">
                  <label>Type of support:</label>
                  <div className="preference-options">
                    {['both', 'local', 'remote'].map(pref => (
                      <button 
                        key={pref}
                        className={`preference-option ${searchPreference === pref ? 'selected' : ''}`}
                        onClick={() => setSearchPreference(pref)}
                      >
                        <span className="preference-icon">{pref === 'both' ? '🌐' : pref === 'local' ? '📍' : '💻'}</span>
                        <span>{pref === 'both' ? 'Both' : pref === 'local' ? 'In-person' : 'Remote'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {searchError && (
                  <div className="search-error">
                    <p>{searchError}</p>
                    <button className="text-button" onClick={() => setSearchPromptsOpen(true)}>Try DIY search prompts →</button>
                  </div>
                )}

                <button 
                  className="primary-button large full-width" 
                  onClick={startSearch}
                  disabled={!location.trim()}
                >
                  Search for Resources
                </button>

                <div className="search-note">
                  <p>Search takes 20-40 seconds. We search the web for real providers, not a pre-made list.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <SearchPromptsPanel stage={selectedStage} location={location} isOpen={searchPromptsOpen} onClose={() => setSearchPromptsOpen(false)} />
      </div>
    );
  }

  // ============================================
  // RENDER: Results - Summary View
  // ============================================
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
            {showSoftCrisis && (
              <div className="soft-crisis-notice">
                <h3>Support is available</h3>
                <p>You indicated occasionally feeling unsafe. Here are numbers if you need them:</p>
                <div className="soft-crisis-resources">
                  <a href="tel:988">988 (US)</a> · <a href="tel:116123">116 123 (UK)</a> · <a href="tel:1737">1737 (NZ)</a> · <a href="tel:131114">13 11 14 (AU)</a>
                </div>
              </div>
            )}
            
            <div className="results-header">
              <span className="results-label">Your Results</span>
              <h1>{content.name}</h1>
            </div>
            
            <div className="results-positioning">
              <p>{content.positioning}</p>
            </div>
            
            {content.urgent && (
              <div className="urgent-notice">
                <p>We encourage you to seek professional evaluation soon.</p>
              </div>
            )}
            
            <div className="results-section">
              <h2>What often helps at this stage</h2>
              <ul>{content.helps.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
            </div>
            
            <div className="results-section">
              <h2>What to watch for</h2>
              <ul>{content.monitor.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
            </div>
            
            <div className="results-cta">
              <h2>Ready to find support?</h2>
              <p>We'll search for real resources in your area.</p>
              <button className="primary-button large" onClick={() => setResultsView('search')}>
                Find Resources →
              </button>
            </div>
            
            <div className="results-footer">
              <button className="text-button" onClick={() => navigate('stages')}>
                View all stages →
              </button>
              <p className="disclaimer">This is not a diagnosis. Please consult a healthcare provider for clinical assessment.</p>
              <button onClick={exitAssessment} className="secondary-button">Return home</button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ============================================
  // RENDER: Assessment Questions
  // ============================================
  const question = questions[currentQuestion];

  return (
    <div className="app-wrapper">
      <TopNav currentPage={currentPage} onNavigate={navigate} onStartAssessment={startAssessment} inAssessment={inAssessment} />
      <ContextNav context="assessment" data={{ currentQuestion, totalQuestions: questions.length, onExit: exitAssessment }} />
      <main className="main-content">
        <div className="assessment-page">
          <div className="question-container">
            <h1 className="question-text">{question.text}</h1>
            {question.subtext && <p className="question-subtext">{question.subtext}</p>}
          </div>
          
          <div className="options-container">
            {scaleOptions.map((option) => (
              <button 
                key={option.value} 
                className={`option-button ${answers[question.id] === option.value ? 'selected' : ''}`}
                onClick={() => handleAnswer(option.value)}
              >
                <span className="option-value">{option.value}</span>
                <span className="option-label">{option.label}</span>
              </button>
            ))}
          </div>
          
          <div className="assessment-nav">
            {currentQuestion > 0 && (
              <button onClick={() => setCurrentQuestion(currentQuestion - 1)} className="back-button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back
              </button>
            )}
            <button onClick={() => setHelpOpen(true)} className="help-button">
              Need help with this question?
            </button>
          </div>
        </div>
      </main>
      <HelpPanel isOpen={helpOpen} onClose={() => setHelpOpen(false)} question={currentQuestion + 1} questionText={question.text} />
    </div>
  );
}

export default App;
