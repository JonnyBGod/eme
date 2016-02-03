import React from 'react-native';
import {Router, Route, Schema, Animations, Actions} from 'react-native-router-flux';
import TimerMixin from 'react-timer-mixin';

import API, {api} from "./src/actions/Loopback";
import UserStore from "./src/stores/user";

import AuthComponent from './src/auth/';

import SelectScreen from './src/scripts/selectScreen';
import ResultScreen from './src/scripts/resultScreen';
import ItemScreen from './src/scripts/itemScreen';

import {mdl} from 'react-native-material-kit';

import moment from 'moment';
import locale from 'moment/min/locales.min';

import strings from './src/strings';
moment.locale(strings.getLanguage(), locale);

moment.locale(strings.getLanguage(), {
    calendar : {
        lastDay : '[Yesterday at] LT',
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        lastWeek : '[last] dddd [at] LT',
        nextWeek : 'dddd [at] LT',
        sameElse : 'L [at] LT'
    }
});

const {
  AppRegistry,
  StyleSheet,
  Navigator,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions
} = React;

const window = Dimensions.get('window');

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centering: {
  },
  horizontal: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333366'
  },
  logo: {
    marginTop: 40,
    width: 150,
    height: 150
  }
});

let LaunchScreen = React.createClass({
  render() {
    return (
      <View style = { styles.horizontal }>
        <mdl.Spinner strokeColor="white"/>
      </View>
    );
  }
});

let AuthScreen = React.createClass({
  render() {
    return (
      <AuthComponent
        signin={API.signin}
        logo={{ uri: "logo", isStatic: true}} />
    );
  }
});

let eme = React.createClass({
  mixins: [TimerMixin],

  componentDidMount() {
    this.setTimeout(function() {
       if (!api.credentials || !api.credentials.userId || !api.credentials.token) {
        API.cleanCache();
        Actions.AuthScreen();
      } else if (!UserStore.getState().currentUser) {
        API.getCurrentUser();
      } else {
        API.onLoggedIn();
        Actions.SelectScreen();
      }

      UserStore.listen(this.onCurrentUserChange);
    }.bind(this), 500);
  },

  componentWillUnmount() {
    UserStore.unlisten(this.onCurrentUserChange);
  },

  onCurrentUserChange(st) {
    if (st.currentUser && Actions.currentRouter.currentRoute.name !== 'SelectScreen') {
      API.onLoggedIn();
      Actions.SelectScreen();
    } else if (Actions.currentRouter.currentRoute.name !== 'AuthScreen') {
      Actions.AuthScreen();
    }
  },

  render() {
    return (
      <Router hideNavBar={true}>
        <Schema name="default" sceneConfig={Animations.FlatFloatFromRight}/>

        <Route name="LaunchScreen" component={LaunchScreen} initial={true}/>
        <Route name="AuthScreen" component={AuthScreen} type="replace"/>
        
        <Route name="SelectScreen" component={SelectScreen} type="replace"/>
        <Route name="ResultScreen" component={ResultScreen}/>
        <Route name="ItemScreen" component={ItemScreen}/>
      </Router>
    );
  },

});

AppRegistry.registerComponent('eme', () => eme);
