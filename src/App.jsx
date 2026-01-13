import { useState } from 'react';

// ============================================
// SEARCH PROMPT LIBRARY
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
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || "I'm here to help. Could you tell me more?" }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't respond. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      <button className="floating-help-button" onClick={onToggle} aria-label="Get help">
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 18L18 6M6 6l12 12"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>
          </svg>
        )}
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
              onKeyPress={handleKeyPress} 
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
           
const startAssessment = () => {
    // Reset all state immediately
    setShowCrisis(false);
    setShowSoftCrisis(false);
    setShowResults(false);
    setShowResourceSearch(false);
    setShowResourceResults(false);
    setSearchResults(null);
    setSearchStage(null);
    setCurrentQuestion(0);
    setAnswers({});
    setFloatingHelpOpen(false);
    setHelpOpen(false);
    
    setFadeIn(false);
    setTimeout(() => {
      setInAssessment(true);
      setFadeIn(true);
      window.scrollTo(0, 0);
    }, 300);
  };
```

Save both files, then push:
```
git add .
```
```
git commit -m "Fix crisis bug and help button"
```
```
git push
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
          <p className="section-intro">
            We're transparent about what's under the hood. Here's exactly what happens when you use Recovery Navigator:
          </p>
          
          <div className="process-flow">
            <div className="process-step">
              <div className="process-icon"><span>1</span></div>
              <div className="process-content">
                <h4>You answer 12 questions</h4>
                <p>About patterns in your life—mental energy around food, stress when routines change, impact on daily life. Takes about 5 minutes.</p>
              </div>
            </div>
            <div className="process-arrow">↓</div>
            <div className="process-step">
              <div className="process-icon"><span>2</span></div>
              <div className="process-content">
                <h4>We identify your support stage</h4>
                <p>Based on your answers, we place you on a spectrum from early awareness (Stage 0) to higher support needs (Stage 3). This isn't a diagnosis—it's a navigation tool.</p>
              </div>
            </div>
            <div className="process-arrow">↓</div>
            <div className="process-step">
              <div className="process-icon highlight">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              </div>
              <div className="process-content">
                <h4>AI searches for matching resources</h4>
                <p>We use Claude (an AI assistant) to search the web in real-time. The AI knows your stage and what typically helps—it looks for therapists, support groups, programs, and services in your area.</p>
              </div>
            </div>
            <div className="process-arrow">↓</div>
            <div className="process-step">
              <div className="process-icon"><span>4</span></div>
              <div className="process-content">
                <h4>You get real options to explore</h4>
                <p>We show you what we found—with names, descriptions, and links. Local in-person options and remote/telehealth services. You decide what to explore.</p>
              </div>
            </div>
          </div>

          <div className="transparency-note">
            <h4>Why AI?</h4>
            <p>
              We don't maintain a database of providers—those go stale quickly and can't cover the whole world. 
              Instead, we use AI to search the web fresh every time, the way a knowledgeable friend would. 
              The AI is prompted with your stage and location, searches multiple sources, and compiles what it finds.
            </p>
            <p>
              <strong>This means:</strong> Results vary by location. Major cities have more options. 
              We can't verify every provider. Always do your own research before committing to any service.
            </p>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-content">
          <h2>What you'll get</h2>
          <div className="value-cards">
            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                </svg>
              </div>
              <h3>Clarity on where you are</h3>
              <p>Understand your patterns without clinical jargon or scary labels. We describe, we don't diagnose.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <h3>Stage-appropriate guidance</h3>
              <p>What typically helps at your stage, what might be premature, and what to watch for going forward.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <h3>Real resources in your area</h3>
              <p>AI-powered search finds actual therapists, groups, and programs—wherever you are in the world.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section alt-bg">
        <div className="section-content">
          <h2>How we're different</h2>
          <div className="comparison-grid">
            <div className="comparison-card other">
              <h4>Most online screeners</h4>
              <ul>
                <li>Give you a score or label</li>
                <li>Leave you to figure out next steps</li>
                <li>Link to generic or outdated directories</li>
                <li>Don't explain their methodology</li>
              </ul>
            </div>
            <div className="comparison-card ours">
              <h4>Recovery Navigator</h4>
              <ul>
                <li>Describes patterns, not people</li>
                <li>Explains what typically helps at each stage</li>
                <li>Searches for current resources in your area</li>
                <li>Shows you exactly how it works</li>
              </ul>
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
          <p className="section-intro">
            This is a tool, not a platform. We're here to help you find direction, then get out of your way.
          </p>
        </div>
      </section>

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

      <footer className="landing-footer">
        <div className="footer-content">
          <p><strong>Recovery Navigator</strong> — A free navigation tool for eating disorder support.</p>
          <p>This is not a medical service and does not provide diagnosis or treatment. If you're in crisis, please contact a <button onClick={() => onNavigate('resources')} className="footer-link">crisis helpline</button>.</p>
        </div>
      </footer>
    </div>
  );
}
// ============================================
// CONTENT PAGES
// ============================================
function HowItWorksPage({ onNavigate, onStartAssessment }) {
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
            Finding help for eating concerns shouldn't require you to already 
            know what you need. Too often, people get stuck between "not sick enough" for 
            intensive treatment and "too complicated" for general wellness advice.
          </p>
          <p>
            Recovery Navigator sits in that gap. We help you understand where you are, 
            what typically helps at that stage, and how to find real resources that match.
          </p>
        </section>

        <section className="content-section">
          <h2>Navigation, Not Diagnosis</h2>
          <p>
            We don't tell you what's "wrong" with you. We don't assign labels or clinical 
            categories. Instead, we describe patterns and point toward resources that tend 
            to help people experiencing similar patterns.
          </p>
          <p>
            Think of it like a compass, not a map. We help you orient toward helpful 
            directions—you decide where to go.
          </p>
        </section>

        <section className="content-section">
          <h2>The Four Stages</h2>
          <p>
            Based on research and clinical experience, we've identified four general stages 
            of eating disorder support needs:
          </p>
          
          <div className="stage-list">
            <div className="stage-item">
              <span className="stage-number">0</span>
              <div className="stage-content">
                <h4>Awareness & Early Concern</h4>
                <p>Noticing patterns, asking questions, seeking information. Psychoeducation, body-image programs, and low-pressure entry points often help most.</p>
              </div>
            </div>
            <div className="stage-item">
              <span className="stage-number">1</span>
              <div className="stage-content">
                <h4>Emerging Patterns</h4>
                <p>Recognizable patterns developing, but often still high-functioning. Support groups, somatic practices, and non-diet nutrition education tend to help.</p>
              </div>
            </div>
            <div className="stage-item">
              <span className="stage-number">2</span>
              <div className="stage-content">
                <h4>Established Patterns</h4>
                <p>Patterns meaningfully affecting daily life. Outpatient therapy, dietitian support, and consistent professional help typically needed.</p>
              </div>
            </div>
            <div className="stage-item">
              <span className="stage-number">3</span>
              <div className="stage-content">
                <h4>Higher Support Needs</h4>
                <p>Significant impact on health and functioning. Professional evaluation, possibly intensive programs, and medical oversight often appropriate.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="content-section">
          <h2>What We Measure</h2>
          <p>
            Our 12 questions explore patterns across several dimensions—not to score severity, 
            but to understand what kind of support might fit:
          </p>
          <ul className="measure-list">
            <li><strong>Mental preoccupation</strong> — How much mental energy goes to food and body thoughts</li>
            <li><strong>Rigidity</strong> — Discomfort when routines change</li>
            <li><strong>Body cue connection</strong> — Difficulty with hunger, fullness, intuitive eating</li>
            <li><strong>Social impact</strong> — Stress around eating with others</li>
            <li><strong>Compulsion vs. choice</strong> — Whether behaviors feel driven or freely chosen</li>
            <li><strong>Emotional impact</strong> — Effects on mood and self-esteem</li>
            <li><strong>Functional interference</strong> — Impact on work, relationships, daily life</li>
            <li><strong>External concern</strong> — Whether others have noticed</li>
            <li><strong>Ambivalence</strong> — Mixed feelings about change</li>
            <li><strong>Prior help-seeking</strong> — Previous attempts to get support</li>
            <li><strong>Physical signs</strong> — Symptoms that may be connected</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>The Resource Search</h2>
          <p>
            After the assessment, we offer to search for real resources in your area. This isn't 
            a pre-built directory—we use AI to search the web in real-time, finding therapists, 
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function WhatToExpectPage({ onNavigate, onStartAssessment }) {
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
          <p>
            There are no right or wrong answers. Just respond based on how things have been 
            for you recently.
          </p>
        </section>

        <section className="content-section">
          <h2>Your Results</h2>
          <p>After the assessment, you'll see:</p>
          <ul className="results-preview-list">
            <li><strong>A stage description</strong> — Where your patterns fall on our support spectrum</li>
            <li><strong>What typically helps</strong> — Types of resources that tend to help at this stage</li>
            <li><strong>What to watch for</strong> — Signs that might suggest seeking more support</li>
            <li><strong>A resource search</strong> — Option to find real support in your area</li>
          </ul>
          <p>
            We describe patterns, not people. You won't see "You are Level 2" — instead, 
            you'll see what your responses suggest and what options might fit.
          </p>
        </section>

        <section className="content-section">
          <h2>A Note on Safety</h2>
          <p>
            One of our questions asks if you're currently feeling physically unsafe or at 
            risk of harming yourself. If you indicate significant current risk, we'll 
            show you crisis resources—helplines and support services that can 
            help right now.
          </p>
          <p>
            This isn't about "failing" the assessment. It's about making sure you have 
            access to the right support at the right time.
          </p>
        </section>

        <div className="page-cta">
          <p className="cta-note">Ready? It takes about 5 minutes, and you can stop anytime.</p>
          <button className="primary-button large" onClick={onStartAssessment}>
            Begin the Assessment
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
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
        <section className="content-section">
          <p className="limitations-intro">
            We've built something we believe is helpful, but we want to be clear about what 
            Recovery Navigator is—and isn't. Honesty about limitations is part of doing this 
            responsibly.
          </p>
        </section>

        <section className="content-section">
          <h2>We Don't Diagnose</h2>
          <p>
            Recovery Navigator is not a diagnostic tool. We don't tell you whether you have 
            an eating disorder, and we're not qualified to. Only trained healthcare professionals 
            can provide clinical diagnoses.
          </p>
          <p>
            What we do is describe patterns and suggest what kinds of support tend to help 
            people experiencing similar patterns. That's navigation, not diagnosis.
          </p>
        </section>

        <section className="content-section">
          <h2>We Don't Provide Treatment</h2>
          <p>
            This tool doesn't deliver therapy, counseling, nutrition planning, or any form of 
            clinical treatment. We point toward resources—we don't replace them.
          </p>
          <p>
            If you're struggling, please connect with a real human professional. Our job is 
            to help you find them, not to be them.
          </p>
        </section>

        <section className="content-section">
          <h2>We Don't Endorse Providers</h2>
          <p>
            When we search for resources, we're showing you what exists—not recommending 
            specific providers. We can't verify the quality of individual therapists, programs, 
            or organizations.
          </p>
          <p>
            Please do your own research. Ask questions. Check credentials. Find someone who 
            feels like the right fit for you.
          </p>
        </section>

        <section className="content-section">
          <h2>Our Resource Search Has Limits</h2>
          <p>We use AI to search the web in real-time, which means:</p>
          <ul>
            <li>We might miss resources that don't have a strong web presence</li>
            <li>Information about hours, availability, or services might be outdated</li>
            <li>We can't verify that providers are currently accepting new clients</li>
            <li>Search quality varies by location—major cities usually have more results</li>
          </ul>
          <p>Treat our results as a starting point for your own research, not a definitive guide.</p>
        </section>

        <section className="content-section">
          <h2>We Use AI—And That Has Limits</h2>
          <p>
            Parts of this tool—including the question helper and resource search—are powered 
            by AI (specifically, Claude by Anthropic). AI has limitations:
          </p>
          <ul>
            <li>It can make mistakes or provide imperfect information</li>
            <li>It doesn't have real-time knowledge of every local resource</li>
            <li>It can't replace human judgment, especially for clinical decisions</li>
          </ul>
          <p>We use AI to make helpful support more accessible, not to replace human care.</p>
        </section>

        <section className="content-section">
          <h2>We're Not Emergency Services</h2>
          <p>
            If you're in immediate danger—medical emergency, active self-harm, or crisis—please 
            contact emergency services or a crisis helpline. We show crisis resources when our 
            safety question is triggered, but we cannot provide emergency response.
          </p>
          <div className="emergency-numbers">
            <p><strong>Emergency services:</strong> 111 (NZ) · 000 (AU) · 911 (US/CA) · 999 (UK) · 112 (EU)</p>
          </div>
        </section>

        <section className="content-section">
          <h2>What We Hope We Do Well</h2>
          <p>Despite these limitations, we believe Recovery Navigator offers something valuable:</p>
          <ul>
            <li>A thoughtful, non-judgmental way to understand your patterns</li>
            <li>Clear guidance on what kinds of support tend to help at different stages</li>
            <li>Real-time search for resources that actually exist in your area</li>
            <li>A bridge between "something feels off" and "here's where to start"</li>
          </ul>
          <p>We're one piece of a larger ecosystem of care. We hope we can help you find your next step.</p>
        </section>

        <div className="page-cta">
          <button className="primary-button large" onClick={onStartAssessment}>
            Take the Assessment
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function ResourcesPage({ onNavigate }) {
  const regions = [
    { name: "New Zealand", resources: [
      { name: "EDANZ", desc: "Eating Disorders Association of New Zealand — support, education, and advocacy", url: "https://www.ed.org.nz" },
      { name: "1737", desc: "Free call or text for mental health support, 24/7", url: "https://1737.org.nz" }
    ]},
    { name: "Australia", resources: [
      { name: "Butterfly Foundation", desc: "Australia's leading eating disorder support organization", url: "https://butterfly.org.au" },
      { name: "InsideOut Institute", desc: "Research and clinical excellence in eating disorders", url: "https://insideoutinstitute.org.au" }
    ]},
    { name: "United States", resources: [
      { name: "NEDA", desc: "National Eating Disorders Association — information, screening, and treatment finder", url: "https://www.nationaleatingdisorders.org" },
      { name: "Project HEAL", desc: "Connecting people to treatment and support", url: "https://www.theprojectheal.org" },
      { name: "988 Lifeline", desc: "Suicide and crisis support — call or text 988", url: "https://988lifeline.org" }
    ]},
    { name: "United Kingdom", resources: [
      { name: "Beat", desc: "UK's eating disorder charity — helplines, support groups, and information", url: "https://www.beateatingdisorders.org.uk" },
      { name: "Samaritans", desc: "24/7 emotional support — call 116 123 (free)", url: "https://www.samaritans.org" }
    ]},
    { name: "Canada", resources: [
      { name: "NEDIC", desc: "National Eating Disorder Information Centre", url: "https://nedic.ca" },
      { name: "Crisis Services Canada", desc: "Call 1-833-456-4566 or text 45645", url: "https://www.crisisservicescanada.ca" }
    ]},
    { name: "International", resources: [
      { name: "F.E.A.S.T.", desc: "Global support network for families of those with eating disorders", url: "https://www.feast-ed.org" },
      { name: "IASP Crisis Centres", desc: "Find crisis support anywhere in the world", url: "https://www.iasp.info/resources/Crisis_Centres/" }
    ]}
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

        <section className="content-section resources-note">
          <h2>A Note on These Resources</h2>
          <p>
            We've listed organizations we believe provide valuable support, but this isn't a 
            comprehensive list, and inclusion doesn't imply endorsement. 
          </p>
        </section>
      </div>
    </div>
  );
}
// ============================================
// ASSESSMENT DATA
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
  0: { 
    name: "Awareness & Early Concern", 
    positioning: "Your responses suggest you may be in an early stage of noticing patterns or concerns. This is a valuable place to be—awareness is the foundation of wellbeing.", 
    helps: ["Psychoeducation about eating, body image, and cultural pressures", "Body-image and media literacy programs", "Gentle embodiment practices like yoga or mindful movement", "Anonymous resources and low-pressure entry points"], 
    premature: "Intensive treatment programs or clinical interventions may not be necessary at this stage and could feel overwhelming.", 
    monitor: ["Increasing preoccupation with food, weight, or body", "Growing rigidity around eating or exercise routines", "Social withdrawal related to food situations"] 
  },
  1: { 
    name: "Emerging Patterns", 
    positioning: "Your responses suggest emerging patterns that may benefit from structured, supportive help—without jumping straight to intensive treatment.", 
    helps: ["Facilitated support groups with gentle accountability", "Somatic and embodiment practices", "Non-diet nutrition education", "Coaching-adjacent supports focused on skills and awareness"], 
    premature: "Waiting until things feel 'bad enough' to seek support. Early engagement often leads to better outcomes.", 
    monitor: ["Increasing interference with daily life, work, or relationships", "Emergence of physical warning signs", "Growing isolation or secrecy around eating"] 
  },
  2: { 
    name: "Established Patterns", 
    positioning: "Your responses suggest more established patterns that are meaningfully affecting your life. Consistent, professional support is likely to be helpful.", 
    helps: ["Outpatient therapy with an eating disorder-informed clinician", "Dietitian support (ideally non-diet/HAES-aligned)", "Adjunctive somatic or body-based programs", "Family education and involvement if appropriate"], 
    premature: "Trying to manage this entirely alone, or relying only on self-help resources without professional guidance.", 
    monitor: ["Physical health symptoms or medical concerns", "Significant functional impairment", "Thoughts of self-harm or hopelessness"] 
  },
  3: { 
    name: "Higher Support Needs", 
    positioning: "Your responses suggest patterns that may benefit from a higher level of care and professional evaluation. This isn't a judgment—it's information to help you access appropriate support.", 
    helps: ["Professional evaluation by an eating disorder specialist", "Consider day programs or intensive outpatient options", "Medical monitoring and oversight", "Structured treatment with a multidisciplinary team"], 
    premature: "Delaying professional evaluation or trying to manage significant symptoms without clinical support.", 
    monitor: ["Any medical emergency signs require immediate attention", "Thoughts of self-harm should be shared with a professional immediately"], 
    urgent: true 
  }
};

const crisisResources = {
  nz: { name: "New Zealand", resources: [
    { name: "Need to Talk?", phone: "1737", description: "Free call or text, 24/7" }, 
    { name: "Lifeline", phone: "0800 543 354", description: "24/7 crisis support" }
  ]},
  au: { name: "Australia", resources: [
    { name: "Lifeline", phone: "13 11 14", description: "24/7 crisis support" }, 
    { name: "Butterfly Foundation", phone: "1800 33 4673", description: "ED-specific support" }
  ]},
  us: { name: "United States", resources: [
    { name: "988 Suicide & Crisis Lifeline", phone: "988", description: "Call or text, 24/7" }, 
    { name: "NEDA Helpline", phone: "1-800-931-2237", description: "Mon-Thu 9am-9pm ET" }
  ]},
  uk: { name: "United Kingdom", resources: [
    { name: "Samaritans", phone: "116 123", description: "Free, 24/7" }, 
    { name: "Beat Eating Disorders", phone: "0808 801 0677", description: "Weekdays 9am-8pm" }
  ]},
  international: { name: "International", resources: [
    { name: "IASP Crisis Centres", url: "https://www.iasp.info/resources/Crisis_Centres/", description: "Find support worldwide" }
  ]}
};

// ============================================
// STAGE EXPLORER (View all stages)
// ============================================
function StageExplorer({ isOpen, onClose, currentStage }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content stage-explorer-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Understanding All Stages</h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        <div className="modal-body">
          <p className="stage-explorer-intro">
            These stages describe patterns, not people. They help match you with appropriate resources.
            Your assessment suggested Stage {currentStage}, but you can explore resources for any stage.
          </p>
          {[0, 1, 2, 3].map(stage => (
            <div key={stage} className={`stage-explorer-item ${stage === currentStage ? 'current' : ''}`}>
              <div className="stage-explorer-header">
                <span className="stage-explorer-number">{stage}</span>
                <h3>{stageContent[stage].name}</h3>
                {stage === currentStage && <span className="current-badge">Your result</span>}
              </div>
              <p>{stageContent[stage].positioning}</p>
              <div className="stage-explorer-helps">
                <strong>What typically helps:</strong>
                <ul>
                  {stageContent[stage].helps.map((help, idx) => (
                    <li key={idx}>{help}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// SEARCH PROMPTS DISPLAY
// ============================================
function SearchPromptsPanel({ stage, location, isOpen, onClose }) {
  if (!isOpen) return null;
  
  const prompts = searchPromptLibrary[stage];
  const locationText = location || '[YOUR CITY]';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content search-prompts-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Search It Yourself</h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        <div className="modal-body">
          <p className="search-prompts-intro">
            Want to do your own research? Here are search terms that work well for finding 
            <strong> {prompts.name}</strong> resources. Copy and paste into Google:
          </p>
          <div className="search-prompts-list">
            {prompts.prompts.map((prompt, idx) => {
              const filledPrompt = prompt.replace('[LOCATION]', locationText);
              return (
                <div key={idx} className="search-prompt-item">
                  <code>{filledPrompt}</code>
                  <button 
                    className="copy-button"
                    onClick={() => navigator.clipboard.writeText(filledPrompt)}
                  >
                    Copy
                  </button>
                </div>
              );
            })}
          </div>
          <div className="search-prompts-tip">
            <strong>Tip:</strong> Try adding "sliding scale" or "low cost" to find affordable options, 
            or "telehealth" for remote services.
          </div>
          <div className="search-prompts-other-stages">
            <p><strong>Looking for different types of support?</strong></p>
            <p className="other-stages-note">
              View prompts for other stages: 
              {[0, 1, 2, 3].filter(s => s !== stage).map(s => (
                <span key={s}> Stage {s} ({stageContent[s].name})</span>
              )).reduce((prev, curr, idx) => idx === 0 ? [curr] : [...prev, ', ', curr], [])}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HELP PANEL (Assessment)
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