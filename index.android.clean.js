import React from 'react-native';

const {
  AppRegistry,
  View,
} = React;

let eme = React.createClass({
  render() {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333366'
      }}>
      </View>
    );
  },

});

AppRegistry.registerComponent('eme', () => eme);
