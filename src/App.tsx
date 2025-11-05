import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/polymet/layouts/app-layout";
import { MockupGenerator } from "@/polymet/pages/mockup-generator";
import { About } from "@/polymet/pages/about";
import { Help } from "@/polymet/pages/help";
import { Privacy } from "@/polymet/pages/privacy";

export default function DeviceMockupApp() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <MockupGenerator />
            </AppLayout>
          }
        />

        <Route
          path="/about"
          element={
            <AppLayout>
              <About />
            </AppLayout>
          }
        />

        <Route
          path="/help"
          element={
            <AppLayout>
              <Help />
            </AppLayout>
          }
        />

        <Route
          path="/privacy"
          element={
            <AppLayout>
              <Privacy />
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
}
