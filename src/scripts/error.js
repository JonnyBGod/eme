import React from 'react-native';
import {Actions} from 'react-native-router-flux';

import strings from '/../strings';

const {View, Text, StyleSheet, TouchableOpacity} = React;

class Error extends React.Component {
  render(){
    return (
      <View style={styles.container}>
        <Text>{this.props.data}</Text>

        <TouchableOpacity onPress={() => Actions.dismiss()}>
          <View style={styles.button}>
              <Text style={styles.whiteFont}>{strings['Close']}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white'
  },
  button: {
  	backgroundColor: '#333366'
  }
});


export default Error;
