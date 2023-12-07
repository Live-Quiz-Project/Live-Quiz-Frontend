import "@/app/tailwind.css";
import { store, persistor } from "@/app/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import router from "@/app/router";
import Loading from "@/common/components/Loading";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Suspense fallback={<Loading />}>
          <RouterProvider router={router} />
        </Suspense>
      </PersistGate>
    </Provider>
  );
}
