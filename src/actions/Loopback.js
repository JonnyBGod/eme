import alt from '/../alt';
import {AsyncStorage, Platform, Alert, PushNotificationIOS, StatusBarIOS} from 'react-native';
import moment from 'moment';

import {Actions} from 'react-native-router-flux';
import Qs from 'qs';
import DeviceInfo from 'react-native-device-info';

import strings from '/../strings';

const STORAGE_KEY = '@AsyncStorage:credentials';
const BASE_URL = __DEV__ ? 'https://rides.cloudtasks.io' : 'https://eme.cloudtasks.io';
const API_URL = BASE_URL + '/api';

const APP_ID = __DEV__ ? '3ba047f321e5812854a9885fd932de7c' : '125ec9cebff29c608f1cee0a68f81398';

function checkStatus(response) {
	if (Platform.OS === 'ios') {
		StatusBarIOS.setNetworkActivityIndicatorVisible(false);
	}

	if (response.status >= 200 && response.status < 300) {
		//console.log(response);
		return response;
	} else {
		//console.log(response);
		if (response.status >= 500 && response.status < 510) {
			var error = 500;
		} else if (response.status >= 400 && response.status < 410) {
			var error = 400;
		} else {
			var error = response._bodyText !== '' ? response._bodyText : '';
		}
		//console.log(error);
		throw error;
	}
}

const api = {
	BASE_URL: BASE_URL,
	API_URL: API_URL,
	APP_ID: APP_ID,
	credentials: {
		permissions: null,
		token: null,
		tokenExpirationDate: null,
		userId: null
	},

	request: function (endpoint, params = {method: 'GET', body: null}) {
			if (params.query && params.query.fields) {
				params.query.fields = JSON.stringify(params.query.fields);
			}

			if (params.query && params.query.filter) {
				params.query.filter = JSON.stringify(params.query.filter);
			}

			if (params.query && params.query.where) {
				params.query.where = JSON.stringify(params.query.where);
			}

			if (params.query) {
				params.query = '?'+ Qs.stringify(params.query);
			}

			if (params.body && typeof params.body === 'object') {
				params.body = JSON.stringify(params.body);
			}

			const obj = {  
				method: params.method,
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: params.body
			};
			
			if (this.credentials && this.credentials.currentUserId && this.credentials.accessTokenId) {
					obj.headers.Authorization = 'Bearer ' + this.credentials.accessTokenId;
			}
			
			if (Platform.OS === 'ios') {
				StatusBarIOS.setNetworkActivityIndicatorVisible(true);
			}

			//console.log(API_URL + endpoint + (params.query ? params.query : ''));
			//console.log(obj);
			return fetch(API_URL + endpoint + (params.query ? params.query : ''), obj)
				.then(checkStatus)
				.then((response) => {
					return response._bodyText !== '' ? response.json() : response;
				});
				/*.catch((error) => {
					console.log(error);
					console.log(API_URL + endpoint + (params.query ? params.query : ''));
					console.log(obj);
				});*/
	},

	get: function (endpoint, params = {}) {
			params.method = 'GET';
		return this.request(endpoint, params);
	},

	post: function (endpoint, params = {body: {}}) {
			params.method = 'POST';
		return this.request(endpoint, params);
	},

	put: function (endpoint, params = {body: {}}) {
			params.method = 'PUT';
			return this.request(endpoint, params);
	},

	del: function (endpoint, params = {body: null}) {
			params.method = 'DELETE';
			return this.request(endpoint, params);
	},

	options: function (endpoint, params = {body: null}) {
			params.method = 'OPTIONS';
			return this.request(endpoint, params);
	},

	head: function (endpoint, params = {body: null}) {
			params.method = 'HEAD';
			return this.request(endpoint, params);
	}
};

let CATEGORIES = {
	Museums: 'museus',
	Theaters: 'teatros',
	Parks: 'parques',
	Viewpoints: 'miradouros'
}

//eme.eu-gb.mybluemix.net/parques
//eme.eu-gb.mybluemix.net/museus
//eme.eu-gb.mybluemix.net/miradouros
//eme.eu-gb.mybluemix.net/teatros

class Loopback {
	constructor() {
		AsyncStorage.getItem(STORAGE_KEY, (err, res) => {
			if (err) return console.error("error");

			if (res) {
				api.credentials = JSON.parse(res);

				if (!api.credentials.token || !api.credentials.tokenExpirationDate || moment(api.credentials.tokenExpirationDate).isBefore(moment())) {
					AsyncStorage.removeItem(STORAGE_KEY);
					api.credentials = {
						permissions: null,
						token: null,
						tokenExpirationDate: null,
						userId: null
					};
				}
			}
		});
	}

	cleanCache() {
		return (dispatch) => {
			dispatch();
		}
	}

	getCredentials() {
		this.dispatch(api.credentials);
	}

	setCredentials(credentials) {
		api.credentials = credentials;
		AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(api.credentials));
		this.dispatch(api.credentials);
	}

	removeCredentials() {
		console.warn('removeCredentials');
		AsyncStorage.removeItem(STORAGE_KEY);
		api.credentials = {
			permissions: null,
			token: null,
			tokenExpirationDate: null,
			userId: null
		};
	}

	error(error) {
		if (error === 500) {
			Alert.alert(
				strings['Error'],
				strings['\nThere seams to be a problem with the server.\n\n Please wait a few minutes and try again.'],
				[
					{text: strings['Retry!']},
				]
			);
		} else if (error === 400) {
			Alert.alert(
				strings['Error'],
				strings['Unanthorized'],
				[
					{
						text: strings['Close'],
						onPress: () => API.logout(true)
					},
				]
			);
		} else {
			Alert.alert(
				strings['Error'],
				error.code,
				[
					{text: strings['Close']},
				]
			);
		}
	}

	warning(warning) {
		Alert.alert(
			strings['Warning'],
			warning,
			[
				{text: strings['Close']},
			]
		);
	}

	onLoggedIn() {
		return (dispatch) => {
			dispatch();
		}
	}

	getCurrentUser() {
		return (dispatch) => {
			console.log('getCurrentUser');
			if (api.credentials && api.credentials.userId && api.credentials.token) {
				var url = 'https://graph.facebook.com/v2.3/'+ api.credentials.userId +'?fields=name,email&access_token='+ api.credentials.token;

		    fetch(url)
		      .then((response) => response.json())
		      .then((responseData) => {
		      	dispatch(responseData);
		      })
		      .done();
		  } else {
				dispatch();
			}
		}
	}

	signin(credentials) {
		return (dispatch) => {
			api.credentials = credentials;
			AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(api.credentials));

			var url = 'https://eme.eu-gb.mybluemix.net/login';

	    fetch(url, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(api.credentials)
	    })
      .then((response) => response.json())
      .then((responseData) => {
      })
      .done(() => {
      	dispatch();
      });
		}
	}

	logout() {
		return (dispatch) => {
			API.removeCredentials();
      dispatch();
		}
	}

	initPushNotifications() {
		return (dispatch) => {
			dispatch();
		}
	}

	shuffle(category) {
		return (dispatch) => {
			if (api.credentials && api.credentials.userId && api.credentials.token) {
				var url = 'http://eme.eu-gb.mybluemix.net/'+ CATEGORIES[category];

		    fetch(url)
		      .then((response) => response.json())
		      .then((responseData) => {
		      	console.log(responseData);
		      	dispatch(responseData);
		      })
		      .done();
		  } else {
				dispatch();
			}
		}
	}
};

const API = alt.createActions(Loopback);

export default API;
export {api}