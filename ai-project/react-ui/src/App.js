import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 300,
    width: 400,
    margin: 20,
    padding: 20
  },
  control: {
    padding: theme.spacing.unit * 2,
    margin: 20
  },
});

class App extends React.Component {
  state = {
    spacing: '16',
    outputData: null,
  };

  componentDidMount() {
    this.timer = setInterval(()=> this.getItems(), 1000);
  };

  getItems = () => {
    fetch("http://localhost:8081/output")
      .then(res => res.json())
      .then(
        (result) => {
          if(result["output"] != ""){
            // console.log(result["output"]);
            this.setState({
              outputData: result["output"],
            });
          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error: error
          });
        }
      )
  }

  transformData(outputData){
    var lines = outputData.split("\n")
    console.log(lines);
  }

  displayData = () => {
    var p1name = "Bob";
    var reactHeaderData = [<Typography variant="h5" component="h3">
                      Player 1:  {p1name};
                  </Typography>,
                  <Typography variant="h5" component="h3">
                      Player 2:
                  </Typography>
                  ]
    var reactDescData = [[<Typography component="p">
                          Team: ;
                      </Typography>,
                    ],[<Typography component="p">
                          Team: ;
                      </Typography>]]
    var reactData = {header: reactHeaderData,
                    desc: reactDescData}

    return reactData
  }

  handleChange = key => (event, value) => {
    this.setState({
      [key]: value,
    });
  };

  render() {
    const { classes } = this.props;
    const { spacing } = this.state;

    var headerData = this.displayData()

    if(this.state.outputData != null){
      this.transformData(this.state.outputData)
      var headerData = this.displayData()
    }

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
          <Grid container className={classes.demo} justify="center" spacing={Number(spacing)}>
            {[0, 1].map(value => (
              <Grid key={value} item>
                <Paper className={classes.paper}>
                  {headerData.header[value]}
                  {headerData.desc[value].map(function(x, index){
                    return x;
                  })}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.control}>
            <Grid container>
              <Grid item>
                {this.state.outputData}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
