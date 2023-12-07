import { Dispatch, Middleware, PayloadAction } from "@reduxjs/toolkit";
import WS from "@/features/live/utils/ws";
import wsStatuses from "@/features/live/utils/statuses";
import wsActionTypes from "@/features/live/utils/action-types";
import { resetLqs } from "@/features/live/store/lqs-slice";
import { fetchParticipant } from "@/features/lobby/store/slice";
import {
  resetMod,
  setAnswer,
  setMod,
  setOptions,
  setQuestion,
  setQuestionCount,
  setTimeLeft,
} from "@/features/live/store/mod-slice";

const wsMiddleware =
  (ws: WS): Middleware =>
  (storeAPI: { getState: any; dispatch: Dispatch<any> }) =>
  (next) =>
  (action: PayloadAction<WSAction | undefined>) => {
    const { getState, dispatch } = storeAPI;
    const { type, payload } = action;
    const { auth, lqs }: StoreRootState = getState();
    const {
      user: { id, name, isHost },
    } = auth.value;
    const { code, quizId } = lqs.value;

    switch (type) {
      case "lqs/connect":
        if (!id && !name && !code) {
          console.error("Not enought information provided to connect");
          break;
        }
        ws.connect(
          `${
            import.meta.env.VITE_WEBSOCKET_URL
          }/live/join/${quizId}?uid=${id}&uname=${name}&is-host=${isHost}`
        );

        ws.on("open", () => {
          ws.send({ type: wsActionTypes.JOINED_LQS });
          console.log("Connection established");
        });

        ws.on("message", (e) => {
          try {
            const m: WSMessage = JSON.parse((e as MessageEvent).data);
            const { type: t, payload: p } = m.content;
            console.log(t, p);

            switch (t) {
              case wsActionTypes.JOINED_LQS:
                dispatch(fetchParticipant());
                break;
              case wsActionTypes.LEFT_LQS:
                dispatch(fetchParticipant());
                break;
              case wsActionTypes.START_LQS:
                dispatch(setTimeLeft(3));
                dispatch(
                  setMod({
                    curQ: 0,
                    status: wsStatuses.STARTING,
                  })
                );
                break;
              case wsActionTypes.END_LQS:
                dispatch(setTimeLeft(-1));
                dispatch(
                  setMod({
                    curQ: 0,
                    status: wsStatuses.ENDING,
                  })
                );
                if (ws.isConnected()) {
                  ws.disconnect();
                }
                break;
              case wsActionTypes.COUNTDOWN:
                dispatch(setTimeLeft(p.timeLeft));
                break;
              case wsActionTypes.DISTRIBUTE_QUESTION:
                console.log(t, p);
                dispatch(setTimeLeft(-1));
                dispatch(setQuestionCount(p.mod.qCount));
                dispatch(
                  setMod({
                    curQ: p.mod.curQ,
                    status: p.mod.status,
                  })
                );
                dispatch(setQuestion(p.question));
                break;
              case wsActionTypes.DISTRIBUTE_OPTIONS:
                console.log(t, p);
                dispatch(setTimeLeft(-1));
                dispatch(
                  setMod({
                    curQ: p.mod.curQ,
                    status: p.mod.status,
                  })
                );
                dispatch(setOptions(p.options));
                break;
              case wsActionTypes.REVEAL_ANSWER:
                console.log(t, p);
                dispatch(setTimeLeft(-1));
                dispatch(
                  setMod({
                    curQ: p.mod.curQ,
                    status: p.mod.status,
                  })
                );
                dispatch(setAnswer(p.answer));
                break;
              default:
                break;
            }
          } catch (error) {
            console.error(error);
          }
        });

        ws.on("close", () => {
          ws.send({ type: wsActionTypes.LEFT_LQS });
          dispatch(
            setMod({
              curQ: 0,
              status: wsStatuses.ENDING,
            })
          );
          ws.disconnect();
          dispatch(resetMod());
          console.log("Connection closed");
        });

        break;

      case "lqs/trigger":
        if (!ws.isConnected()) {
          ws.connect(
            `${
              import.meta.env.VITE_WEBSOCKET_URL
            }/lqses/join/${code}?uid=${id}&uname=${name}&is-host=${isHost}`
          );
          ws.on("open", () => {
            ws.send({
              type: (payload as WSAction).type,
              payload: (payload as WSAction).payload,
            });
          });
          break;
        }
        ws.send({
          type: (payload as WSAction).type,
          payload: (payload as WSAction).payload,
        });
        break;

      case "lqs/endLqs":
        dispatch(
          setMod({
            curQ: 0,
            status: wsStatuses.ENDING,
          })
        );
        dispatch(resetLqs());
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
