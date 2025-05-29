import React from 'react';
import { View, Text } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

interface ProgressRingProps {
  progress: number; // value between 0 and 1
  label: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  textColor?: string;
  labelColor?: string;
}

const screenWidth = Dimensions.get('window').width;

export default function ProgressRing({
  progress,
  label,
  size = 140,
  strokeWidth = 14,
  color = 'rgba(30, 41, 59, 1)', // gray-800
  textColor = '#1f2937', // gray-800
  labelColor = '#475569', // gray-600
}: ProgressRingProps) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ position: 'relative', height: size, width: size }}>
        <ProgressChart
          data={{ labels: [''], data: [progress] }}
          width={size}
          height={size}
          strokeWidth={strokeWidth}
          radius={(size - strokeWidth) / 2.5}
          chartConfig={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            backgroundGradientFrom: 'rgba(0, 0, 0, 0)',
            backgroundGradientTo: 'rgba(0, 0, 0, 0)',
            decimalPlaces: 0,
            color: () => color,
            labelColor: () => 'rgba(0, 0, 0, 0)',
          }}
          hideLegend={true}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
        />

        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: textColor }}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
      </View>

      <Text
        style={{
          marginTop: 4,
          fontSize: 14,
          color: labelColor,
        }}>
        {label}
      </Text>
    </View>
  );
}
