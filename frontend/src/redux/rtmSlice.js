import { createSlice } from "@reduxjs/toolkit";

const rtmSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    likeNotification: [],
    unreadLikeNotificationCount: 0,
  },
  reducers: {
    setLikeNotification: (state, action) => {
      console.log(action.payload); 
      if (action.payload.type === "like") {
        state.likeNotification.unshift({
          ...action.payload,
          isRead: false,
        });
        state.unreadLikeNotificationCount =
          (state.unreadLikeNotificationCount || 0) + 1;
      } else if (action.payload.type === "dislike") {
        state.likeNotification = state.likeNotification.filter(
          (item) => item.userId !== action.payload.userId
        );
      }
    },
    markLikeNotificationAsRead: (state, action) => {
      const notificationIndex = state.likeNotification.findIndex(
        (item) => item.userId === action.payload
      );

      if (
        notificationIndex !== -1 &&
        !state.likeNotification[notificationIndex].isRead
      ) {
        state.likeNotification[notificationIndex].isRead = true;
        state.unreadLikeNotificationCount = Math.max(
          0,
          state.unreadLikeNotificationCount - 1
        );
      }
    },
  },
});

export const { setLikeNotification, markLikeNotificationAsRead } =
  rtmSlice.actions;
export default rtmSlice.reducer;
