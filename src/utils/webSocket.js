import { store } from "../redux/store";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import {
  setGameDataSocket,
  setGameOddSocket,
  setNotificationSocket
} from "src/redux/webSocketGameSlice";

const { dispatch } = store;

const echo = new Echo({
  broadcaster: process.env.REACT_APP_BROADCASTER,
  key: process.env.REACT_APP_WS_KEY,
  wsHost: process.env.REACT_APP_WS_HOST,
  wsPort: process.env.REACT_APP_WS_PORT,
  forceTLS: false,
  disableStats: true,
});
export const priceLogWebSocket = () => {
  echo.channel("price-log").listen("PriceLogEvent", (data) => {
    dispatch(setGameDataSocket(data));
  });
};

export const gameOddWebSocket = () => {
  echo.channel("game-odd").listen("GameOddEvent", (data) => {
    dispatch(setGameOddSocket(data));
  });
};

export const notificationWebSocket = () => {
  echo.channel("notification").listen("NotificationsEvent", (data) => {
    dispatch(setNotificationSocket(data));
  });
};

// export const ParseFloat = (str, val) => {
//   str = str.toString();
//   str = str.slice(0, str.indexOf(".") + val + 1);
//   return Number(str);
// };

export const priceLogWebSocketClose = () => {
  echo.leave("price-log");
};
