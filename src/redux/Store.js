import { combineReducers, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './reducers/userReducer';
import userListReducer from './reducers/userListReducer';

const rootReducer = combineReducers({
  currentUser: userReducer,
  userList: userListReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['currentUser'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };
