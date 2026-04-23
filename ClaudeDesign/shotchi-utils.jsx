// Shared utilities and components for Shotchi

function lightenColor(hex, amount) {
  const num = parseInt(hex.replace('#',''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xFF) + amount);
  const b = Math.min(255, (num & 0xFF) + amount);
  return `rgb(${r},${g},${b})`;
}

function hexToRgba(hex, alpha) {
  const num = parseInt(hex.replace('#',''), 16);
  const r = (num >> 16) & 0xFF;
  const g = (num >> 8) & 0xFF;
  const b = num & 0xFF;
  return `rgba(${r},${g},${b},${alpha})`;
}

// Adi mascot
function Adi({ state = 'happy', color = '#7BAF8E', size = 120, animate = true }) {
  const s = size, cx = s/2, cy = s/2 + 4;
  const animStyle = animate ? {
    animation: state === 'excited' ? 'bounce 1s ease infinite' : 'float 3s ease-in-out infinite'
  } : {};
  return (
    <div style={{ width: s, height: s, ...animStyle, position: 'relative', display:'inline-block' }}>
      <div style={{
        position:'absolute', bottom:-8, left:'50%', transform:'translateX(-50%)',
        width: s*0.7, height: s*0.2,
        background: `radial-gradient(ellipse, ${hexToRgba(color, 0.4)} 0%, transparent 70%)`,
        filter:'blur(6px)',
      }}/>
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <defs>
          <radialGradient id={`bg_${state}_${size}`} cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor={lightenColor(color, 40)}/>
            <stop offset="100%" stopColor={color}/>
          </radialGradient>
        </defs>
        {/* body */}
        <ellipse cx={cx} cy={cy+2} rx={s*0.38} ry={s*0.43} fill={`url(#bg_${state}_${size})`}
          style={{ filter:`drop-shadow(0 4px 12px ${hexToRgba(color,0.3)})` }}/>
        {/* shine */}
        <ellipse cx={cx-s*0.09} cy={cy-s*0.13} rx={s*0.11} ry={s*0.07} fill="white" opacity="0.35"/>

        {/* eyes */}
        {(state==='happy'||state==='excited') && <>
          <path d={`M${cx-s*.13} ${cy-s*.06} Q${cx-s*.08} ${cy-s*.14} ${cx-s*.03} ${cy-s*.06}`}
            stroke="white" strokeWidth={s*.042} fill="none" strokeLinecap="round"/>
          <path d={`M${cx+s*.03} ${cy-s*.06} Q${cx+s*.08} ${cy-s*.14} ${cx+s*.13} ${cy-s*.06}`}
            stroke="white" strokeWidth={s*.042} fill="none" strokeLinecap="round"/>
        </>}
        {state==='sad' && <>
          <path d={`M${cx-s*.13} ${cy-s*.1} Q${cx-s*.08} ${cy-s*.04} ${cx-s*.03} ${cy-s*.1}`}
            stroke="white" strokeWidth={s*.042} fill="none" strokeLinecap="round"/>
          <path d={`M${cx+s*.03} ${cy-s*.1} Q${cx+s*.08} ${cy-s*.04} ${cx+s*.13} ${cy-s*.1}`}
            stroke="white" strokeWidth={s*.042} fill="none" strokeLinecap="round"/>
        </>}
        {(state==='neutral'||state==='waiting') && <>
          <circle cx={cx-s*.08} cy={cy-s*.07} r={s*.038} fill="white"/>
          <circle cx={cx+s*.08} cy={cy-s*.07} r={s*.038} fill="white"/>
        </>}

        {/* mouth */}
        {state==='happy' &&
          <path d={`M${cx-s*.1} ${cy+s*.07} Q${cx} ${cy+s*.17} ${cx+s*.1} ${cy+s*.07}`}
            stroke="white" strokeWidth={s*.04} fill="none" strokeLinecap="round"/>}
        {state==='excited' &&
          <path d={`M${cx-s*.13} ${cy+s*.06} Q${cx} ${cy+s*.21} ${cx+s*.13} ${cy+s*.06}`}
            stroke="white" strokeWidth={s*.04} fill="none" strokeLinecap="round"/>}
        {(state==='neutral'||state==='waiting') &&
          <line x1={cx-s*.08} y1={cy+s*.1} x2={cx+s*.08} y2={cy+s*.1}
            stroke="white" strokeWidth={s*.036} strokeLinecap="round"/>}
        {state==='sad' &&
          <path d={`M${cx-s*.1} ${cy+s*.14} Q${cx} ${cy+s*.07} ${cx+s*.1} ${cy+s*.14}`}
            stroke="white" strokeWidth={s*.04} fill="none" strokeLinecap="round"/>}

        {/* cheeks */}
        {(state==='happy'||state==='excited') && <>
          <ellipse cx={cx-s*.21} cy={cy+s*.04} rx={s*.07} ry={s*.045} fill="white" opacity="0.22"/>
          <ellipse cx={cx+s*.21} cy={cy+s*.04} rx={s*.07} ry={s*.045} fill="white" opacity="0.22"/>
        </>}
      </svg>
    </div>
  );
}

