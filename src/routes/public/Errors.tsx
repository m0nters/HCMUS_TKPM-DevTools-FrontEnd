import { Route } from "react-router-dom";
import { NotFound, Unauthorized } from "../../pages";

export const Errors = [
  <Route key="notFound" path="*" element={<NotFound />} />,
  <Route key="unauthorized" path="/401" element={<Unauthorized />} />,
];
