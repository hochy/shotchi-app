// shotchi-screens4.jsx — Achievements, Weight History, Doctor Report

// ── ACHIEVEMENTS ──
function AchievementsScreen({ onNav }) {
  const theme = useTheme();
  const { accent } = theme;

  const badges = [
    { id:'first',    emoji:'🥇', title:'First Shot',      desc:'Logged your very first injection',  earned:true,  date:'Nov 4' },
    { id:'week1',    emoji:'🌱', title:'One Week In',     desc:'7 days on your GLP-1 journey',      earned:true,  date:'Nov 11' },
    { id:'month1',   emoji:'🌟', title:'One Month',       desc:'4 consecutive weekly shots',        earned:true,  date:'Dec 4' },
    { id:'streak4',  emoji:'🔥', title:'4-Week Streak',   desc:'On time every week for a month',    earned:true,  date:'Apr 14' },
    { id:'sitemaster',emoji:'🗺️',title:'Site Master',     desc:'Used all 6 injection sites',        earned:true,  date:'Jan 22' },
    { id:'10lbs',    emoji:'⚖️', title:'10 lbs Down',     desc:'Lost your first 10 pounds',         earned:true,  date:'Feb 3' },
    { id:'18lbs',    emoji:'🏆', title:'18 lbs Down',     desc:'Amazing progress — keep going!',    earned:true,  date:'Apr 18' },
    { id:'month3',   emoji:'💎', title:'3-Month Champ',   desc:'12 consecutive weekly shots',       earned:false, progress:80 },
    { id:'25lbs',    emoji:'🚀', title:'25 lbs Down',     desc:'7 more lbs to go!',                 earned:false, progress:72 },
    { id:'ontime',   emoji:'⏰', title:'Perfect Month',   desc:'100% on-time for 4 weeks',          earned:false, progress:90 },
    { id:'year',     emoji:'🎂', title:'1-Year Journey',  desc:'365 days on your journey',          earned:false, progress:34 },
    { id:'50shots',  emoji:'💉', title:'50 Shots',        desc:'Halfway to 50 injections',          earned:false, progress:48 },
  ];

  const earned = badges.filter(b=>b.earned);
  const upcoming = badges.filter(b=>!b.earned);

  const BadgeCard = ({ badge }) => (
    <div style={{
      display:'flex',flexDirection:'column',alignItems:'center',gap:6,
      padding:'14px 8px',borderRadius:18,
      background: badge.earned ? `${accent}15` : theme.surface2,
      border:`2px solid ${badge.earned?accent+'44':theme.border}`,
      position:'relative',overflow:'hidden',
      opacity: badge.earned ? 1 : 0.75,
    }}>
      {/* Progress ring for unearned */}
      {!badge.earned && (
        <svg width={52} height={52} style={{position:'absolute',top:8,left:'50%',transform:'translateX(-50%)'}}>
          <circle cx={26} cy={26} r={23} fill="none" stroke={theme.surface2} strokeWidth={3}/>
          <circle cx={26} cy={26} r={23} fill="none" stroke={accent} strokeWidth={3}
            strokeDasharray={`${2*Math.PI*23}`}
            strokeDashoffset={`${2*Math.PI*23*(1-badge.progress/100)}`}
            strokeLinecap="round"
            style={{transformOrigin:'26px 26px',transform:'rotate(-90deg)',opacity:0.6}}/>
        </svg>
      )}
      <div style={{fontSize:28, position:'relative', zIndex:1, filter:badge.earned?'none':'grayscale(0.5)'}}>{badge.emoji}</div>
      <div style={{fontSize:11,fontWeight:800,color:badge.earned?theme.text:theme.text2,textAlign:'center',lineHeight:1.3}}>{badge.title}</div>
      {badge.earned
        ? <div style={{fontSize:10,color:theme.text3,fontWeight:600}}>{badge.date}</div>
        : <div style={{fontSize:10,color:accent,fontWeight:700}}>{badge.progress}%</div>
      }
    </div>
  );

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',background:theme.bg,fontFamily:'Nunito,sans-serif'}}>
      <div style={{padding:'14px 20px 0',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:22,fontWeight:900,color:theme.text}}>Achievements</div>
          <div style={{fontSize:13,color:theme.text3,fontWeight:600}}>{earned.length} earned · {upcoming.length} in progress</div>
        </div>
        <Adi state="proud" color={accent} size={60} animate={true}/>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:'12px 20px',display:'flex',flexDirection:'column',gap:16}}>
        {/* Streak banner */}
        <div style={{
          background:`linear-gradient(135deg,${accent},${lightenColor(accent,-20)})`,
          borderRadius:20,padding:'16px',display:'flex',alignItems:'center',gap:14,
        }}>
          <div style={{fontSize:36}}>🔥</div>
          <div>
            <div style={{fontSize:18,fontWeight:900,color:'white'}}>4-Week Streak!</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,0.8)',fontWeight:600}}>Every shot on time. You're unstoppable.</div>
          </div>
        </div>

        {/* Earned */}
        <div>
          <div style={{fontSize:12,color:theme.text3,fontWeight:800,letterSpacing:1,marginBottom:10,textTransform:'uppercase'}}>EARNED ({earned.length})</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
            {earned.map(b=><BadgeCard key={b.id} badge={b}/>)}
          </div>
        </div>

        {/* In progress */}
        <div>
          <div style={{fontSize:12,color:theme.text3,fontWeight:800,letterSpacing:1,marginBottom:10,textTransform:'uppercase'}}>IN PROGRESS</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
            {upcoming.map(b=><BadgeCard key={b.id} badge={b}/>)}
          </div>
        </div>

        {/* Next milestone */}
        <div style={{
          background:theme.surface,borderRadius:20,padding:'16px',
          border:`1.5px solid ${accent}33`,boxShadow:theme.shadow,
        }}>
          <div style={{fontSize:11,color:theme.text3,fontWeight:800,letterSpacing:1,marginBottom:10,textTransform:'uppercase'}}>CLOSEST NEXT BADGE</div>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{fontSize:32}}>⏰</div>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:800,color:theme.text}}>Perfect Month</div>
              <div style={{fontSize:12,color:theme.text2,fontWeight:600,marginBottom:6}}>100% on-time for 4 weeks — you're at 90%!</div>
              <div style={{height:8,background:theme.surface2,borderRadius:4,overflow:'hidden'}}>
                <div style={{width:'90%',height:'100%',background:accent,borderRadius:4,transition:'width 1s ease'}}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav active="achievements" onNav={onNav}/>
    </div>
  );
}

