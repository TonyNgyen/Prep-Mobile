import React from 'react';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  Easing,
} from 'react-native-reanimated';
import { Circle as AnimatedCircle } from 'react-native-svg';
import { Text, View } from 'react-native';

const AnimatedCircleComponent = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  value: number;
  progress: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  textColor?: string;
  labelColor?: string;
  animate?: boolean;
  animationDuration?: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  progress = 0.75,
  label = '',
  size = 88,
  strokeWidth = 10,
  color = '#1E293B',
  backgroundColor = '#1E293B',
  textColor = '#111827',
  labelColor = '#6B7280',
  animate = true,
  animationDuration = 800,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressValue = useSharedValue(animate ? 0 : progress);

  React.useEffect(() => {
    if (animate) {
      progressValue.value = withTiming(progress, {
        duration: animationDuration,
        easing: Easing.out(Easing.ease),
      });
    }
  }, [progress, animate]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - progressValue.value * circumference,
  }));
  return (
    <View className="items-center justify-center p-1">
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            <Circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke={backgroundColor}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeOpacity={0.05}
            />
            <AnimatedCircleComponent
              cx="50%"
              cy="50%"
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              animatedProps={animatedProps}
              strokeLinecap="round"
              fill="transparent"
              strokeOpacity={0.9}
            />
          </G>
        </Svg>
        <View
          className="items-center justify-center"
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
          <Text
            className="max-w-[90%] text-center font-bold"
            style={{
              color: textColor,
              fontSize: size * 0.2,
              lineHeight: size * 0.22,
            }}
            numberOfLines={1}
            adjustsFontSizeToFit>
            {value}
          </Text>
        </View>
      </View>
      {label && (
        <Text
          className="text-xs font-medium uppercase tracking-wider"
          style={{
            color: labelColor,
            marginTop: size * 0.1,
            letterSpacing: 0.5,
          }}>
          {label}
        </Text>
      )}
    </View>
  );
};

export default ProgressRing;
