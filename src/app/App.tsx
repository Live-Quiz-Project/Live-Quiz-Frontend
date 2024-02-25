import "@/app/global.css";
import { store, persistor } from "@/app/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import router from "@/app/router";
import Loading from "@/common/components/Loading";
import { MathJaxContext } from "better-react-mathjax";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Suspense fallback={<Loading />}>
          <MathJaxContext>
            <RouterProvider router={router} />
          </MathJaxContext>
        </Suspense>
      </PersistGate>
    </Provider>
  );
}
