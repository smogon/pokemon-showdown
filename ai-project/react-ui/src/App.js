import logo from './logo.svg';
import './App.css';
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
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  testpaper: {
    height: 30,
    width: 125
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
  listButton: {
    padding: 10,
  }
});



class App extends React.Component {
  constructor(props){
    super(props);
    this.myRef  = React.createRef();
  }

  menuClick = (event, index) => {
    // console.log(index);
    this.setState({ selectedIndex: index, anchorEl: null });
  };

  state = {
    spacing: '16',
    anchorEl: null,
    outputData: null,
  };

  componentDidMount() {
    fetch("http://localhost:8081/output")
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result["output"]);
          this.setState({
            outputData: result,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error: error
          });
        }
      )
  };

  getCurrentDate = () => {

      var today = new Date();
      var dd = today.getDate();

      var mm = today.getMonth()+1;
      var yyyy = today.getFullYear();

      if(dd<10){
          dd='0'+dd;
      }

      if(mm<10) {
          mm='0'+mm;
      }

      today = mm+'/'+dd+'/'+yyyy;
      return today;
  }


  transformData = () => {
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

  render() {
    const { classes } = this.props;
    const { spacing } = this.state;
    var tableData = {}
    // console.log(this.state.outputData);
    var headerData = this.transformData()

    if(this.state.outputData != null){
      var headerData = this.transformData()
    }

    console.log(headerData);

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={6}
          style={{
            paddingTop: "30px",
            paddingLeft: "30px",
            position: "relative",
          }}>
          <Grid container className={classes.demo} justify="center" spacing={Number(spacing)}>
            {[0, 1].map(value => (
              <Grid key={value} item xs={false}>
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
      </Grid>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
