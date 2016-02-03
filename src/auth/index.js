import React from 'react-native';
import SigninScreen from './signinScreen';

const {
  Component,
  Navigator,
  PropTypes
} = React;

class AuthComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

	renderScene(route, nav) {
    switch (route.name) {
      case 'Signup':
        return <SignupScreen {...this.props} navigator={nav} />;
      case 'ForgotPassword':
        return <ForgotPasswordScreen {...this.props} navigator={nav} />;
      default:
        return (
          <SigninScreen {...this.props} navigator={nav} />
        );
    }
  }

  render() {
    return (
      <Navigator
        {...this.props.navigator}
        navigationBarHidden={true}
        initialRoute={{name: 'SigninScreen'}}
        renderScene={(route, nav) => this.renderScene(route, nav)} />
    );
  }

}

AuthComponent.propTypes = {
  signin: PropTypes.func.isRequired,
  signup: PropTypes.func,
  resetPassword: PropTypes.func
};

AuthComponent.defaultProps = {};

export default AuthComponent;