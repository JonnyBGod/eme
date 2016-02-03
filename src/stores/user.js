import {AsyncStorage} from 'react-native';
import alt from '/../alt';
import moment from 'moment';

import {Actions} from 'react-native-router-flux';
import API from "/../actions/Loopback";

const STORAGE_KEY = '@AsyncStorage:currentUser';

class UserStore {
  constructor() {
    this.state = {};
    // Set the default message
    // AsyncStorage.removeItem(STORAGE_KEY);
    AsyncStorage.getItem(STORAGE_KEY, (err, res) => {
      if (err) return console.error("error");

      if (res){
        this.state.currentUser = JSON.parse(res);
        
        if (moment(this.state.currentUser.updated).diff(moment(), 'hour') >= 1) {
          this.state.currentUser = null;
        }
      } else {
        this.state.currentUser = null;
      }
    });

    this.bindListeners({
      onGetCurrentUser: API.getCurrentUser,
      onSignin: API.signin,
      onLogout: API.logout,
      cleanCache: API.cleanCache
    });
  }

  cleanCache() {
    AsyncStorage.removeItem(STORAGE_KEY);
    this.setState({currentUser: null});
  }

  onGetCurrentUser(currentUser) {
    if (currentUser) {
      currentUser.updated = new Date();
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));

      this.setState({currentUser: currentUser});
    } else {
      this.setState({currentUser: false});
    }
  }

  onSignin() {
    console.log('onSignin');
    API.getCurrentUser();
  }

  onSignup() {
    API.getCurrentUser();
  }

  onLogout() {
    this.cleanCache();
  }
};

export default alt.createStore(UserStore, 'UserStore');
