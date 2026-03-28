import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HotelCard from "./HotelCard";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Jost:wght@300;400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --gold: #c9a84c; --gold-dim: rgba(201,168,76,0.12);
  --dark: #0a0a0a; --dark2: #111; --surface: #161616;
  --card: #1c1c1c; --border: #2a2a2a;
  --text: #f5f0e8; --muted: #777; --danger: #e07070; --success: #70c9a0;
  --radius: 12px;
}
.adm { font-family: 'Jost', sans-serif; background: var(--dark); min-height: 100vh; color: var(--text); display: flex; }

/* SIDEBAR */
.adm-sidebar {
  width: 220px; background: var(--dark2); border-right: 1px solid var(--border);
  display: flex; flex-direction: column; padding: 32px 0; position: fixed;
  top: 0; left: 0; bottom: 0;
}
.adm-logo { padding: 0 24px 28px; border-bottom: 1px solid var(--border); }
.adm-logo h2 { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--gold); }
.adm-logo p { font-size: 11px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-top: 2px; }
.adm-nav { padding: 20px 0; flex: 1; }
.adm-nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 24px; font-size: 14px; color: var(--muted);
  cursor: pointer; transition: color 0.2s, background 0.2s; border-left: 2px solid transparent;
}
.adm-nav-item:hover, .adm-nav-item.active { color: var(--text); background: var(--gold-dim); border-left-color: var(--gold); }
.adm-nav-item span:first-child { font-size: 16px; }
.adm-logout {
  margin: 0 16px 16px; padding: 11px;
  background: rgba(224,112,112,0.1); color: var(--danger);
  border: 1px solid rgba(224,112,112,0.2); border-radius: 8px;
  font-family: 'Jost', sans-serif; font-size: 13px; letter-spacing: 1px;
  cursor: pointer; transition: background 0.2s;
}
.adm-logout:hover { background: rgba(224,112,112,0.2); }

/* MAIN */
.adm-main { margin-left: 220px; flex: 1; padding: 40px; }
.adm-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 36px; }
.adm-topbar h1 { font-family: 'Cormorant Garamond', serif; font-size: 36px; }
.adm-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 36px; }
.stat-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 24px;
}
.stat-card .stat-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
.stat-card .stat-value { font-family: 'Cormorant Garamond', serif; font-size: 40px; color: var(--gold); }

