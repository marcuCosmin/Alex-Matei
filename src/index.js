import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Authentication} from './Contexts/Authentication';
import {DeviceWidth} from './Contexts/DeviceWidth';
import {Title} from './Contexts/Ttile';

ReactDOM.render(
  <React.StrictMode>
    <Authentication>
      <DeviceWidth>
        <Title>
          <App />
        </Title>
      </DeviceWidth>
    </Authentication>
  </React.StrictMode>,
  document.getElementById('root')
);