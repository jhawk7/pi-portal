import React from 'react';
import ReactDOM from 'react-dom';
import {string} from 'prop-types';
import './node.css'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid, ImageList, ImageListItem } from '@mui/material';
const pimage = process.env.PUBLIC_URL + "/raspberry-pi.png"

class Node extends React.Component {    
    // specify type constraints for props
    static propTypes =  {
        name: string.isRequired
    };

    constructor(props) {
        super(props); // initiliazes this

        //node state
        this.state = {
            status: "n/a",
            stats: {
                cpu: "n/a",
                mem: "n/a",
                ip: "n/a",
                description: "n/a"
            }
        }

        //declaring functions
        this.getStats = this.getStats.bind(this)
        this.updateStats = this.updateStats.bind(this)
        this.changeStatus = this.changeStatus.bind(this) 
        this.handleError = this.handleError.bind(this)
    }

    updateStats(res) {
        this.setState({
            stats: res.stats
        })
    }

    changeStatus(res) {
        let state = (res.status === 200 ) ? "online" : "offline"
        this.setState({
            status: state
        })
    }

    getStats(name) {
        const url = `http://${name}.${process.env.PIHOST}/stats`
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer token"
            }
        }).then(res => {
            res = res.json()
            this.updateStats(res)
        })
        .catch(e => this.handleError(e))
    }

    checkHealth(name) {
        const url = `http://${name}.${process.env.PIHOST}/healthcheck`
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer token"
            }
        }).then(res => {
            res = res.json()
            this.changeStatus(res)
        })
        .catch(e => this.handleError(e))
        
    }

    handleError(e) {
        console.log(e)
    }

    //will run when component is mounted
    componentDidMount() {
        this.checkHealth(this.props.name)
        this.getStats(this.props.name)
    }

    render() {
        return (
            <div>
                <Card raised="true" sx={{minWidth: 275}}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            <b>{this.props.name}</b>
                        </Typography>
                        <Typography>
                            <p><b>Status:</b> {this.state.status}</p>
                        </Typography>
                        <ImageListItem>
                          <img src={`${pimage}?w=164&h=164&fit=crop&auto=format`} 
                                srcSet={`${pimage}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`} 
                                alt={pimage} loading="lazy"
                            />
                        </ImageListItem>
                        <Typography variant="body2">
                            <ul>
                                <li><b>CPU:</b> {this.state.stats.cpu}</li>
                                <li><b>MEM:</b> {this.state.stats.mem}</li>
                                <li><b>IP:</b> {this.state.stats.ip}</li>
                                <li><b>DESC:</b> {this.state.stats.description}</li>
                            </ul>
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="error" variant="contained">Kill</Button>
                        <Button size="small" color="secondary" variant="contained">Refresh</Button>
                    </CardActions>
                </Card>
            </div>
        )
    }
}

export default Node