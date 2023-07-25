import React, {useState, useEffect} from 'react';
import {TouchableOpacity, Animated, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const RotatingIcon = ({isRotating, onPress}) => {
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    let animation = null;

    if (isRotating) {
      animation = Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      Animated.timing(animatedValue).stop();
      animatedValue.setValue(0);
    }

    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [isRotating]);

  const rotateStyle = {
    transform: [
      {
        rotate: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          perspective: 2000,
        }}>
        <Animated.View
          style={[
            rotateStyle,
            {
              width: 16,
              height: 16,
              borderRadius: 8,
              alignItems: 'center',
            },
          ]}>
          <FontAwesome name="refresh" size={16} color="#ffffff" />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

export default RotatingIcon;
