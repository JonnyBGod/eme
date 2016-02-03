import alt from '/../alt';
import API, {api} from '/../actions/Loopback';
import {DeviceEventEmitter, Platform} from 'react-native';
import _ from "underscore";
import moment from 'moment';

import {Actions} from 'react-native-router-flux';

import UserStore from "./user";

class ItemsStore {
  constructor() {
    this.state = {
      data: []
    };

    this.bindListeners({
      onLoggedIn: API.onLoggedIn,
      onLogout: API.logout,
      cleanCache: API.cleanCache,
      shuffle: API.shuffle
    });
  }

  onLoggedIn() {
  }

  cleanCache() {
    this.state = {
      cache: {},
      dataForQuery: {},
      ended: {},
      query: '',
      connected: false,
      eventSourceTries: 0
    };
  }

  onLogout() {
    if (this.subscription && this.subscription.readyState === 1) {
      this.subscription.close();
    }

    this.cleanCache();
  }

  shuffle(data) {
    this.setState({
      data: data
    });
  }
};

export default alt.createStore(ItemsStore, 'ItemsStore');
