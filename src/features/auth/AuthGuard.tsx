import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useSearchParams } from "react-router-dom";
import { logIn, logOut } from "@/features/auth/store/slice";
import { http } from "@/common/services/axios";
import { resetLqs } from "@/features/live/store/lqs-slice";
import { resetMod } from "@/features/live/store/mod-slice";

export default function AuthGuard() {
  const [isHost, setIsHost] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [searchParams, _] = useSearchParams();
  const dispatch = useDispatch<StoreDispatch>();

  useEffect(() => {
    dispatch(logOut());
    dispatch(resetLqs());
    dispatch(resetMod());

    if (!searchParams.get("token")) {
      setIsHost(false);
      setDone(true);
    }

    (async () => {
      let authData = {
        token: "",
        user: {
          id: "",
          name: "",
          displayName: "",
          displayEmoji: "",
          displayColor: "",
          isHost: false,
        },
      };
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
        } = await http.post("/decode", {
          token: searchParams.get("token"),
        });

        authData = {
          token: searchParams.get("token") || "",
          user: {
            id: data.uid,
            name: data.name,
            displayName: data.display_name,
            displayEmoji: data.display_emoji,
            displayColor: data.display_color,
            isHost: searchParams.get("qid") !== "",
          },
        };

        if (searchParams.get("qid")) {
          dispatch(logIn(authData));
          setIsHost(true);
          setDone(true);
        } else {
          dispatch(logIn(authData));
          setIsHost(false);
          setDone(true);
        }
      } catch (error) {
        console.error(error);
        setIsHost(false);
        setDone(true);
      }
    })();
  }, []);

  if (!done) return null;
  if (!isHost) return <Navigate to="/join" replace />;
  if (searchParams.get("qid"))
    return <Navigate to={`/config/${searchParams.get("qid")}`} replace />;
}
