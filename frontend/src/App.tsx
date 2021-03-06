import React, { useEffect, useState } from "react";
import "./App.css";
import Course from "./modules/Course";
import AddCourse from "./modules/AddCourse";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/index";
import { ThemeProvider } from "@mui/material/styles";
import { dark_theme, light_theme } from "./theme";
import { CssBaseline } from "@mui/material";
import { useCookies, CookiesProvider } from "react-cookie";
import { updateThemeMode } from "./store/theme";
import Dashboard from "./modules/DashBoard";
import axios from "axios";
import { apiURL } from "./utils/constant";
import { setCourses } from "./store/courses";
import user, { setNotification } from "./store/user";
import CustomSpinner from "./components/CustomSpinner";
import Upcoming from "./modules/Upcoming";

function App() {
  const courses = useSelector(
    (store: RootState) => store.courses.currentCourses
  );
  const user = useSelector((store: RootState) => store.user);
  const themeMode = useSelector((store: RootState) => store.theme.darkMode);
  const dispatch = useDispatch();
  const [cookies, setCookies] = useCookies(["darkMode"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cookies["darkMode"]) {
      setCookies("darkMode", true);
    } else
      dispatch(updateThemeMode({ darkMode: cookies["darkMode"] === "true" }));
    setLoading(true);
    axios({
      method: "GET",
      url: `${apiURL}/application-start`,
    })
      .then((res) => {
        // update redux state
        dispatch(setCourses(res.data.courses));
        dispatch(setNotification({ notification: res.data.notification }));
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);

  return (
    <ThemeProvider theme={themeMode ? dark_theme : light_theme}>
      <CssBaseline>
        <CookiesProvider>
          <Box>
            <BrowserRouter basename="/coa/app">
              {loading ? (
                <Box height="100vh">
                  <CustomSpinner />
                </Box>
              ) : (
                <Box>
                  <Navbar updateThemeCookie={setCookies} />
                  <Box
                    component="main"
                    sx={{ mr: { md: "275px", xl: "0" } }}
                    mt="75px"
                  >
                    <Routes>
                      <Route path="/add" element={<AddCourse />} />
                      <Route path="/upcoming" element={<Upcoming />} />
                      <Route
                        path="/dashboard"
                        element={<Dashboard courses={courses} />}
                      />
                      {courses.map(
                        (
                          e //add routes for all courses
                        ) => (
                          <Route
                            path={e.code.toLowerCase()}
                            element={
                              <Course
                                courseInfo={e}
                                notification={user.notification}
                              />
                            }
                          />
                        )
                      )}
                      <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                  </Box>
                </Box>
              )}
            </BrowserRouter>
          </Box>
        </CookiesProvider>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
