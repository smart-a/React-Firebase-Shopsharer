import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ListPage from "./pages/ListPage";
import HomePage from "./pages/HomePage";
import SignIn from "./components/SignIn";
import * as db from "./firestore";

// import useAuth from "./hooks/useAuth";
// import Loading from "./components/shared/Loading";

function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    db.checkAuth((user) => {
      setLoading(false);
      setUser(user);
    });
  }, []);
  if (loading) return user ? <AuthApp /> : <UnAuthApp></UnAuthApp>;
}

function AuthApp() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/:listId" component={ListPage} />
        <Route exact path="/" component={HomePage} />
      </Switch>
    </BrowserRouter>
  );
}

function UnAuthApp() {
  return <SignIn />;
}

ReactDOM.render(
  <React.StrictMode>
    <App />
    {/* <UnAuthApp /> */}
  </React.StrictMode>,
  document.getElementById("root")
);
