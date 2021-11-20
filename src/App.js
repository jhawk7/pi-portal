import logo from './logo.svg';
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Node from './Node'
import { Grid } from '@mui/material';

class App extends React.Component {
  renderNode(name) {
    return <Node name={name}/>;
  }

  render() {
    const nodeList = ["node0", "node1", "node2", "node3", "node4", "node5"]
    return (
      <div>
        <h1>Pi-Portal</h1>
        <Grid container spacing={4}>
          {nodeList.map((node) => {
            return <Grid item xs={4} md={4}>{this.renderNode(node)}</Grid>
          })}
        </Grid>
      </div>
    )
  }
}

export default App;
