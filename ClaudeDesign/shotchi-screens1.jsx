// shotchi-screens1.jsx — Home, Log Shot, Celebration

function HomeScreen({ onNav, onLog }) {
  const theme = useTheme();
  const { accent } = theme;
  const [adiSpeech, setAdiSpeech] = React.useState('Ready to log? 💪');
  React.useEffect(() => {
    const msgs = ['Ready to log? 💪', 'You got this! 🌟', 'Feeling good? 😊', 'Day 4 of 7! 📅'];
    let i = 0;
    const t = setInterval(() => { i = (i+1)%msgs.length; setAdiSpeech(msgs[i]); }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',background:theme.bg,fontFamily:'Nunito,sans-serif'}}>
      <div style={{
        background: theme.dark
          ? `linear-gradient(160deg,${accent}22 0%,${theme.bg} 65%)`
          : `linear-gradient(160deg,${lightenColor(accent,55)} 0%,${theme.bg} 65%)`,
        padding:'8px 20px 16px',display:'flex',flexDirection:'column',alignItems:'center',
      }}>
        <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
          <div style={{fontSize:13,color:theme.text3,fontWeight:600}}>Mon, Apr 21</div>
          <div style={{background:accent,color:'white',borderRadius:999,padding:'3px 10px',fontSize:12,fontWeight:800}}>🔥 4 weeks</div>
        </div>
        <Adi state="happy" color={accent} size={125} speechBubble={adiSpeech}/>
        <div style={{textAlign:'center',marginTop:8}}>
          <div style={{fontSize:21,fontWeight:900,color:theme.text}}>Good morning, Sarah! 👋</div>
          <div style={{fontSize:13,color:theme.text2,fontWeight:600,marginTop:2}}>You're crushing it — shot logged today</div>
        </div>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:'0 20px 12px',display:'flex',flexDirection:'column',gap:11}}>
        <button onClick={onLog} style={{
          width:'100%',padding:'15px',borderRadius:999,border:'none',cursor:'pointer',
          background:accent,color:'white',fontSize:16,fontWeight:800,fontFamily:'Nunito,sans-serif',
          boxShadow:`0 6px 22px ${accent}55`,marginTop:10,
          position:'relative',overflow:'hidden',transition:'transform 0.1s',
        }}>💉 Log Today's Shot</button>

        <div style={{display:'flex',gap:10}}>
          <StatPill label="Next dose" value="Monday"/>
          <StatPill label="Streak" value="4 wks 🔥"/>
          <StatPill label="On-time" value="92%"/>
        </div>

        {/* Med level badge */}
        <button onClick={()=>onNav('timeline')} style={{
          display:'flex',alignItems:'center',gap:10,
          background:theme.dark?`${accent}22`:`${accent}12`,
          border:`1.5px solid ${accent}44`,borderRadius:16,
          padding:'10px 14px',cursor:'pointer',fontFamily:'Nunito,sans-serif',width:'100%',
        }}>
          <div style={{width:36,height:36,borderRadius:10,background:`${accent}30`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>💊</div>
          <div style={{flex:1,textAlign:'left'}}>
            <div style={{fontSize:13,fontWeight:800,color:accent}}>78% medication level · Day 4</div>
            <div style={{fontSize:11,color:theme.text2,fontWeight:600}}>Peak side effects may occur tomorrow</div>
          </div>
          <svg width="8" height="13" viewBox="0 0 8 13"><path d="M1 1l6 5.5-6 5.5" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        {/* Weight card */}
        <Card style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px'}}>
          <div>
            <div style={{fontSize:11,color:theme.text3,fontWeight:700,marginBottom:2,letterSpacing:0.5}}>WEIGHT TREND</div>
            <div style={{fontSize:24,fontWeight:900,color:theme.text}}>162 <span style={{fontSize:13,color:theme.text3,fontWeight:600}}>lbs</span></div>
            <div style={{fontSize:12,color:'#4caf7d',fontWeight:700}}>↓ 18 lbs total</div>
          </div>
          <Sparkline data={[180,178,175,172,169,166,164,162]} width={90} height={40}/>
        </Card>

        {/* Shortcuts row */}
        <div style={{display:'flex',gap:10}}>
          <button onClick={()=>onNav('sideeffects')} style={{
            flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6,
            background:theme.surface,border:`1px solid ${theme.border}`,borderRadius:16,
            padding:'12px 8px',cursor:'pointer',fontFamily:'Nunito,sans-serif',
            boxShadow:theme.shadow,
          }}>
            <span style={{fontSize:22}}>😊</span>
            <span style={{fontSize:12,fontWeight:700,color:theme.text2}}>Side Effects</span>
          </button>
          <button onClick={()=>onNav('weighthistory')} style={{
            flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6,
            background:theme.surface,border:`1px solid ${theme.border}`,borderRadius:16,
            padding:'12px 8px',cursor:'pointer',fontFamily:'Nunito,sans-serif',
            boxShadow:theme.shadow,
          }}>
            <span style={{fontSize:22}}>⚖️</span>
            <span style={{fontSize:12,fontWeight:700,color:theme.text2}}>Weight Log</span>
          </button>
          <button onClick={()=>onNav('doctorreport')} style={{
            flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6,
            background:theme.surface,border:`1px solid ${theme.border}`,borderRadius:16,
            padding:'12px 8px',cursor:'pointer',fontFamily:'Nunito,sans-serif',
            boxShadow:theme.shadow,
          }}>
            <span style={{fontSize:22}}>📋</span>
            <span style={{fontSize:12,fontWeight:700,color:theme.text2}}>Dr Report</span>
          </button>
        </div>
      </div>

      <BottomNav active="home" onNav={onNav}/>
    </div>
  );
}

// ── LOG SHOT ──
function LogShotScreen({ onNav }) {
  const theme = useTheme();
  const { accent } = theme;
  const [selectedSite, setSelectedSite] = React.useState('leftThigh');
  const [selectedDrug, setSelectedDrug] = React.useState('Wegovy');
  const [weight, setWeight] = React.useState('162');
  const [step, setStep] = React.useState(1);
  const recentSites = ['rightThigh','rightStomach'];
  const isOverused = recentSites.includes(selectedSite);
  const sites = [
    {id:'leftThigh',   label:'Left Thigh',    cx:120,cy:258,rx:24,ry:30},
    {id:'rightThigh',  label:'Right Thigh',   cx:212,cy:258,rx:24,ry:30},
    {id:'leftStomach', label:'Left Stomach',  cx:130,cy:183,rx:22,ry:22},
    {id:'rightStomach',label:'Right Stomach', cx:202,cy:183,rx:22,ry:22},
    {id:'leftArm',     label:'Left Arm',      cx:89, cy:174,rx:15,ry:23},
    {id:'rightArm',    label:'Right Arm',     cx:243,cy:174,rx:15,ry:23},
  ];
  const drugs=['Wegovy','Ozempic','Mounjaro','Zepbound','Saxenda'];
  const bodyFill = theme.dark?'#2a2a2e':'#e8e0d8';
  const bodyStroke = theme.dark?'#3a3a3e':'#d0c8c0';

  if (step===3) return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',background:theme.bg,fontFamily:'Nunito,sans-serif',alignItems:'center',justifyContent:'center',padding:32,gap:16}}>
      <Adi state="excited" color={accent} size={130}/>
      <div style={{fontSize:24,fontWeight:900,color:theme.text,textAlign:'center'}}>Shot logged! 🎉</div>
      <div style={{fontSize:14,color:theme.text2,fontWeight:600,textAlign:'center'}}>{selectedDrug} · {sites.find(s=>s.id===selectedSite)?.label} · {weight} lbs</div>
      <Btn onClick={()=>onNav('home')} full>Back to Home</Btn>
    </div>
  );

  if (step===2) return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',background:theme.bg,fontFamily:'Nunito,sans-serif'}}>
      <div style={{padding:'14px 20px 0',display:'flex',alignItems:'center',gap:10}}>
        <BackBtn onPress={()=>setStep(1)}/>
        <div style={{fontSize:19,fontWeight:900,color:theme.text}}>Log Your Weight</div>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'0 28px',gap:20}}>
        <Adi state="neutral" color={accent} size={100}/>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:17,fontWeight:800,color:theme.text}}>How much do you weigh today?</div>
          <div style={{fontSize:13,color:theme.text2,fontWeight:600,marginTop:4}}>Optional — helps track your progress</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12,justifyContent:'center'}}>
          <button onClick={()=>setWeight(w=>String(+w-1))} style={{width:48,height:48,borderRadius:24,background:`${accent}20`,border:'none',cursor:'pointer',fontSize:24,color:accent,fontWeight:900,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Nunito,sans-serif'}}>−</button>
          <div style={{width:120,textAlign:'center',fontSize:54,fontWeight:900,color:accent,fontFamily:'Nunito,sans-serif',lineHeight:1}}>{weight}</div>
          <button onClick={()=>setWeight(w=>String(+w+1))} style={{width:48,height:48,borderRadius:24,background:`${accent}20`,border:'none',cursor:'pointer',fontSize:24,color:accent,fontWeight:900,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Nunito,sans-serif'}}>+</button>
        </div>
        <div style={{fontSize:16,color:theme.text2,fontWeight:700,marginTop:-10}}>lbs</div>
        <div style={{width:'100%',display:'flex',flexDirection:'column',gap:8}}>
          <Btn onClick={()=>setStep(3)} full>Save & Confirm 🎉</Btn>
          <button onClick={()=>setStep(3)} style={{background:'none',border:'none',color:theme.text3,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'Nunito,sans-serif'}}>Skip weight</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',background:theme.bg,fontFamily:'Nunito,sans-serif',overflowY:'auto'}}>
      <div style={{padding:'14px 20px 0',display:'flex',alignItems:'center',gap:10}}>
        <BackBtn onPress={()=>onNav('home')}/>
        <div style={{fontSize:19,fontWeight:900,color:theme.text}}>Log Your Shot</div>
      </div>
      <div style={{padding:'10px 20px 0',display:'flex',gap:10}}>
        {[['📅','DATE','Today, Apr 21'],['🕐','TIME','9:41 AM']].map(([e,l,v])=>(
          <Card key={l} style={{flex:1,padding:'10px 12px',display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:15}}>{e}</span>
            <div><div style={{fontSize:10,color:theme.text3,fontWeight:700}}>{l}</div><div style={{fontSize:13,fontWeight:800,color:theme.text}}>{v}</div></div>
          </Card>
        ))}
      </div>
      <div style={{padding:'10px 20px 0'}}>
        <Card style={{padding:'12px 14px'}}>
          <div style={{fontSize:11,color:theme.text3,fontWeight:700,marginBottom:8,letterSpacing:0.5}}>INJECTION SITE</div>
          <div style={{display:'flex',justifyContent:'center'}}>
            <svg width="332" height="306" viewBox="0 0 332 306">
              <ellipse cx="166" cy="58" rx="30" ry="34" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5"/>
              <rect x="155" y="88" width="22" height="16" fill={bodyFill}/>
              <path d="M121 106 Q100 113 96 143 L91 218 Q93 228 130 230 L166 232 L202 230 Q239 228 241 218 L236 143 Q232 113 211 106 Z" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5"/>
              <path d="M121 110 Q80 118 76 163 Q74 183 81 193 Q91 208 99 198 L110 143 Z" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5"/>
              <path d="M211 110 Q252 118 256 163 Q258 183 251 193 Q241 208 233 198 L222 143 Z" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5"/>
              <path d="M131 230 L119 298 Q117 308 129 310 L143 302 L148 243 Z" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5"/>
              <path d="M201 230 L213 298 Q215 308 203 310 L189 302 L184 243 Z" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5"/>
              {sites.map(site=>{
                const isSel=selectedSite===site.id, isRecent=recentSites.includes(site.id);
                return (
                  <g key={site.id} onClick={()=>setSelectedSite(site.id)} style={{cursor:'pointer'}}>
                    {isSel&&<ellipse cx={site.cx} cy={site.cy} rx={site.rx+7} ry={site.ry+7} fill={accent} opacity="0.15"/>}
                    <ellipse cx={site.cx} cy={site.cy} rx={site.rx} ry={site.ry}
                      fill={isSel?accent:isRecent?`${accent}20`:'transparent'}
                      stroke={isSel?accent:isRecent?accent:'#ccc'}
                      strokeWidth={isSel?2.5:1.5}
                      strokeDasharray={isRecent&&!isSel?'4 3':'none'}
                      opacity={isRecent&&!isSel?0.55:1}/>
                    {isRecent&&!isSel&&<text x={site.cx} y={site.cy+5} textAnchor="middle" fontSize="12" fill={accent} opacity="0.7">✓</text>}
                  </g>
                );
              })}
            </svg>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,justifyContent:'center',background:`${accent}15`,borderRadius:12,padding:'8px 14px',marginTop:4}}>
            <span style={{fontSize:16}}>📍</span>
            <span style={{fontWeight:800,color:accent,fontSize:14}}>{sites.find(s=>s.id===selectedSite)?.label}</span>
            <span style={{color:'#4caf7d',fontSize:13}}>✓</span>
          </div>
          {isOverused&&(
            <div style={{marginTop:8,background:'#FFF3CD',borderRadius:10,padding:'8px 12px',display:'flex',gap:7,alignItems:'center',border:'1px solid #F5A62344'}}>
              <span style={{fontSize:14}}>⚠️</span>
              <span style={{fontSize:12,fontWeight:700,color:'#856404'}}>Used recently — consider rotating</span>
            </div>
          )}
        </Card>
      </div>
      <div style={{padding:'10px 20px 0'}}>
        <Card style={{padding:'12px 14px'}}>
          <div style={{fontSize:11,color:theme.text3,fontWeight:700,marginBottom:8,letterSpacing:0.5}}>MEDICATION</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
            {drugs.map(d=>(
              <button key={d} onClick={()=>setSelectedDrug(d)} style={{
                padding:'7px 13px',borderRadius:999,
                border:`2px solid ${selectedDrug===d?accent:theme.border}`,
                background:selectedDrug===d?accent:theme.surface2,
                color:selectedDrug===d?'white':theme.text2,
                fontWeight:700,fontSize:13,fontFamily:'Nunito,sans-serif',cursor:'pointer',
              }}>{d}</button>
            ))}
          </div>
        </Card>
      </div>
      <div style={{padding:'14px 20px 10px',display:'flex',flexDirection:'column',gap:8}}>
        <Btn onClick={()=>setStep(2)} full>Next — Log Weight →</Btn>
        <button onClick={()=>onNav('home')} style={{background:'none',border:'none',color:theme.text3,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'Nunito,sans-serif'}}>Cancel</button>
      </div>
    </div>
  );
}

// ── CELEBRATION MODAL ──
function CelebrationModal({ onClose }) {
  const theme = useTheme();
  const { accent } = theme;
  return (
    <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}}>
      <Confetti/>
      <div style={{
        background:theme.surface,borderRadius:28,padding:'28px 24px',
        width:'82%',textAlign:'center',
        animation:'scaleIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        position:'relative',zIndex:1,
        boxShadow:'0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{fontSize:36,marginBottom:8}}>✨🥳✨</div>
        <div style={{fontSize:21,fontWeight:900,color:theme.text,marginBottom:6}}>Milestone Reached!</div>
        <div style={{fontSize:14,color:theme.text2,fontWeight:600,marginBottom:16}}>
          <span style={{color:accent,fontWeight:900}}>1 Month Streak!</span><br/>You're absolutely glowing! 💪
        </div>
        <Adi state="excited" color={accent} size={100}/>
        <Btn onClick={onClose} full style={{marginTop:14}}>Adi Rocks! 🎉</Btn>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, LogShotScreen, CelebrationModal });
