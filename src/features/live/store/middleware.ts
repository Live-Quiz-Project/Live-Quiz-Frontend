import { Dispatch, Middleware, PayloadAction } from "@reduxjs/toolkit";
import WS from "@/features/live/utils/ws";
import wsActionTypes from "@/features/live/utils/action-types";
import wsStatuses from "@/features/live/utils/statuses";
import {
  resetMod,
  setAnswers,
  setStatus,
  setTimeLeft,
  updateMod,
} from "@/features/live/store/mod-slice";
import { setParticipant } from "@/features/auth/store/slice";
import { setParticipants } from "@/features/lobby/store/slice";
import { resetLqs } from "@/features/live/store/lqs-slice";

const wsMiddleware =
  (ws: WS): Middleware =>
  (storeAPI: { getState: any; dispatch: Dispatch<any> }) =>
  (next) =>
  (action: PayloadAction<WSAction | undefined>) => {
    const { getState, dispatch } = storeAPI;
    const { type, payload } = action;
    const { auth, lqs }: StoreRootState = getState();
    const { token, user, anonymous, participant } = auth.value;
    const { code } = lqs.value;

    switch (type) {
      case "lqs/connect":
        if (
          (anonymous &&
            !participant.displayName &&
            !participant.displayEmoji &&
            !participant.displayColor &&
            !code) ||
          (!anonymous &&
            !user.displayName &&
            !user.displayEmoji &&
            !user.displayColor &&
            !code)
        ) {
          console.error("Not enought information provided to connect");
          break;
        }

        ws.connect(
          `${import.meta.env.VITE_WEBSOCKET_URL}/live/${code}/join?${
            participant.id ? `pid=${participant.id}&` : ""
          }${token ? `uid=${user.id}` : ""}&name=${
            anonymous ? participant.displayName : user.displayName
          }&emoji=${
            anonymous ? participant.displayEmoji : user.displayEmoji
          }&color=${(anonymous
            ? participant.displayColor
            : user.displayColor
          ).replace("#", "%23")}`
        );

        ws.on("open", () => {
          console.log("Connection established");
        });

        ws.on("message", (e) => {
          const m: WSMessage = JSON.parse((e as MessageEvent).data);
          const { type: t, payload: p } = m.content;
          console.log(t, p);

          switch (t) {
            case wsActionTypes.JOIN_LQS:
              if (
                (!participant.id ||
                  (participant.id && p.participant_id === participant.id)) &&
                user.isHost === p.is_host
              ) {
                dispatch(
                  setParticipant({
                    id: p.participant_id,
                    code: p.code,
                    displayName: p.participant_name,
                    displayEmoji: p.participant_emoji,
                    displayColor: p.participant_color,
                  })
                );
              }
              if (user.isHost === p.is_host) dispatch(setAnswers(p.answers));
              dispatch(updateMod());
              ws.send({ type: wsActionTypes.GET_PARTICIPANTS });
              break;
            case wsActionTypes.LEAVE_LQS:
              dispatch(updateMod());
              ws.send({ type: wsActionTypes.GET_PARTICIPANTS });
              break;
            case wsActionTypes.KICK_PARTICIPANT:
              dispatch(resetLqs());
              dispatch(resetMod());
              if (ws.isConnected()) ws.disconnect();
              break;
            case wsActionTypes.START_LQS:
              dispatch(setTimeLeft(3));
              dispatch(updateMod());
              break;
            case wsActionTypes.END_LQS:
              dispatch(setStatus(wsStatuses.ENDING));
              if (ws.isConnected()) ws.disconnect();
              break;
            case wsActionTypes.COUNTDOWN:
              dispatch(setTimeLeft(p.time_left));
              break;
            case wsActionTypes.DISTRIBUTE_QUESTION:
              dispatch(setTimeLeft(5));
              dispatch(updateMod());
              break;
            case wsActionTypes.DISTRIBUTE_MEDIA:
              dispatch(setTimeLeft(15));
              dispatch(updateMod());
              break;
            case wsActionTypes.DISTRIBUTE_OPTIONS:
              dispatch(setTimeLeft(p));
              dispatch(setAnswers(null));
              dispatch(updateMod());
              break;
            case wsActionTypes.REVEAL_ANSWER:
              dispatch(setTimeLeft(0));
              dispatch(setAnswers(p));
              dispatch(updateMod());
              break;
            case wsActionTypes.CONCLUDE:
              dispatch(updateMod());
              ws.send({ type: wsActionTypes.GET_PARTICIPANTS });
              break;
            case wsActionTypes.GET_PARTICIPANTS:
              dispatch(setParticipants(p));
              break;
            case wsActionTypes.TOGGLE_LOCK:
              dispatch(updateMod());
              break;
            case wsActionTypes.SUBMIT_ANSWER:
              dispatch(updateMod());
              break;
            case wsActionTypes.UNSUBMIT_ANSWER:
              dispatch(setAnswers(null));
              dispatch(updateMod());
              break;
            default:
              break;
          }
        });

        ws.on("close", () => {
          ws.send({ type: wsActionTypes.LEAVE_LQS });
          ws.disconnect();
          console.log("Connection closed");
        });
        break;

      case "lqs/trigger":
        if (ws.isConnected()) {
          ws.send({
            type: (payload as WSAction).type,
            payload: (payload as WSAction).payload,
          });
        }
        break;

      case "lqs/endLqs":
        dispatch(setStatus(wsStatuses.ENDING));
        ws.send({ type: wsActionTypes.END_LQS });
        break;

      case "lqs/disconnect":
        if (ws.isConnected()) {
          ws.disconnect();
        }
        break;

      default:
        break;
    }

    return next(action);
  };

export default wsMiddleware;
