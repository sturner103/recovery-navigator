import { useState } from 'react';

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
  nz: { 
    name: "New Zealand", 
    resources: [
      { name: "Need to Talk?", phone: "1737", description: "Free call or text, 24/7" }, 
      { name: "Lifeline", phone: "0800 543 354", description: "24/7 crisis support" },
      { name: "Suicide Crisis Helpline", phone: "0508 828 865", description: "24/7" }
    ] 
  },
  au: { 
    name: "Australia", 
    resources: [
      { name: "Lifeline", phone: "13 11 14", description: "24/7 crisis support" }, 
      { name: "Butterfly Foundation", phone: "1800 33 4673", description: "ED-specific support, 8am-midnight" }
    ] 
  },
  us: { 
    name: "United States", 
    resources: [
      { name: "988 Suicide & Crisis Lifeline", phone: "988", description: "Call or text, 24/7" }, 
      { name: "NEDA Helpline", phone: "1-800-931-2237", description: "Mon-Thu 9am-9pm ET" }
    ] 
  },
  uk: { 
    name: "United Kingdom", 
    resources: [
      { name: "Samaritans", phone: "116 123", description: "Free, 24/7" }, 
      { name: "Beat Eating Disorders", phone: "0808 801 0677", description: "Weekdays 9am-8pm" }
    ] 
  },
  international: { 
    name: "International", 
    resources: [
      { name: "IASP Crisis Centres", url: "https://www.iasp.info/resources/Crisis_Centres/", description: "Find support worldwide" }
    ] 
  }
};

function getStage(score) {
  if (score <= 7) return 0;
  if (score <= 14) return 1;
  if (score <= 22) return 2;
  return 3;
}

// ============================================
// LOADING SPINNER COMPONENT
// ============================================
function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  );
}

// ============================================
// FLOATING HELP ASSISTANT (Site-wide)
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
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || "I'm here to help with any questions about Recovery Navigator." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't respond. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button className="floating-help-button" onClick={onToggle} aria-label="Get help">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12"/>
          ) : (
            <>
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>
            </>
          )}
        </svg>
        <span className="floating-help-label">{isOpen ? 'Close' : 'Questions?'}</span>
      </button>
      {isOpen && (
        <div className="floating-help-panel">
          <div className="floating-help-header">
            <h3>How can I help?</h3>
          </div>
          <div className="floating-help-content">
            {messages.length === 0 && (
              <div className="help-welcome">
                <p>I can answer questions about Recovery Navigator, eating disorder support, or help you understand anything on this site.</p>
                <p className="help-prompt">What would you like to know?</p>
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
      )}
    </>
  );
}

