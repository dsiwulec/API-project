import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SpotsSplashPage from "./components/SpotsList";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotDetailsPage from "./components/SpotDetails";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path='/spots/:spotId' component={SpotDetailsPage} />
          <Route exact path="/" component={SpotsSplashPage} />
        </Switch>
      )}
    </>
  );
}

export default App;
