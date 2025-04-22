import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice.jsx";
import studentsReducer from "./slices/studentsSlice.jsx";
import teachersReducer from "./slices/teacherSlice.jsx";
import classesReducer from "./slices/classesSlice.jsx";
import libraryReducer from "./slices/librarySlice.jsx";
import subjectReducer from "./slices/subjectSlice.jsx";
import dailyAttendanceReducer from "./slices/dailyAttendanceSlice.jsx";
const store = configureStore({
  reducer: {
    user: userReducer,
    students: studentsReducer,
    teachers: teachersReducer,
    classes: classesReducer,
    library: libraryReducer,
    subjects: subjectReducer,
    dailyAttendance: dailyAttendanceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["user/loginSuccess"],
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          "payload.token",
          "payload.user.createdAt",
          "payload.user.updatedAt",
        ],
        // Ignore these paths in the state
        ignoredPaths: [
          "user.currentUser.createdAt",
          "user.currentUser.updatedAt",
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
