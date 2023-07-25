import React, {useEffect} from 'react';
import Svg, {Circle} from 'react-native-svg';
import Animated, {useAnimatedProps, withTiming} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const CircularProgressBar = ({cx, cy, progress, circleLength, target}) => {
  const R = circleLength / (2 * Math.PI);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circleLength * (1 - progress.value),
  }));

  useEffect(() => {
    progress.value = withTiming(target, {duration: 2000});
  }, []);

  return (
    <Svg>
      <Circle cx={55} cy={55} r={R} stroke={'#B8B8B8'} strokeWidth={8} />
      <AnimatedCircle
        cx={cx}
        cy={cy}
        r={R}
        stroke={'#3460D7'}
        strokeWidth={8}
        strokeDasharray={circleLength}
        animatedProps={animatedProps}
        strokeLinecap={'round'}
      />
    </Svg>
  );
};

export default CircularProgressBar;
