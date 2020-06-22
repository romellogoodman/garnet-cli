import React, {useEffect} from 'react';
import {render} from 'react-dom';

const App = (props) => {
  const text = window.test || 'helloooooooo brooklyn!';

  useEffect(() => {
    console.log('window.test', window.test);
  }, [window.test]);

  return <div>{text}</div>;
};

render(<App />, document.getElementById('root'));
