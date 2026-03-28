
function Highlight({ text = "", query = "" }) {
  if (!query.trim()) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} style={{
              background: "rgba(201,168,76,0.35)", color: "inherit",
              borderRadius: 3, padding: "0 2px"
            }}>{part}</mark>
          : part
      )}
    </>
  );
}

const cardCss = `
  .hc-wrap {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 24px;
    transition: border-color 0.3s, transform 0.2s;
    animation: hcFadeUp 0.4s ease both;
  }
  @keyframes hcFadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .hc-wrap:hover { border-color: rgba(201,168,76,0.4); transform: translateY(-2px); }

  .hc-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; }
  .hc-name { font-family:'Cormorant Garamond',serif; font-size:22px; }
  .hc-city { font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-top:2px; }
  .hc-badge { background:var(--gold-dim); color:var(--gold); border:1px solid rgba(201,168,76,0.25); border-radius:20px; padding:3px 10px; font-size:12px; white-space:nowrap; }

  .hc-info { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px; }
  .hc-info-item { background:var(--card); border-radius:8px; padding:10px 14px; }
  .hc-info-label { font-size:10px; letter-spacing:1px; text-transform:uppercase; color:var(--muted); }
  .hc-info-value { font-size:15px; margin-top:2px; }

  /* availability pill */
  .hc-avail { display:inline-flex; align-items:center; gap:5px; font-size:11px; letter-spacing:1px; text-transform:uppercase; margin-bottom:14px; }
  .hc-avail-dot { width:7px; height:7px; border-radius:50%; }
  .hc-avail.available .hc-avail-dot { background:var(--success); box-shadow:0 0 5px var(--success); }
  .hc-avail.available { color:var(--success); }
  .hc-avail.unavailable .hc-avail-dot { background:var(--danger); }
  .hc-avail.unavailable { color:var(--danger); }
  .hc-avail.checking .hc-avail-dot { background:var(--gold); animation:pulse 1s infinite; }
  .hc-avail.checking { color:var(--gold); }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .hc-actions { display:flex; gap:10px; }

  /* user mode buttons */
  .btn-book {
    width:100%; padding:12px; background:var(--gold); color:var(--dark);
    border:none; border-radius:8px; font-family:'Jost',sans-serif;
    font-size:13px; font-weight:500; letter-spacing:1.5px; text-transform:uppercase;
    cursor:pointer; transition:opacity 0.2s;
  }
  .btn-book:hover:not(:disabled) { opacity:0.88; }
  .btn-book:disabled { cursor:not-allowed; opacity:1; }
  .btn-book.booked { background:rgba(112,201,160,0.15); color:var(--success); border:1px solid rgba(112,201,160,0.3); }
  .btn-book.checking-btn { background:rgba(201,168,76,0.15); color:var(--gold); border:1px solid rgba(201,168,76,0.3); }
  .btn-book.error-btn { background:rgba(224,112,112,0.1); color:var(--danger); border:1px solid rgba(224,112,112,0.25); }

  /* admin mode buttons */
  .btn-edit {
    flex:1; padding:9px; background:rgba(201,168,76,0.1); color:var(--gold);
    border:1px solid rgba(201,168,76,0.25); border-radius:8px;
    font-family:'Jost',sans-serif; font-size:13px; cursor:pointer; transition:background 0.2s;
  }
  .btn-edit:hover { background:rgba(201,168,76,0.2); }
  .btn-delete {
    flex:1; padding:9px; background:rgba(224,112,112,0.08); color:var(--danger);
    border:1px solid rgba(224,112,112,0.2); border-radius:8px;
    font-family:'Jost',sans-serif; font-size:13px; cursor:pointer; transition:background 0.2s;
  }
  .btn-delete:hover { background:rgba(224,112,112,0.18); }
`;

function HotelCard({ hotel, mode = "user", query = "", isBooked = false, bookingState = "idle", onBook, onEdit, onDelete }) {
  const available = !isBooked && hotel.available !== false;

  const availLabel = () => {
    if (bookingState === "checking") return { cls: "checking", text: "Checking availability…" };
    if (isBooked) return { cls: "unavailable", text: "Booked by you" };
    if (!available) return { cls: "unavailable", text: "Unavailable" };
    return { cls: "available", text: "Available" };
  };
  const { cls, text } = availLabel();

  const bookLabel = () => {
    if (bookingState === "checking") return { cls: "checking-btn", label: "Checking…", disabled: true };
    if (bookingState === "confirmed" || isBooked) return { cls: "booked", label: "✓ Booked", disabled: true };
    if (bookingState === "error") return { cls: "error-btn", label: "Unavailable", disabled: true };
    if (!available) return { cls: "error-btn", label: "Unavailable", disabled: true };
    return { cls: "", label: "Book Now", disabled: false };
  };
  const book = bookLabel();

  return (
    <>
      <style>{cardCss}</style>
      <div className="hc-wrap" role="article" aria-label={`Hotel: ${hotel.name}`}>
        <div className="hc-header">
          <div>
            <div className="hc-name"><Highlight text={hotel.name} query={query} /></div>
            <div className="hc-city"><Highlight text={hotel.city} query={query} /></div>
          </div>
          <div className="hc-badge">⭐ {hotel.rating}</div>
        </div>

        <div className="hc-info">
          <div className="hc-info-item">
            <div className="hc-info-label">Price</div>
            <div className="hc-info-value">₹{hotel.price}</div>
          </div>
          <div className="hc-info-item">
            <div className="hc-info-label">Food</div>
            <div className="hc-info-value">🍽️ {hotel.food}</div>
          </div>
          <div className="hc-info-item" style={{ gridColumn: "span 2" }}>
            <div className="hc-info-label">Nearby Places</div>
            <div className="hc-info-value" style={{ fontSize: 13 }}>
              <Highlight text={hotel.places || "—"} query={query} />
            </div>
          </div>
        </div>

        {/* Availability status — satisfies "conditional rendering for availability states" */}
        {mode === "user" && (
          <div className={`hc-avail ${cls}`} aria-live="polite">
            <span className="hc-avail-dot" />
            {text}
          </div>
        )}

        {mode === "user" && (
          <button
            className={`btn-book ${book.cls}`}
            onClick={onBook}
            disabled={book.disabled}
            aria-label={`${book.label} ${hotel.name}`}
          >
            {book.label}
          </button>
        )}

        {mode === "admin" && (
          <div className="hc-actions">
            <button className="btn-edit" onClick={onEdit} aria-label={`Edit ${hotel.name}`}>Edit</button>
            <button className="btn-delete" onClick={onDelete} aria-label={`Delete ${hotel.name}`}>Delete</button>
          </div>
        )}
      </div>
    </>
  );
}

export default HotelCard;
export { Highlight };