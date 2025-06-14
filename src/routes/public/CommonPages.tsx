import { Route } from "react-router-dom";
import {
  Home,
  PluginExplorer,
  TermsOfService,
  PluginDetails,
} from "../../pages";

export const CommonPages = [
  <Route key="home" path="/" element={<Home />} />,
  <Route key="explore" path="/explore" element={<PluginExplorer />} />,
  <Route key="terms" path="/terms" element={<TermsOfService />} />,
  <Route path="/tools/:pluginName" element={<PluginDetails />} />,
];
