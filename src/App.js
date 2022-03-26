//General Imports
import { Suspense } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

//Custom Hooks
import { useAuthContext } from './hooks/useAuthContext';
import { useTheme } from './hooks/useTheme';

//Components
import { CustomNavbar } from './components/navbar/CustomNavbar';
import { Sidebar } from './components/sidebar/Sidebar';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';

//Pages
import { Dashboard } from './pages/dashboard/Dashboard';
import { Login } from './pages/authentication/Login';
import { Signup } from './pages/authentication/Signup';
import Budget from './pages/budget/Budget';
import Budgets from './pages/budget/Budgets';
import Profile from './pages/profile/Profile';
import CreateOrder from './pages/orders/CreateOrder';
import Orders from './pages/orders/Orders';

//Styles
import './App.css';
import Order from './pages/orders/Order';
import 'react-toastify/dist/ReactToastify.css';
import { Users } from './pages/admin/Users';
import { SavedOrders } from './pages/orders/savedOrders/SavedOrders';
import EditSavedOrder from './pages/orders/savedOrders/EditSavedOrder';

function App() {
  const { mode } = useTheme();
  const { authIsReady, user } = useAuthContext();
  return (
    <Suspense fallback="loading">
      <div className={`App ${mode}`}>
        {authIsReady && (
          <BrowserRouter>
            {user && <Sidebar />}
            <Container
              fluid
              style={{ maxHeight: '100vh', overflowY: 'scroll' }}
            >
              <CustomNavbar />
              <ToastContainer />
              <Switch>
                {/* Generic Routes */}
                <Route exact path="/">
                  {user ? <Dashboard /> : <Redirect to="/login" />}
                </Route>
                <Route exact path="/login">
                  {!user ? <Login /> : <Redirect to="/" />}
                </Route>
                <Route exact path="/signup">
                  {!user ? <Signup /> : <Redirect to="/" />}
                </Route>
                <Route path="/profile/:id">
                  {user ? <Profile /> : <Redirect to="/" />}
                </Route>

                {/* Orders */}
                <Route path="/orders/:id">
                  {user ? <Order /> : <Redirect to="/login" />}
                </Route>
                <Route exact path="/orders">
                  {user ? <Orders /> : <Redirect to="/login" />}
                </Route>
                <Route exact path="/createOrder">
                  {user ? <CreateOrder /> : <Redirect to="/login" />}
                </Route>
                <Route exact path="/editSavedOrder/:id">
                  {user ? <EditSavedOrder /> : <Redirect to="/login" />}
                </Route>
                <Route exact path="/editSavedOrder/">
                  {user ? <EditSavedOrder /> : <Redirect to="/login" />}
                </Route>
                <Route path="/savedOrders">
                  {user ? <SavedOrders /> : <Redirect to="/login" />}
                </Route>

                {/* Budgets */}
                <Route exact path="/budgets">
                  {user ? (
                    user.role === 'Admin' ? (
                      <Budgets />
                    ) : (
                      <Redirect to="/" />
                    )
                  ) : (
                    <Redirect to="/login" />
                  )}
                </Route>

                <Route path="/budgets/:id">
                  {user ? (
                    user.role === 'Admin' ? (
                      <Budget />
                    ) : (
                      <Redirect to="/" />
                    )
                  ) : (
                    <Redirect to="/login" />
                  )}
                </Route>

                {/* Admin */}
                <Route exact path="/users">
                  {user ? (
                    user.role === 'Admin' ? (
                      <Users />
                    ) : (
                      <Redirect to="/" />
                    )
                  ) : (
                    <Redirect to="/login" />
                  )}
                </Route>

                {/* Match All */}
                <Route path="*">
                  <Redirect to="/" />
                </Route>
              </Switch>
            </Container>
          </BrowserRouter>
        )}
      </div>
    </Suspense>
  );
}

export default App;
