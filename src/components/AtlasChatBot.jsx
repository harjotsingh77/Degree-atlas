import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { programmes, universities, inr } from '../data.js';
import { useShortlist } from '../context/ShortlistContext.jsx';

export default function AtlasChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'atlas',
      text: "Hi there! 👋 I'm **Atlas**, your DegreeAtlas academic advisor.\n\nAsk me anything about online degrees, real semester fees, NAAC grades, or comparing programmes.",
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(false);
  const messagesEndRef = useRef(null);
  const nav = useNavigate();
  const { count: shortlistCount } = useShortlist();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnread(false);
    }
  }, [isOpen, messages, isTyping]);

  const quickPrompts = [
    '🎓 Top Online MBA degrees',
    '💰 Best courses under ₹1.5 Lakh',
    '❤️ How does Shortlist work?',
    '⚖️ Compare top universities',
  ];

  const generateAtlasResponse = (query) => {
    const q = query.toLowerCase().trim();

    if (/^(hi|hello|hey|namaste|hola|hlo|hii)/i.test(q)) {
      return {
        text: "Hello! Great to connect with you. 🎓\n\nI can help you explore verified UGC-DEB accredited programmes, check real fees without agent spam, or compare universities side by side. What degree are you considering?",
        links: [
          { label: 'Explore All Programmes →', to: '/programmes' },
          { label: 'View Universities →', to: '/universities' },
        ],
      };
    }

    if (q.includes('mba') || q.includes('management') || q.includes('bba')) {
      const mbaList = programmes.filter((p) => p.name.toLowerCase().includes('mba')).slice(0, 3);
      return {
        text: `Here are the top accredited Online MBA programmes on DegreeAtlas:\n\n${mbaList
          .map((m) => {
            const uni = universities.find((u) => u.id === m.universityId);
            return `• **${m.name}** at ${uni?.name} — ${inr(m.feeTotal)} (${m.durationMo} Months, NAAC ${uni?.naacGrade || 'A+'})`;
          })
          .join('\n\n')}\n\nYou can shortlist any of these by clicking the ❤️ heart icon on the card!`,
        links: [
          { label: 'View All MBA Programmes →', to: '/programmes?cat=Management' },
          { label: 'Compare MBA Options →', to: '/compare' },
        ],
      };
    }

    if (q.includes('mca') || q.includes('bca') || q.includes('tech') || q.includes('computer') || q.includes('coding')) {
      const techList = programmes.filter((p) => p.name.toLowerCase().includes('mca') || p.name.toLowerCase().includes('bca')).slice(0, 3);
      return {
        text: `Top computer application and IT degrees available:\n\n${techList
          .map((t) => {
            const uni = universities.find((u) => u.id === t.universityId);
            return `• **${t.name}** (${uni?.name}) — ${inr(t.feeTotal)}, Duration: ${t.durationMo} Months`;
          })
          .join('\n\n')}\n\nAll courses are 100% online with UGC-DEB entitlement.`,
        links: [
          { label: 'Explore Tech & MCA Degrees →', to: '/programmes?cat=Computer%20Applications' },
        ],
      };
    }

    if (q.includes('fee') || q.includes('cost') || q.includes('budget') || q.includes('cheap') || q.includes('paisa') || q.includes('lakh')) {
      const budgetProgs = [...programmes].sort((a, b) => a.feeTotal - b.feeTotal).slice(0, 3);
      return {
        text: `Most affordable verified degrees on DegreeAtlas:\n\n${budgetProgs
          .map((p) => {
            const uni = universities.find((u) => u.id === p.universityId);
            return `• **${p.name}** (${uni?.name}) — **${inr(p.feeTotal)}** total fee`;
          })
          .join('\n\n')}\n\nMost universities offer no-cost EMI starting around ₹5,000/month.`,
        links: [
          { label: 'Browse All Programmes →', to: '/programmes' },
        ],
      };
    }

    if (q.includes('shortlist') || q.includes('heart') || q.includes('save') || q.includes('favourite')) {
      return {
        text: `**How Shortlist Works:**\n\n1. On any course card, click the **❤️ Heart Icon** directly under the red PG/UG ribbon.\n2. The heart turns red, and your shortlist count in the header updates.\n3. Click the header Heart icon or visit **My Shortlist** to review all your saved programmes and compare them in 1 click!`,
        links: [
          { label: `Open My Shortlist (${shortlistCount}) →`, to: '/shortlist' },
          { label: 'Browse Programmes →', to: '/programmes' },
        ],
      };
    }

    if (q.includes('compare') || q.includes('vs') || q.includes('difference')) {
      return {
        text: `**Comparison Engine:**\n\nDegreeAtlas lets you compare up to 4 universities or programmes side by side across:\n• Total & semester fees\n• UGC entitlement & NAAC grades\n• Eligibility criteria\n• Core specialisations\n\nClick "+ Compare" on any course or visit our dedicated Compare tool!`,
        links: [
          { label: 'Open Compare Tool →', to: '/compare' },
        ],
      };
    }

    if (q.includes('chitkara') || q.includes('lpu') || q.includes('chandigarh') || q.includes('amity') || q.includes('vit') || q.includes('jain') || q.includes('manipal')) {
      const matchedUni = universities.find((u) => q.includes(u.short.toLowerCase()) || q.includes(u.name.toLowerCase().split(' ')[0]));
      if (matchedUni) {
        return {
          text: `**${matchedUni.name}:**\n\n• **NAAC Grade:** ${matchedUni.naacGrade || 'A+'}\n• **Location:** ${matchedUni.location}\n• **Accreditation:** UGC-DEB Entitled, AICTE Approved\n• **Key Programmes:** ${matchedUni.stats?.progsOffered || 'Multiple'} online UG & PG degrees.\n\nWould you like to explore their fee structure and programmes?`,
          links: [
            { label: `View ${matchedUni.name} →`, to: `/universities/${matchedUni.slug}` },
          ],
        };
      }
    }

    if (q.includes('eligibility') || q.includes('admission') || q.includes('exam')) {
      return {
        text: `**General Admission & Eligibility Guidelines:**\n\n• **Postgraduate (PG / MBA / MCA):** Bachelor's degree from a recognised university with minimum 50% aggregate (45% for reserved categories).\n• **Undergraduate (UG / BBA / BCA):** 10+2 from a recognised board with min 45–50% marks.\n• **No Entrance Exam Required:** Most online degrees offer direct admission based on past academic records!`,
        links: [
          { label: 'Explore Programmes →', to: '/programmes' },
        ],
      };
    }

    // Default Fallback
    return {
      text: "Thanks for asking! I can help you search courses, inspect transparent fee schedules, or explain UGC approvals.\n\nYou can also browse our full list of accredited degrees or open the comparison matrix.",
      links: [
        { label: 'Browse Programmes →', to: '/programmes' },
        { label: 'Open Compare Page →', to: '/compare' },
        { label: 'My Shortlist →', to: '/shortlist' },
      ],
    };
  };

  const handleSend = (textToSend = input) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAtlasResponse(trimmed);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'atlas',
        text: response.text,
        links: response.links,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="atlas-chatbot-root">
      {/* Floating Launcher Button */}
      <button
        type="button"
        className={`atlas-chat-launcher ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close Atlas Chat' : 'Open Atlas Academic Advisor Chat'}
        title="Chat with Atlas (Degree Advisor)"
      >
        {isOpen ? (
          /* Close X icon when open */
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          /* Red D Logo when closed */
          <div className="atlas-launcher-inner">
            <svg width="28" height="28" viewBox="0 0 32 32">
              <path d="M6 4h10a12 12 0 0 1 12 12v0a12 12 0 0 1-12 12H6V4zm6 5.5v13h4a6.5 6.5 0 0 0 6.5-6.5v0a6.5 6.5 0 0 0-6.5-6.5h-4z" fill="#DC2626" />
            </svg>
          </div>
        )}
      </button>

      {/* Floating Prompt Tooltip (shows when closed) */}
      {!isOpen && (
        <div className="atlas-launcher-callout" onClick={() => setIsOpen(true)}>
          <span className="atlas-callout-text">Chat with <strong>Atlas</strong></span>
          <span className="atlas-callout-close" onClick={(e) => { e.stopPropagation(); e.target.parentElement.style.display = 'none'; }}>×</span>
        </div>
      )}

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="atlas-chat-window" role="dialog" aria-label="Atlas Academic Advisor Chat">
          {/* Header */}
          <div className="atlas-chat-header">
            <div className="atlas-header-left">
              <div className="atlas-avatar-circle">
                <svg width="20" height="20" viewBox="0 0 32 32">
                  <path d="M6 4h10a12 12 0 0 1 12 12v0a12 12 0 0 1-12 12H6V4zm6 5.5v13h4a6.5 6.5 0 0 0 6.5-6.5v0a6.5 6.5 0 0 0-6.5-6.5h-4z" fill="#DC2626" />
                </svg>
              </div>
              <div className="atlas-header-info">
                <div className="atlas-header-title-row">
                  <h3 className="atlas-name">Atlas</h3>
                  <span className="atlas-ai-badge">Degree Advisor</span>
                </div>
                <span className="atlas-online-status">
                  <span className="atlas-status-dot" /> Online • Instant answers
                </span>
              </div>
            </div>

            <div className="atlas-header-actions">
              <button
                type="button"
                className="atlas-btn-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="atlas-chat-body">
            {messages.map((m) => (
              <div key={m.id} className={`atlas-message-row ${m.sender === 'user' ? 'user-row' : 'atlas-row'}`}>
                {m.sender === 'atlas' && (
                  <div className="atlas-msg-avatar">
                    <svg width="14" height="14" viewBox="0 0 32 32">
                      <path d="M6 4h10a12 12 0 0 1 12 12v0a12 12 0 0 1-12 12H6V4zm6 5.5v13h4a6.5 6.5 0 0 0 6.5-6.5v0a6.5 6.5 0 0 0-6.5-6.5h-4z" fill="#DC2626" />
                    </svg>
                  </div>
                )}
                <div className="atlas-bubble-wrap">
                  <div className={`atlas-bubble ${m.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                    <div className="atlas-bubble-content">
                      {m.text.split('\n\n').map((para, i) => (
                        <p key={i} style={{ margin: i === 0 ? 0 : '8px 0 0' }}>
                          {para.split('\n').map((line, j) => {
                            // Bold parser for **text**
                            const parts = line.split(/(\*\*[^*]+\*\*)/g);
                            return (
                              <span key={j} style={{ display: 'block' }}>
                                {parts.map((part, k) => {
                                  if (part.startsWith('**') && part.endsWith('**')) {
                                    return <strong key={k}>{part.slice(2, -2)}</strong>;
                                  }
                                  return part;
                                })}
                              </span>
                            );
                          })}
                        </p>
                      ))}
                    </div>

                    {/* Action Links */}
                    {m.links && m.links.length > 0 && (
                      <div className="atlas-msg-links">
                        {m.links.map((link, idx) => (
                          <Link
                            key={idx}
                            to={link.to}
                            className="atlas-chip-link"
                            onClick={() => {
                              if (window.innerWidth < 768) setIsOpen(false);
                            }}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="atlas-time-label">{m.time}</span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="atlas-message-row atlas-row">
                <div className="atlas-msg-avatar">
                  <svg width="14" height="14" viewBox="0 0 32 32">
                    <path d="M6 4h10a12 12 0 0 1 12 12v0a12 12 0 0 1-12 12H6V4zm6 5.5v13h4a6.5 6.5 0 0 0 6.5-6.5v0a6.5 6.5 0 0 0-6.5-6.5h-4z" fill="#DC2626" />
                  </svg>
                </div>
                <div className="atlas-bubble bot-bubble atlas-typing-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="atlas-quick-prompts">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                className="atlas-prompt-chip"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="atlas-chat-input-bar">
            <textarea
              className="atlas-chat-textarea"
              placeholder="Ask Atlas about fees, degrees, shortlisting..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={1}
            />
            <button
              type="button"
              className="atlas-btn-send"
              onClick={() => handleSend()}
              disabled={!input.trim()}
              aria-label="Send message to Atlas"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
