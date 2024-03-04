import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useSearchParams } from "react-router-dom";
import { logIn } from "@/features/auth/slice";
import { http } from "@/common/services/axios";
import { resetLqs } from "@/features/live/store/lqs-slice";
import { resetMod } from "@/features/live/store/mod-slice";

export default function AuthGuard() {
  const [isHost, setHost] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [searchParams, _] = useSearchParams();
  const dispatch = useDispatch<StoreDispatch>();

  useEffect(() => {
    dispatch(resetLqs());
    dispatch(resetMod());

    if (!searchParams.get("token")) {
      setHost(false);
      setDone(true);
      return;
    }

    (async () => {
      let authData: AuthStoreState;
      try {
        const {
          data,
        }: {
          data: {
            uid: string;
            name: string;
            display_name: string;
            display_emoji: string;
            display_color: string;
          };
        } = await http.get("/decode", {
          headers: {
            Authorization: `Bearer ${searchParams.get("token")}`,
          },
        });

        authData = {
          token: searchParams.get("token") || "",
          user: {
            id: data.uid,
            name: data.name,
            displayName: data.display_name,
            displayEmoji: data.display_emoji,
            displayColor: data.display_color,
            isHost: !(
              !searchParams.get("qid") || searchParams.get("qid") === ""
            ),
          },
          participant: {
            displayName: data.display_name,
            displayEmoji: data.display_emoji,
            displayColor: data.display_color,
            marks: 0,
          },
          anonymous: false,
        };
        dispatch(logIn(authData));
        if (searchParams.get("qid")) {
          setHost(true);
          setDone(true);
          return;
        }
        if (searchParams.get("code")) {
          setHost(false);
          setDone(true);
          return;
        }
        setDone(true);
      } catch (error) {
        console.error(error);
        setHost(false);
        setDone(true);
      }
    })();
  }, []);

  if (!done) return null;
  if (!isHost)
    return (
      <Navigate
        to={`/join${
          searchParams.get("code") ? "?code=" + searchParams.get("code") : ""
        }`}
        replace
      />
    );
  if (searchParams.get("qid"))
    return <Navigate to={`/config/${searchParams.get("qid")}`} replace />;
}
