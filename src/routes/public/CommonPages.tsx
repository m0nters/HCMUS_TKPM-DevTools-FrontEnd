import { Route } from "react-router-dom";
import Home from "../../pages/Home";
import PluginExplorer from "../../pages/PluginExplorer";
import TermsOfService from "../../pages/TermsOfService";
import PluginDetails from "../../pages/PluginDetails";

export const CommonPages = [
  <Route key="home" path="/" element={<Home />} />,
  <Route key="explore" path="/explore" element={<PluginExplorer />} />,
  <Route key="terms" path="/terms" element={<TermsOfService />} />,
  <Route path="/tools/:pluginName" element={<PluginDetails />} />,
];
