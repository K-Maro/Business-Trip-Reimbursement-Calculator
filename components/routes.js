import React from "react";
import { Redirect, Switch, Route, Router } from "react-router-dom";
import RouteGuard from "./RouteGuard";
//history
import { history } from './helpers/history';
 
//pages
import Login from "./Login";
import Form from "../src/Form";
 
function Routes() {
   return (
       <Router history={history}>
           <Switch>
               <Route
                   exact
                   path="/Login"
                   component={Login}
               />
               <RouteGuard
                   path="/Form"
                   component={Form}
               />
               
           </Switch>
       </Router>
   );
}
 
export default Routes