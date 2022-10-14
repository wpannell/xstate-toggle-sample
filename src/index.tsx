import "./styles.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";

interface ToggleContext {
  countObject:
    | {
        count: number;
      }
    | undefined;
}

type ToggleState =
  | {
      value: "active" | { other: "one" };
      context: ToggleContext & { countObject: { count: number } };
    }
  | {
      value: "inactive";
      context: ToggleContext;
    };

const toggleMachine = createMachine<ToggleContext, any, ToggleState>({
  id: "toggle",
  initial: "inactive",
  context: {
    countObject: undefined
  },
  states: {
    inactive: {
      on: { TOGGLE: "active" }
    },
    active: {
      entry: assign({
        countObject: (ctx) => {
          if (ctx.countObject === undefined) {
            return {
              count: 1
            };
          }

          return {
            count: ctx.countObject.count + 1
          };
        }
      }),
      on: { TOGGLE: "other" }
    },
    other: {
      on: { TOGGLE: "active" },
      initial: "one",
      states: {
        one: {}
      }
    }
  }
});

function App() {
  const [current, send] = useMachine(toggleMachine);
  const active = current.matches("active");
  const { countObject } = current.context;

  return (
    <div className="App">
      <h1>XState React Template</h1>
      <h2>Fork this template!</h2>
      <button onClick={() => send("TOGGLE")}>
        Click me ({active ? "✅" : "❌"})
      </button>{" "}
      {(current.matches("active") || current.matches({ other: "one" })) &&
        current.context.countObject && (
          <code>
            Toggled <strong>{countObject.count}</strong> times
          </code>
        )}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
