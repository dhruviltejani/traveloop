import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";

import CreateTrip from "./pages/CreateTrip";

import MyTrips from "./pages/MyTrips";

import ViewTrip from "./pages/ViewTrip";

import AddStop from "./pages/AddStop";

import AddActivity from "./pages/AddActivity";

import EditStop from "./pages/EditStop";

import EditTrip from "./pages/EditTrip";
import TripBudget from "./pages/TripBudget";
import CitySearch from "./pages/CitySearch";
import ActivitySearch from "./pages/ActivitySearch";
import PackingChecklist from "./pages/PackingChecklist";
import PublicTrip from "./pages/PublicTrip";
import Profile from "./pages/Profile";
import TripNotes from "./pages/TripNotes";
import AdminDashboard from "./pages/AdminDashboard";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* AUTH */}
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* CREATE TRIP */}
        <Route
          path="/create-trip"
          element={<CreateTrip />}
        />

        {/* MY TRIPS */}
        <Route
          path="/my-trips"
          element={<MyTrips />}
        />

        {/* VIEW TRIP */}
        <Route
          path="/trip/:id"
          element={<ViewTrip />}
        />

        {/* ADD STOP */}
        <Route
          path="/add-stop/:id"
          element={<AddStop />}
        />

        {/* ADD ACTIVITY */}
        <Route
          path="/add-activity/:id"
          element={<AddActivity />}
        />

        {/* EDIT STOP */}
        <Route
          path="/edit-stop/:id"
          element={<EditStop />}
        />

        {/* EDIT TRIP */}
        <Route
          path="/edit-trip/:id"
          element={<EditTrip />}
        />

        {/* TRIP BUDGET */}
        <Route
          path="/trip-budget/:id"
          element={<TripBudget />}
        />

        {/* CITY SEARCH */}
        <Route
          path="/trip/:id/city-search"
          element={<CitySearch />}
        />

        {/* ACTIVITY SEARCH */}
        <Route
          path="/trip/:id/activity-search/:stopId"
          element={<ActivitySearch />}
        />

        {/* PACKING CHECKLIST */}
        <Route
          path="/trip/:id/packing-checklist"
          element={<PackingChecklist />}
        />

        {/* PUBLIC TRIP */}
        <Route
          path="/public-trip/:id"
          element={<PublicTrip />}
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* TRIP NOTES */}
        <Route
          path="/trip/:id/notes"
          element={<TripNotes />}
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;