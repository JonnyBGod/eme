import React from 'react-native';
import API from '/../actions/Loopback';

import FBLogin from 'react-native-facebook-login';
var FBLoginManager = require('NativeModules').FBLoginManager;

import Dimensions from 'Dimensions';
import {MKTextField, MKColor, mdl} from 'react-native-material-kit';

import strings from './strings';

const windowSize = Dimensions.get('window');

const {
  AppRegistry,
  StyleSheet,
  Component,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  DeviceEventEmitter,
  Platform
} = React;

class SigninScreen extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onStoreUpdate() {
  }

  getLogoElement() {
    let {
      logo,
    } = this.props;

    if (!logo) {
      logo = {uri: "logo", isStatic: true};
    }

    return <Image style={[styles.logo, {width: 150, height: 150}]} source={logo} />
  }

  render() { 
    return (
      <View style={styles.container}>
        <View style={styles.header}>
            {this.getLogoElement()}
        </View>

        <View style={styles.inputContainer}>
          <FBLogin style={{ marginBottom: 10, }}
            permissions={["email","user_friends"]}
            loginBehavior={FBLoginManager.LoginBehaviors.Native}
            onLogin={(data) => {
              if (!this.state.loading) {
                this.props.signin(data.credentials);
              }
              this.setState({ loading: true });
            }}
            onLogout={() => {
              this.setState({ loading: true });
              //_this.setState({ user : null });
            }}
            onLoginFound={(data) => {
              console.log("Existing login found.");
              if (!this.state.loading) {
                this.props.signin(data.credentials);
              }
              this.setState({ loading: true });
            }}
            onLoginNotFound={() => {
              this.setState({ loading: false });
              //_this.setState({ user : null });
            }}
            onError={(data) => {
              console.log("ERROR");
              console.log(data);
              this.setState({ loading: false });
            }}
            onCancel={() => {
              console.log("User cancelled.");
              this.setState({ loading: false });
            }}
            onPermissionsMissing={(data) => {
              console.log("Check permissions!");
              console.log(data);
              this.setState({ loading: false });
            }} />
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#333366'
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: .4,
    backgroundColor: 'transparent'
  },
  logo: {
    marginTop: 40,
    width: 150,
    height: 150
  },
  signin: {
    backgroundColor: MKColor.Indigo,
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center'
  },
  signup: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: .15
  },
  inputContainer: {
    height: 40,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10,
    width: windowSize.width,
  },
  inputs: {
    marginBottom: 10,
    flex: .3
  },
  input: {
    position: 'absolute',
    left: 61,
    top: 12,
    right: 0,
    height: 20,
    fontSize: 14
  },
  inputText: {
    color: 'white'
  },
  forgotContainer: {
    alignItems: 'flex-end',
    padding: 15,
  },
  greyFont: {
    color: 'rgba(255,255,255,.5)'
  },
  whiteFont: {
    color: '#FFF'
  }
});

export default SigninScreen;