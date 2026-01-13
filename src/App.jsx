import { useState } from 'react';

// ============================================
// NAVIGATION
// ============================================
function Navigation({ currentPage, onNavigate, onStartAssessment }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'how-it-works', label: 'How This Works' },
    { id: 'what-to-expect', label: 'What to Expect' },
    { id: 'resources', label: 'Other Resources' },
    { id: 'limitations', label: 'Our Limitations' },
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

        <button className="nav-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12"/>
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16"/>
            )}
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
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Finding the right support shouldn't feel this hard</h1>
          <p className="hero-subtitle">
            You've probably searched online, read articles, maybe taken a quiz or two. 
            And you're still not sure what kind of help fits where you are right now.
          </p>
          <p className="hero-subtitle">
            That's exactly why we built this.
          </p>
          <div className="hero-actions">
            <button className="primary-button large" onClick={onStartAssessment}>
              Take the Assessment
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button className="secondary-button" onClick={() => onNavigate('how-it-works')}>
              Learn how it works
            </button>
          </div>
        </div>
      </section>

      {/* What This Is Section */}
      <section className="landing-section">
        <div className="section-content">
          <h2>What is Recovery Navigator?</h2>
          <p className="section-intro">
            We're a navigation tool — not a diagnosis, not a treatment program, not another quiz 
            that leaves you with a label and no clear next step.
          </p>
          <div className="value-cards">
            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3>5 minutes</h3>
              <p>12 thoughtful questions about patterns in your life — not symptoms or clinical criteria.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                </svg>
              </div>
              <h3>Personalized direction</h3>
              <p>Based on your answers, we'll suggest what kinds of support typically help at your stage.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <h3>Real resources</h3>
              <p>We'll search for actual support options in your area — therapists, groups, programs that exist today.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="landing-section alt-bg">
        <div className="section-content">
          <h2>Is this for me?</h2>
          <p className="section-intro">
            This tool is for anyone wondering whether their relationship with food, 
            body, or exercise might benefit from some support. That includes:
          </p>
          <div className="audience-list">
            <div className="audience-item">
              <span className="audience-marker"></span>
              <p><strong>If you're questioning patterns</strong> — noticing thoughts or behaviors that feel different, consuming, or hard to shake</p>
            </div>
            <div className="audience-item">
              <span className="audience-marker"></span>
              <p><strong>If you've been struggling a while</strong> — and you're trying to figure out what level of help makes sense</p>
            </div>
            <div className="audience-item">
              <span className="audience-marker"></span>
              <p><strong>If you're supporting someone</strong> — a family member, friend, or client — and want to understand the landscape</p>
            </div>
            <div className="audience-item">
              <span className="audience-marker"></span>
              <p><strong>If you're a practitioner</strong> — looking for a thoughtful referral tool when someone falls outside your scope</p>
            </div>
          </div>
        </div>
      </section>

      {/* How We're Different Section */}
      <section className="landing-section">
        <div className="section-content">
          <h2>How we're different</h2>
          <div className="comparison-grid">
            <div className="comparison-card other">
              <h4>Most online resources</h4>
              <ul>
                <li>Give you a score or label</li>
                <li>Leave you to figure out next steps</li>
                <li>Offer generic advice</li>
                <li>Link to outdated directories</li>
              </ul>
            </div>
            <div className="comparison-card ours">
              <h4>Recovery Navigator</h4>
              <ul>
                <li>Describes patterns, not people</li>
                <li>Explains what typically helps at each stage</li>
                <li>Searches for real, current resources in your area</li>
                <li>Offers a helper if you get stuck on any question</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="landing-section alt-bg">
        <div className="section-content centered">
          <h2>Your privacy matters</h2>
          <p className="section-intro">
            We don't store your answers. We don't create accounts. We don't track you. 
            When you close this page, your responses are gone.
          </p>
          <p className="section-intro">
            This is a tool, not a platform. We're here to help you find direction, then get out of your way.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-section cta-section">
        <div className="section-content centered">
          <h2>Ready to explore?</h2>
          <p className="section-intro">
            It takes about 5 minutes. There's no sign-up, no email required, and you can 
            stop anytime.
          </p>
          <button className="primary-button large" onClick={onStartAssessment}>
            Begin the Assessment
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p>Recovery Navigator is not a medical service and does not provide diagnosis or treatment.</p>
          <p>If you're in crisis, please contact a <button onClick={() => onNavigate('resources')} className="footer-link">crisis helpline</button> in your area.</p>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// PLACEHOLDER PAGES (we'll build these next)
