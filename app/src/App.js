import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Home from "./home/Home";
import Login from "./login/Login";
import ErrorPage from "./errorPage/ErrorPage";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/404">
          <ErrorPage></ErrorPage>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
