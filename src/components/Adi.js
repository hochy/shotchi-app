import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Ellipse, Defs, RadialGradient, Stop } from 'react-native-svg';
import { MotiView, AnimatePresence } from 'moti';

/**
 * Adi v2 - High-performance animated SVG mascot.
 */
export default function Adi({ 
  state = 'happy', 
  color = '#7BAF8E', 
  size = 120, 
  animate = true, 
  speechBubble = null 
}) {
  const [blink, setBlink] = useState(false);
  const s = size;
  const cx = s / 2;
  const cy = s / 2 + 2;

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
      }, 2000 + Math.random() * 3000);
    };
    loop();
    return () => clearTimeout(t);
  }, [animate, state]);

  const renderEyes = () => {
    if (blink && state !== 'sad') {
      return (
        <>
          <Path d={`M${cx - s * 0.13} ${cy - s * 0.09} L${cx - s * 0.03} ${cy - s * 0.09}`} stroke="white" strokeWidth={s * 0.04} strokeLinecap="round" />
          <Path d={`M${cx + s * 0.03} ${cy - s * 0.09} L${cx + s * 0.13} ${cy - s * 0.09}`} stroke="white" strokeWidth={s * 0.04} strokeLinecap="round" />
        </>
      );
    }

    switch (state) {
      case 'excited':
      case 'happy':
        return (
          <>
            <Path d={`M${cx - s * 0.13} ${cy - s * 0.06} Q${cx - s * 0.08} ${cy - s * 0.15} ${cx - s * 0.03} ${cy - s * 0.06}`} stroke="white" strokeWidth={s * 0.045} fill="none" strokeLinecap="round" />
            <Path d={`M${cx + s * 0.03} ${cy - s * 0.06} Q${cx + s * 0.08} ${cy - s * 0.15} ${cx + s * 0.13} ${cy - s * 0.06}`} stroke="white" strokeWidth={s * 0.045} fill="none" strokeLinecap="round" />
          </>
        );
      case 'sad':
        return (
          <>
            <Path d={`M${cx - s * 0.13} ${cy - s * 0.09} Q${cx - s * 0.08} ${cy - s * 0.03} ${cx - s * 0.03} ${cy - s * 0.09}`} stroke="white" strokeWidth={s * 0.04} fill="none" strokeLinecap="round" />
            <Path d={`M${cx + s * 0.03} ${cy - s * 0.09} Q${cx + s * 0.08} ${cy - s * 0.03} ${cx + s * 0.13} ${cy - s * 0.09}`} stroke="white" strokeWidth={s * 0.04} fill="none" strokeLinecap="round" />
          </>
        );
      case 'waiting':
      case 'neutral':
      default:
        return (
          <>
            <Circle cx={cx - s * 0.08} cy={cy - s * 0.08} r={s * 0.04} fill="white" />
            <Circle cx={cx + s * 0.08} cy={cy - s * 0.08} r={s * 0.04} fill="white" />
          </>
        );
    }
  };

  const renderMouth = () => {
    switch (state) {
      case 'excited':
        return <Path d={`M${cx - s * 0.13} ${cy + s * 0.06} Q${cx} ${cy + s * 0.21} ${cx + s * 0.13} ${cy + s * 0.06}`} stroke="white" strokeWidth={s * 0.045} fill="none" strokeLinecap="round" />;
      case 'happy':
        return <Path d={`M${cx - s * 0.11} ${cy + s * 0.07} Q${cx} ${cy + s * 0.17} ${cx + s * 0.11} ${cy + s * 0.07}`} stroke="white" strokeWidth={s * 0.04} fill="none" strokeLinecap="round" />;
      case 'sad':
        return <Path d={`M${cx - s * 0.11} ${cy + s * 0.13} Q${cx} ${cy + s * 0.05} ${cx + s * 0.11} ${cy + s * 0.13}`} stroke="white" strokeWidth={s * 0.04} fill="none" strokeLinecap="round" />;
      case 'waiting':
        return <Path d={`M${cx - s * 0.07} ${cy + s * 0.1} L${cx + s * 0.07} ${cy + s * 0.1}`} stroke="white" strokeWidth={s * 0.03} strokeLinecap="round" />;
      default:
        return <Path d={`M${cx - s * 0.09} ${cy + s * 0.1} L${cx + s * 0.09} ${cy + s * 0.1}`} stroke="white" strokeWidth={s * 0.035} strokeLinecap="round" />;
    }
  };

  const gradId = `adiG_${state}_${color.replace('#', '')}`;
  const showArms = state === 'happy' || state === 'excited';
  const showCheeks = state === 'happy' || state === 'excited';

  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      <MotiView
        from={{ translateY: 0 }}
        animate={{ translateY: state === 'excited' ? -15 : -8 }}
        transition={{
          type: 'timing',
          duration: state === 'excited' ? 800 : 2000,
          loop: true,
          repeatReverse: true,
        }}
      >
        <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <Defs>
            <RadialGradient id={gradId} cx="38%" cy="30%" r="65%">
              <Stop offset="0%" stopColor="white" stopOpacity={0.3} />
              <Stop offset="100%" stopColor={color} />
            </RadialGradient>
          </Defs>
          
          {/* Arms */}
          {showArms && (
            <>
              <Ellipse cx={cx - s * 0.43} cy={cy + s * 0.08} rx={s * 0.1} ry={s * 0.068} fill={color} />
              <Ellipse cx={cx + s * 0.43} cy={cy + s * 0.08} rx={s * 0.1} ry={s * 0.068} fill={color} />
            </>
          )}

          {/* Body */}
          <Ellipse cx={cx} cy={cy + 3} rx={s * 0.39} ry={s * 0.43} fill={`url(#${gradId})`} />
          
          {/* Shine */}
          <Ellipse cx={cx - s * 0.09} cy={cy - s * 0.13} rx={s * 0.1} ry={s * 0.065} fill="white" opacity="0.3" />
          
          {renderEyes()}
          {renderMouth()}

          {showCheeks && (
            <>
              <Ellipse cx={cx - s * 0.23} cy={cy + s * 0.05} rx={s * 0.07} ry={s * 0.044} fill="white" opacity="0.18" />
              <Ellipse cx={cx + s * 0.23} cy={cy + s * 0.05} rx={s * 0.07} ry={s * 0.044} fill="white" opacity="0.18" />
            </>
          )}
        </Svg>
      </MotiView>
    </View>
  );
}
