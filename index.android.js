var GcmAndroid = require('react-native-gcm-android');
import Notification from 'react-native-system-notification';

import React from 'react-native';
import {Router, Route, Schema, Animations, Actions} from 'react-native-router-flux';
import TimerMixin from 'react-timer-mixin';

import API, {api} from "./src/actions/Loopback";
import AppStore from "./src/stores/app";
import UserStore from "./src/stores/user";
import CarStore from "./src/stores/car";
import CarsStore from "./src/stores/cars";
import PushStore from "./src/stores/push";
import RidesStore from "./src/stores/rides";
import ClassificationStore from "./src/stores/classification";

import DrawerLayout from 'react-native-drawer-layout';

import AuthComponent from './src/auth/';

import Menu from './src/scripts/menu';
import RidesScreen from './src/scripts/ridesScreen';
import DriverScreen from './src/scripts/driverScreen';
import NewRideScreen from './src/scripts/newRideScreen';
import CarsScreen from './src/scripts/carsScreen';
import RideScreen from './src/scripts/rideScreen';
import DriverRideScreen from './src/scripts/driverRideScreen';

import AskForRideRate from './src/scripts/askForRideRate';

import {mdl} from 'react-native-material-kit';

import moment from 'moment';
import locale from 'moment/min/locales.min';

import strings from './src/strings';

if (GcmAndroid.launchNotification) {
  var notification = GcmAndroid.launchNotification;
  var info = JSON.parse(notification.info);
  GcmAndroid.createNotification({
    subject: info.subject,
    message: info.message,
    largeIcon: 'ic_launcher',
    autoCancel: true,
    ticker: 'new notification!',
  });
  GcmAndroid.stopService();
} else {

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
    Dimensions,
    ToastAndroid,
    BackAndroid
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
          signup={API.signup}
          logo={{ uri: "logo", isStatic: true}} />
      );
    }
  });

  let Drawer = React.createClass({
    render() {
      return (
        <DrawerLayout
          ref='drawer'
          drawerWidth={window.width <= 320 ? (window.width - window.width*.2) : 300}
          renderNavigationView={() => <Menu
            indexNavigator={this.props.indexNavigator}
            changeScene={(name, type) => this.changeScene(name, type)}
            closeDrawer={() => this.refs.drawer.close()} />
          } >

          <RidesScreen/>

        </DrawerLayout>
      );
    }
  });

  let eme = React.createClass({
    mixins: [TimerMixin],

    componentDidMount() {

      BackAndroid.addEventListener('hardwareBackPress', () => {
        try {
          Actions.pop();
          return true;
        } catch (err) {
          return true;
        }
      });

      this.setTimeout(function() {
         if (!api.credentials || !api.credentials.currentUserId || !api.credentials.accessTokenId) {
          API.cleanCache();
          Actions.AuthScreen();
        } else if (!UserStore.getState().currentUser) {
          API.getCurrentUser();
        } else if (!AppStore.getState().currentApp) {
          API.getCurrentApp();
        } else {
          API.onLoggedIn();

          if (CarStore.getState().currentCar) {
            Actions.DriverScreen();
          } else {
            Actions.RidesScreen();
          }
          API.getPendingClassifications();
        }

        AppStore.listen(this.onCurrentAppChange);
        CarStore.listen(this.onCurrentCarChange);
      }.bind(this), 500);
    },

    componentWillUnmount() {
      AppStore.unlisten(this.onCurrentAppChange);
    },

    onCurrentAppChange(st) {
      if (st.currentApp) {
        API.onLoggedIn();

        if (CarStore.getState().currentCar) {
          Actions.DriverScreen();
        } else {
          Actions.RidesScreen();
        }
      } else {
        Actions.AuthScreen();
      }
    },

    onCurrentCarChange(st) {
      if (AppStore.getState().currentApp) {
        if (st.currentCar) {
          Actions.DriverScreen();
        } else {
          Actions.RidesScreen();
        }
      }
    },

    render() {
      return (
        <DrawerLayout
          ref='drawer'
          drawerWidth={window.width <= 320 ? (window.width - window.width*.2) : 300}
          renderNavigationView={() => <Menu closeDrawer={() => this.refs.drawer.closeDrawer()} />} >

          <Router hideNavBar={true}>
            <Schema name="default" sceneConfig={Animations.FlatFloatFromRight}/>
            <Schema name="modal" sceneConfig={Navigator.SceneConfigs.FloatFromBottom}/>

            <Route name="LaunchScreen" component={LaunchScreen} initial={true} hideNavBar={true}/>
            <Route name="AuthScreen" component={AuthScreen} hideNavBar={true} type="replace"/>

            <Route name="HomeScreen" component={RidesScreen} title={{title: strings["Rides"]}} type="replace" openDrawer={() => this.refs.drawer.openDrawer()}/>
            <Route name="DriverScreen" component={DriverScreen} title={{title: strings["Driver"]}} type="replace" openDrawer={() => this.refs.drawer.openDrawer()}/>
            <Route name="CarsScreen" component={CarsScreen} title={{title: strings["Cars"]}} openDrawer={() => this.refs.drawer.openDrawer()}/>
            <Route name="NewRideScreen" component={NewRideScreen} title={{title: strings["New Ride"]}}/>
            <Route name="RideScreen" component={RideScreen} title={{title: ""}}/>
            <Route name="DriverRideScreen" component={DriverRideScreen} title={{title: ""}}/>

            <Route name="askForRideRate" component={AskForRideRate} schema="modal"/>
          </Router>

        </DrawerLayout>
      );
    },

  });

  AppRegistry.registerComponent('eme', () => eme);
}
