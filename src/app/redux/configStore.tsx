import { configureStore, combineReducers } from '@reduxjs/toolkit';
import hideShow from './hideShow';
import home from './storeSocial_network/home';
import background from './background';
import changeLanguage from './languageRD';
import reload from './reload';
import messenger from './messenger';
import roomsChat from './roomsChat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import userOnlineRD from './userOnlineRD';
const persistConfig = {
    key: 'root',
    version: 1,

    storage: AsyncStorage,
};
const rootReducer = combineReducers({
    language: changeLanguage,
    background: background,
    roomsChat,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: { persistedReducer, hideShow, home, reload, messenger, userOnlineRD },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
