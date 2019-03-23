import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-caesar-dressing';
import './index.css';
import App from './userInterface/App';
import * as serviceWorker from './serviceWorker';
import store from './store/store';

ReactDOM.render(<App store={store} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register({
  onUpdate: () => {
    store.dispatch({ type: 'update' });
  },
});
