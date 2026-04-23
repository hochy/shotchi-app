// shotchi-components.jsx — shared primitives + ThemeContext + Adi v2

const ThemeContext = React.createContext(null);
const useTheme = () => React.useContext(ThemeContext);

function makeTheme(dark, accent) {
  return {
    dark, accent,
    bg:        dark ? '#111113' : '#f7f8fa',
    surface:   dark ? '#1c1c1e' : '#ffffff',
    surface2:  dark ? '#2c2c2e' : '#f0f0f2',
    text:      dark ? '#f2f2f7' : '#1c1c1e',
    text2:     dark ? '#9a9aa0' : '#666',
    text3:     dark ? '#58585e' : '#aaa',
    border:    dark ? 'rgba(255,255,255,0.09)' : '#eeeeee',
    shadow:    dark ? '0 2px 14px rgba(0,0,0,0.5)' : '0 2px 16px rgba(0,0,0,0.07)',
    navBorder: dark ? 'rgba(255,255,255,0.07)' : '#f0f0f0',
    navBg:     dark ? '#161618' : '#ffffff',
  };
}

function lightenColor(hex, amount) {
  const num = parseInt(hex.replace('#',''), 16);
  const r = Math.min(255,(num>>16)+amount);
  const g = Math.min(255,((num>>8)&0xFF)+amount);
  const b = Math.min(255,(num&0xFF)+amount);
  return `rgb(${r},${g},${b})`;
}

