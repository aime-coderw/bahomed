import React, { useEffect, useState, useRef } from "react";
import { FaUserInjured, FaProjectDiagram, FaGlobeAmericas, FaUserMd } from "react-icons/fa";
import "./Home.css";
import heroImage from "../assets/logo.jpg";

// Service Images
import telecareImg from "../assets/services/telecare.jpg";
import pharmacyImg from "../assets/services/pharmacy.jpg";
import diagnosticsImg from "../assets/services/diagnostics.jpg";
import chroniccareImg from "../assets/services/chroniccare.jpg";
import lifetrackImg from "../assets/services/lifetrack.jpg";
import mentalImg from "../assets/services/mental.jpg";
import preventiveImg from "../assets/services/preventive.jpg";
import globalcareImg from "../assets/services/globalcare.jpg";
import chatIcon from "../assets/chat-icon.jpg"; // replace with your image path


export default function Home() {
  // Impact stats
  const [projects, setProjects] = useState(0);
  const [countries, setCountries] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [specialists, setSpecialists] = useState(0);
  const impactRef = useRef(null);

  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([{ sender: "bot", text: "👋 Hello! How can I help you today?" }]);
  const chatEndRef = useRef(null);

  const predefinedReplies = {
    contact: "📞 Phone: +250 791 231 993\n✉️ Email: contact@baho.com\n📍 Address: Kigali, Rwanda",
    services: "We provide TeleCare, e-Pharmacy, Diagnostics, ChronicCare, LifeTrack, Mental Health, Preventive Programs, and GlobalCare.",
    telecare: "TeleCare allows video consultations and online appointments with our specialists.",
    pharmacy: "BAHO Meds: Order prescriptions and chronic medications online, delivered to your home.",
    "mental health": "Tele-counseling and therapy services for mental health and stress management."
  };

  const sendMessage = async (customMessage) => {
  const msg = customMessage || userMessage;
  if (!msg.trim()) return;

  // Add user message
  setMessages(prev => [...prev, { sender: "user", text: msg }]);
  setUserMessage("");

  // Try predefined replies
  const key = msg.toLowerCase().trim();
  if (predefinedReplies[key]) {
    setMessages(prev => [...prev, { sender: "bot", text: predefinedReplies[key] }]);
    return;
  }

  // Temporary "typing"
  setMessages(prev => [...prev, { sender: "bot", text: "Typing..." }]);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });

    if (!res.ok) throw new Error("Network");

    const data = await res.json();

    setMessages(prev => {
      const updated = [...prev];
      updated[updated.length - 1] = { sender: "bot", text: data.reply };
      return updated;
    });

  } catch (err) {
    setMessages(prev => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        sender: "bot",
        text: "⚠️ Server is unreachable. Please try again later.",
      };
      return updated;
    });
  }
};


  // Scroll chat to bottom whenever messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, chatOpen]);

  // Animate impact counters
  useEffect(() => {
    let observer;
    const animateValue = (target, setter, duration = 2000) => {
      let start = 0;
      const increment = target / (duration / 50);
      const interval = setInterval(() => {
        start += increment;
        if (start >= target) {
          start = target;
          clearInterval(interval);
        }
        setter(Math.floor(start));
      }, 50);
    };

    if (impactRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            animateValue(5000, setPatientCount);
            animateValue(298, setProjects);
            animateValue(56, setCountries);
            animateValue(465, setSpecialists);
            observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(impactRef.current);
    }

    return () => observer && observer.disconnect();
  }, []);

  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-text">
          <h1>Welcome to BAHO</h1>
          <p>Accessible, affordable, and high-quality healthcare for everyone in Africa.</p>
          <a href="/patient-care" className="hero-button">Start Patient Care</a>
        </div>
      </section>

      {/* IMPACT SECTION */}
      <section className="impact" ref={impactRef}>
        <div className="impact-cards">
          <div className="impact-card">
            <FaUserInjured className="impact-icon" />
            <h3>{patientCount.toLocaleString()}+</h3>
            <p>Patients impacted in 2024</p>
          </div>
          <div className="impact-card">
            <FaProjectDiagram className="impact-icon" />
            <h3>{projects.toLocaleString()}</h3>
            <p>Projects with Telemedicine access</p>
          </div>
          <div className="impact-card">
            <FaGlobeAmericas className="impact-icon" />
            <h3>{countries.toLocaleString()}</h3>
            <p>Countries with Telemedicine access</p>
          </div>
          <div className="impact-card">
            <FaUserMd className="impact-icon" />
            <h3>{specialists.toLocaleString()}</h3>
            <p>Specialists in our network</p>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="services">
        <h2>Our Services</h2>
        <div className="service-cards">
          <div className="service-card">
            <img src={telecareImg} alt="TeleCare" className="service-image"/>
            <h3>TeleCare / Telemedicine</h3>
            <p>Video consultations, online appointments, and specialist access for everyone, anywhere.</p>
            <a href="/telecare" className="service-button">Learn More</a>
          </div>

          <div className="service-card">
            <img src={pharmacyImg} alt="e-Pharmacy" className="service-image"/>
            <h3>BAHO Meds (e-Pharmacy)</h3>
            <p>Order online prescriptions, chronic medication packs, and have them delivered to your home.</p>
            <a href="/pharmacy" className="service-button">Learn More</a>
          </div>

          <div className="service-card">
            <img src={diagnosticsImg} alt="Diagnostics" className="service-image"/>
            <h3>Diagnostics & Lab Services</h3>
            <p>Blood tests, infectious disease screening, and preventive checkups at your convenience.</p>
            <a href="/diagnostics" className="service-button">Learn More</a>
          </div>

          <div className="service-card">
            <img src={chroniccareImg} alt="ChronicCare" className="service-image"/>
            <h3>ChronicCare / Disease Management</h3>
            <p>Manage diabetes, hypertension, HIV/AIDS, and more with ongoing support and subscriptions.</p>
            <a href="/chroniccare" className="service-button">Learn More</a>
          </div>

          <div className="service-card">
            <img src={lifetrackImg} alt="LifeTrack" className="service-image"/>
            <h3>LifeTrack (Maternal & Child Health)</h3>
            <p>Pregnancy & child monitoring, immunizations, and nutritional guidance for mothers and children.</p>
            <a href="/lifetrack" className="service-button">Learn More</a>
          </div>

          <div className="service-card">
            <img src={mentalImg} alt="Mental Health" className="service-image"/>
            <h3>Mental Health & Counseling</h3>
            <p>Tele-counseling, therapy, and stress management for youth, adults, and corporates.</p>
            <a href="/mental" className="service-button">Learn More</a>
          </div>

          <div className="service-card">
            <img src={preventiveImg} alt="Preventive" className="service-image"/>
            <h3>Preventive & Wellness Programs</h3>
            <p>Fitness, nutrition, and lifestyle coaching for urban population and corporate clients.</p>
            <a href="/preventive" className="service-button">Learn More</a>
          </div>

          <div className="service-card">
            <img src={globalcareImg} alt="GlobalCare" className="service-image"/>
            <h3>GlobalCare / Medical Tourism</h3>
            <p>High-value procedures, concierge services, and international referrals for specialized care.</p>
            <a href="/globalcare" className="service-button">Learn More</a>
          </div>
        </div>
      </section>

      {/* CHATBOT */}
