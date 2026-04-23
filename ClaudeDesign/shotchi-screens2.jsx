// shotchi-screens2.jsx — History, SideEffects, MedTimeline

function HistoryScreen({ onNav }) {
  const theme = useTheme();
  const { accent } = theme;
  const weightData = [180,178,176,174,171,169,167,165,163,162];
  const months = ['Nov','Dec','Jan','Feb','Mar','Apr'];
  const injections = [
    {date:'Apr 20',drug:'Wegovy',site:'Left Thigh',weight:'162 lbs'},
    {date:'Apr 13',drug:'Wegovy',site:'Right Stomach',weight:'163 lbs'},
    {date:'Apr 6', drug:'Wegovy',site:'Left Thigh',weight:'165 lbs'},
    {date:'Mar 30',drug:'Wegovy',site:'Right Thigh',weight:'167 lbs'},
    {date:'Mar 23',drug:'Wegovy',site:'Left Stomach',weight:'168 lbs'},
  ];
  const siteData = [
    {label:'Left Thigh',   pct:28,color:'#7BAF8E'},
    {label:'Right Thigh',  pct:24,color:'#7B8EAF'},
    {label:'Left Stomach', pct:18,color:'#AF7B9C'},
    {label:'Right Stomach',pct:16,color:'#AF9C7B'},
    {label:'Left Arm',     pct:8, color:'#7BAFAF'},
    {label:'Right Arm',    pct:6, color:'#F5A623'},
  ];
  const chartW=300, chartH=95;
  const min=158, max=182;
  const scaleY=v=>chartH-((v-min)/(max-min))*chartH;
  const scaleX=i=>(i/(weightData.length-1))*chartW;
  const linePts=weightData.map((v,i)=>`${scaleX(i)},${scaleY(v)}`).join(' ');
  const areaPath=`M${scaleX(0)},${chartH} `+weightData.map((v,i)=>`L${scaleX(i)},${scaleY(v)}`).join(' ')+` L${chartW},${chartH} Z`;
  const total=siteData.reduce((a,b)=>a+b.pct,0);
  let cumAngle=-Math.PI/2;
  const donutPaths=siteData.map(s=>{
    const angle=(s.pct/total)*2*Math.PI;
    const x1=72+62*Math.cos(cumAngle),y1=72+62*Math.sin(cumAngle);
    cumAngle+=angle;
    const x2=72+62*Math.cos(cumAngle),y2=72+62*Math.sin(cumAngle);
    const large=angle>Math.PI?1:0;
    const xi1=72+37*Math.cos(cumAngle-angle),yi1=72+37*Math.sin(cumAngle-angle);
    const xi2=72+37*Math.cos(cumAngle),yi2=72+37*Math.sin(cumAngle);
    return {...s,d:`M${x1},${y1} A62,62 0 ${large},1 ${x2},${y2} L${xi2},${yi2} A37,37 0 ${large},0 ${xi1},${yi1} Z`};
  });

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',background:theme.bg,fontFamily:'Nunito,sans-serif'}}>
      <div style={{padding:'14px 20px 0'}}>
        <div style={{fontSize:22,fontWeight:900,color:theme.text}}>Your Journey</div>
        <div style={{fontSize:13,color:theme.text3,fontWeight:600}}>24 total injections</div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'12px 20px',display:'flex',flexDirection:'column',gap:12}}>
        <div style={{display:'flex',gap:10}}>
          <StatPill label="Total shots" value="24"/>
          <StatPill label="On-time" value="92%"/>
          <StatPill label="Lost" value="18 lbs"/>
        </div>
        {/* Weight chart */}
        <Card style={{padding:'14px 16px'}}>
          <div style={{fontSize:11,color:theme.text3,fontWeight:700,marginBottom:10,letterSpacing:0.5}}>WEIGHT TREND — 6 MONTHS</div>
          <svg width="100%" viewBox={`-28 -10 ${chartW+40} ${chartH+30}`} style={{overflow:'visible'}}>
            <defs>
              <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity="0.3"/>
                <stop offset="100%" stopColor={accent} stopOpacity="0"/>
              </linearGradient>
            </defs>
            {[160,165,170,175,180].map(v=>(
              <g key={v}>
                <line x1={0} y1={scaleY(v)} x2={chartW} y2={scaleY(v)} stroke={theme.dark?'#333':'#f0f0f0'} strokeWidth="1"/>
                <text x={-4} y={scaleY(v)+4} textAnchor="end" fontSize="9" fill={theme.text3}>{v}</text>
              </g>
            ))}
            {months.map((m,i)=>(
              <text key={m} x={(i/(months.length-1))*chartW} y={chartH+20} textAnchor="middle" fontSize="10" fill={theme.text3}>{m}</text>
            ))}
            <path d={areaPath} fill="url(#wGrad)"/>
            <polyline points={linePts} fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            {weightData.map((v,i)=><circle key={i} cx={scaleX(i)} cy={scaleY(v)} r="3.5" fill={accent}/>)}
            <text x={scaleX(weightData.length-1)} y={scaleY(162)-10} textAnchor="middle" fontSize="11" fill={accent} fontWeight="bold">162 lbs</text>
          </svg>
        </Card>
        {/* Site donut */}
        <Card style={{padding:'14px 16px'}}>
          <div style={{fontSize:11,color:theme.text3,fontWeight:700,marginBottom:10,letterSpacing:0.5}}>SITE ROTATION</div>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <svg width={144} height={144} viewBox="0 0 144 144">
              {donutPaths.map((s,i)=><path key={i} d={s.d} fill={s.color} opacity="0.9"/>)}
              <text x="72" y="68" textAnchor="middle" fontSize="20" fontWeight="900" fill={theme.text}>24</text>
              <text x="72" y="84" textAnchor="middle" fontSize="10" fill={theme.text3}>shots</text>
            </svg>
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:5}}>
              {siteData.map(s=>(
                <div key={s.label} style={{display:'flex',alignItems:'center',gap:6}}>
                  <div style={{width:10,height:10,borderRadius:3,background:s.color,flexShrink:0}}/>
                  <div style={{fontSize:11,color:theme.text2,fontWeight:600,flex:1}}>{s.label}</div>
                  <div style={{fontSize:11,color:theme.text3,fontWeight:700}}>{s.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
        {/* History list */}
        <div>
          <div style={{fontSize:11,color:theme.text3,fontWeight:700,marginBottom:8,paddingLeft:4,letterSpacing:0.5}}>RECENT INJECTIONS</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {injections.map((inj,i)=>(
              <Card key={i} style={{padding:'12px 14px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{display:'flex',gap:10,alignItems:'center'}}>
                    <div style={{width:36,height:36,borderRadius:11,background:`${accent}20`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17}}>💉</div>
                    <div>
                      <div style={{fontWeight:800,color:theme.text,fontSize:13}}>{inj.drug} · {inj.site}</div>
                      <div style={{fontSize:11,color:theme.text3,fontWeight:600}}>{inj.date}</div>
                    </div>
                  </div>
                  <div style={{fontSize:13,fontWeight:800,color:accent}}>{inj.weight}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <BottomNav active="history" onNav={onNav}/>
    </div>
  );
}

// ── SIDE EFFECTS ──
function SideEffectsScreen({ onNav, onSave }) {
  const theme = useTheme();
  const { accent } = theme;
  const [selected, setSelected] = React.useState(['nausea','fatigue']);
  const [severity, setSeverity] = React.useState(40);
  const symptoms = [
    {id:'nausea',emoji:'😣',label:'Nausea'},{id:'fatigue',emoji:'😫',label:'Fatigue'},
    {id:'constipation',emoji:'😣',label:'Constipation'},{id:'diarrhea',emoji:'😖',label:'Diarrhea'},
    {id:'headache',emoji:'🤕',label:'Headache'},{id:'dizziness',emoji:'😵',label:'Dizziness'},
    {id:'stomachPain',emoji:'🤢',label:'Stomach Pain'},{id:'acidReflux',emoji:'🔥',label:'Acid Reflux'},
    {id:'bloating',emoji:'🎈',label:'Bloating'},{id:'lossAppetite',emoji:'🍽️',label:'No Appetite'},
  ];
  const toggle=id=>setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
  const sevLabel=severity<33?'Mild':severity<66?'Moderate':'Severe';
  const sevColor=severity<33?'#4caf7d':severity<66?'#F5A623':'#E74C3C';
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',background:theme.bg,fontFamily:'Nunito,sans-serif'}}>
      <div style={{padding:'14px 20px 0',display:'flex',alignItems:'center',gap:10}}>
        <BackBtn onPress={()=>onNav('home')}/>
        <div>
          <div style={{fontSize:19,fontWeight:900,color:theme.text}}>How are you feeling?</div>
          <div style={{fontSize:11,color:theme.text3,fontWeight:600}}>Today at 9:41 AM</div>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'12px 20px',display:'flex',flexDirection:'column',gap:10}}>
        <div style={{fontSize:13,fontWeight:700,color:theme.text2}}>Tap all that apply</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {symptoms.map(s=>{
            const isSel=selected.includes(s.id);
            return (
              <button key={s.id} onClick={()=>toggle(s.id)} style={{
                display:'flex',alignItems:'center',gap:8,padding:'10px 11px',borderRadius:14,
                border:`2px solid ${isSel?accent:theme.border}`,
                background:isSel?`${accent}15`:theme.surface,
                cursor:'pointer',fontFamily:'Nunito,sans-serif',transition:'all 0.15s',
              }}>
                <span style={{fontSize:18}}>{s.emoji}</span>
                <span style={{fontSize:12,fontWeight:700,color:isSel?accent:theme.text2,flex:1,textAlign:'left'}}>{s.label}</span>
                {isSel&&<span style={{color:accent,fontSize:12}}>✓</span>}
              </button>
            );
          })}
        </div>
        <button onClick={()=>setSelected([])} style={{
          padding:'10px',borderRadius:14,border:`2px solid ${selected.length===0?accent:theme.border}`,
          background:selected.length===0?`${accent}15`:theme.surface,
          fontSize:14,fontWeight:700,color:selected.length===0?accent:theme.text3,
          cursor:'pointer',fontFamily:'Nunito,sans-serif',
        }}>😊 None today!</button>
        {selected.length>0&&(
          <Card style={{padding:'14px 16px'}}>
            <div style={{fontSize:11,color:theme.text3,fontWeight:700,marginBottom:10,letterSpacing:0.5}}>SEVERITY</div>
            <input type="range" min="0" max="100" value={severity} onChange={e=>setSeverity(+e.target.value)} style={{width:'100%',accentColor:sevColor}}/>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
              <span style={{fontSize:12,color:theme.text3,fontWeight:600}}>Mild</span>
              <span style={{fontSize:13,fontWeight:800,color:sevColor}}>{sevLabel}</span>
              <span style={{fontSize:12,color:theme.text3,fontWeight:600}}>Severe</span>
            </div>
          </Card>
        )}
        <Card style={{padding:'12px 14px'}}>
          <div style={{fontSize:11,color:theme.text3,fontWeight:700,marginBottom:8,letterSpacing:0.5}}>NOTES</div>
          <div style={{borderRadius:10,border:`1.5px solid ${theme.border}`,padding:'10px 12px',fontSize:14,color:theme.text3,fontWeight:600}}>Add notes…</div>
        </Card>
      </div>
      <div style={{padding:'10px 20px 14px',display:'flex',flexDirection:'column',gap:8}}>
        <Btn onClick={onSave} full>Save</Btn>
        <button onClick={()=>onNav('home')} style={{background:'none',border:'none',color:theme.text3,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'Nunito,sans-serif'}}>Skip</button>
      </div>
    </div>
  );
}

// ── MED TIMELINE ──
function MedTimelineScreen({ onNav }) {
  const theme = useTheme();
  const { accent } = theme;
  const [med, setMed] = React.useState('Wegovy');
  const meds = ['Wegovy','Ozempic','Mounjaro','Zepbound'];
  const today = 4;
  const chartW=300, chartH=110;
  const levels=Array.from({length:71},(_,i)=>{const d=i/10;return 100*Math.exp(-0.15*d)*(1-Math.exp(-3*d));});
  const maxL=Math.max(...levels);
  const scaled=levels.map(v=>v/maxL*100);
  const scaleX=i=>(i/70)*chartW, scaleY=v=>chartH-v/100*chartH;
  const linePts=scaled.map((v,i)=>`${scaleX(i)},${scaleY(v)}`).join(' ');
  const areaPath=`M0,${chartH} `+scaled.map((v,i)=>`L${scaleX(i)},${scaleY(v)}`).join(' ')+` L${chartW},${chartH} Z`;
  const todayX=(today/7)*chartW;
  const todayLevel=Math.round(scaled[Math.round(today/7*70)]);
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',background:theme.bg,fontFamily:'Nunito,sans-serif'}}>
      <div style={{padding:'14px 20px 0',display:'flex',alignItems:'center',gap:10}}>
        <BackBtn onPress={()=>onNav('home')}/>
        <div style={{fontSize:19,fontWeight:900,color:theme.text}}>Medication Timeline</div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'12px 20px',display:'flex',flexDirection:'column',gap:12}}>
        <div style={{display:'flex',gap:7}}>
          {meds.map(m=>(
            <button key={m} onClick={()=>setMed(m)} style={{
              flex:1,padding:'8px 2px',borderRadius:12,
              border:`2px solid ${med===m?accent:theme.border}`,
              background:med===m?accent:theme.surface2,
              color:med===m?'white':theme.text2,
              fontWeight:700,fontSize:11,cursor:'pointer',fontFamily:'Nunito,sans-serif',
            }}>{m}</button>
          ))}
        </div>
        <Card style={{padding:'14px 16px'}}>
          <div style={{fontSize:11,color:theme.text3,fontWeight:700,marginBottom:4,letterSpacing:0.5}}>ESTIMATED MEDICATION LEVEL</div>
          <div style={{fontSize:11,color:theme.text3,fontWeight:600,marginBottom:12}}>Semaglutide · 7-day half-life</div>
          <svg width="100%" viewBox={`-28 -16 ${chartW+48} ${chartH+36}`} style={{overflow:'visible'}}>
            <defs>
              <linearGradient id="medFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity="0.28"/>
                <stop offset="100%" stopColor={accent} stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="medLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={accent}/><stop offset="70%" stopColor={accent}/><stop offset="100%" stopColor="#F5A623"/>
              </linearGradient>
            </defs>
            {[0,25,50,75,100].map(v=>(
              <g key={v}>
                <line x1={0} y1={scaleY(v)} x2={chartW} y2={scaleY(v)} stroke={theme.dark?'#333':'#f0f0f0'} strokeWidth="1"/>
                <text x={-4} y={scaleY(v)+4} textAnchor="end" fontSize="9" fill={theme.text3}>{v}%</text>
              </g>
            ))}
            {[1,2,3,4,5,6,7].map(d=>(
              <text key={d} x={(d/7)*chartW} y={chartH+18} textAnchor="middle" fontSize="10" fill={theme.text3}>D{d}</text>
            ))}
            <path d={areaPath} fill="url(#medFill)"/>
            <polyline points={linePts} fill="none" stroke="url(#medLine)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <text x={scaleX(12)} y={scaleY(scaled[12])-10} textAnchor="middle" fontSize="10" fill={accent} fontWeight="bold">Peak</text>
            <line x1={todayX} y1={0} x2={todayX} y2={chartH} stroke={theme.text} strokeWidth="1.5" strokeDasharray="4 3"/>
            <rect x={todayX-17} y={-15} width={34} height={14} rx={4} fill={theme.text}/>
            <text x={todayX} y={-4} textAnchor="middle" fontSize="9" fill={theme.dark?'#000':'white'} fontWeight="bold">TODAY</text>
            <circle cx={todayX} cy={scaleY(todayLevel)} r="5" fill={accent} stroke={theme.surface} strokeWidth="2.5"/>
          </svg>
        </Card>
        <Card style={{padding:'14px 16px',background:theme.dark?`${accent}15`:`${accent}0a`,border:`1.5px solid ${accent}33`}}>
          <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:10}}>
            <div style={{width:42,height:42,borderRadius:13,background:`${accent}25`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:21}}>💊</div>
            <div>
              <div style={{fontSize:14,fontWeight:900,color:theme.text}}>You're at {todayLevel}% medication level</div>
              <div style={{fontSize:12,color:theme.text2,fontWeight:600}}>Day {today} of your weekly cycle</div>
            </div>
          </div>
          <div style={{height:1,background:theme.border,marginBottom:10}}/>
          <div style={{fontSize:13,color:theme.text2,fontWeight:600,lineHeight:1.6}}>
            ⚡ Side effects may peak <strong style={{color:theme.text}}>1–2 days</strong> after injection<br/>
            📅 Next dose in <strong style={{color:accent}}>3 days</strong> (Monday)
          </div>
        </Card>
        <Card style={{padding:'14px 16px'}}>
          <div style={{fontSize:11,color:theme.text3,fontWeight:700,marginBottom:10,letterSpacing:0.5}}>THIS WEEK</div>
          <div style={{display:'flex',gap:4}}>
            {['M','T','W','T','F','S','S'].map((d,i)=>{
              const isToday=i===today-1, isPast=i<today-1;
              return (
                <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                  <div style={{fontSize:10,fontWeight:700,color:isToday?accent:theme.text3}}>{d}</div>
                  <div style={{width:'100%',height:30,borderRadius:8,background:isToday?accent:isPast?`${accent}30`:theme.surface2,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    {i===0&&<span style={{fontSize:10}}>💉</span>}
                    {isToday&&<span style={{fontSize:9,color:'white',fontWeight:800}}>now</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { HistoryScreen, SideEffectsScreen, MedTimelineScreen });
