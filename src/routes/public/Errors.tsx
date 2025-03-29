import { Route } from "react-router-dom";
import NotFound from "../../pages/404";
import Unauthorized from "../../pages/401";

export const Errors = [
  <Route key="notFound" path="*" element={<NotFound />} />,
  <Route key="unauthorized" path="/401" element={<Unauthorized />} />,
];
