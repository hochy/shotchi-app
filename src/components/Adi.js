import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Svg, { Path, Circle, Ellipse, Defs, RadialGradient, Stop, G } from 'react-native-svg';
import { MotiView, AnimatePresence } from 'moti';
import { Easing } from 'react-native-reanimated';

/**
 * Adi v3.0 - The "Extra Cute" Chubby Blob Edition.
 */
export default function Adi({ 
  state = 'happy', 
  color = '#7BAF8E', 
  size = 120, 
  animate = true,
  onPress
}) {
  const [blink, setBlink] = useState(false);
  const [wiggle, setWiggle] = useState(0);
  
  const s = size;
  const cx = s / 2;
  const cy = s / 2 + 5;

  // Auto-blink logic
  useEffect(() => {
    if (!animate || state === 'sad') return;
    let t;
    const loop = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          loop();
        }, 150);
      }, 2500 + Math.random() * 4000);
    };
    loop();
    return () => clearTimeout(t);
  }, [animate, state]);

  const handlePress = () => {
    setWiggle(prev => prev + 1);
    onPress && onPress();
  };

  const renderEyes = () => {
    // Glossy Highlight for "Cute" look
    const Highlight = ({x, y}) => (
      <Circle cx={x + s*0.015} cy={y - s*0.015} r={s*0.012} fill="white" opacity="0.8" />
    );

    if (blink && state !== 'sad') {
      return (
        <G opacity="0.6">
          <Path d={`M${cx - s * 0.12} ${cy - s * 0.08} Q${cx - s*0.08} ${cy - s*0.06} ${cx - s * 0.04} ${cy - s * 0.08}`} stroke="white" strokeWidth={s * 0.03} fill="none" strokeLinecap="round" />
          <Path d={`M${cx + s * 0.04} ${cy - s * 0.08} Q${cx + s*0.08} ${cy - s*0.06} ${cx + s * 0.12} ${cy - s * 0.08}`} stroke="white" strokeWidth={s * 0.03} fill="none" strokeLinecap="round" />
        </G>
      );
    }

    switch (state) {
      case 'excited':
      case 'happy':
        return (
          <>
            <Path d={`M${cx - s * 0.14} ${cy - s * 0.06} Q${cx - s * 0.09} ${cy - s * 0.14} ${cx - s * 0.04} ${cy - s * 0.06}`} stroke="white" strokeWidth={s * 0.04} fill="none" strokeLinecap="round" />
            <Path d={`M${cx + s * 0.04} ${cy - s * 0.06} Q${cx + s * 0.09} ${cy - s * 0.14} ${cx + s * 0.14} ${cy - s * 0.06}`} stroke="white" strokeWidth={s * 0.04} fill="none" strokeLinecap="round" />
          </>
        );
      case 'sad':
        return (
          <>
            <Circle cx={cx - s * 0.09} cy={cy - s * 0.06} r={s * 0.04} fill="white" />
            <Circle cx={cx + s * 0.09} cy={cy - s * 0.06} r={s * 0.04} fill="white" />
            <Path d={`M${cx - s*0.04} ${cy + s*0.02} Q${cx} ${cy - s*0.02} ${cx + s*0.04} ${cy + s*0.02}`} stroke="white" strokeWidth={s*0.03} fill="none" />
          </>
        );
      default:
        return (
          <>
            <Circle cx={cx - s * 0.09} cy={cy - s * 0.08} r={s * 0.045} fill="white" />
            <Circle cx={cx + s * 0.09} cy={cy - s * 0.08} r={s * 0.045} fill="white" />
            <Highlight x={cx - s * 0.09} y={cy - s * 0.08} />
            <Highlight x={cx + s * 0.09} y={cy - s * 0.08} />
          </>
        );
    }
  };

  const renderMouth = () => {
    if (state === 'sad') return null; // Handled in eyes for sad
    const mouthW = state === 'excited' ? s*0.12 : s*0.08;
    const mouthH = state === 'excited' ? s*0.08 : s*0.04;
    
    return (
      <Path 
        d={`M${cx - mouthW} ${cy + s*0.06} Q${cx} ${cy + s*0.06 + mouthH} ${cx + mouthW} ${cy + s*0.06}`} 
        stroke="white" 
        strokeWidth={s * 0.04} 
        fill="none" 
        strokeLinecap="round" 
      />
    );
  };

  const gradId = `adiG_v3_${color.replace('#', '')}`;
  const showArms = state === 'happy' || state === 'excited';

  return (
    <Pressable onPress={handlePress}>
      <View style={{ width: s * 1.3, height: s * 1.3, alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Soft Glow */}
        <MotiView
          from={{ scale: 0.9, opacity: 0.15 }}
          animate={{ scale: 1.15, opacity: 0.08 }}
          transition={{ loop: true, type: 'timing', duration: 2500, easing: Easing.inOut(Easing.sin) }}
          style={{ position: 'absolute', width: s * 0.9, height: s * 0.8, borderRadius: s * 0.5, backgroundColor: color }}
        />

        <AnimatePresence exitBeforeEnter>
          <MotiView
            key={state + wiggle}
            from={{ scale: 0.8, rotate: wiggle > 0 ? (wiggle % 2 === 0 ? '8deg' : '-8deg') : '0deg' }}
            animate={{ scale: 1, rotate: '0deg' }}
            transition={{ type: 'spring', damping: 10, stiffness: 120 }}
          >
            {/* Jelly Physics Breathing */}
            <MotiView
              from={{ scaleY: 1, scaleX: 1 }}
              animate={{ 
                scaleY: 1.04, 
                scaleX: 0.97,
                translateY: state === 'excited' ? -12 : -6 
              }}
              transition={{ loop: true, repeatReverse: true, duration: 1800, easing: Easing.inOut(Easing.softbeam) }}
            >
              <Svg width={s} height={s+10} viewBox={`0 0 ${s} ${s+10}`}>
                <Defs>
                  <RadialGradient id={gradId} cx="35%" cy="30%" r="70%">
                    <Stop offset="0%" stopColor="white" stopOpacity={0.4} />
                    <Stop offset="100%" stopColor={color} />
                  </RadialGradient>
                </Defs>
                
                {/* Extra Chubby Body Shape */}
                <Path
                  d={`M${cx - s*0.4},${cy+s*0.1} 
                     C${cx - s*0.45},${cy - s*0.4} ${cx + s*0.45},${cy - s*0.4} ${cx + s*0.4},${cy+s*0.1}
                     C${cx + s*0.35},${cy + s*0.45} ${cx - s*0.35},${cy + s*0.45} ${cx - s*0.4},${cy+s*0.1} Z`}
                  fill={`url(#${gradId})`}
                />

                {/* Tiny Blush Marks */}
                <Ellipse cx={cx - s * 0.22} cy={cy + s * 0.04} rx={s * 0.06} ry={s * 0.03} fill="white" opacity="0.25" />
                <Ellipse cx={cx + s * 0.22} cy={cy + s * 0.04} rx={s * 0.06} ry={s * 0.03} fill="white" opacity="0.25" />

                {/* Arms (Nubby style) */}
                {showArms && (
                  <G>
                    <MotiView from={{ rotate: '0deg' }} animate={{ rotate: '15deg' }} transition={{ loop: true, repeatReverse: true, duration: 900 }}>
                      <Ellipse cx={cx - s * 0.42} cy={cy + s * 0.1} rx={s * 0.08} ry={s * 0.05} fill={color} />
                    </MotiView>
                    <MotiView from={{ rotate: '0deg' }} animate={{ rotate: '-15deg' }} transition={{ loop: true, repeatReverse: true, duration: 900 }}>
                      <Ellipse cx={cx + s * 0.42} cy={cy + s * 0.1} rx={s * 0.08} ry={s * 0.05} fill={color} />
                    </MotiView>
                  </G>
                )}
                
                {renderEyes()}
                {renderMouth()}
              </Svg>
              
              {/* Dynamic Jelly Shadow */}
              <MotiView 
                from={{ scale: 1, opacity: 0.12 }}
                animate={{ scale: 0.85, opacity: 0.08 }}
                transition={{ loop: true, repeatReverse: true, duration: 1800 }}
                style={styles.shadow}
              />
            </MotiView>
          </MotiView>
        </AnimatePresence>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    width: 50,
    height: 6,
    backgroundColor: '#000',
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: -8,
  }
});
