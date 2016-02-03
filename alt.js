import Alt from 'alt';
import {Dispatcher} from 'flux'

class MyDispatcher extends Dispatcher {
  constructor() {
    super();
  }

  dispatch(payload) {
  	if (!this.isDispatching()) {
  		super.dispatch(payload);
  	} else {
  		setTimeout(() => super.dispatch(payload));
  	}
  }
}

//const alt = new Alt();
const alt = new Alt({
  dispatcher: new MyDispatcher()
})

export default alt