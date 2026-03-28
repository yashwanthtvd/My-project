import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import HotelCard from "./HotelCard";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Jost:wght@300;400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --gold: #c9a84c; --gold-dim: rgba(201,168,76,0.12);
  --dark: #0a0a0a; --dark2: #111; --surface: #161616;
  --card: #1c1c1c; --border: #2a2a2a;
  --text: #f5f0e8; --muted: #777; --success: #70c9a0; --danger: #e07070;
  --radius: 12px;
}
.usr { font-family: 'Jost', sans-serif; background: var(--dark); min-height: 100vh; color: var(--text); display: flex; }

/* SIDEBAR */
.usr-sidebar {
  width: 220px; background: var(--dark2); border-right: 1px solid var(--border);
  display: flex; flex-direction: column; padding: 32px 0; position: fixed;
  top: 0; left: 0; bottom: 0;
}
.usr-logo { padding: 0 24px 28px; border-bottom: 1px solid var(--border); }
.usr-logo h2 { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--gold); }
.usr-logo p { font-size: 11px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-top: 2px; }
.usr-nav { padding: 20px 0; flex: 1; }
.usr-nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 24px; font-size: 14px; color: var(--muted);
  cursor: pointer; transition: color 0.2s, background 0.2s; border-left: 2px solid transparent;
}
.usr-nav-item:hover, .usr-nav-item.active { color: var(--text); background: var(--gold-dim); border-left-color: var(--gold); }
.usr-logout {
  margin: 0 16px 16px; padding: 11px;
  background: rgba(224,112,112,0.1); color: var(--danger);
  border: 1px solid rgba(224,112,112,0.2); border-radius: 8px;
  font-family: 'Jost', sans-serif; font-size: 13px; letter-spacing: 1px;
  cursor: pointer; transition: background 0.2s;
}
.usr-logout:hover { background: rgba(224,112,112,0.2); }

/* MAIN */
.usr-main { margin-left: 220px; flex: 1; padding: 40px; }
.usr-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
.usr-topbar h1 { font-family: 'Cormorant Garamond', serif; font-size: 36px; }

/* TABS */
.usr-tabs { display: flex; gap: 4px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 4px; margin-bottom: 32px; width: fit-content; }
.usr-tab {
  padding: 9px 24px; border-radius: 7px; border: none;
  font-family: 'Jost', sans-serif; font-size: 13px; letter-spacing: 1px;
  cursor: pointer; transition: background 0.2s, color 0.2s;
  background: transparent; color: var(--muted);
}
.usr-tab.active { background: var(--gold); color: var(--dark); font-weight: 500; }

/* SEARCH */
.search-wrap { position: relative; margin-bottom: 16px; }
.search-wrap input {
  width: 100%; max-width: 500px; padding: 13px 40px 13px 42px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 10px; color: var(--text);
  font-family: 'Jost', sans-serif; font-size: 14px; outline: none;
  transition: border-color 0.2s;
}
.search-wrap input:focus { border-color: var(--gold); }
.search-wrap input::placeholder { color: #444; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 16px; pointer-events: none; }
.search-clear {
  position: absolute; right: calc(100% - 488px); top: 50%; transform: translateY(-50%);
  color: var(--muted); cursor: pointer; font-size: 14px; padding: 4px;
  transition: color 0.2s;
}
.search-clear:hover { color: var(--text); }

/* FILTERS */
.filter-row {
  display: flex; align-items: flex-end; gap: 16px; flex-wrap: wrap;
  margin-bottom: 20px; padding: 16px 20px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 10px;
}
.filter-group { display: flex; flex-direction: column; gap: 5px; }
.filter-group label { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); }
.filter-group select,
.filter-group input {
  padding: 9px 12px; background: var(--card); border: 1px solid var(--border);
  border-radius: 8px; color: var(--text);
  font-family: 'Jost', sans-serif; font-size: 13px; outline: none;
  transition: border-color 0.2s; min-width: 140px;
}
.filter-group select:focus,
.filter-group input:focus { border-color: var(--gold); }
.filter-group input::placeholder { color: #444; }
.filter-group select option { background: var(--card); }
.btn-clear {
  padding: 9px 18px; background: rgba(224,112,112,0.08); color: var(--danger);
  border: 1px solid rgba(224,112,112,0.2); border-radius: 8px;
  font-family: 'Jost', sans-serif; font-size: 12px; letter-spacing: 1px;
  cursor: pointer; transition: background 0.2s; align-self: flex-end;
}
.btn-clear:hover { background: rgba(224,112,112,0.18); }

.results-count {
  font-size: 13px; color: var(--muted); margin-bottom: 20px;
}
.results-count strong { color: var(--gold); }

.empty-link {
  display: inline-block; margin-top: 10px; color: var(--gold);
  font-size: 13px; cursor: pointer; text-decoration: underline;
  text-underline-offset: 3px;
}

/* HOTEL GRID */
.usr-hotel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
.usr-hotel-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 24px;
  transition: border-color 0.3s, transform 0.2s;
  animation: fadeUp 0.4s ease both;
}
@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.usr-hotel-card:hover { border-color: rgba(201,168,76,0.35); transform: translateY(-2px); }
.hc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.hc-name { font-family: 'Cormorant Garamond', serif; font-size: 22px; }
.hc-city { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
.hc-rating { background: var(--gold-dim); color: var(--gold); border: 1px solid rgba(201,168,76,0.25); border-radius: 20px; padding: 3px 10px; font-size: 12px; }
.hc-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
.info-item { background: var(--card); border-radius: 8px; padding: 10px 14px; }
.info-label { font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); }
.info-value { font-size: 15px; margin-top: 2px; }
.btn-book {
  width: 100%; padding: 12px;
  background: var(--gold); color: var(--dark);
  border: none; border-radius: 8px;
  font-family: 'Jost', sans-serif; font-size: 13px;
  font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase;
  cursor: pointer; transition: opacity 0.2s;
}
.btn-book:hover { opacity: 0.88; }
.btn-book:disabled { background: var(--border); color: var(--muted); cursor: not-allowed; opacity: 1; }
.btn-booked { background: rgba(112,201,160,0.15); color: var(--success); border: 1px solid rgba(112,201,160,0.3); }

