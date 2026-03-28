import { useNavigate } from "react-router-dom";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --gold: #c9a84c;
  --gold-light: #e8d5a3;
  --dark: #0a0a0a;
  --dark2: #141414;
  --text: #f5f0e8;
  --muted: #888;
  --radius: 12px;
}

.home { font-family: 'Jost', sans-serif; background: var(--dark); color: var(--text); min-height: 100vh; }

/* NAVBAR */
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 60px;
  background: rgba(10,10,10,0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(201,168,76,0.15);
}
.logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px; font-weight: 700;
  color: var(--gold);
  letter-spacing: 1px;
}
.nav-links { display: flex; gap: 12px; }
.nav-links button {
  background: none; border: none; color: var(--text);
  font-family: 'Jost', sans-serif; font-size: 14px;
  font-weight: 400; letter-spacing: 1px; text-transform: uppercase;
  cursor: pointer; padding: 8px 16px; border-radius: 6px;
  transition: color 0.2s, background 0.2s;
}
.nav-links button:hover { color: var(--gold); background: rgba(201,168,76,0.08); }

/* HERO */
.hero {
  position: relative; height: 100vh;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.bg-video {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; opacity: 0.35;
}
.overlay {
  position: relative; z-index: 2;
  text-align: center; padding: 0 20px;
  animation: fadeUp 1s ease both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.overlay h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(48px, 8vw, 96px);
  font-weight: 700; line-height: 1.05;
  color: var(--text);
  margin-bottom: 16px;
}
.overlay h1 span { color: var(--gold); }
.overlay p {
  font-size: 18px; color: var(--muted);
  letter-spacing: 2px; text-transform: uppercase;
  margin-bottom: 48px;
}
.role-buttons { display: flex; gap: 16px; justify-content: center; }
.btn-primary {
  background: var(--gold); color: var(--dark);
  border: none; padding: 14px 40px;
  font-family: 'Jost', sans-serif; font-size: 14px;
  font-weight: 500; letter-spacing: 2px; text-transform: uppercase;
  border-radius: 6px; cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,168,76,0.3); }
.btn-outline {
  background: transparent; color: var(--gold);
  border: 1px solid var(--gold); padding: 14px 40px;
  font-family: 'Jost', sans-serif; font-size: 14px;
  font-weight: 500; letter-spacing: 2px; text-transform: uppercase;
  border-radius: 6px; cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.btn-outline:hover { background: rgba(201,168,76,0.1); transform: translateY(-2px); }

/* FEATURES */
.features {
  padding: 100px 60px;
  background: var(--dark2);
}
.features > h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 48px; text-align: center;
  margin-bottom: 60px; color: var(--gold);
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px; max-width: 1100px; margin: 0 auto;
}
.feat-card {
  background: var(--dark); border: 1px solid rgba(201,168,76,0.15);
  border-radius: var(--radius); padding: 36px 28px;
  transition: border-color 0.3s, transform 0.3s;
}
.feat-card:hover { border-color: var(--gold); transform: translateY(-4px); }
.feat-icon { font-size: 36px; margin-bottom: 16px; }
.feat-card h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px; margin-bottom: 10px; color: var(--text);
}
.feat-card p { color: var(--muted); font-size: 14px; line-height: 1.6; }

/* CTA */
.cta {
  padding: 100px 60px; text-align: center;
  background: linear-gradient(135deg, rgba(201,168,76,0.08) 0%, transparent 100%);
  border-top: 1px solid rgba(201,168,76,0.1);
}
.cta h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 48px; margin-bottom: 16px;
}
.cta p { color: var(--muted); font-size: 18px; }
`;

function Home() {
  const navigate = useNavigate();

  const goToAuth = (role) => navigate(`/auth/${role}`);

  const goDashboard = () => {
    if (localStorage.getItem("user")) navigate("/user");
    else if (localStorage.getItem("admin")) navigate("/admin");
    else alert("Please login first");
  };

  const logout = () => { localStorage.clear(); navigate("/"); };

  const features = [
    { icon: "🏨", title: "Best Hotels", desc: "Top rated hotels handpicked from every city across the country." },
    { icon: "💰", title: "Low Prices", desc: "Affordable rooms for every budget, no hidden charges." },
    { icon: "⚡", title: "Easy Booking", desc: "Book your perfect room in just a few clicks." },
    { icon: "🔒", title: "Safe & Secure", desc: "Your data and payments are always fully protected." },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="home">
        <nav className="navbar">
          <h2 className="logo">HotelBook</h2>
          <div className="nav-links">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Home</button>
            <button onClick={goDashboard}>Dashboard</button>
            <button onClick={logout}>Logout</button>
          </div>
        </nav>

        <section className="hero">
          <video autoPlay loop muted className="bg-video">
            <source src="/bg.mp4" type="video/mp4" />
          </video>
          <div className="overlay">
            <h1>Find Your <span>Perfect</span> Stay</h1>
            <p>Luxury & comfort at every price point</p>
            <div className="role-buttons">
              <button className="btn-primary" onClick={() => goToAuth("user")}>Book as User</button>
              <button className="btn-outline" onClick={() => goToAuth("admin")}>Admin Panel</button>
            </div>
          </div>
        </section>

        <section className="features">
          <h2>Why HotelBook?</h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feat-card" key={i}>
                <div className="feat-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cta">
          <h2>Start Your Journey Today ✈️</h2>
          <p>Choose your destination and enjoy a stay you'll never forget</p>
        </section>
      </div>
    </>
  );
}

export default Home;