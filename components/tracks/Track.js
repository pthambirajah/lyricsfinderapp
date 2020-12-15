import React from 'react';

const Track = props => {
    const { track } = props;

    return(
        <View style={styles.container}>
            <Text>Track</Text>
          
        </View>
    )
};
const styles = StyleSheet.create({
    container: {
      flex: 2,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default Track;