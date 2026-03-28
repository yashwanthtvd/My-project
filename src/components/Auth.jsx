import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Jost:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --gold: #c9a84c; --dark: #0a0a0a; --dark2: #141414;
  --surface: #1a1a1a; --border: #2a2a2a; --text: #f5f0e8; --muted: #888;
}

.auth-container {
  min-height: 100vh; display: flex;
  font-family: 'Jost', sans-serif;
  background: var(--dark);
}

.auth-left {
  flex: 1; background: linear-gradient(135deg, rgba(201,168,76,0.12), rgba(10,10,10,0.9));
  display: flex; flex-direction: column; justify-content: center;
  padding: 80px; border-right: 1px solid var(--border);
}
.auth-left h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 64px; color: var(--gold);
  line-height: 1; margin-bottom: 16px;
}
.auth-left p { color: var(--muted); font-size: 16px; line-height: 1.6; max-width: 320px; }

.auth-right {
  width: 480px; display: flex; align-items: center;
  justify-content: center; padding: 60px 48px;
}

.auth-box { width: 100%; animation: slideIn 0.5s ease both; }
@keyframes slideIn {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

.auth-role-badge {
  display: inline-block;
  background: rgba(201,168,76,0.15); color: var(--gold);
  border: 1px solid rgba(201,168,76,0.3);
  padding: 4px 14px; border-radius: 20px;
  font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
  margin-bottom: 20px;
}

.auth-box h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 40px; color: var(--text);
  margin-bottom: 36px; font-weight: 600;
}

.auth-field { margin-bottom: 16px; }
.auth-field label {
  display: block; font-size: 11px; letter-spacing: 2px;
  text-transform: uppercase; color: var(--muted); margin-bottom: 8px;
}
.auth-field input {
  width: 100%; padding: 14px 16px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 8px; color: var(--text);
  font-family: 'Jost', sans-serif; font-size: 15px;
  outline: none; transition: border-color 0.2s;
}
.auth-field input:focus { border-color: var(--gold); }
.auth-field input::placeholder { color: #444; }

.auth-btn {
  width: 100%; padding: 15px;
  background: var(--gold); color: var(--dark);
  border: none; border-radius: 8px;
  font-family: 'Jost', sans-serif; font-size: 14px;
  font-weight: 500; letter-spacing: 2px; text-transform: uppercase;
  cursor: pointer; margin-top: 8px;
  transition: opacity 0.2s, transform 0.2s;
}
.auth-btn:hover { opacity: 0.9; transform: translateY(-1px); }

.auth-toggle {
  text-align: center; margin-top: 24px;
  color: var(--muted); font-size: 14px;
}
.auth-toggle span {
  color: var(--gold); cursor: pointer; margin-left: 6px;
  text-decoration: underline; text-underline-offset: 3px;
}

.auth-error {
  background: rgba(220,80,80,0.1); border: 1px solid rgba(220,80,80,0.3);
  color: #e07070; border-radius: 8px; padding: 12px 16px;
  font-size: 13px; margin-bottom: 16px;
}
.auth-success {
  background: rgba(80,180,120,0.1); border: 1px solid rgba(80,180,120,0.3);
  color: #70c9a0; border-radius: 8px; padding: 12px 16px;
  font-size: 13px; margin-bottom: 16px;
}

@media (max-width: 768px) {
  .auth-left { display: none; }
  .auth-right { width: 100%; padding: 40px 24px; }
}
`;

function Auth() {
  const { role } = useParams();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  // Storage key is role-specific so admin and user accounts don't collide
  const storageKey = `hotelbook_${role}`;

  const switchMode = () => {
    setIsLogin(prev => !prev);
    setMsg({ type: "", text: "" });
    setForm({ username: "", password: "" });
  };

  const handleSubmit = () => {
    setMsg({ type: "", text: "" });

    if (!form.username.trim() || !form.password.trim()) {
      setMsg({ type: "error", text: "Please fill in all fields." });
      return;
    }
    if (form.username.trim().length < 3) {
      setMsg({ type: "error", text: "Username must be at least 3 characters." });
      return;
    }
    if (form.password.length < 4) {
      setMsg({ type: "error", text: "Password must be at least 4 characters." });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const stored = JSON.parse(localStorage.getItem(storageKey));

      if (isLogin) {
        // LOGIN
        if (!stored) {
          setMsg({ type: "error", text: "No account found. Please sign up first." });
          return;
        }
        if (stored.username !== form.username.trim() || stored.password !== form.password) {
          setMsg({ type: "error", text: "Incorrect username or password." });
          return;
        }
        navigate(role === "user" ? "/user" : "/admin");
      } else {
        // SIGNUP
        if (stored) {
          setMsg({ type: "error", text: `A ${role} account already exists. Please login instead.` });
          return;
        }
        localStorage.setItem(storageKey, JSON.stringify({
          username: form.username.trim(),
          password: form.password,
          role,
        }));
        setMsg({ type: "success", text: "Account created successfully! You can now login." });
        setIsLogin(true);
        setForm({ username: "", password: "" });
      }
    }, 400); // small delay for UX feel
  };

  return (
    <>
      <style>{css}</style>
      <div className="auth-container">
        <div className="auth-left">
          <h1>Hotel<br />Book</h1>
          <p>Your gateway to the finest stays. Comfort, luxury, and simplicity — all in one place.</p>
        </div>
        <div className="auth-right">
          <div className="auth-box">
            <div className="auth-role-badge">{role}</div>
            <h2>{isLogin ? "Welcome back" : "Create account"}</h2>

            {msg.text && (
              <div className={msg.type === "error" ? "auth-error" : "auth-success"}>
                {msg.type === "error" ? "⚠ " : "✓ "}{msg.text}
              </div>
            )}

            <div className="auth-field">
              <label>Username</label>
              <input
                placeholder="Enter your username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                autoComplete="username"
              />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>

            <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
            </button>

            <p className="auth-toggle">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <span onClick={switchMode}>{isLogin ? " Sign up" : " Login"}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Auth;