// shotchi-screens3.jsx — Settings, Onboarding

function SettingsScreen({ onNav, onAccentChange, onDarkChange }) {
  const theme = useTheme();
  const { accent } = theme;
  const [notifs, setNotifs] = React.useState(true);
  const [healthSync, setHealthSync] = React.useState(false);
  const accents = [
    {color:'#7BAF8E'},{color:'#7B8EAF'},{color:'#AF7B9C'},{color:'#AF9C7B'},{color:'#7BAFAF'},
  ];

  const Toggle = ({ value, onChange }) => (
    <div onClick={()=>onChange(!value)} style={{
      width:46,height:26,borderRadius:13,cursor:'pointer',
      background:value?accent:theme.surface2,
      position:'relative',transition:'background 0.2s',flexShrink:0,
      border:`1px solid ${theme.border}`,
    }}>
      <div style={{
        position:'absolute',top:3,left:value?22:3,
        width:18,height:18,borderRadius:9,background:'white',
        boxShadow:'0 1px 4px rgba(0,0,0,0.25)',transition:'left 0.2s',
      }}/>
    </div>
  );

  const SectionLabel = ({children}) => (
    <div style={{fontSize:11,fontWeight:800,color:theme.text3,letterSpacing:1,padding:'14px 4px 6px',textTransform:'uppercase'}}>{children}</div>
  );

  const Row = ({icon,label,value,chevron=true,control,destructive=false,onPress}) => (
    <div onClick={onPress} style={{
      display:'flex',alignItems:'center',gap:12,
      padding:'13px 16px',borderBottom:`1px solid ${theme.border}`,
      background:theme.surface,cursor:onPress?'pointer':'default',
    }}>
      {icon&&<div style={{width:34,height:34,borderRadius:10,background:`${accent}20`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>{icon}</div>}
      <div style={{flex:1,fontSize:15,fontWeight:700,color:destructive?'#E74C3C':theme.text,fontFamily:'Nunito,sans-serif'}}>{label}</div>
      {value&&<div style={{fontSize:14,color:theme.text2,fontWeight:600,fontFamily:'Nunito,sans-serif'}}>{value}</div>}
      {control}
      {chevron&&!control&&<svg width="8" height="13" viewBox="0 0 8 13"><path d="M1 1l6 5.5-6 5.5" stroke={theme.text3} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
  );

  const Section = ({children}) => (
    <div style={{borderRadius:18,overflow:'hidden',boxShadow:theme.shadow}}>{children}</div>
  );

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',background:theme.bg,fontFamily:'Nunito,sans-serif'}}>
      <div style={{padding:'14px 20px 0'}}>
        <div style={{fontSize:22,fontWeight:900,color:theme.text}}>Settings</div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'0 20px'}}>
        {/* Profile */}
        <SectionLabel>Profile</SectionLabel>
        <Section>
          <div style={{background:theme.surface,padding:'14px 16px',display:'flex',alignItems:'center',gap:14,borderBottom:`1px solid ${theme.border}`}}>
            <div style={{width:50,height:50,borderRadius:25,background:`linear-gradient(135deg,${accent},${lightenColor(accent,30)})`,display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:20,fontWeight:900}}>S</div>
            <div style={{flex:1}}>
              <div style={{fontSize:16,fontWeight:800,color:theme.text}}>Sarah</div>
              <div style={{fontSize:13,color:theme.text2,fontWeight:600}}>sarah@email.com</div>
            </div>
            <svg width="8" height="13" viewBox="0 0 8 13"><path d="M1 1l6 5.5-6 5.5" stroke={theme.text3} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </Section>

        {/* Medication */}
        <SectionLabel>Medication</SectionLabel>
        <Section>
          <Row icon="💉" label="My Medication" value="Wegovy 2.4mg"/>
          <Row icon="📅" label="Dose Day" value="Monday"/>
          <Row icon="🔔" label="Reminder Time" value="9:00 AM"/>
        </Section>

        {/* Preferences */}
        <SectionLabel>Preferences</SectionLabel>
        <Section>
          {/* Color picker */}
          <div style={{background:theme.surface,padding:'14px 16px',borderBottom:`1px solid ${theme.border}`}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
              <div style={{width:34,height:34,borderRadius:10,background:`${accent}20`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>🎨</div>
              <div style={{fontSize:15,fontWeight:700,color:theme.text}}>Adi's Color</div>
            </div>
            <div style={{display:'flex',gap:12,paddingLeft:46}}>
              {accents.map(a=>(
                <button key={a.color} onClick={()=>onAccentChange(a.color)} style={{
                  width:30,height:30,borderRadius:15,background:a.color,border:'none',cursor:'pointer',
                  boxShadow:accent===a.color?`0 0 0 3px ${theme.surface}, 0 0 0 5px ${a.color}`:'none',
                  transition:'box-shadow 0.15s',
                }}/>
              ))}
            </div>
          </div>
          <Row icon="🔔" label="Notifications" chevron={false} control={<Toggle value={notifs} onChange={setNotifs}/>}/>
          <Row icon="❤️" label="Apple Health Sync" chevron={false} control={<Toggle value={healthSync} onChange={setHealthSync}/>}/>
          <Row icon="🌙" label="Dark Mode" chevron={false} control={<Toggle value={theme.dark} onChange={onDarkChange}/>}/>
        </Section>

        {/* Data */}
        <SectionLabel>Data</SectionLabel>
        <Section>
          <Row icon="📋" label="Export for Doctor"/>
          <Row icon="🗑️" label="Reset All Data" destructive chevron={false}/>
        </Section>

        {/* Account */}
        <SectionLabel>Account</SectionLabel>
        <Section>
          <div style={{background:theme.surface,padding:'14px 16px',textAlign:'center',borderRadius:'0 0 18px 18px'}}>
            <span style={{fontSize:15,fontWeight:700,color:theme.text2,cursor:'pointer',fontFamily:'Nunito,sans-serif'}}>Sign Out</span>
          </div>
        </Section>
        <div style={{height:20}}/>
      </div>
      <BottomNav active="settings" onNav={onNav}/>
    </div>
  );
}

// ── ONBOARDING ──
function OnboardingScreen({ onFinish }) {
  const theme = useTheme();
  const { accent } = theme;
  const [step, setStep] = React.useState(0);
  const [med, setMed] = React.useState('Wegovy');
  const [day, setDay] = React.useState('Mon');
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const meds = [
    {name:'Wegovy',  generic:'semaglutide',badge:'Weekly',emoji:'💚'},
    {name:'Ozempic', generic:'semaglutide',badge:'Weekly',emoji:'🔵'},
    {name:'Mounjaro',generic:'tirzepatide',badge:'Weekly',emoji:'🟣'},
    {name:'Zepbound',generic:'tirzepatide',badge:'Weekly',emoji:'🟡'},
    {name:'Saxenda', generic:'liraglutide', badge:'Daily', emoji:'🟠'},
  ];

  const screens = [
    // Welcome
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',padding:'20px 28px',gap:16,textAlign:'center'}}>
      <Adi state="happy" color={accent} size={145}/>
      <div>
        <div style={{fontSize:26,fontWeight:900,color:theme.text}}>Welcome to</div>
        <div style={{fontSize:32,fontWeight:900,color:accent}}>Shotchi</div>
      </div>
      <div style={{fontSize:14,color:theme.text2,fontWeight:600,lineHeight:1.6}}>Your friendly GLP-1 journey companion</div>
      <div style={{display:'flex',flexDirection:'column',gap:9,width:'100%',marginTop:4}}>
        {[['📅','Track your weekly injections'],['🎉','Celebrate your milestones'],['📊','Understand your progress']].map(([e,t])=>(
          <div key={t} style={{display:'flex',alignItems:'center',gap:10,background:`${accent}15`,borderRadius:14,padding:'11px 14px'}}>
            <span style={{fontSize:19}}>{e}</span>
            <span style={{fontSize:13,fontWeight:700,color:theme.text}}>{t}</span>
          </div>
        ))}
      </div>
    </div>,

    // Medication
    <div style={{display:'flex',flexDirection:'column',height:'100%',padding:'18px 22px',gap:12}}>
      <div>
        <div style={{fontSize:21,fontWeight:900,color:theme.text}}>What medication are you taking?</div>
        <div style={{fontSize:12,color:theme.text2,fontWeight:600,marginTop:3}}>We'll personalize your experience</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8,flex:1,overflowY:'auto'}}>
        {meds.map(m=>(
          <button key={m.name} onClick={()=>setMed(m.name)} style={{
            display:'flex',alignItems:'center',gap:12,padding:'13px 14px',borderRadius:16,
            border:`2.5px solid ${med===m.name?accent:theme.border}`,
            background:med===m.name?`${accent}10`:theme.surface,cursor:'pointer',
            fontFamily:'Nunito,sans-serif',transition:'all 0.15s',
          }}>
            <span style={{fontSize:21}}>{m.emoji}</span>
            <div style={{flex:1,textAlign:'left'}}>
              <div style={{fontSize:15,fontWeight:800,color:theme.text}}>{m.name}</div>
              <div style={{fontSize:11,color:theme.text2,fontWeight:600}}>{m.generic}</div>
            </div>
            <div style={{fontSize:11,fontWeight:800,padding:'3px 10px',borderRadius:999,background:med===m.name?accent:theme.surface2,color:med===m.name?'white':theme.text3}}>{m.badge}</div>
            {med===m.name&&<div style={{width:22,height:22,borderRadius:11,background:accent,display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:13}}>✓</div>}
          </button>
        ))}
      </div>
    </div>,

    // Injection day
    <div style={{display:'flex',flexDirection:'column',height:'100%',padding:'18px 22px',gap:14}}>
      <div>
        <div style={{fontSize:21,fontWeight:900,color:theme.text}}>When is your injection day?</div>
        <div style={{fontSize:12,color:theme.text2,fontWeight:600,marginTop:3}}>We'll remind you so you never miss a dose</div>
      </div>
      <div style={{display:'flex',gap:5}}>
        {days.map(d=>(
          <button key={d} onClick={()=>setDay(d)} style={{
            flex:1,padding:'10px 0',borderRadius:12,border:`2px solid ${day===d?accent:theme.border}`,
            background:day===d?accent:theme.surface,color:day===d?'white':theme.text2,
            fontWeight:800,fontSize:11,cursor:'pointer',fontFamily:'Nunito,sans-serif',transition:'all 0.15s',
          }}>{d}</button>
        ))}
      </div>
      <div style={{background:theme.surface,borderRadius:16,padding:'14px 16px',boxShadow:theme.shadow}}>
        <div style={{fontSize:11,color:theme.text3,fontWeight:700,marginBottom:8,letterSpacing:0.5}}>REMINDER TIME</div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{fontSize:32,fontWeight:900,color:accent}}>9:00</div>
          <div style={{display:'flex',flexDirection:'column',gap:3}}>
            {['AM','PM'].map(p=>(
              <div key={p} style={{padding:'2px 10px',borderRadius:8,fontSize:13,fontWeight:800,background:p==='AM'?accent:theme.surface2,color:p==='AM'?'white':theme.text3,cursor:'pointer'}}>{p}</div>
            ))}
          </div>
        </div>
      </div>
      <div style={{background:theme.surface,borderRadius:16,padding:'14px 16px',boxShadow:theme.shadow}}>
        <div style={{fontSize:11,color:theme.text3,fontWeight:700,marginBottom:8,letterSpacing:0.5}}>APRIL 2026</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:3}}>
          {['S','M','T','W','T','F','S'].map((d,i)=><div key={i} style={{textAlign:'center',fontSize:10,color:theme.text3,fontWeight:700,padding:'3px 0'}}>{d}</div>)}
          {[null,null,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].map((d,i)=>{
            const isMon=d&&(d===6||d===13||d===20||d===27)&&day==='Mon';
            return <div key={i} style={{textAlign:'center',fontSize:11,fontWeight:isMon?800:500,padding:'4px 0',borderRadius:7,background:isMon?accent:'transparent',color:isMon?'white':d?theme.text:theme.border}}>{d||''}</div>;
          })}
        </div>
      </div>
    </div>,

    // All set
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',padding:'24px 28px',gap:16,textAlign:'center'}}>
      <Adi state="excited" color={accent} size={145}/>
      <div>
        <div style={{fontSize:26,fontWeight:900,color:theme.text}}>You're all set! 🎉</div>
        <div style={{fontSize:14,color:theme.text2,fontWeight:600,marginTop:8,lineHeight:1.7}}>
          We'll remind you every <strong style={{color:accent}}>{day}day</strong> at <strong style={{color:accent}}>9:00 AM</strong>
        </div>
      </div>
      <div style={{background:`${accent}15`,borderRadius:18,padding:'16px 20px',width:'100%'}}>
        <div style={{fontSize:14,fontWeight:700,color:theme.text2,lineHeight:2}}>
          💊 <strong style={{color:theme.text}}>{med}</strong><br/>
          📅 Every <strong style={{color:theme.text}}>{day}day</strong><br/>
          🔔 Reminder at <strong style={{color:theme.text}}>9:00 AM</strong>
        </div>
      </div>
    </div>,
  ];

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',background:theme.bg,fontFamily:'Nunito,sans-serif'}}>
      <div style={{display:'flex',justifyContent:'center',gap:6,padding:'12px 0 0'}}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{width:step===i?22:8,height:8,borderRadius:4,background:step===i?accent:theme.surface2,transition:'width 0.3s,background 0.3s'}}/>
        ))}
      </div>
      <div key={step} style={{flex:1,overflow:'auto',animation:'fadeIn 0.25s ease'}}>{screens[step]}</div>
      <div style={{padding:'10px 24px 16px',display:'flex',flexDirection:'column',gap:8}}>
        <Btn onClick={()=>step<3?setStep(s=>s+1):onFinish()} full>
          {step===3?'Start Tracking →':step===0?'Get Started →':'Continue →'}
        </Btn>
        {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{background:'none',border:'none',color:theme.text3,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'Nunito,sans-serif'}}>← Back</button>}
      </div>
    </div>
  );
}

Object.assign(window, { SettingsScreen, OnboardingScreen });