// ── ADI v2 ──
function Adi({ state='happy', color='#7BAF8E', size=120, animate=true, speechBubble=null }) {
  const s = size, cx = s/2, cy = s/2+2;
  const [blink, setBlink] = React.useState(false);
  const [vis, setVis] = React.useState(1);
  const prevRef = React.useRef(state);

  // cross-fade on state switch
  React.useEffect(() => {
    if (state !== prevRef.current) {
      setVis(0);
      const t = setTimeout(() => { prevRef.current = state; setVis(1); }, 110);
      return () => clearTimeout(t);
    }
  }, [state]);

  // auto-blink
  React.useEffect(() => {
    if (!animate || state === 'sad') return;
    let t;
    const loop = () => { t = setTimeout(() => { setBlink(true); setTimeout(() => { setBlink(false); loop(); }, 140); }, 2200 + Math.random()*2800); };
    loop();
    return () => clearTimeout(t);
  }, [animate, state]);

  const eyes = {
    happy: blink
      ? <><line x1={cx-s*.13} y1={cy-s*.09} x2={cx-s*.03} y2={cy-s*.09} stroke="white" strokeWidth={s*.04} strokeLinecap="round"/><line x1={cx+s*.03} y1={cy-s*.09} x2={cx+s*.13} y2={cy-s*.09} stroke="white" strokeWidth={s*.04} strokeLinecap="round"/></>
      : <><path d={`M${cx-s*.13} ${cy-s*.06} Q${cx-s*.08} ${cy-s*.15} ${cx-s*.03} ${cy-s*.06}`} stroke="white" strokeWidth={s*.045} fill="none" strokeLinecap="round"/><path d={`M${cx+s*.03} ${cy-s*.06} Q${cx+s*.08} ${cy-s*.15} ${cx+s*.13} ${cy-s*.06}`} stroke="white" strokeWidth={s*.045} fill="none" strokeLinecap="round"/></>,
    excited: <><path d={`M${cx-s*.14} ${cy-s*.07} Q${cx-s*.08} ${cy-s*.17} ${cx-s*.02} ${cy-s*.07}`} stroke="white" strokeWidth={s*.05} fill="none" strokeLinecap="round"/><path d={`M${cx+s*.02} ${cy-s*.07} Q${cx+s*.08} ${cy-s*.17} ${cx+s*.14} ${cy-s*.07}`} stroke="white" strokeWidth={s*.05} fill="none" strokeLinecap="round"/></>,
    neutral: <><circle cx={cx-s*.08} cy={cy-s*.08} r={blink?0:s*.04} fill="white"/><circle cx={cx+s*.08} cy={cy-s*.08} r={blink?0:s*.04} fill="white"/></>,
    sad:     <><path d={`M${cx-s*.13} ${cy-s*.09} Q${cx-s*.08} ${cy-s*.03} ${cx-s*.03} ${cy-s*.09}`} stroke="white" strokeWidth={s*.04} fill="none" strokeLinecap="round"/><path d={`M${cx+s*.03} ${cy-s*.09} Q${cx+s*.08} ${cy-s*.03} ${cx+s*.13} ${cy-s*.09}`} stroke="white" strokeWidth={s*.04} fill="none" strokeLinecap="round"/></>,
    waiting: <><circle cx={cx-s*.08} cy={cy-s*.08} r={s*.04} fill="white" style={{animation:'pulse 1.8s ease-in-out infinite'}}/><circle cx={cx+s*.08} cy={cy-s*.08} r={s*.04} fill="white"/></>,
    proud:   blink ? <><line x1={cx-s*.13} y1={cy-s*.09} x2={cx-s*.03} y2={cy-s*.09} stroke="white" strokeWidth={s*.04} strokeLinecap="round"/><line x1={cx+s*.03} y1={cy-s*.09} x2={cx+s*.13} y2={cy-s*.09} stroke="white" strokeWidth={s*.04} strokeLinecap="round"></line></> : <><path d={`M${cx-s*.13} ${cy-s*.07} Q${cx-s*.08} ${cy-s*.14} ${cx-s*.03} ${cy-s*.07}`} stroke="white" strokeWidth={s*.04} fill="none" strokeLinecap="round"/><path d={`M${cx+s*.03} ${cy-s*.07} Q${cx+s*.08} ${cy-s*.14} ${cx+s*.13} ${cy-s*.07}`} stroke="white" strokeWidth={s*.04} fill="none" strokeLinecap="round"/></>,
  };
  const mouths = {
    happy:   <path d={`M${cx-s*.11} ${cy+s*.07} Q${cx} ${cy+s*.17} ${cx+s*.11} ${cy+s*.07}`} stroke="white" strokeWidth={s*.04} fill="none" strokeLinecap="round"/>,
    excited: <path d={`M${cx-s*.13} ${cy+s*.06} Q${cx} ${cy+s*.21} ${cx+s*.13} ${cy+s*.06}`} stroke="white" strokeWidth={s*.045} fill="none" strokeLinecap="round"/>,
    neutral: <line x1={cx-s*.09} y1={cy+s*.1} x2={cx+s*.09} y2={cy+s*.1} stroke="white" strokeWidth={s*.035} strokeLinecap="round"/>,
    sad:     <path d={`M${cx-s*.11} ${cy+s*.13} Q${cx} ${cy+s*.05} ${cx+s*.11} ${cy+s*.13}`} stroke="white" strokeWidth={s*.04} fill="none" strokeLinecap="round"/>,
    waiting: <line x1={cx-s*.07} y1={cy+s*.1} x2={cx+s*.07} y2={cy+s*.1} stroke="white" strokeWidth={s*.03} strokeLinecap="round"/>,
    proud:   <path d={`M${cx-s*.12} ${cy+s*.07} Q${cx} ${cy+s*.18} ${cx+s*.12} ${cy+s*.07}`} stroke="white" strokeWidth={s*.04} fill="none" strokeLinecap="round"/>,
  };

  const showArms = state === 'happy' || state === 'excited' || state === 'proud';
  const showCheeks = state === 'happy' || state === 'excited' || state === 'proud';
  const showSparkles = state === 'excited' || state === 'proud';
  const gradId = `adiG_${state}_${color.replace('#','')}`;

  const bodyAnim = animate
    ? state === 'excited' ? {animation:'bounce 0.85s ease-in-out infinite'}
    : state === 'sad' ? {animation:'droop 3s ease-in-out infinite'}
    : {animation:'float 3s ease-in-out infinite'} : {};

  // sparkle positions
  const sparkles = showSparkles ? [
    {x:-s*.6, y:-s*.15, r:s*.045, d:0},
    {x:s*.55,  y:-s*.2,  r:s*.055, d:.4},
    {x:-s*.45, y:s*.35,  r:s*.035, d:.7},
    {x:s*.5,   y:s*.3,   r:s*.04,  d:.2},
    {x:0,      y:-s*.65, r:s*.04,  d:.9},
  ] : [];

  return (
    <div style={{width:s, height:s+20, position:'relative', display:'flex', flexDirection:'column', alignItems:'center'}}>
      {/* Speech bubble */}
      {speechBubble && (
        <div style={{
          position:'absolute', top:-s*.18, left:'50%', transform:'translateX(-50%)',
          background:'white', borderRadius:12, padding:'6px 12px',
          fontSize:s*.1, fontWeight:800, color:'#333',
          boxShadow:'0 2px 10px rgba(0,0,0,0.12)', whiteSpace:'nowrap', zIndex:10,
          animation:'fadeIn 0.3s ease',
        }}>
          {speechBubble}
          <div style={{
            position:'absolute', bottom:-7, left:'50%', transform:'translateX(-50%)',
            width:12, height:8, background:'white',
            clipPath:'polygon(0 0, 100% 0, 50% 100%)',
          }}/>
        </div>
      )}
      {/* Glow shadow */}
      <div style={{position:'absolute',bottom:2,left:'50%',transform:'translateX(-50%)',width:s*.65,height:s*.12,background:`radial-gradient(ellipse,${color}44 0%,transparent 70%)`,filter:'blur(5px)'}}/>
      {/* Main SVG */}
      <div style={{...bodyAnim, opacity:vis, transition:'opacity 0.12s', position:'relative'}}>
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <defs>
            <radialGradient id={gradId} cx="38%" cy="30%" r="65%">
              <stop offset="0%" stopColor={lightenColor(color,42)}/>
              <stop offset="100%" stopColor={color}/>
            </radialGradient>
          </defs>
          {/* Nub arms */}
          {showArms && <>
            <ellipse cx={cx-s*.43} cy={cy+s*.08} rx={s*.1} ry={s*.068} fill={`url(#${gradId})`} style={{filter:`drop-shadow(0 3px 6px ${color}44)`}}/>
            <ellipse cx={cx+s*.43} cy={cy+s*.08} rx={s*.1} ry={s*.068} fill={`url(#${gradId})`} style={{filter:`drop-shadow(0 3px 6px ${color}44)`}}/>
          </>}
          {/* Body */}
          <ellipse cx={cx} cy={cy+3} rx={s*.39} ry={s*.43} fill={`url(#${gradId})`} style={{filter:`drop-shadow(0 7px 18px ${color}55)`}}/>
          {/* Shine */}
          <ellipse cx={cx-s*.09} cy={cy-s*.13} rx={s*.1} ry={s*.065} fill="white" opacity="0.3"/>
          {eyes[state] || eyes.neutral}
          {mouths[state] || mouths.neutral}
          {showCheeks && <>
            <ellipse cx={cx-s*.23} cy={cy+s*.05} rx={s*.07} ry={s*.044} fill="white" opacity="0.18"/>
            <ellipse cx={cx+s*.23} cy={cy+s*.05} rx={s*.07} ry={s*.044} fill="white" opacity="0.18"/>
          </>}
          {/* Sparkle stars */}
          {sparkles.map((sp,i)=>(
            <path key={i}
              d={`M${cx+sp.x},${cy+sp.y} l${sp.r*.4},${sp.r} l${sp.r*.4},-${sp.r} l-${sp.r*.8},0 l${sp.r*.4},-${sp.r} l-${sp.r*.8},${sp.r*1.2}z`}
              fill="white" opacity="0.9"
              style={{animation:`sparkle 1.4s ${sp.d}s ease-in-out infinite`}}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

// ── RIPPLE BUTTON ──
function Btn({ children, outline=false, small=false, full=false, onClick, style={}, color:colorProp, disabled=false }) {
  const theme = useTheme();
  const color = colorProp || theme?.accent || '#7BAF8E';
  const [ripples, setRipples] = React.useState([]);
  const ref = React.useRef(null);
  const handleClick = (e) => {
    if (disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX-rect.left, y = e.clientY-rect.top;
    const id = Date.now();
    setRipples(r=>[...r,{id,x,y}]);
    setTimeout(()=>setRipples(r=>r.filter(r=>r.id!==id)), 600);
    onClick && onClick(e);
  };
  return (
    <button ref={ref} onClick={handleClick} disabled={disabled} style={{
      background: disabled ? '#ccc' : outline ? 'transparent' : color,
      border: outline ? `2px solid ${color}` : 'none',
      color: outline ? color : 'white',
      borderRadius:999, padding:small?'8px 20px':'14px 28px',
      fontSize:small?14:16, fontWeight:700,
      fontFamily:'Nunito,sans-serif', cursor:disabled?'not-allowed':'pointer',
      width:full?'100%':undefined,
      boxShadow:outline||disabled?'none':`0 4px 16px ${color}44`,
      letterSpacing:0.2, position:'relative', overflow:'hidden',
      transition:'transform 0.1s, opacity 0.1s',
      opacity: disabled ? 0.5 : 1,
      ...style,
    }}>
      {ripples.map(r=>(
        <span key={r.id} style={{
          position:'absolute',borderRadius:'50%',
          left:r.x-40,top:r.y-40,width:80,height:80,
          background:'rgba(255,255,255,0.35)',
          animation:'rippleOut 0.55s ease-out forwards',
          pointerEvents:'none',
        }}/>
      ))}
      <span style={{position:'relative',zIndex:1}}>{children}</span>
    </button>
  );
}

function Card({ children, style={}, onClick }) {
  const theme = useTheme();
  return (
    <div onClick={onClick} style={{
      background:theme?.surface||'white', borderRadius:20,
      boxShadow:theme?.shadow||'0 2px 16px rgba(0,0,0,0.07)',
      padding:16, cursor:onClick?'pointer':'default', ...style,
    }}>{children}</div>
  );
}

function StatPill({ label, value }) {
  const theme = useTheme();
  const { accent } = theme;
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',background:`${accent}18`,borderRadius:14,padding:'8px 10px',flex:1}}>
      <span style={{fontSize:14,fontWeight:800,color:accent}}>{value}</span>
      <span style={{fontSize:10,color:theme.text3,fontWeight:600,marginTop:1}}>{label}</span>
    </div>
  );
}

function BottomNav({ active, onNav }) {
  const theme = useTheme();
  const { accent } = theme;
  const tabs = [
    { id:'home',    label:'Home',    icon:(a)=><svg width="22" height="22" viewBox="0 0 24 24" fill={a?accent:theme.text3}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> },
    { id:'history', label:'History', icon:(a)=><svg width="22" height="22" viewBox="0 0 24 24" fill={a?accent:theme.text3}><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg> },
    { id:'achievements', label:'Awards', icon:(a)=><svg width="22" height="22" viewBox="0 0 24 24" fill={a?accent:theme.text3}><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V18H9v2h6v-2h-2v-2.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg> },
    { id:'settings', label:'Settings', icon:(a)=><svg width="22" height="22" viewBox="0 0 24 24" fill={a?accent:theme.text3}><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg> },
  ];
  return (
    <div style={{display:'flex',borderTop:`1px solid ${theme.navBorder}`,background:theme.navBg,paddingBottom:4,flexShrink:0}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>onNav(t.id)} style={{
          flex:1,display:'flex',flexDirection:'column',alignItems:'center',
          gap:2,padding:'10px 0 6px',background:'none',border:'none',cursor:'pointer',
          transition:'opacity 0.15s',
        }}>
          {t.icon(active===t.id)}
          <span style={{fontSize:10,fontWeight:700,color:active===t.id?accent:theme.text3,fontFamily:'Nunito,sans-serif'}}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

function Confetti() {
  const colors=['#7BAF8E','#AF7B9C','#7B8EAF','#AF9C7B','#7BAFAF','#F5A623'];
  const pieces=Array.from({length:30},(_,i)=>({
    id:i, x:Math.random()*100, delay:Math.random()*2.5,
    color:colors[i%colors.length], size:5+Math.random()*7, dur:2+Math.random()*2,
  }));
  return (
    <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}>
      {pieces.map(p=>(
        <div key={p.id} style={{
          position:'absolute',left:`${p.x}%`,top:'-12px',
          width:p.size,height:p.size*.5,background:p.color,borderRadius:2,
          animation:`confettiFall ${p.dur}s ${p.delay}s ease-in infinite`,
        }}/>
      ))}
    </div>
  );
}

function Sparkline({ data, width=80, height=30 }) {
  const theme = useTheme();
  const color = theme.accent;
  const min=Math.min(...data), max=Math.max(...data);
  const scaleY=v=>height-((v-min)/(max-min||1))*(height-4)-2;
  const scaleX=i=>(i/(data.length-1))*width;
  const pts=data.map((v,i)=>`${scaleX(i)},${scaleY(v)}`).join(' ');
  const area=`M${scaleX(0)},${height} `+data.map((v,i)=>`L${scaleX(i)},${scaleY(v)}`).join(' ')+` L${width},${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={area} fill={color} opacity="0.15"/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BackBtn({ onPress }) {
  const theme = useTheme();
  return (
    <button onClick={onPress} style={{background:'none',border:'none',cursor:'pointer',padding:4,borderRadius:10,flexShrink:0}}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill={theme.text}><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
    </button>
  );
}

Object.assign(window, {
  ThemeContext, useTheme, makeTheme,
  Adi, Btn, Card, StatPill, BottomNav, Confetti, Sparkline, BackBtn, lightenColor,
});