// ── WEIGHT HISTORY ──
function WeightHistoryScreen({ onNav }) {
  const theme = useTheme();
  const { accent } = theme;
  const [range, setRange] = React.useState('6m');

  const allData = [
    {date:'Nov 4', w:180}, {date:'Nov 11',w:179}, {date:'Nov 18',w:178}, {date:'Nov 25',w:177},
    {date:'Dec 2', w:176}, {date:'Dec 9', w:175}, {date:'Dec 16',w:174}, {date:'Dec 23',w:173},
    {date:'Jan 6', w:172}, {date:'Jan 13',w:171}, {date:'Jan 20',w:170}, {date:'Jan 27',w:169},
    {date:'Feb 3', w:168}, {date:'Feb 10',w:167}, {date:'Feb 17',w:166}, {date:'Feb 24',w:165},
    {date:'Mar 3', w:165}, {date:'Mar 10',w:164}, {date:'Mar 17',w:164}, {date:'Mar 24',w:163},
    {date:'Apr 7', w:163}, {date:'Apr 14',w:162.5},{date:'Apr 21',w:162},
  ];

  const ranges = { '1m':4, '3m':12, '6m':24 };
  const data = allData.slice(-ranges[range]);
  const chartW=300, chartH=100;
  const vals = data.map(d=>d.w);
  const min=Math.floor(Math.min(...vals)-2), max=Math.ceil(Math.max(...vals)+1);
  const scaleY=v=>chartH-((v-min)/(max-min))*chartH;
  const scaleX=i=>(i/(data.length-1))*chartW;
  const pts=data.map((d,i)=>`${scaleX(i)},${scaleY(d.w)}`).join(' ');
  const area=`M0,${chartH} `+data.map((d,i)=>`L${scaleX(i)},${scaleY(d.w)}`).join(' ')+` L${chartW},${chartH} Z`;
  const totalLost = 180 - 162;
  const weeklyAvg = (totalLost / 24).toFixed(1);

  const entries = [...allData].reverse().slice(0,8);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',background:theme.bg,fontFamily:'Nunito,sans-serif'}}>
      <div style={{padding:'14px 20px 0',display:'flex',alignItems:'center',gap:10}}>
        <BackBtn onPress={()=>onNav('home')}/>
        <div>
          <div style={{fontSize:20,fontWeight:900,color:theme.text}}>Weight History</div>
          <div style={{fontSize:12,color:theme.text3,fontWeight:600}}>Since Nov 4, 2024</div>
        </div>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:'12px 20px',display:'flex',flexDirection:'column',gap:12}}>
        {/* Hero stats */}
        <div style={{
          background:`linear-gradient(135deg,${accent},${lightenColor(accent,-15)})`,
          borderRadius:22,padding:'18px',
        }}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.75)',fontWeight:700}}>TOTAL LOST</div>
              <div style={{fontSize:42,fontWeight:900,color:'white',lineHeight:1}}>{totalLost}<span style={{fontSize:18}}> lbs</span></div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.75)',fontWeight:700}}>AVG / WEEK</div>
              <div style={{fontSize:28,fontWeight:900,color:'white',lineHeight:1}}>{weeklyAvg}<span style={{fontSize:13}}> lbs</span></div>
            </div>
          </div>
          <div style={{height:1,background:'rgba(255,255,255,0.2)',margin:'12px 0'}}/>
          <div style={{display:'flex',gap:16}}>
            {[['Start',`${allData[0].w} lbs`],['Current','162 lbs'],['Goal','150 lbs']].map(([l,v])=>(
              <div key={l}>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.65)',fontWeight:700}}>{l}</div>
                <div style={{fontSize:15,color:'white',fontWeight:800}}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div style={{background:theme.surface,borderRadius:20,padding:'14px 16px',boxShadow:theme.shadow}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div style={{fontSize:11,color:theme.text3,fontWeight:700,letterSpacing:0.5}}>TREND</div>
            <div style={{display:'flex',gap:6}}>
              {['1m','3m','6m'].map(r=>(
                <button key={r} onClick={()=>setRange(r)} style={{
                  padding:'3px 10px',borderRadius:999,border:'none',
                  background:range===r?accent:theme.surface2,
                  color:range===r?'white':theme.text3,
                  fontWeight:700,fontSize:11,cursor:'pointer',fontFamily:'Nunito,sans-serif',
                }}>{r}</button>
              ))}
            </div>
          </div>
          <svg width="100%" viewBox={`-28 -12 ${chartW+40} ${chartH+30}`} style={{overflow:'visible'}}>
            <defs>
              <linearGradient id="whGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity="0.3"/>
                <stop offset="100%" stopColor={accent} stopOpacity="0"/>
              </linearGradient>
            </defs>
            {[min,min+Math.round((max-min)/2),max].map(v=>(
              <g key={v}>
                <line x1={0} y1={scaleY(v)} x2={chartW} y2={scaleY(v)} stroke={theme.dark?'#333':'#f0f0f0'} strokeWidth="1"/>
                <text x={-4} y={scaleY(v)+4} textAnchor="end" fontSize="9" fill={theme.text3}>{v}</text>
              </g>
            ))}
            <path d={area} fill="url(#whGrad)"/>
            <polyline points={pts} fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            {data.map((d,i)=><circle key={i} cx={scaleX(i)} cy={scaleY(d.w)} r="3" fill={accent}/>)}
            {/* Goal line */}
            <line x1={0} y1={scaleY(150)} x2={chartW} y2={scaleY(150)} stroke="#F5A623" strokeWidth="1.5" strokeDasharray="5 4"/>
            <text x={chartW+4} y={scaleY(150)+4} fontSize="9" fill="#F5A623" fontWeight="bold">Goal</text>
          </svg>
        </div>

        {/* BMI card */}
        <div style={{display:'flex',gap:10}}>
          {[
            {label:'Current BMI',value:'25.8',note:'Overweight',color:'#F5A623'},
            {label:'Goal BMI',   value:'23.2',note:'Healthy',   color:'#4caf7d'},
          ].map(c=>(
            <div key={c.label} style={{flex:1,background:theme.surface,borderRadius:16,padding:'12px 14px',boxShadow:theme.shadow}}>
              <div style={{fontSize:11,color:theme.text3,fontWeight:700,marginBottom:4}}>{c.label}</div>
              <div style={{fontSize:22,fontWeight:900,color:c.color}}>{c.value}</div>
              <div style={{fontSize:11,color:c.color,fontWeight:700}}>{c.note}</div>
            </div>
          ))}
        </div>

        {/* Log entries */}
        <div>
          <div style={{fontSize:11,color:theme.text3,fontWeight:800,letterSpacing:1,marginBottom:8,textTransform:'uppercase'}}>LOG ENTRIES</div>
          <div style={{display:'flex',flexDirection:'column',gap:7}}>
            {entries.map((e,i)=>(
              <div key={i} style={{
                display:'flex',alignItems:'center',justifyContent:'space-between',
                background:theme.surface,borderRadius:14,padding:'11px 14px',
                boxShadow:theme.shadow,
              }}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:8,height:8,borderRadius:4,background:i===0?accent:theme.surface2,flexShrink:0}}/>
                  <span style={{fontSize:13,color:theme.text2,fontWeight:600}}>{e.date}</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:15,fontWeight:800,color:theme.text}}>{e.w} lbs</span>
                  {i<entries.length-1 && (
                    <span style={{fontSize:11,fontWeight:700,color: entries[i+1].w-e.w>0?'#4caf7d':'#E74C3C'}}>
                      {entries[i+1].w-e.w>0?'↑':'↓'} {Math.abs(entries[i+1].w-e.w).toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DOCTOR REPORT ──
function DoctorReportScreen({ onNav }) {
  const theme = useTheme();
  const { accent } = theme;
  const [generating, setGenerating] = React.useState(false);
  const [generated, setGenerated] = React.useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(()=>{ setGenerating(false); setGenerated(true); }, 2200);
  };

  const stats = [
    {label:'Total Injections',   value:'24',       icon:'💉'},
    {label:'On-Time Rate',        value:'92%',      icon:'⏰'},
    {label:'Current Streak',      value:'4 weeks',  icon:'🔥'},
    {label:'Weight Lost',         value:'18 lbs',   icon:'⚖️'},
    {label:'Start Date',          value:'Nov 4 \'24', icon:'📅'},
    {label:'Current Dose',        value:'2.4mg',    icon:'💊'},
  ];

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',background:theme.bg,fontFamily:'Nunito,sans-serif'}}>
      <div style={{padding:'14px 20px 0',display:'flex',alignItems:'center',gap:10}}>
        <BackBtn onPress={()=>onNav('home')}/>
        <div>
          <div style={{fontSize:20,fontWeight:900,color:theme.text}}>Doctor Report</div>
          <div style={{fontSize:12,color:theme.text3,fontWeight:600}}>Share your progress with your provider</div>
        </div>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:'12px 20px',display:'flex',flexDirection:'column',gap:14}}>
        {/* Preview card */}
        <div style={{
          background:theme.surface,borderRadius:22,overflow:'hidden',boxShadow:theme.shadow,
          border:`1.5px solid ${theme.border}`,
        }}>
          {/* Report header */}
          <div style={{background:`linear-gradient(135deg,${accent},${lightenColor(accent,-20)})`,padding:'18px 20px'}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:44,height:44,borderRadius:12,background:'rgba(255,255,255,0.25)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>📋</div>
              <div>
                <div style={{fontSize:16,fontWeight:900,color:'white'}}>GLP-1 Progress Report</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.75)',fontWeight:600}}>Sarah · Generated Apr 21, 2025</div>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div style={{padding:'16px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {stats.map(s=>(
              <div key={s.label} style={{background:`${accent}0d`,borderRadius:12,padding:'10px 12px'}}>
                <div style={{fontSize:16,marginBottom:4}}>{s.icon}</div>
                <div style={{fontSize:16,fontWeight:900,color:theme.text}}>{s.value}</div>
                <div style={{fontSize:10,color:theme.text3,fontWeight:700}}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Mini weight chart */}
          <div style={{padding:'0 16px 14px'}}>
            <div style={{fontSize:11,color:theme.text3,fontWeight:700,marginBottom:8,letterSpacing:0.5}}>WEIGHT TREND</div>
            <div style={{height:50,background:theme.surface2,borderRadius:10,display:'flex',alignItems:'center',padding:'0 12px',overflow:'hidden',position:'relative'}}>
              <Sparkline data={[180,177,174,171,168,165,163,162]} width={280} height={40}/>
              <div style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',textAlign:'right'}}>
                <div style={{fontSize:14,fontWeight:900,color:accent}}>162 lbs</div>
                <div style={{fontSize:10,color:'#4caf7d',fontWeight:700}}>↓18 lbs</div>
              </div>
            </div>
          </div>

          {/* Site rotation summary */}
          <div style={{padding:'0 16px 16px'}}>
            <div style={{fontSize:11,color:theme.text3,fontWeight:700,marginBottom:8,letterSpacing:0.5}}>SITE ROTATION</div>
            <div style={{display:'flex',gap:4}}>
              {[['L.Thigh','28%'],['R.Thigh','24%'],['L.Stom','18%'],['R.Stom','16%'],['Arms','14%']].map(([s,p])=>(
                <div key={s} style={{flex:1,textAlign:'center'}}>
                  <div style={{height:30,background:`${accent}30`,borderRadius:6,display:'flex',alignItems:'flex-end',justifyContent:'center',overflow:'hidden'}}>
                    <div style={{width:'100%',background:accent,borderRadius:6,height:`${parseInt(p)}%`,opacity:0.8,minHeight:4}}/>
                  </div>
                  <div style={{fontSize:8,color:theme.text3,fontWeight:700,marginTop:3,lineHeight:1.2}}>{s}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Side effects note */}
          <div style={{padding:'0 16px 16px'}}>
            <div style={{fontSize:11,color:theme.text3,fontWeight:700,marginBottom:8,letterSpacing:0.5}}>COMMON SIDE EFFECTS LOGGED</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {[['Nausea','😣','42%'],['Fatigue','😫','38%'],['Headache','🤕','18%']].map(([l,e,p])=>(
                <div key={l} style={{display:'flex',alignItems:'center',gap:5,background:`${accent}12`,borderRadius:999,padding:'4px 10px'}}>
                  <span style={{fontSize:13}}>{e}</span>
                  <span style={{fontSize:11,fontWeight:700,color:theme.text}}>{l}</span>
                  <span style={{fontSize:10,color:theme.text3,fontWeight:600}}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {!generated ? (
            <Btn onClick={handleGenerate} full disabled={generating}>
              {generating ? '⏳ Generating PDF…' : '📤 Generate & Share PDF'}
            </Btn>
          ) : (
            <div style={{
              background:'#e8f5e9',borderRadius:16,padding:'14px 16px',
              display:'flex',alignItems:'center',gap:12,
              border:'1.5px solid #4caf7d44',
            }}>
              <div style={{width:40,height:40,borderRadius:12,background:'#4caf7d22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>✅</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:800,color:'#2e7d32'}}>Report ready!</div>
                <div style={{fontSize:12,color:'#4caf7d',fontWeight:600}}>Tap to share with your doctor</div>
              </div>
              <svg width="8" height="13" viewBox="0 0 8 13"><path d="M1 1l6 5.5-6 5.5" stroke="#4caf7d" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          )}
          <button onClick={()=>setGenerated(false)} style={{background:'none',border:'none',color:theme.text3,fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'Nunito,sans-serif'}}>
            Customize report fields
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AchievementsScreen, WeightHistoryScreen, DoctorReportScreen });