// ============================================
function HowItWorksPage({ onNavigate, onStartAssessment }) {
  return (
    <div className="content-page">
      <div className="page-header">
        <h1>How This Works</h1>
        <p>Understanding our approach to eating disorder support navigation.</p>
      </div>
      <div className="page-content">
        <p>Full content coming soon. For now, you can:</p>
        <button className="primary-button" onClick={onStartAssessment}>Take the Assessment</button>
      </div>
    </div>
  );
}

function WhatToExpectPage({ onNavigate, onStartAssessment }) {
  return (
    <div className="content-page">
      <div className="page-header">
        <h1>What to Expect</h1>
        <p>What happens when you take the assessment.</p>
      </div>
      <div className="page-content">
        <p>Full content coming soon. For now, you can:</p>
        <button className="primary-button" onClick={onStartAssessment}>Take the Assessment</button>
      </div>
    </div>
  );
}

function ResourcesPage({ onNavigate }) {
  return (
    <div className="content-page">
      <div className="page-header">
        <h1>Other Resources</h1>
        <p>Trusted organizations and support around the world.</p>
      </div>
      <div className="page-content">
        <p>Full content coming soon.</p>
      </div>
    </div>
  );
}

function LimitationsPage({ onNavigate, onStartAssessment }) {
  return (
    <div className="content-page">
      <div className="page-header">
        <h1>Our Limitations</h1>
        <p>What this tool does and doesn't do.</p>
      </div>
      <div className="page-content">
        <p>Full content coming soon. For now, you can:</p>
        <button className="primary-button" onClick={onStartAssessment}>Take the Assessment</button>
      </div>
    </div>
  );
}

// ============================================
// ASSESSMENT DATA & COMPONENTS
// ============================================
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

function getStage(score, safetyTriggered) {
  if (safetyTriggered) return 'crisis';
  if (score <= 7) return 0;
  if (score <= 14) return 1;
  if (score <= 22) return 2;
  return 3;
}

const stageContent = {
  0: { name: "Awareness & Early Concern", positioning: "Your responses suggest you may be in an early stage of noticing patterns or concerns. This is a valuable place to be—awareness is the foundation of wellbeing.", helps: ["Psychoeducation about eating, body image, and cultural pressures", "Body-image and media literacy programs", "Gentle embodiment practices like yoga or mindful movement", "Anonymous resources and low-pressure entry points"], premature: "Intensive treatment programs or clinical interventions may not be necessary at this stage and could feel overwhelming.", monitor: ["Increasing preoccupation with food, weight, or body", "Growing rigidity around eating or exercise routines", "Social withdrawal related to food situations"] },
  1: { name: "Emerging Patterns", positioning: "Your responses suggest emerging patterns that may benefit from structured, supportive help—without jumping straight to intensive treatment.", helps: ["Facilitated support groups with gentle accountability", "Somatic and embodiment practices", "Non-diet nutrition education", "Coaching-adjacent supports focused on skills and awareness"], premature: "Waiting until things feel 'bad enough' to seek support. Early engagement often leads to better outcomes.", monitor: ["Increasing interference with daily life, work, or relationships", "Emergence of physical warning signs", "Growing isolation or secrecy around eating"] },
  2: { name: "Established Patterns", positioning: "Your responses suggest more established patterns that are meaningfully affecting your life. Consistent, professional support is likely to be helpful.", helps: ["Outpatient therapy with an eating disorder-informed clinician", "Dietitian support (ideally non-diet/HAES-aligned)", "Adjunctive somatic or body-based programs", "Family education and involvement if appropriate"], premature: "Trying to manage this entirely alone, or relying only on self-help resources without professional guidance.", monitor: ["Physical health symptoms or medical concerns", "Significant functional impairment", "Thoughts of self-harm or hopelessness"] },
  3: { name: "Higher Support Needs", positioning: "Your responses suggest patterns that may benefit from a higher level of care and professional evaluation. This isn't a judgment—it's information to help you access appropriate support.", helps: ["Professional evaluation by an eating disorder specialist", "Consider day programs or intensive outpatient options", "Medical monitoring and oversight", "Structured treatment with a multidisciplinary team"], premature: "Delaying professional evaluation or trying to manage significant symptoms without clinical support.", monitor: ["Any medical emergency signs require immediate attention", "Thoughts of self-harm should be shared with a professional immediately"], urgent: true }
};

