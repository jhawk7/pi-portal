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
import axios from 'axios';
import { green, lightBlue } from '@mui/material/colors';
const pimage = process.env.PUBLIC_URL + "/raspberry-pi.png"

class Node extends React.Component {    
    // specify type constraints for props
    static propTypes =  {
        name: string.isRequired
    };

    constructor(props) {
        super(props); // initiliazes this

        //initial node state
        this.state = {
            status: "n/a",
            stats: {
                cpu: "n/a",
                mem: "n/a",
                ip: "n/a",
                disk_space: "n/a",
                desc: "n/a"
            }
        }

        //declaring functions
        this.getStats = this.getStats.bind(this)
        this.updateStats = this.updateStats.bind(this)
        this.changeStatus = this.changeStatus.bind(this) 
        this.handleError = this.handleError.bind(this)
        this.checkHealth = this.checkHealth.bind(this)
        this.kill = this.kill.bind(this)
        this.reboot = this.reboot.bind(this)
        this.makeCall = this.makeCall.bind(this)
        this.update = this.update.bind(this)
    }

    updateStats(res) {
        this.setState({
            stats: {
                cpu: res.data.cpu,
                mem: res.data.mem,
                ip: res.data.ip,
                disk_space: res.data.disk_space,
                desc: res.data.desc
            }
        })
    }

    changeStatus(res) {
        let state = (res.status === 200 ) ? "online" : "offline"
        this.setState({
            status: state
        })
    }

    getStats() {
        const url = `http://${this.props.name}.${process.env.REACT_APP_PIHOST}/stats`
        const method = "GET"
        const responseHandler = (res => {
            this.updateStats(res)
        })

        this.makeCall(method, url, responseHandler)
    }

    checkHealth() {
        const url = `http://${this.props.name}.${process.env.REACT_APP_PIHOST}/healthcheck`
        const method = "GET"
        const responseHandler = (res => {
            console.log(`CheckHealt response ${res}`)
            this.changeStatus(res)
        })

        this.makeCall(method, url, responseHandler)
    }

    kill() {
        const url = `http://${this.props.name}.${process.env.REACT_APP_PIHOST}/kill`
        const method = "POST"
        const responseHandler = (res => {
            this.changeStatus(res)
        })

        this.makeCall(method, url, responseHandler)
    }

    reboot() {
        const url = `http://${this.props.name}.${process.env.REACT_APP_PIHOST}/reboot`
        const method = "POST"
        const responseHandler = (res => {
            this.changeStatus(res)
        })

        this.makeCall(method, url, responseHandler)
    }

    update() {
        const url = `http://${this.props.name}.${process.env.REACT_APP_PIHOST}/update`
        const method = "POST"
        const responseHandler = (res => {
            if (res.status === 204) {
                console.log("Update successful")
            }
        })
        
        this.makeCall(method, url, responseHandler)
    } 

    makeCall(method, target, responseHandler) {
        //making http call with axios to proxy
        axios({
            method: method,
            url: `${process.env.REACT_APP_PROXY}` + target,
            headers: {
                'Authorization': `Bearer test_tken`,
                'Content-Type': 'application/json',
                "origin": "Pi-Monitor"
            }
        })
        .then(responseHandler)
        .catch(e => this.handleError)
    }

    handleError(e) {
        console.log(e)
    }

    //will run when component is mounted
    componentDidMount() {
        this.checkHealth()
        this.getStats()
    }

    render() {
        let statusColor = (this.state.status === "online") ? 'green' : 'red'
        let displayDesc = (this.state.stats.desc === "n/a") ? "n/a" : this.state.stats.desc.substring(0,52) + "..."
        let statsColor = "lightseagreen"
        return (
            <div>
                <Card raised="true" sx={{minWidth: 275}}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            <b>{this.props.name}</b>
                        </Typography>
                        <Typography>
                            <p style={{color: statusColor}}><b style={{color: "black"}}>Status:</b> {this.state.status}</p>
                        </Typography>
                        <ImageListItem>
                          <img src={`${pimage}?w=164&h=164&fit=crop&auto=format`} 
                                srcSet={`${pimage}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`} 
                                alt={pimage} loading="lazy"
                            />
                        </ImageListItem>
                        <Typography variant="body2">
                            <ul>
                                <li><b>CPU:</b> <b style={{color: statsColor}}>{this.state.stats.cpu}</b></li>
                                <li><b>MEM:</b> <b style={{color: statsColor}}>{this.state.stats.mem}</b></li>
                                <li><b>SPACE:</b> <b style={{color: statsColor}}>{this.state.stats.disk_space}</b></li>
                                <li><b>IP:</b> <b style={{color: statsColor}}>{this.state.stats.ip}</b></li>
                                <li><b>DESC:</b> <b style={{color: statsColor}}>{displayDesc}</b></li>
                            </ul>
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="secondary" variant="contained" onClick={this.reboot}>Reboot</Button>
                        <Button size="small" color="error" variant="contained" onClick={this.kill}>Kill</Button>
                        <Button size="small" color="primary" variant="contained" onClick={() => {this.checkHealth(); this.getStats()}}>Refresh</Button>
                        <Button size="small" color="success" variant="contained" onClick={this.update}>Update</Button>
                    </CardActions>
                </Card>
            </div>
        )
    }
}

export default Node