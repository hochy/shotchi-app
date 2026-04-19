import React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Svg, { Path, Circle, Text as SvgText, TSpan } from 'react-native-svg';

const { width } = Dimensions.get('window');
const DIAGRAM_WIDTH = 200;
const DIAGRAM_HEIGHT = 300;
const SCALE = (width * 0.7) / DIAGRAM_WIDTH;

export default function BodyDiagram({ selectedSite, onSelectSite, themeColor = '#7BAF8E', lastUsedSite }) {
  
  const getSiteStyle = (site) => {
    if (selectedSite === site) return themeColor;
    if (lastUsedSite === site) return '#E0E0E0';
    return '#F5F5F5';
  };

  const getStrokeStyle = (site) => {
    if (selectedSite === site) return themeColor;
    return '#CCCCCC';
  };

  // Helper to render a reliable touch zone
  const TouchZone = ({ site, top, left, width, height, rotate = '0deg' }) => (
    <Pressable
      onPress={() => onSelectSite(site)}
      style={[
        styles.touchZone,
        { top: top * SCALE, left: left * SCALE, width: width * SCALE, height: height * SCALE, transform: [{ rotate }] }
      ]}
    />
  );

  return (
    <View style={[styles.container, { width: DIAGRAM_WIDTH * SCALE, height: DIAGRAM_HEIGHT * SCALE }]}>
      <Svg width={DIAGRAM_WIDTH * SCALE} height={DIAGRAM_HEIGHT * SCALE} viewBox={`0 0 ${DIAGRAM_WIDTH} ${DIAGRAM_HEIGHT}`}>
        {/* Main Body Outline */}
        <Path
          d="M60,50 L140,50 L150,150 L130,200 L70,200 L50,150 Z"
          fill="#FFFFFF"
          stroke="#DDDDDD"
          strokeWidth="2"
        />

        {/* Arms */}
        <Path
          d="M30,60 L55,55 L65,130 L45,140 Z"
          fill={getSiteStyle('left_arm')}
          stroke={getStrokeStyle('left_arm')}
          strokeWidth="2"
        />
        <Path
          d="M170,60 L145,55 L135,130 L155,140 Z"
          fill={getSiteStyle('right_arm')}
          stroke={getStrokeStyle('right_arm')}
          strokeWidth="2"
        />

        {/* Abdomen (Stomach) - Now with 10-unit central gap */}
        <Path
          d="M70,100 L95,100 L95,180 L75,180 Z"
          fill={getSiteStyle('left_stomach')}
          stroke={getStrokeStyle('left_stomach')}
          strokeWidth="2"
        />
        <Path
          d="M105,100 L130,100 L125,180 L105,180 Z"
          fill={getSiteStyle('right_stomach')}
          stroke={getStrokeStyle('right_stomach')}
          strokeWidth="2"
        />

        {/* Legs / Thighs */}
        <Path
          d="M65,205 L95,205 L90,280 L60,280 Z"
          fill={getSiteStyle('left_thigh')}
          stroke={getStrokeStyle('left_thigh')}
          strokeWidth="2"
        />
        <Path
          d="M105,205 L135,205 L140,280 L110,280 Z"
          fill={getSiteStyle('right_thigh')}
          stroke={getStrokeStyle('right_thigh')}
          strokeWidth="2"
        />

        <Circle cx="100" cy="30" r="20" fill="#FFFFFF" stroke="#DDDDDD" strokeWidth="2" />

        {/* Vertical Stacked Labels */}
        <SvgText x="45" y="90" fontSize="10" fill="#777" textAnchor="middle" fontWeight="bold">
          <TSpan x="45" dy="0">L</TSpan>
          <TSpan x="45" dy="12">ARM</TSpan>
        </SvgText>

        <SvgText x="82" y="135" fontSize="10" fill="#777" textAnchor="middle" fontWeight="bold">
          <TSpan x="82" dy="0">L</TSpan>
          <TSpan x="82" dy="12">STOM</TSpan>
        </SvgText>

        <SvgText x="75" y="240" fontSize="10" fill="#777" textAnchor="middle" fontWeight="bold">
          <TSpan x="75" dy="0">L</TSpan>
          <TSpan x="75" dy="12">THIGH</TSpan>
        </SvgText>

        <SvgText x="155" y="90" fontSize="10" fill="#777" textAnchor="middle" fontWeight="bold">
          <TSpan x="155" dy="0">R</TSpan>
          <TSpan x="155" dy="12">ARM</TSpan>
        </SvgText>
        
        <SvgText x="118" y="135" fontSize="10" fill="#777" textAnchor="middle" fontWeight="bold">
          <TSpan x="118" dy="0">R</TSpan>
          <TSpan x="118" dy="12">STOM</TSpan>
        </SvgText>

        <SvgText x="125" y="240" fontSize="10" fill="#777" textAnchor="middle" fontWeight="bold">
          <TSpan x="125" dy="0">R</TSpan>
          <TSpan x="125" dy="12">THIGH</TSpan>
        </SvgText>
      </Svg>

      {/* Invisible Touch Zones */}
      <TouchZone site="left_arm" top={55} left={25} width={40} height={90} rotate="-10deg" />
      <TouchZone site="right_arm" top={55} left={135} width={40} height={90} rotate="10deg" />
      
      <TouchZone site="left_stomach" top={100} left={65} width={30} height={85} />
      <TouchZone site="right_stomach" top={100} left={105} width={30} height={85} />
      
      <TouchZone site="left_thigh" top={200} left={55} width={40} height={90} />
      <TouchZone site="right_thigh" top={200} left={105} width={40} height={90} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    position: 'relative',
  },
  touchZone: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 20,
  }
});
