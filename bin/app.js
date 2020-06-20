import React from "react";
import { render } from "react-dom";

const App = (props) => {
  const text = window.test || "nope!";

  return <div>{text}</div>;
};

render(<App />, document.getElementById("root"));