// ============================================
// NAVIGATION
// ============================================
function Navigation({ currentPage, onNavigate, onStartAssessment }) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'how-it-works', label: 'How This Works' },
    { id: 'stages', label: 'The Stages' },
    { id: 'what-to-expect', label: 'What to Expect' },
    { id: 'limitations', label: 'Our Limitations' },
    { id: 'resources', label: 'Other Resources' },
  ];

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <button className="nav-logo" onClick={() => onNavigate('home')}>
          <svg viewBox="0 0 32 32" fill="none" className="nav-logo-icon">
            <circle cx="16" cy="16" r="14" fill="#7d9a8c"/>
            <path d="M16 8 L16 16 L22 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="16" cy="16" r="2" fill="white"/>
          </svg>
          <span>Recovery Navigator</span>
        </button>
        
        <button className="nav-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <path d="M6 18L18 6M6 6l12 12"/> : <path d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
        
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navItems.map(item => (
            <button 
              key={item.id} 
              className={`nav-link ${currentPage === item.id ? 'active' : ''}`} 
              onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
            >
              {item.label}
            </button>
          ))}
          <button className="nav-cta" onClick={() => { onStartAssessment(); setMenuOpen(false); }}>
            Start Assessment
          </button>
        </div>
      </div>
    </nav>
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
            Recovery Navigator is a free tool for anyone questioning their eating patterns, 
            body image, or relationship with food. We help you understand where you are 
            and connect you with real resources—therapists, support groups, and programs—anywhere in the world.
          </p>
          <div className="hero-actions">
            <button className="primary-button large" onClick={onStartAssessment}>
              Take the Assessment
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button className="secondary-button" onClick={() => onNavigate('how-it-works')}>
              Learn how it works
            </button>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-content">
          <h2>Is this for me?</h2>
          <p className="section-intro">
            This tool is for anyone wondering whether their relationship with food, 
            body, or exercise might benefit from some support:
          </p>
          <div className="audience-list">
            <div className="audience-item">
              <span className="audience-marker"></span>
              <p><strong>If you're questioning patterns</strong> — noticing thoughts or behaviors around food that feel different, consuming, or hard to shake</p>
            </div>
            <div className="audience-item">
              <span className="audience-marker"></span>
              <p><strong>If you've been struggling</strong> — and you're trying to figure out what level of help makes sense for where you are</p>
            </div>
            <div className="audience-item">
              <span className="audience-marker"></span>
              <p><strong>If you're supporting someone</strong> — a family member, friend, or client — and want to understand what resources exist</p>
            </div>
            <div className="audience-item">
              <span className="audience-marker"></span>
              <p><strong>If you're a practitioner</strong> — looking for a referral tool when eating concerns fall outside your scope</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section alt-bg">
        <div className="section-content">
          <h2>How it works</h2>
          <p className="section-intro">We're transparent about what's under the hood:</p>
          
          <div className="process-flow">
            <div className="process-step">
              <div className="process-icon">1</div>
              <div className="process-content">
                <h4>You answer 12 questions</h4>
                <p>About patterns in your life—mental energy around food, stress when routines change, impact on daily life. Takes about 5 minutes.</p>
              </div>
            </div>
            <div className="process-arrow">↓</div>
            <div className="process-step">
              <div className="process-icon">2</div>
              <div className="process-content">
                <h4>We identify your support stage</h4>
                <p>Based on your answers, we place you on a spectrum from early awareness (Stage 0) to higher support needs (Stage 3).</p>
              </div>
            </div>
            <div className="process-arrow">↓</div>
            <div className="process-step">
              <div className="process-icon">3</div>
              <div className="process-content">
                <h4>AI searches for matching resources</h4>
                <p>We search the web in real-time for therapists, support groups, and programs in your area.</p>
              </div>
            </div>
            <div className="process-arrow">↓</div>
            <div className="process-step">
              <div className="process-icon">4</div>
              <div className="process-content">
                <h4>You get real options to explore</h4>
                <p>We show you what we found—with names, descriptions, and links. You decide what to explore.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-content centered">
          <h2>Your privacy matters</h2>
          <p className="section-intro">
            We don't store your answers. We don't create accounts. We don't track you. 
            When you close this page, your responses are gone.
          </p>
        </div>
      </section>

      <section className="landing-section cta-section">
        <div className="section-content centered">
          <h2>Ready to explore?</h2>
          <p className="section-intro">It takes about 5 minutes. No sign-up, no email required.</p>
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
// STAGES PAGE (New - replaces modal)
// ============================================
function StagesPage({ onStartAssessment, highlightStage = null }) {
  return (
    <div className="content-page">
      <div className="page-header">
        <h1>Understanding the Stages</h1>
        <p>How we think about different levels of support needs.</p>
      </div>
      
      <div className="page-content">
        <section className="content-section">
          <p className="stages-intro">
            We use four stages to describe different patterns of eating concerns—not to label people, 
            but to help match you with appropriate resources. These aren't clinical diagnoses. 
            They're a framework for navigation.
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
                    {stageContent[stage].helps.map((help, idx) => (
                      <li key={idx}>{help}</li>
                    ))}
                  </ul>
                </div>
                <div className="stage-watch">
                  <h4>What to watch for:</h4>
                  <ul>
                    {stageContent[stage].monitor.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="content-section stages-note">
          <h2>A few things to remember</h2>
          <ul>
            <li><strong>Stages aren't permanent.</strong> People move between stages over time—sometimes forward, sometimes back.</li>
            <li><strong>Higher stage ≠ worse person.</strong> These describe patterns, not character or worth.</li>
            <li><strong>You know yourself best.</strong> If our assessment doesn't feel right, trust your instincts.</li>
            <li><strong>Any stage can seek any help.</strong> There's no gatekeeping. You don't need to "earn" support.</li>
          </ul>
        </section>

        <div className="page-cta">
          <p className="cta-note">Ready to see where you might fall?</p>
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
// OTHER CONTENT PAGES
// ============================================
function HowItWorksPage({ onStartAssessment }) {
  return (
    <div className="content-page">
      <div className="page-header">
        <h1>How This Works</h1>
        <p>A thoughtful approach to eating disorder support navigation.</p>
      </div>
      
      <div className="page-content">
        <section className="content-section">
          <h2>Our Philosophy</h2>
          <p>
            Finding help for eating concerns shouldn't require you to already know what you need. 
            Too often, people get stuck between "not sick enough" for intensive treatment and 
            "too complicated" for general wellness advice.
          </p>
          <p>
            Recovery Navigator sits in that gap. We help you understand where you are, 
            what typically helps at that stage, and how to find real resources that match.
          </p>
        </section>

        <section className="content-section">
          <h2>Navigation, Not Diagnosis</h2>
          <p>
            We don't tell you what's "wrong" with you. We don't assign labels or clinical categories. 
            Instead, we describe patterns and point toward resources that tend to help people 
            experiencing similar patterns.
          </p>
          <p>
            Think of it like a compass, not a map. We help you orient toward helpful directions—you 
            decide where to go.
          </p>
        </section>

        <section className="content-section">
          <h2>The Resource Search</h2>
          <p>
            After the assessment, we offer to search for real resources in your area. This isn't a 
            pre-built directory—we use AI to search the web in real-time, finding therapists, 
            support groups, programs, and organizations that match your stage and location.
          </p>
          <p>
            We can find resources anywhere in the world—from Berlin to Auckland to Chicago. 
            We show you what we find, but we don't rank or endorse specific providers. 
            You explore the options and decide what feels right.
          </p>
        </section>

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

function WhatToExpectPage({ onStartAssessment }) {
  return (
    <div className="content-page">
      <div className="page-header">
        <h1>What to Expect</h1>
        <p>Everything you need to know before starting.</p>
      </div>
      
      <div className="page-content">
        <section className="content-section">
          <h2>The Assessment</h2>
          <div className="expect-grid">
            <div className="expect-card">
              <div className="expect-icon">📝</div>
              <h4>12 Questions</h4>
              <p>Thoughtful questions about patterns in your life. No trick questions, no clinical jargon.</p>
            </div>
            <div className="expect-card">
              <div className="expect-icon">⏱️</div>
              <h4>About 5 Minutes</h4>
              <p>Take your time. There's no timer, and you can go back to previous questions.</p>
            </div>
            <div className="expect-card">
              <div className="expect-icon">🔒</div>
              <h4>Completely Private</h4>
              <p>Nothing is stored. No account needed. When you close the page, your answers are gone.</p>
            </div>
            <div className="expect-card">
              <div className="expect-icon">💬</div>
              <h4>Help If You Need It</h4>
              <p>Every question has a "help" button if you're unsure what we're asking.</p>
            </div>
          </div>
        </section>

        <section className="content-section">
          <h2>The Questions</h2>
          <p>
            We ask about everyday experiences—how much mental energy goes to food thoughts, 
            how you feel when routines change, stress around eating with others. The questions 
            use a simple scale:
          </p>
          <div className="scale-preview">
            <div className="scale-item"><span>0</span> Not at all</div>
            <div className="scale-item"><span>1</span> Occasionally</div>
            <div className="scale-item"><span>2</span> Often</div>
            <div className="scale-item"><span>3</span> Most of the time</div>
          </div>
          <p>There are no right or wrong answers. Just respond based on how things have been for you recently.</p>
        </section>

        <section className="content-section">
          <h2>A Note on Safety</h2>
          <p>
            One of our questions asks if you're currently feeling physically unsafe or at risk of 
            harming yourself. If you indicate significant current risk, we'll show you crisis 
            resources—helplines and support services that can help right now.
          </p>
          <p>
            This isn't about "failing" the assessment. It's about making sure you have access to 
            the right support at the right time.
          </p>
        </section>

        <div className="page-cta">
          <p className="cta-note">Ready? It takes about 5 minutes, and you can stop anytime.</p>
          <button className="primary-button large" onClick={onStartAssessment}>
            Begin the Assessment
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function LimitationsPage({ onStartAssessment }) {
  return (
    <div className="content-page">
      <div className="page-header">
        <h1>Our Limitations</h1>
        <p>What this tool does and doesn't do.</p>
      </div>
      
      <div className="page-content">
        <section className="content-section">
          <p className="limitations-intro">
            We've built something we believe is helpful, but we want to be clear about what 
            Recovery Navigator is—and isn't. Honesty about limitations is part of doing this responsibly.
          </p>
        </section>

        <section className="content-section">
          <h2>We Don't Diagnose</h2>
          <p>
            Recovery Navigator is not a diagnostic tool. We don't tell you whether you have an 
            eating disorder, and we're not qualified to. Only trained healthcare professionals 
            can provide clinical diagnoses.
          </p>
        </section>

        <section className="content-section">
          <h2>We Don't Provide Treatment</h2>
          <p>
            This tool doesn't deliver therapy, counseling, nutrition planning, or any form of 
            clinical treatment. We point toward resources—we don't replace them.
          </p>
        </section>

        <section className="content-section">
          <h2>We Don't Endorse Providers</h2>
          <p>
            When we search for resources, we're showing you what exists—not recommending specific 
            providers. We can't verify the quality of individual therapists, programs, or organizations.
          </p>
        </section>

        <section className="content-section">
          <h2>We Use AI—And That Has Limits</h2>
          <p>
            Parts of this tool—including the question helper and resource search—are powered by AI. 
            AI has limitations: it can make mistakes, provide imperfect information, and can't 
            replace human judgment. We use AI to make helpful support more accessible, not to 
            replace human care.
          </p>
        </section>

        <section className="content-section">
          <h2>We're Not Emergency Services</h2>
          <p>
            If you're in immediate danger—medical emergency, active self-harm, or crisis—please 
            contact emergency services or a crisis helpline.
          </p>
          <div className="emergency-numbers">
            <p><strong>Emergency services:</strong> 111 (NZ) · 000 (AU) · 911 (US/CA) · 999 (UK) · 112 (EU)</p>
          </div>
        </section>

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

function ResourcesPage() {
  const regions = [
    { 
      name: "New Zealand", 
      resources: [
        { name: "EDANZ", desc: "Eating Disorders Association of New Zealand — support, education, and advocacy", url: "https://www.ed.org.nz" },
        { name: "1737", desc: "Free call or text for mental health support, 24/7", url: "https://1737.org.nz" }
      ]
    },
    { 
      name: "Australia", 
      resources: [
        { name: "Butterfly Foundation", desc: "Australia's leading eating disorder support organization", url: "https://butterfly.org.au" },
        { name: "InsideOut Institute", desc: "Research and clinical excellence in eating disorders", url: "https://insideoutinstitute.org.au" }
      ]
    },
    { 
      name: "United States", 
      resources: [
        { name: "NEDA", desc: "National Eating Disorders Association — information, screening, and treatment finder", url: "https://www.nationaleatingdisorders.org" },
        { name: "Project HEAL", desc: "Connecting people to treatment and support", url: "https://www.theprojectheal.org" },
        { name: "988 Lifeline", desc: "Suicide and crisis support — call or text 988", url: "https://988lifeline.org" }
      ]
    },
    { 
      name: "United Kingdom", 
      resources: [
        { name: "Beat", desc: "UK's eating disorder charity — helplines, support groups, and information", url: "https://www.beateatingdisorders.org.uk" },
        { name: "Samaritans", desc: "24/7 emotional support — call 116 123 (free)", url: "https://www.samaritans.org" }
      ]
    },
    { 
      name: "International", 
      resources: [
        { name: "F.E.A.S.T.", desc: "Global support network for families of those with eating disorders", url: "https://www.feast-ed.org" },
        { name: "IASP Crisis Centres", desc: "Find crisis support anywhere in the world", url: "https://www.iasp.info/resources/Crisis_Centres/" }
      ]
    }
  ];

  return (
    <div className="content-page wide">
      <div className="page-header">
        <h1>Other Resources</h1>
        <p>Trusted organizations and support around the world.</p>
      </div>
      
      <div className="page-content">
        <section className="content-section">
          <p className="resources-intro">
            Recovery Navigator is one tool among many. These organizations have been supporting 
            people with eating concerns for years—offering helplines, support groups, treatment 
            finders, and educational resources.
          </p>
        </section>

        <div className="resources-grid">
          {regions.map((region, idx) => (
            <section key={idx} className="resource-region">
              <h2>{region.name}</h2>
              <div className="region-resources">
                {region.resources.map((resource, rIdx) => (
                  <a key={rIdx} href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-item">
                    <h4>{resource.name}</h4>
                    <p>{resource.desc}</p>
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
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || "I'm here to help clarify this question." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't respond. Please try again." }]);
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
            <p>I can help clarify what this question is asking. I won't judge or influence your answer.</p>
            <p className="help-prompt">What would you like to know?</p>
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
// SEARCH PROMPTS PANEL
// ============================================
function SearchPromptsPanel({ stage, location, isOpen, onClose }) {
  if (!isOpen) return null;
  
  const prompts = searchPromptLibrary[stage];
  const loc = location || '[YOUR CITY]';

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Search It Yourself</h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        <div className="modal-body">
          <p className="search-prompts-intro">
            Here are search terms that work well for <strong>{prompts.name}</strong> resources. 
            Copy and paste into Google:
          </p>
          <div className="search-prompts-list">
            {prompts.prompts.map((prompt, idx) => {
              const filled = prompt.replace('[LOCATION]', loc);
              return (
                <div key={idx} className="search-prompt-item">
                  <code>{filled}</code>
                  <button className="copy-button" onClick={() => copyToClipboard(filled)}>Copy</button>
                </div>
              );
            })}
          </div>
          <div className="search-prompts-tip">
            <strong>Tip:</strong> Add "sliding scale" or "low cost" for affordable options, or "telehealth" for remote services.
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// STAGE SELECTOR (Visual Cards)
// ============================================
function StageSelector({ selectedStage, assessedStage, onSelect }) {
  return (
    <div className="stage-selector">
      <p className="stage-selector-label">Search for resources matching:</p>
      <div className="stage-selector-cards">
        {[0, 1, 2, 3].map(stage => (
          <button 
            key={stage}
            className={`stage-selector-card ${selectedStage === stage ? 'selected' : ''} ${assessedStage === stage ? 'assessed' : ''}`}
            onClick={() => onSelect(stage)}
            style={{ borderColor: selectedStage === stage ? stageContent[stage].color : 'transparent' }}
          >
            <span className="stage-selector-number" style={{ background: stageContent[stage].color }}>{stage}</span>
            <span className="stage-selector-name">{stageContent[stage].name}</span>
            {assessedStage === stage && <span className="stage-selector-badge">Your result</span>}
          </button>
        ))}
      </div>
      <p className="stage-selector-hint">You can search for any stage, not just your assessed result.</p>
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
  
  // Assessment state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [showSoftCrisis, setShowSoftCrisis] = useState(false);
  
  // Resource search state
  const [showResourceSearch, setShowResourceSearch] = useState(false);
  const [showResourceResults, setShowResourceResults] = useState(false);
  const [location, setLocation] = useState('');
  const [searchPreference, setSearchPreference] = useState('both');
  const [searchStage, setSearchStage] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searchError, setSearchError] = useState(null);
  
  // UI state
  const [helpOpen, setHelpOpen] = useState(false);
  const [floatingHelpOpen, setFloatingHelpOpen] = useState(false);
  const [searchPromptsOpen, setSearchPromptsOpen] = useState(false);
  const [highlightStage, setHighlightStage] = useState(null);

  // Navigation
  const navigate = (page) => {
    setCurrentPage(page);
    setInAssessment(false);
    window.scrollTo(0, 0);
  };

  // Start assessment
  const startAssessment = () => {
    setShowCrisis(false);
    setShowSoftCrisis(false);
    setShowResults(false);
    setShowResourceSearch(false);
    setShowResourceResults(false);
    setSearchResults(null);
    setSearchStage(null);
    setCurrentQuestion(0);
    setAnswers({});
    setHelpOpen(false);
    setInAssessment(true);
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

  // Handle answer selection
  const handleAnswer = (value) => {
    const q = questions[currentQuestion];
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);

    // Safety gate check (Question 12)
    if (q.safetyGate) {
      if (value >= 2) {
        setShowCrisis(true);
        return;
      }
      if (value === 1) {
        setShowSoftCrisis(true);
      }
    }

    // Move to next question or show results
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
    setShowResourceSearch(false);
    setShowResourceResults(false);
    setAnswers({});
    setCurrentQuestion(0);
    setHighlightStage(null);
  };

  // Perform resource search
  const performSearch = async () => {
    if (!location.trim()) return;
    
    setIsSearching(true);
    setSearchError(null);
    
    const stage = searchStage !== null ? searchStage : getStage(calculateScore());
    const stageInfo = stageContent[stage];
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);
      
      const response = await fetch('/.netlify/functions/search-resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          stage, 
          stageName: stageInfo.name, 
          stageHelps: stageInfo.helps, 
          location: location.trim(), 
          preference: searchPreference 
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('Search failed.');
      
      const data = await response.json();
      setSearchResults(data);
      setShowResourceResults(true);
    } catch (err) {
      if (err.name === 'AbortError') {
        setSearchError('Search took too long. Please try again or use the DIY search prompts below.');
      } else {
        setSearchError('Something went wrong. Please try again or use the DIY search prompts below.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  // ============================================
  // RENDER: Non-assessment pages
  // ============================================
  if (!inAssessment) {
    return (
      <div className="app-wrapper">
        <Navigation currentPage={currentPage} onNavigate={navigate} onStartAssessment={startAssessment} />
        <main className="main-content">
          {currentPage === 'home' && <LandingPage onStartAssessment={startAssessment} onNavigate={navigate} />}
          {currentPage === 'how-it-works' && <HowItWorksPage onStartAssessment={startAssessment} />}
          {currentPage === 'stages' && <StagesPage onStartAssessment={startAssessment} highlightStage={highlightStage} />}
          {currentPage === 'what-to-expect' && <WhatToExpectPage onStartAssessment={startAssessment} />}
          {currentPage === 'limitations' && <LimitationsPage onStartAssessment={startAssessment} />}
          {currentPage === 'resources' && <ResourcesPage />}
        </main>
        <FloatingHelper isOpen={floatingHelpOpen} onToggle={() => setFloatingHelpOpen(!floatingHelpOpen)} />
      </div>
    );
  }

  // ============================================
  // RENDER: Crisis Screen
  // ============================================
  if (showCrisis) {
    return (
      <div className="app">
        <div className="crisis-container">
          <div className="crisis-header">
            <div className="crisis-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
            </div>
            <h1>You don't have to face this alone</h1>
          </div>
          <p className="crisis-message">
            Based on your response, connecting with someone who can help right now is important.
          </p>
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
            <p>If you're in immediate danger, call emergency services.</p>
            <button onClick={exitAssessment} className="restart-button subtle">Return home</button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: Resource Results
  // ============================================
  if (showResourceResults && searchResults) {
    const stage = searchStage !== null ? searchStage : getStage(calculateScore());
    
    return (
      <div className="app">
        <div className="resource-results-container">
          <button onClick={() => setShowResourceResults(false)} className="back-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back
          </button>
          
          <div className="resource-results-header">
            <h1>Resources for You</h1>
            <p className="results-context">Based on {stageContent[stage].name} in {location}</p>
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
                    <div className="resource-links">
                      {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="resource-link-button">Visit website →</a>}
                      {r.phone && <a href={`tel:${r.phone.replace(/\s/g, '')}`} className="resource-phone-link">{r.phone}</a>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="diy-search-section">
            <h2>Want to search yourself?</h2>
            <p>Our AI search is a starting point. For more options, try these search terms:</p>
            <button className="secondary-button" onClick={() => setSearchPromptsOpen(true)}>
              View Search Prompts →
            </button>
          </div>
          
          <div className="resource-results-footer">
            <div className="results-caveat">
              <h3>Important to know</h3>
              <p>These are options to explore, not recommendations. Please do your own research before contacting any provider.</p>
            </div>
            <div className="results-actions">
              <button onClick={() => { setShowResourceResults(false); setSearchResults(null); }} className="secondary-button">Search again</button>
              <button onClick={exitAssessment} className="restart-button">Return home</button>
            </div>
          </div>
        </div>
        
        <SearchPromptsPanel 
          stage={stage} 
          location={location} 
          isOpen={searchPromptsOpen} 
          onClose={() => setSearchPromptsOpen(false)} 
        />
      </div>
    );
  }

  // ============================================
  // RENDER: Resource Search
  // ============================================
  if (showResourceSearch) {
    const assessedStage = getStage(calculateScore());
    const selectedStage = searchStage !== null ? searchStage : assessedStage;

    return (
      <div className="app">
        <div className="resource-search-container">
          <button onClick={() => setShowResourceSearch(false)} className="back-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to results
          </button>
          
          <div className="search-header">
            <h1>Find Resources</h1>
            <p>We'll search for support options that match your needs and location.</p>
          </div>
          
          <div className="search-form">
            <div className="form-group">
              <label htmlFor="location">Where are you located?</label>
              <input 
                type="text" 
                id="location"
                placeholder="City, region, or country (e.g., Auckland, NZ)" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                className="location-input" 
              />
            </div>
            
            <StageSelector 
              selectedStage={selectedStage}
              assessedStage={assessedStage}
              onSelect={(stage) => setSearchStage(stage)}
            />
            
            <div className="form-group">
              <label>What type of support?</label>
              <div className="preference-options">
                <button 
                  className={`preference-option ${searchPreference === 'both' ? 'selected' : ''}`} 
                  onClick={() => setSearchPreference('both')}
                >
                  <span className="preference-icon">🌐</span>
                  <span className="preference-label">Both</span>
                </button>
                <button 
                  className={`preference-option ${searchPreference === 'local' ? 'selected' : ''}`} 
                  onClick={() => setSearchPreference('local')}
                >
                  <span className="preference-icon">📍</span>
                  <span className="preference-label">In-person</span>
                </button>
                <button 
                  className={`preference-option ${searchPreference === 'remote' ? 'selected' : ''}`} 
                  onClick={() => setSearchPreference('remote')}
                >
                  <span className="preference-icon">💻</span>
                  <span className="preference-label">Remote</span>
                </button>
              </div>
            </div>
            
            {searchError && (
              <div className="search-error">
                <p>{searchError}</p>
              </div>
            )}
            
            <button 
              className="primary-button large" 
              onClick={performSearch} 
              disabled={!location.trim() || isSearching}
            >
              {isSearching ? 'Searching...' : 'Search for Resources'}
            </button>
            
            {isSearching && <LoadingSpinner message="Searching for resources... This may take up to 20 seconds." />}
            
            <div className="diy-search-fallback">
              <p>Prefer to search yourself?</p>
              <button className="text-button" onClick={() => setSearchPromptsOpen(true)}>
                View DIY search prompts →
              </button>
            </div>
          </div>
        </div>
        
        <SearchPromptsPanel 
          stage={selectedStage} 
          location={location} 
          isOpen={searchPromptsOpen} 
          onClose={() => setSearchPromptsOpen(false)} 
        />
      </div>
    );
  }

  // ============================================
  // RENDER: Results
  // ============================================
  if (showResults) {
    const score = calculateScore();
    const stage = getStage(score);
    const content = stageContent[stage];

    return (
      <div className="app">
        <div className="results-container">
          {showSoftCrisis && (
            <div className="soft-crisis-notice">
              <h3>We noticed you're having a difficult time</h3>
              <p>You indicated occasionally feeling unsafe or at risk. While we're showing your full results below, support is available right now if you need it:</p>
              <div className="soft-crisis-resources">
                <a href="tel:988">988 (US)</a> · 
                <a href="tel:116123">116 123 (UK)</a> · 
                <a href="tel:1737">1737 (NZ)</a> · 
                <a href="tel:131114">13 11 14 (AU)</a>
              </div>
            </div>
          )}
          
          <div className="results-header">
            <span className="results-label">Your Navigation Results</span>
            <h1>{content.name}</h1>
          </div>
          
          <div className="results-section positioning">
            <p>{content.positioning}</p>
          </div>
          
          {content.urgent && (
            <div className="results-section urgent-notice">
              <p>We encourage you to seek professional evaluation soon.</p>
            </div>
          )}
          
          <div className="results-section">
            <h2>What often helps at this stage</h2>
            <ul>
              {content.helps.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>
          
          <div className="results-section">
            <h2>What may be less helpful</h2>
            <p>{content.premature}</p>
          </div>
          
          <div className="results-section">
            <h2>What to watch for</h2>
            <ul>
              {content.monitor.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>
          
          <div className="results-section explore-stages">
            <button className="text-button" onClick={() => { navigate('stages'); setHighlightStage(stage); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
              View all stages to understand the full spectrum
            </button>
          </div>
          
          <div className="results-section next-steps">
            <h2>Ready to explore options?</h2>
            <p>We can help you search for resources that match your needs.</p>
            <button className="primary-button" onClick={() => setShowResourceSearch(true)}>
              Find Resources →
            </button>
          </div>
          
          <div className="results-footer">
            <p className="disclaimer">This assessment does not provide a diagnosis. Please consult a healthcare provider for clinical assessment.</p>
            <button onClick={exitAssessment} className="restart-button">Return home</button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: Assessment Questions
  // ============================================
  const question = questions[currentQuestion];
  const progress = ((currentQuestion) / questions.length) * 100;

  return (
    <div className="app">
      <div className="assessment-container">
        <div className="assessment-header">
          <button onClick={() => setHelpOpen(true)} className="help-top-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>
            </svg>
            Need help with this question?
          </button>
          <button onClick={exitAssessment} className="exit-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
            Exit
          </button>
        </div>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-text">{currentQuestion + 1} of {questions.length}</span>
        </div>
        
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
        
        {currentQuestion > 0 && (
          <div className="nav-container">
            <button onClick={() => setCurrentQuestion(currentQuestion - 1)} className="back-button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back
            </button>
          </div>
        )}
      </div>
      
      <HelpPanel 
        isOpen={helpOpen} 
        onClose={() => setHelpOpen(false)} 
        question={currentQuestion + 1} 
        questionText={question.text} 
      />
    </div>
  );
}

export default App;
