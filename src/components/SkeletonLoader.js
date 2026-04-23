import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';

/**
 * A reusable Skeleton component for shimmering loading states.
 */
export default function SkeletonLoader({ 
  width, 
  height, 
  borderRadius = 8, 
  style,
  baseColor = '#E1E9EE',
  highlightColor = '#F2F8FC'
}) {
  return (
    <View style={[styles.container, { width, height, borderRadius, backgroundColor: baseColor }, style]}>
      <MotiView
        from={{ opacity: 0.3 }}
        animate={{ opacity: 0.6 }}
        transition={{
          type: 'timing',
          duration: 1000,
          loop: true,
          repeatReverse: true,
        }}
        style={[styles.shimmer, { borderRadius, backgroundColor: highlightColor }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  shimmer: {
    flex: 1,
  },
});
