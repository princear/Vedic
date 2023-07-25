import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Statusbar = ({
  numberOfBars = 0,
  partiallyCompleted = 0,
  completedBars = 0,
}) => {
  let totalBars = new Array(numberOfBars).fill();

  return (
    <View style={styles.container}>
      {totalBars.map((item, idx) => {
        if (partiallyCompleted - 1 === idx) {
          return (
            <View key={idx} style={styles.bar}>
              <View style={styles.partialBar} />
            </View>
          );
        } else {
          return (
            <View
              key={idx}
              style={[
                styles.bar,
                {
                  backgroundColor:
                    idx > completedBars - 1 ? '#BFBFBF' : '#3460D7',
                },
              ]}
            />
          );
        }
      })}
    </View>
  );
};

export default Statusbar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  bar: {
    flexGrow: 1,
    backgroundColor: '#BFBFBF',
    height: 4,
    borderRadius: 4,
    marginRight: 4,
  },
  partialBar: {
    backgroundColor: '#3460D7',
    height: '100%',
    width: '55%',
    borderRadius: 4,
  },
});
