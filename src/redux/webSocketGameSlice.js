import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  gameDataSocket: {},
  gameOddSocket: {},
  notificationSocket: {},
};
export const webSocketGameSlice = createSlice({
  name: "webSocketGameSlice",
  initialState,
  reducers: {
    setGameDataSocket: (state, action) => {
      state.gameDataSocket = action.payload;
    },
    setGameOddSocket: (state, action) => {
      state.gameOddSocket = action.payload;
    },
    setNotificationSocket: (state, action) => {
      state.notificationSocket = action.payload;
    },
  },
});

export const { setGameDataSocket, setGameOddSocket, setNotificationSocket } = webSocketGameSlice.actions;
export default webSocketGameSlice.reducer;