// Simple card
function Card({ children, style={} }) {
  return (
    <div style={{
      background:'white', borderRadius:20, padding:'16px',
      boxShadow:'0 2px 12px rgba(0,0,0,0.07)',
      ...style
    }}>{children}</div>
  );
}

// Pill button
function PillBtn({ children, onClick, color='#7BAF8E', outlined=false, small=false, style={} }) {
  return (
    <button onClick={onClick} style={{
      background: outlined ? 'transparent' : color,
      color: outlined ? color : 'white',
      border: outlined ? `2px solid ${color}` : 'none',
      borderRadius: 9999, fontFamily:'Nunito, sans-serif',
      fontWeight:700, fontSize: small ? 14 : 16,
      padding: small ? '8px 18px' : '14px 28px',
      cursor:'pointer', letterSpacing:0.2,
      boxShadow: outlined ? 'none' : `0 4px 16px ${hexToRgba(color,0.35)}`,
      transition:'all 0.15s', ...style,
    }}>{children}</button>
  );
}

// Confetti
function Confetti() {
  const colors = ['#7BAF8E','#AF7B9C','#7B8EAF','#AF9C7B','#7BAFAF','#F5A623','#E74C3C'];
  const pieces = Array.from({length:28},(_,i)=>({
    id:i, x:Math.random()*100, delay:Math.random()*2.5,
    color:colors[i%colors.length], w:5+Math.random()*8, h:3+Math.random()*5,
    dur:2+Math.random()*2.5,
  }));
  return (
    <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}>
      {pieces.map(p=>(
        <div key={p.id} style={{
          position:'absolute', left:`${p.x}%`, top:'-12px',
          width:p.w, height:p.h, background:p.color, borderRadius:2,
          animation:`confettiFall ${p.dur}s ${p.delay}s ease-in infinite`,
          transform:`rotate(${Math.random()*360}deg)`,
        }}/>
      ))}
    </div>
  );
}

// Bottom nav
function BottomNav({ active, onNav, accent }) {
  const tabs = [
    { id:'home', label:'Home', d:'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' },
    { id:'history', label:'History', d:'M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z' },
    { id:'settings', label:'Settings', d:'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z' },
  ];
  return (
    <div style={{
      display:'flex', justifyContent:'space-around', alignItems:'center',
      padding:'10px 0 22px', background:'white',
      borderTop:'1px solid #f0f0f0', flexShrink:0,
    }}>
      {tabs.map(t=>{
        const isActive = active===t.id;
        return (
          <button key={t.id} onClick={()=>onNav(t.id)} style={{
            display:'flex', flexDirection:'column', alignItems:'center', gap:3,
            background:'none', border:'none', cursor:'pointer', padding:'4px 24px',
            position:'relative',
          }}>
            {isActive && <div style={{
              position:'absolute', top:-8, width:36, height:3,
              background:accent, borderRadius:'0 0 3px 3px',
            }}/>}
            <svg width="22" height="22" viewBox="0 0 24 24" fill={isActive ? accent : '#bbb'}>
              <path d={t.d}/>
            </svg>
            <span style={{
              fontSize:11, fontWeight:isActive?700:500,
              color:isActive ? accent : '#bbb', fontFamily:'Nunito,sans-serif',
            }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, { Adi, Card, PillBtn, Confetti, BottomNav, lightenColor, hexToRgba });