const crisisResources = {
  nz: { name: "New Zealand", resources: [{ name: "Need to Talk?", phone: "1737", description: "Free call or text, 24/7" }, { name: "Lifeline", phone: "0800 543 354", description: "24/7 crisis support" }, { name: "Suicide Crisis Helpline", phone: "0508 828 865", description: "24/7" }] },
  au: { name: "Australia", resources: [{ name: "Lifeline", phone: "13 11 14", description: "24/7 crisis support" }, { name: "Butterfly Foundation", phone: "1800 33 4673", description: "ED-specific support, 8am-midnight" }] },
  us: { name: "United States", resources: [{ name: "988 Suicide & Crisis Lifeline", phone: "988", description: "Call or text, 24/7" }, { name: "NEDA Helpline", phone: "1-800-931-2237", description: "Mon-Thu 9am-9pm ET" }] },
  uk: { name: "United Kingdom", resources: [{ name: "Samaritans", phone: "116 123", description: "Free, 24/7" }, { name: "Beat Eating Disorders", phone: "0808 801 0677", description: "Weekdays 9am-8pm, Weekends 4pm-8pm" }] },
  international: { name: "International", resources: [{ name: "International Association for Suicide Prevention", url: "https://www.iasp.info/resources/Crisis_Centres/", description: "Find crisis centers worldwide" }] }
};

