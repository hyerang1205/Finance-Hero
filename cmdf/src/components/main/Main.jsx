import React, { useEffect } from "react";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import AssignmentTurnedInRoundedIcon from "@material-ui/icons/AssignmentTurnedInRounded";
import AttachMoneyRoundedIcon from "@material-ui/icons/AttachMoneyRounded";
import FilterDramaRoundedIcon from "@material-ui/icons/FilterDramaRounded";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from "@material-ui/core/Snackbar";
import IncomeItem from "../incomeItem/IncomeItem";
import ExpenseItem from "../incomeItem/ExpenseItem";
import Footer from "../footer/Footer";
import Dialog from "./Dialog";
import AppBar from "./AppBar";
import TaskItem from "../incomeItem/TasksItem";
import Assets from "./assets/Assets";
import History from "./history/History";
import Swal from 'sweetalert2';
import firebase from '../../firebase';
import { popQuiz } from './popup/Popup';
import "../../styles/main.css";

const useStyles = makeStyles(theme => ({
  cardGrid: {
    padding: theme.spacing(8)
  },
  fab: {
    position: 'fixed',
    right: 30,
    bottom: 30
  },
  paper: {
    padding: 10,
  }
}));

const missions = [
  {
    mission: ["Quiz", "Mission"]
  }
];
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Main({ userSession = "No User", handleSignOut = () => { } }) {
  const classes = useStyles();
  const [up, setUp] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [incomeOpen, setIncomeOpen] = React.useState(false);
  const [expenseOpen, setExpenseOpen] = React.useState(false);
  const [tasksOpen, setTasksOpen] = React.useState(false);
  const [incomes, setIncomes] = React.useState([{ task: "Add your income!", amount: "0" }]);
  const [expenses, setExpenses] = React.useState([]);
  const [coins, setCoins] = React.useState([]);
  const [gems, setGems] = React.useState([]);
  const [alert, setAlert] = React.useState(true);
  const str = userSession.loadUserData().username;
  const username = str.substring(0, str.length - 14);
  const usersRef = firebase.database().ref("user/" + username);

  const toggleUp = () => setUp(!up);

  const handleIncomeOpen = () => setIncomeOpen(true);

  const handleExpenseOpen = () => setExpenseOpen(true);

  const handleTasksOpen = () => setTasksOpen(true);

  const handleIncomeClose = () => setIncomeOpen(false);

  const handleExpenseClose = () => setExpenseOpen(false);

  const handleTasksClose = () => setTasksOpen(false);

  const handleSelectedTab = index => setSelectedTab(index);

  useEffect(() => {
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      progressSteps: ['1', '2', '3']
    }).queue([
      {
        title: 'Welcome!',
        html:
          'It looks like you logged in for the first time!' +
          '<br>Let\'s get started😉' +
          '<br><h3>What\'s your name?</h3>',
      },
      {
        title: 'Awesome!',
        text: 'What\'s your goal?',
      },
      {
        title: 'You\'r almost there!',
        text: 'How many days do you have?',
      },
    ]).then((result) => {
      if (result.value) {
        Swal.fire({
          title: `You\'r all set, ${result.value[0]}!`,
          html: `
              We noted down your new goal: ${result.value[1]}
              <br>You have ${result.value[2]} days!
              <br><h3>We\'ll make sure you get there💪</h3>
            `,
          confirmButtonText: 'Lovely!'
        }).then(() => setAlert(false));
      }
    });
  }, []);

  const cards = [
    {
      title: "Income",
      open: incomeOpen,
      handleClose: handleIncomeClose
    },
    {
      title: "Expense",
      open: expenseOpen,
      handleClose: handleExpenseClose
    },
    {
      title: "Tasks",
      open: tasksOpen,
      handleClose: handleTasksClose
    }
  ];

  useEffect(() => {
    usersRef.on('value', snapshot => {
      if (snapshot.val() == null) {
        firebase.database().ref("user").child(username).set({
          income: [{ task: "Welcome!", amount: "0" }],
          expense: [{ name: "Welcome!", spend: "0" }],
          gem: 200,
          money: 250,
          avatar: '3'
        });
        Swal.mixin({
          input: 'text',
          confirmButtonText: 'Next &rarr;',
          progressSteps: ['1', '2', '3']
        }).queue([
          {
            title: 'Welcome!',
            html:
              'It looks like you logged in for the first time!' +
              '<br>Let\'s get started😉' +
              '<br><h3>What\'s your name?</h3>',
          },
          {
            title: 'Awesome!',
            text: 'What\'s your goal?',
          },
          {
            title: 'You\'r almost there!',
            text: 'How much money do you need to have to achieve the goal?',
          },
        ]).then((result) => {
          if (result.value) {
            Swal.fire({
              title: `You\'r all set, ${result.value[0]}!`,
              html: `
                  We noted down your new goal: ${result.value[1]}
                  <br>You need to collect ${result.value[2]} dollars!
                  <br><h3>We\'ll make sure you get there💪</h3>
                `,
              confirmButtonText: 'Lovely!'
            }).then(() => setAlert(false));
          }
        });
      }
      else{
        setIncomes(snapshot.val().income);
        setExpenses(snapshot.val().expense);
      }
    });
  }, []);

  const CardList = props => {
    const { title } = props;
    switch (title) {
      case "Income":
        return (
          <Paper className={classes.paper}>
            {incomes.map(({ task, amount }, i) => (
              <IncomeItem key={i} task={task} amount={amount} />
            ))}
          </Paper>
        );
      case "Expense":
        return (
          <Paper className={classes.paper}>
            {expenses.map(({ name, spend }, i) => (
              <ExpenseItem key={i} name={name} spend={spend} />
            ))}
          </Paper>
        );
      case "Tasks":
        return (
          <Paper className={classes.paper}>
            {missions.map(({ mission }, i) => (
              <TaskItem key={i} mission={mission} popQuiz={popQuiz} />
            ))}
          </Paper>
        );
      default:
        return <div></div>;
    }
  };

  const Content = (props) => {
    const { selectedTab } = props;

    switch (selectedTab) {
      case 0:
        return <Grid container justify="center" spacing={8}>
          {cards.map((card, i) => (
            <Grid item key={i} xs={12} sm={6} md={4}>
              <Typography variant="h6">{card.title}</Typography>
              <CardList {...card} />
            </Grid>
          ))}
        </Grid>;
      case 1:
        return <Assets />;
      case 2:
        return <History />;
      default:
        return <div></div>;
    }
  };

  return (
    <>
      <main>
        <AppBar userSession={userSession} handleSignOut={handleSignOut} selectedTab={selectedTab} handleSelectedTab={handleSelectedTab} />
        <Paper className={classes.cardGrid}>
          <Content selectedTab={selectedTab} />
        </Paper>
        <Fab
          className={classes.fab}
          color="primary"
          aria-label="add"
          onClick={toggleUp}
        >
          <AddRoundedIcon />
        </Fab>
        <Slide direction="up" in={up} mountOnEnter unmountOnExit>
          <Fab
            className={classes.fab}
            color="primary"
            aria-label="add"
            onClick={handleIncomeOpen}
            style={{ bottom: 240 }}
          >
            <FilterDramaRoundedIcon />
          </Fab>
        </Slide>
        <Slide direction="up" in={up} mountOnEnter unmountOnExit>
          <Fab
            className={classes.fab}
            color="primary"
            aria-label="add"
            onClick={handleExpenseOpen}
            style={{ bottom: 170 }}
          >
            <AssignmentTurnedInRoundedIcon />
          </Fab>
        </Slide>
        <Slide direction="up" in={up} mountOnEnter unmountOnExit>
          <Fab
            className={classes.fab}
            color="primary"
            aria-label="add"
            onClick={handleTasksOpen}
            style={{ bottom: 100 }}
          >
            <AttachMoneyRoundedIcon />
          </Fab>
        </Slide>
        {cards.map((card, i) => (
          <Dialog
            key={i}
            open={card.open}
            handleClose={card.handleClose}
            Transition={Transition}
            type={card.title}
          />
        ))}
        <Snackbar open={!alert} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Alert severity="success">
            Daily check-in
            <Button onClick={() => setAlert(true)} variant="outlined" style={{ color: 'white', borderColor: 'white', marginLeft: 20 }}>Dismiss</Button>
          </Alert>
        </Snackbar>
      </main>
      <Footer />
    </>
  );
}
