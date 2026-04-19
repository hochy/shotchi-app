import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, G, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const DIAGRAM_SIZE = width * 0.7;

export default function BodyDiagram({ selectedSite, onSelectSite, themeColor = '#7BAF8E', lastUsedSite }) {
  
  const handlePress = (site) => {
    onSelectSite(site);
  };

  const getSiteStyle = (site) => {
    if (selectedSite === site) return themeColor;
    if (lastUsedSite === site) return '#E0E0E0'; // Gray out last used
    return '#F5F5F5'; // Default
  };

  const getStrokeStyle = (site) => {
    if (selectedSite === site) return themeColor;
    return '#CCCCCC';
  };

  return (
    <View style={styles.container}>
      <Svg width={DIAGRAM_SIZE} height={DIAGRAM_SIZE * 1.5} viewBox="0 0 200 300">
        {/* Main Body Outline - Simplified Torso */}
        <Path
          d="M60,50 L140,50 L150,150 L130,200 L70,200 L50,150 Z"
          fill="#FFFFFF"
          stroke="#DDDDDD"
          strokeWidth="2"
        />

        {/* Arms */}
        <G onPress={() => handlePress('left_arm')}>
          <Path
            d="M30,60 L55,55 L65,130 L45,140 Z"
            fill={getSiteStyle('left_arm')}
            stroke={getStrokeStyle('left_arm')}
            strokeWidth="2"
          />
        </G>
        <G onPress={() => handlePress('right_arm')}>
          <Path
            d="M170,60 L145,55 L135,130 L155,140 Z"
            fill={getSiteStyle('right_arm')}
            stroke={getStrokeStyle('right_arm')}
            strokeWidth="2"
          />
        </G>

        {/* Abdomen (Stomach) - Split Left/Right */}
        <G onPress={() => handlePress('left_stomach')}>
          <Path
            d="M75,100 L100,100 L100,180 L80,180 Z"
            fill={getSiteStyle('left_stomach')}
            stroke={getStrokeStyle('left_stomach')}
            strokeWidth="2"
          />
        </G>
        <G onPress={() => handlePress('right_stomach')}>
          <Path
            d="M100,100 L125,100 L120,180 L100,180 Z"
            fill={getSiteStyle('right_stomach')}
            stroke={getStrokeStyle('right_stomach')}
            strokeWidth="2"
          />
        </G>

        {/* Legs / Thighs */}
        <G onPress={() => handlePress('left_thigh')}>
          <Path
            d="M65,205 L95,205 L90,280 L60,280 Z"
            fill={getSiteStyle('left_thigh')}
            stroke={getStrokeStyle('left_thigh')}
            strokeWidth="2"
          />
        </G>
        <G onPress={() => handlePress('right_thigh')}>
          <Path
            d="M105,205 L135,205 L140,280 L110,280 Z"
            fill={getSiteStyle('right_thigh')}
            stroke={getStrokeStyle('right_thigh')}
            strokeWidth="2"
          />
        </G>

        {/* Head (Decorative) */}
        <Circle cx="100" cy="30" r="20" fill="#FFFFFF" stroke="#DDDDDD" strokeWidth="2" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
});