// ============================================
// HELP PANEL
// ============================================
function HelpPanel({ isOpen, onClose, question, questionText }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuestion, setLastQuestion] = useState(question);

  if (question !== lastQuestion) {
    setMessages([]);
    setLastQuestion(question);
  }

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
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
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask about this question..." disabled={isLoading} />
        <button onClick={sendMessage} disabled={isLoading || !input.trim()}>Send</button>
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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [showResourceSearch, setShowResourceSearch] = useState(false);
  const [showResourceResults, setShowResourceResults] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);

  const [location, setLocation] = useState('');
  const [searchPreference, setSearchPreference] = useState('both');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searchError, setSearchError] = useState(null);

  const progress = ((currentQuestion) / questions.length) * 100;

  const navigate = (page) => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentPage(page);
      setInAssessment(false);
      setFadeIn(true);
      window.scrollTo(0, 0);
    }, 300);
  };

  const startAssessment = () => {
    setFadeIn(false);
    setTimeout(() => {
      setInAssessment(true);
      setCurrentQuestion(0);
      setAnswers({});
      setShowResults(false);
      setShowCrisis(false);
      setShowResourceSearch(false);
      setShowResourceResults(false);
      setFadeIn(true);
      window.scrollTo(0, 0);
    }, 300);
  };

  const handleAnswer = (value) => {
    const question = questions[currentQuestion];
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    if (question.safetyGate && value > 0) {
      setFadeIn(false);
      setTimeout(() => { setShowCrisis(true); setFadeIn(true); }, 300);
      return;
    }

    setFadeIn(false);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResults(true);
      }
      setFadeIn(true);
    }, 300);
  };

  const calculateScore = () => {
    let score = 0;
    for (let i = 1; i <= 11; i++) { score += answers[i] || 0; }
    return score;
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setFadeIn(false);
      setTimeout(() => { setCurrentQuestion(currentQuestion - 1); setFadeIn(true); }, 300);
    }
  };

  const exitAssessment = () => {
    setFadeIn(false);
    setTimeout(() => {
      setInAssessment(false);
      setCurrentPage('home');
      setFadeIn(true);
    }, 300);
  };

  const openResourceSearch = () => {
    setFadeIn(false);
    setTimeout(() => { setShowResourceSearch(true); setFadeIn(true); }, 300);
  };

  const backToResults = () => {
    setFadeIn(false);
    setTimeout(() => { setShowResourceSearch(false); setShowResourceResults(false); setFadeIn(true); }, 300);
  };

  const performSearch = async () => {
    if (!location.trim()) return;
    setIsSearching(true);
    setSearchError(null);
    const score = calculateScore();
    const stage = getStage(score, false);
    const stageInfo = stageContent[stage];

    try {
      const response = await fetch('/.netlify/functions/search-resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage, stageName: stageInfo.name, stageHelps: stageInfo.helps, location: location.trim(), preference: searchPreference })
      });
      if (!response.ok) throw new Error('Search failed.');
      const data = await response.json();
      setSearchResults(data);
      setFadeIn(false);
      setTimeout(() => { setShowResourceResults(true); setFadeIn(true); }, 300);
    } catch (err) {
      setSearchError(err.message || 'Something went wrong.');
    } finally {
      setIsSearching(false);
    }
  };

  // ============================================
  // RENDER: Pages (non-assessment)
  // ============================================
  if (!inAssessment) {
    return (
      <div className={`app-wrapper ${fadeIn ? 'fade-in' : 'fade-out'}`}>
        <Navigation currentPage={currentPage} onNavigate={navigate} onStartAssessment={startAssessment} />
        <main className="main-content">
          {currentPage === 'home' && <LandingPage onStartAssessment={startAssessment} onNavigate={navigate} />}
          {currentPage === 'how-it-works' && <HowItWorksPage onNavigate={navigate} onStartAssessment={startAssessment} />}
          {currentPage === 'what-to-expect' && <WhatToExpectPage onNavigate={navigate} onStartAssessment={startAssessment} />}
          {currentPage === 'resources' && <ResourcesPage onNavigate={navigate} />}
          {currentPage === 'limitations' && <LimitationsPage onNavigate={navigate} onStartAssessment={startAssessment} />}
        </main>
      </div>
    );
  }

  // ============================================
  // RENDER: Assessment Flow
  // ============================================

  // Crisis screen
  if (showCrisis) {
    return (
      <div className={`app ${fadeIn ? 'fade-in' : 'fade-out'}`}>
        <div className="crisis-container">
          <div className="crisis-header">
            <div className="crisis-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
            </div>
            <h1>You don't have to face this alone</h1>
          </div>
          <p className="crisis-message">Based on your response, connecting with someone who can help right now is important.</p>
          <div className="crisis-resources">
            {Object.entries(crisisResources).map(([key, region]) => (
              <div key={key} className="crisis-region">
                <h3>{region.name}</h3>
                {region.resources.map((resource, idx) => (
                  <div key={idx} className="crisis-resource">
                    <span className="resource-name">{resource.name}</span>
                    {resource.phone && <a href={`tel:${resource.phone.replace(/\s/g, '')}`} className="resource-phone">{resource.phone}</a>}
                    {resource.url && <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">Find support →</a>}
                    <span className="resource-desc">{resource.description}</span>
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

  // Resource Results
  if (showResourceResults && searchResults) {
    return (
      <div className={`app ${fadeIn ? 'fade-in' : 'fade-out'}`}>
        <div className="resource-results-container">
          <button onClick={backToResults} className="back-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to results
          </button>
          <div className="resource-results-header">
            <h1>Resources for You</h1>
            <p className="results-context">Based on your stage ({stageContent[getStage(calculateScore(), false)].name}) and location ({location})</p>
          </div>
          {searchResults.introduction && <div className="results-intro"><p>{searchResults.introduction}</p></div>}
          {searchResults.categories && searchResults.categories.map((category, idx) => (
            <div key={idx} className="resource-category">
              <h2>{category.name}</h2>
              <div className="resource-list">
                {category.resources.map((resource, rIdx) => (
                  <div key={rIdx} className="resource-card">
                    <div className="resource-card-header">
                      <h3>{resource.name}</h3>
                      {resource.type && <span className="resource-type">{resource.type}</span>}
                    </div>
                    <p className="resource-description">{resource.description}</p>
                    {resource.url && <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link-button">Visit website →</a>}
                    {resource.phone && <a href={`tel:${resource.phone.replace(/\s/g, '')}`} className="resource-phone-link">{resource.phone}</a>}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="resource-results-footer">
            <div className="results-caveat">
              <h3>Important to know</h3>
              <p>These are options to explore, not recommendations or endorsements. Availability and fit may vary.</p>
            </div>
            <div className="results-actions">
              <button onClick={() => { setShowResourceResults(false); setSearchResults(null); }} className="secondary-button">Search again</button>
              <button onClick={exitAssessment} className="restart-button">Return home</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Resource Search
  if (showResourceSearch) {
    return (
      <div className={`app ${fadeIn ? 'fade-in' : 'fade-out'}`}>
        <div className="resource-search-container">
          <button onClick={backToResults} className="back-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to results
          </button>
          <div className="search-header">
            <h1>Find Resources</h1>
            <p>We'll search for support options that match your current stage and location.</p>
          </div>
          <div className="search-form">
            <div className="form-group">
              <label htmlFor="location">Where are you located?</label>
              <input type="text" id="location" placeholder="City, region, or country (e.g., Berlin, Germany)" value={location} onChange={(e) => setLocation(e.target.value)} className="location-input" />
            </div>
            <div className="form-group">
              <label>What type of support?</label>
              <div className="preference-options">
                <button className={`preference-option ${searchPreference === 'both' ? 'selected' : ''}`} onClick={() => setSearchPreference('both')}>
                  <span className="preference-icon">🌐</span><span className="preference-label">Both</span>
                </button>
                <button className={`preference-option ${searchPreference === 'local' ? 'selected' : ''}`} onClick={() => setSearchPreference('local')}>
                  <span className="preference-icon">📍</span><span className="preference-label">In-person</span>
                </button>
                <button className={`preference-option ${searchPreference === 'remote' ? 'selected' : ''}`} onClick={() => setSearchPreference('remote')}>
                  <span className="preference-icon">💻</span><span className="preference-label">Remote</span>
                </button>
              </div>
            </div>
            {searchError && <div className="search-error"><p>{searchError}</p></div>}
            <button className="primary-button large" onClick={performSearch} disabled={!location.trim() || isSearching}>
              {isSearching ? 'Searching...' : 'Search for Resources'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results
  if (showResults) {
    const score = calculateScore();
    const stage = getStage(score, false);
    const content = stageContent[stage];

    return (
      <div className={`app ${fadeIn ? 'fade-in' : 'fade-out'}`}>
        <div className="results-container">
          <div className="results-header">
            <span className="results-label">Your Navigation Results</span>
            <h1>{content.name}</h1>
          </div>
          <div className="results-section positioning"><p>{content.positioning}</p></div>
          {content.urgent && <div className="results-section urgent-notice"><p>We encourage you to seek professional evaluation soon.</p></div>}
          <div className="results-section">
            <h2>What often helps at this stage</h2>
            <ul>{content.helps.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
          </div>
          <div className="results-section">
            <h2>What may be less helpful</h2>
            <p>{content.premature}</p>
          </div>
          <div className="results-section">
            <h2>What to watch for</h2>
            <ul>{content.monitor.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
          </div>
          <div className="results-section next-steps">
            <h2>Ready to explore options?</h2>
            <p>We can help you search for resources that match your needs.</p>
            <button className="primary-button" onClick={openResourceSearch}>Find Resources →</button>
          </div>
          <div className="results-footer">
            <p className="disclaimer">This assessment does not provide a diagnosis. Please consult a healthcare provider for clinical assessment.</p>
            <button onClick={exitAssessment} className="restart-button">Return home</button>
          </div>
        </div>
      </div>
    );
  }

  // Assessment Questions
  const question = questions[currentQuestion];

  return (
    <div className={`app ${fadeIn ? 'fade-in' : 'fade-out'}`}>
      <div className="assessment-container">
        <div className="assessment-header">
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
            <button key={option.value} className={`option-button ${answers[question.id] === option.value ? 'selected' : ''}`} onClick={() => handleAnswer(option.value)}>
              <span className="option-value">{option.value}</span>
              <span className="option-label">{option.label}</span>
            </button>
          ))}
        </div>
        <div className="nav-container">
          {currentQuestion > 0 && (
            <button onClick={goBack} className="back-button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back
            </button>
          )}
        </div>
        <div className="help-container">
          <button className="help-button" onClick={() => setHelpOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>
            </svg>
            Need help understanding this question?
          </button>
        </div>
      </div>
      <HelpPanel isOpen={helpOpen} onClose={() => setHelpOpen(false)} question={currentQuestion + 1} questionText={question.text} />
    </div>
  );
}

export default App;