/* FORM */
.adm-section-title { font-family: 'Cormorant Garamond', serif; font-size: 26px; margin-bottom: 20px; color: var(--gold); }
.adm-form {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 28px; margin-bottom: 36px;
}
.adm-form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
.adm-field label { display: block; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
.adm-field input {
  width: 100%; padding: 11px 14px;
  background: var(--card); border: 1px solid var(--border);
  border-radius: 8px; color: var(--text);
  font-family: 'Jost', sans-serif; font-size: 14px; outline: none;
  transition: border-color 0.2s;
}
.adm-field input:focus { border-color: var(--gold); }
.adm-field input::placeholder { color: #444; }
.adm-form-actions { display: flex; gap: 12px; }
.btn-gold {
  padding: 11px 28px; background: var(--gold); color: var(--dark);
  border: none; border-radius: 8px; font-family: 'Jost', sans-serif;
  font-size: 13px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase;
  cursor: pointer; transition: opacity 0.2s;
}
.btn-gold:hover { opacity: 0.88; }
.btn-ghost {
  padding: 11px 28px; background: transparent; color: var(--muted);
  border: 1px solid var(--border); border-radius: 8px; font-family: 'Jost', sans-serif;
  font-size: 13px; cursor: pointer; transition: color 0.2s, border-color 0.2s;
}
.btn-ghost:hover { color: var(--text); border-color: var(--text); }

/* HOTEL LIST */
.adm-hotel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
.adm-hotel-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 24px;
  transition: border-color 0.3s, transform 0.2s;
  animation: fadeUp 0.4s ease both;
}
@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.adm-hotel-card:hover { border-color: rgba(201,168,76,0.4); transform: translateY(-2px); }
.hotel-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.hotel-card-name { font-family: 'Cormorant Garamond', serif; font-size: 22px; }
.hotel-card-city { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
.hotel-badge {
  background: var(--gold-dim); color: var(--gold);
  border: 1px solid rgba(201,168,76,0.25); border-radius: 20px;
  padding: 3px 10px; font-size: 12px;
}
.hotel-card-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
.info-item { background: var(--card); border-radius: 8px; padding: 10px 14px; }
.info-item .info-label { font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); }
.info-item .info-value { font-size: 15px; margin-top: 2px; }
.hotel-card-actions { display: flex; gap: 10px; }
.btn-edit {
  flex: 1; padding: 9px; background: rgba(201,168,76,0.1); color: var(--gold);
  border: 1px solid rgba(201,168,76,0.25); border-radius: 8px;
  font-family: 'Jost', sans-serif; font-size: 13px; cursor: pointer;
  transition: background 0.2s;
}
.btn-edit:hover { background: rgba(201,168,76,0.2); }
.btn-delete {
  flex: 1; padding: 9px; background: rgba(224,112,112,0.08); color: var(--danger);
  border: 1px solid rgba(224,112,112,0.2); border-radius: 8px;
  font-family: 'Jost', sans-serif; font-size: 13px; cursor: pointer;
  transition: background 0.2s;
}
.btn-delete:hover { background: rgba(224,112,112,0.18); }
.adm-empty { text-align: center; padding: 60px; color: var(--muted); }
.adm-empty p { font-size: 16px; }
`;

const emptyHotel = { name: "", city: "", price: "", rating: "", food: "", places: "" };

function AdminDashboard() {
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(emptyHotel);
  const [hotels, setHotels] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("hotels")) || [];
    setHotels(data);
  }, []);

  const save = (updated) => {
    setHotels(updated);
    localStorage.setItem("hotels", JSON.stringify(updated));
  };

  const addOrUpdate = () => {
    if (!hotel.name || !hotel.city || !hotel.price) return alert("Name, city and price are required.");
    let updated;
    if (editIndex !== null) {
      updated = hotels.map((h, i) => (i === editIndex ? hotel : h));
      setEditIndex(null);
    } else {
      updated = [...hotels, { ...hotel, available: true }];
    }
    save(updated);
    setHotel(emptyHotel);
  };

  const startEdit = (i) => {
    setHotel(hotels[i]);
    setEditIndex(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteHotel = (i) => {
    if (!window.confirm("Delete this hotel?")) return;
    save(hotels.filter((_, idx) => idx !== i));
  };

  const cancelEdit = () => { setEditIndex(null); setHotel(emptyHotel); };

  const fields = [
    { key: "name", label: "Hotel Name", placeholder: "e.g. The Grand Palace" },
    { key: "city", label: "City", placeholder: "e.g. Mumbai" },
    { key: "price", label: "Price (₹/night)", placeholder: "e.g. 4500" },
    { key: "rating", label: "Rating (1–5)", placeholder: "e.g. 4.5" },
    { key: "food", label: "Food Rating", placeholder: "e.g. 4.2" },
    { key: "places", label: "Nearby Places", placeholder: "e.g. Marina Beach, Fort" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="adm">
        <aside className="adm-sidebar">
          <div className="adm-logo">
            <h2>HotelBook</h2>
            <p>Admin Panel</p>
          </div>
          <nav className="adm-nav">
            <div className="adm-nav-item active">
              <span>🏨</span><span>Hotels</span>
            </div>
          </nav>
          <button className="adm-logout" onClick={() => { localStorage.removeItem("hotelbook_admin"); navigate("/"); }}>
            ↩ Logout
          </button>
        </aside>

        <main className="adm-main">
          <div className="adm-topbar">
            <h1>Hotel Management</h1>
          </div>

          <div className="adm-stats">
            <div className="stat-card">
              <div className="stat-label">Total Hotels</div>
              <div className="stat-value">{hotels.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Cities Covered</div>
              <div className="stat-value">{new Set(hotels.map(h => h.city)).size}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Avg Rating</div>
              <div className="stat-value">
                {hotels.length ? (hotels.reduce((a, h) => a + parseFloat(h.rating || 0), 0) / hotels.length).toFixed(1) : "—"}
              </div>
            </div>
          </div>

          <h2 className="adm-section-title">{editIndex !== null ? "✏️ Edit Hotel" : "➕ Add Hotel"}</h2>
          <div className="adm-form">
            <div className="adm-form-grid">
              {fields.map(f => (
                <div className="adm-field" key={f.key}>
                  <label>{f.label}</label>
                  <input placeholder={f.placeholder} value={hotel[f.key]}
                    onChange={(e) => setHotel({ ...hotel, [f.key]: e.target.value })} />
                </div>
              ))}
            </div>
            <div className="adm-form-actions">
              <button className="btn-gold" onClick={addOrUpdate}>
                {editIndex !== null ? "Update Hotel" : "Add Hotel"}
              </button>
              {editIndex !== null && <button className="btn-ghost" onClick={cancelEdit}>Cancel</button>}
            </div>
          </div>

          <h2 className="adm-section-title">🏨 All Hotels ({hotels.length})</h2>
          {hotels.length === 0 ? (
            <div className="adm-empty"><p>No hotels yet. Add your first hotel above.</p></div>
          ) : (
            <div className="adm-hotel-grid">
              {hotels.map((h, i) => (
                <HotelCard
                  key={i}
                  hotel={h}
                  mode="admin"
                  onEdit={() => startEdit(i)}
                  onDelete={() => deleteHotel(i)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default AdminDashboard;