<div className="chatbot-container">
  <div className={`chatbot-window ${chatOpen ? "show" : ""}`}>
    <div className="chatbot-header">
      <span>BAHO Assistant</span>
      <button onClick={() => setChatOpen(false)}>×</button>
    </div>

    {/* Messages */}
    <div className="chatbot-messages">
      {messages.map((m, i) => (
        <div key={i} className={`chatbot-msg ${m.sender}`}>
          {m.sender === "bot"
            ? m.text.split(/\*|\n/).map((line, idx) => (
                <p key={idx}>{line.trim()}</p>
              ))
            : m.text
          }
        </div>
      ))}
      <div ref={chatEndRef}></div>
    </div>

    {/* Quick buttons pinned above input */}
    <div className="chatbot-quick-buttons">
      {["Services", "Contact", "TeleCare", "Mental Health"].map(btn => (
        <button key={btn} onClick={() => sendMessage(btn)}>{btn}</button>
      ))}
    </div>

    {/* Input */}
    <div className="chatbot-input">
      <input
        type="text"
        placeholder="Type your message..."
        value={userMessage}
        onChange={e => setUserMessage(e.target.value)}
        onKeyDown={e => e.key === "Enter" && sendMessage()}
      />
      <button onClick={() => sendMessage()}>Send</button>
    </div>
  </div>

 {/* Floating chat image button with label */}
<div className="chatbot-image-wrapper" onClick={() => setChatOpen(true)}>
  <span className="chatbot-label">Chat with Dr. Aline</span>
  <img
    src={chatIcon}          // your imported image
    alt="Chat"
    className="chatbot-image-button"
  />
</div>


</div>
    </div>
  );
}