/* BOOKINGS */
.bk-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 24px; margin-bottom: 16px;
  display: flex; justify-content: space-between; align-items: center;
  animation: fadeUp 0.4s ease both;
}
.bk-info h3 { font-family: 'Cormorant Garamond', serif; font-size: 22px; margin-bottom: 6px; }
.bk-meta { display: flex; gap: 16px; color: var(--muted); font-size: 13px; }
.btn-cancel {
  padding: 10px 22px; background: rgba(224,112,112,0.1); color: var(--danger);
  border: 1px solid rgba(224,112,112,0.2); border-radius: 8px;
  font-family: 'Jost', sans-serif; font-size: 13px; cursor: pointer;
  transition: background 0.2s; white-space: nowrap;
}
.btn-cancel:hover { background: rgba(224,112,112,0.2); }
.usr-empty { text-align: center; padding: 60px; color: var(--muted); font-size: 16px; }
`;


async function checkAvailability(hotelName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      
      resolve(Math.random() > 0.1);
    }, 1200);
  });
}

function UserDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("browse");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  // bookingStates: { [hotelName]: "idle" | "checking" | "confirmed" | "error" }
  const [bookingStates, setBookingStates] = useState({});

  useEffect(() => {
    setHotels(JSON.parse(localStorage.getItem("hotels")) || []);
    setBookings(JSON.parse(localStorage.getItem("bookings")) || []);
  }, []);

  const logout = () => { localStorage.removeItem("hotelbook_user"); navigate("/"); };

  const isBooked = useCallback((name) => bookings.some(b => b.name === name), [bookings]);

  // Async booking with availability check
  const bookHotel = useCallback(async (hotel) => {
    if (isBooked(hotel.name) || bookingStates[hotel.name] === "checking") return;

    // 1. Set state to "checking" — triggers the availability UI
    setBookingStates(prev => ({ ...prev, [hotel.name]: "checking" }));

    // 2. Await async availability check (simulated network call)
    const available = await checkAvailability(hotel.name);

    if (!available) {
      // 3a. Availability failed — show error state
      setBookingStates(prev => ({ ...prev, [hotel.name]: "error" }));
      return;
    }

    // 3b. Available — confirm booking
    const updated = [...bookings, hotel];
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));

    const updatedHotels = hotels.map(h =>
      h.name === hotel.name ? { ...h, available: false } : h
    );
    setHotels(updatedHotels);
    localStorage.setItem("hotels", JSON.stringify(updatedHotels));

    setBookingStates(prev => ({ ...prev, [hotel.name]: "confirmed" }));
  }, [bookings, hotels, bookingStates, isBooked]);

  const cancelBooking = useCallback((i) => {
    const hotelName = bookings[i].name;
    const updated = bookings.filter((_, idx) => idx !== i);
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));

    const updatedHotels = hotels.map(h =>
      h.name === hotelName ? { ...h, available: true } : h
    );
    setHotels(updatedHotels);
    localStorage.setItem("hotels", JSON.stringify(updatedHotels));
    setBookingStates(prev => ({ ...prev, [hotelName]: "idle" }));
  }, [bookings, hotels]);

  const clearFilters = () => { setQuery(""); setSortBy("default"); setMaxPrice(""); setMinRating(""); };
  const hasFilters = query || sortBy !== "default" || maxPrice || minRating;

  // useMemo — only recomputes when deps change (optimized rendering)
  const filtered = useMemo(() => {
    return hotels
      .filter(h => {
        const q = query.toLowerCase();
        const matchesQuery = !q ||
          h.name?.toLowerCase().includes(q) ||
          h.city?.toLowerCase().includes(q) ||
          h.places?.toLowerCase().includes(q);
        const matchesPrice = !maxPrice || parseFloat(h.price) <= parseFloat(maxPrice);
        const matchesRating = !minRating || parseFloat(h.rating) >= parseFloat(minRating);
        return matchesQuery && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return parseFloat(a.price) - parseFloat(b.price);
        if (sortBy === "price_desc") return parseFloat(b.price) - parseFloat(a.price);
        if (sortBy === "rating") return parseFloat(b.rating) - parseFloat(a.rating);
        return 0;
      });
  }, [hotels, query, sortBy, maxPrice, minRating]);

  return (
    <>
      <style>{css}</style>
      <div className="usr">
        <aside className="usr-sidebar">
          <div className="usr-logo">
            <h2>HotelBook</h2>
            <p>User Portal</p>
          </div>
          <nav className="usr-nav">
            <div className={`usr-nav-item ${tab === "browse" ? "active" : ""}`} onClick={() => setTab("browse")}>
              <span>🏨</span><span>Browse Hotels</span>
            </div>
            <div className={`usr-nav-item ${tab === "bookings" ? "active" : ""}`} onClick={() => setTab("bookings")}>
              <span>📋</span><span>My Bookings {bookings.length > 0 && `(${bookings.length})`}</span>
            </div>
          </nav>
          <button className="usr-logout" onClick={logout}>↩ Logout</button>
        </aside>

        <main className="usr-main">
          <div className="usr-topbar">
            <h1>{tab === "browse" ? "Browse Hotels" : "My Bookings"}</h1>
          </div>

          <div className="usr-tabs">
            <button className={`usr-tab ${tab === "browse" ? "active" : ""}`} onClick={() => setTab("browse")}>Browse</button>
            <button className={`usr-tab ${tab === "bookings" ? "active" : ""}`} onClick={() => setTab("bookings")}>
              My Bookings {bookings.length > 0 && `(${bookings.length})`}
            </button>
          </div>

          {tab === "browse" && (
            <>
              <div className="search-wrap">
                <span className="search-icon">🔍</span>
                <input
                  placeholder="Search by hotel name, city, or nearby places..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  aria-label="Search hotels"
                />
                {query && <span className="search-clear" onClick={() => setQuery("")} aria-label="Clear search">✕</span>}
              </div>

              <div className="filter-row" role="group" aria-label="Filter options">
                <div className="filter-group">
                  <label htmlFor="sort">Sort by</label>
                  <select id="sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="default">Default</option>
                    <option value="price_asc">Price: Low → High</option>
                    <option value="price_desc">Price: High → Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label htmlFor="maxprice">Max Price (₹)</label>
                  <input id="maxprice" type="number" placeholder="e.g. 5000" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                </div>
                <div className="filter-group">
                  <label htmlFor="minrating">Min Rating</label>
                  <input id="minrating" type="number" placeholder="e.g. 4" min="1" max="5" step="0.1" value={minRating} onChange={e => setMinRating(e.target.value)} />
                </div>
                {hasFilters && <button className="btn-clear" onClick={clearFilters}>Clear all</button>}
              </div>

              {hasFilters && (
                <p className="results-count">
                  {filtered.length} hotel{filtered.length !== 1 ? "s" : ""} found
                  {query && <> for "<strong>{query}</strong>"</>}
                </p>
              )}

              {filtered.length === 0 ? (
                <div className="usr-empty">
                  <p>No hotels match your search.</p>
                  <span className="empty-link" onClick={clearFilters}>Clear filters</span>
                </div>
              ) : (
                <div className="usr-hotel-grid">
                  {filtered.map((h, i) => (
                    <HotelCard
                      key={i}
                      hotel={h}
                      mode="user"
                      query={query}
                      isBooked={isBooked(h.name)}
                      bookingState={bookingStates[h.name] || "idle"}
                      onBook={() => bookHotel(h)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {tab === "bookings" && (
            <>
              {bookings.length === 0 ? (
                <div className="usr-empty">You have no bookings yet. Browse hotels to book one!</div>
              ) : (
                bookings.map((b, i) => (
                  <div className="bk-card" key={i} role="article" aria-label={`Booking: ${b.name}`}>
                    <div className="bk-info">
                      <h3>{b.name}</h3>
                      <div className="bk-meta">
                        <span>📍 {b.city}</span>
                        <span>💰 ₹{b.price}</span>
                        <span>⭐ {b.rating}</span>
                      </div>
                    </div>
                    <button className="btn-cancel" onClick={() => cancelBooking(i)} aria-label={`Cancel booking for ${b.name}`}>
                      Cancel Booking
                    </button>
                  </div>
                ))
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default UserDashboard;