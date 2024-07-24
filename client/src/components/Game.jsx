import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Container, Row, Button, Alert, Col } from "react-bootstrap";
import {
    Routes,
    Route,
    Outlet,
    Navigate,
    Link,
    useNavigate,
} from "react-router-dom";
import API from "../API.mjs";

function GameComponent(props) {
    //GameComponent props: loggedIn, user

    const navigate = useNavigate();

    const [numberOfRounds, setNumberOfRounds] = useState(props.user ? 3 : 1);
    const [timer, setTimer] = useState(30); //seconds
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [meme, setMeme] = useState({ id: 0, path: "" });
    const [pastMemes, setPastMemes] = useState([]);
    const [captions, setCaptions] = useState([]);
    const [gameOver, setGameOver] = useState(0);
    const [timerOn, setTimerOn] = useState(1); //0: timer off, 1: timer on
    const [show, setShow] = useState(false);
    const [text, setText] = useState("");

    //states for saving the memes and solutions for each round
    const [meme1, setmeme1] = useState(0);
    const [meme2, setmeme2] = useState(0);
    const [meme3, setmeme3] = useState(0);
    const [correct1, setCorrect1] = useState(0);
    const [correct2, setCorrect2] = useState(0);
    const [correct3, setCorrect3] = useState(0);
    const [sol1, setSol1] = useState('');
    const [sol2, setSol2] = useState('');
    const [sol3, setSol3] = useState('');

    const fetchRound = async () => {
        try {
            const m = await API.fetchRandomMeme(pastMemes);
            setMeme(m);
            setPastMemes([...pastMemes, m.id]);
            const c = await API.fetchCaptions(m.id);
            setCaptions(c);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRound();
    }, [round]);

    useEffect(() => {
        if (timer === 0) {
            setTimerOn(0);
            submitAnswer(-1);
        }
        const interval = setInterval(() => {
            if (timerOn) setTimer((t) => t - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer, timerOn]);

    const restart = () => {
        setNumberOfRounds(props.user ? 3 : 1);
        setTimer(30);
        setGameOver(0);
        setScore(0);
        setPastMemes([]);
        setmeme1(0);
        setmeme2(0);
        setmeme3(0);
        setCorrect1(0);
        setCorrect2(0);
        setCorrect3(0);
        setSol1('');
        setSol2('');
        setSol3('');
        setRound(1);
        if (!props.user){
            fetchRound(); //triggered manually here for 1 round game
        }
        setTimerOn(1);
    };

    const nextRound = async () => {
        if (props.loggedIn && round === numberOfRounds) {
            setGameOver(1);
            setText("Game over! Your score is: " + score);
            setShow(true);
            if (props.user) await API.saveGame(
                props.user.id,
                score,
                meme1.id,
                meme2.id,
                meme3.id,
                correct1,
                correct2,
                correct3
            );
        }
        if (!props.loggedIn && round === numberOfRounds) {
            setGameOver(1);
            setText("Game over! Your score is: " + score);
            setShow(true);
        }
        if (round < numberOfRounds) {
            setTimer(30);
            setTimerOn(1);
            setRound((r) => r + 1);
        }
        
    };

    const submitAnswer = async (idCaption) => {
        if (show) return; //this prevents the user from submitting multiple times
        setTimerOn(0);
    
        let success = await API.validateSolution(meme.id, idCaption)

        const solution = await API.fetchSolutions(meme.id);
        const filteredSolution = captions.filter((c) => solution.some((s) => s.id === c.id));

        if (round === 1) {
            setmeme1(meme);
        } else if (round === 2) {
            setmeme2(meme);
        } else if (round === 3) {
            setmeme3(meme);
        }

        if (success) {
            setScore((s) => s + 5);
            setText("Correct answer! +5 points");
            setShow(true);

            if (round === 1) {
                setCorrect1(1);
                setSol1(filteredSolution.filter((s) => s.id === idCaption)[0].text);
            } else if (round === 2) {
                setCorrect2(1);
                setSol2(filteredSolution.filter((s) => s.id === idCaption)[0].text);

            } else if (round === 3) {
                setCorrect3(1);
                setSol3(filteredSolution.filter((s) => s.id === idCaption)[0].text);
            }
        } else {
            setText("You got 0 points. Correct captions were: - " + filteredSolution.map((s) => s.text).join(" - "));
            setShow(true);
        }
    };

    return (
        <Container fluid className="m-0 p-0">
        <AlertDismissible 
            showAlert={show} 
            handleShow={setShow} 
            text={text} 
            handleRound={nextRound} 
            gameover={gameOver} 
            handleRestart={restart}
            m1={meme1}
            m2={meme2}
            m3={meme3}
            s1={sol1}
            s2={sol2}
            s3={sol3}
             />
            <Row className="d-flex justify-content-center mt-3 mx-0">
                <Stats
                    round={round}
                    numberOfRounds={numberOfRounds}
                    score={score}
                    timer={timer}
                />
            </Row>
            <Row className="d-flex justify-content-center mt-3 mx-0">
                <Col xs={5} className="d-flex flex-column align-items-center">
                    <MemeComponent id={meme.id} path={meme.path}></MemeComponent>
                </Col>
                <Col xs={5} className="d-flex flex-column">
                    <h3>Choose the correct caption:</h3>

                    {captions.map((c) => (
                        <CaptionComponent
                            key={c.id}
                            id={c.id}
                            text={c.text}
                            handleSelect={submitAnswer}
                        ></CaptionComponent>
                    ))}
                </Col>
            </Row>
        </Container>
    );
}

function Stats(props) {
    //Stats props: round, numberOfRounds, score, timer
    return (
        <>
            <Col xs={2} className="d-flex justify-content-center">
                <h4>
                    Round: {props.round} / {props.numberOfRounds}
                </h4>
            </Col>

            <Col xs={2} className="d-flex justify-content-center">
                <h4>Score: {props.score}</h4>
            </Col>

            <Col xs={2} className="d-flex justify-content-center">
                <h4>Time left: {props.timer}</h4>
            </Col>

            <Col xs={2} className="d-flex justify-content-center">
                <Link className="btn btn-danger mx-2" to={"/"}>
                    Exit game
                </Link>
            </Col>
        </>
    );
}

function MemeComponent(props) {
    //Meme props: path
    return (
        <img
            src={`../../${props.path}`}
            alt="Meme"
            style={{ width: "400px", height: "400px" }}
        />
    );
}

function CaptionComponent(props) {
    //Caption props: id, text, handleSelect (submitAnswer function)
    return (
        <Button
            className=" my-2 btn-dark btn-light"
            onClick={() => props.handleSelect(props.id)}
        >
            {props.text}
        </Button>
    );
}

function AlertDismissible(props) {

    const [show, setShow] = useState(props.showAlert);
  
    return (
      <>
        <Alert show={props.showAlert} className="m-5 ">
            {props.gameover ?
            <Alert.Heading>Game Over! You have no more rounds!</Alert.Heading> :
            <Alert.Heading>End of the round</Alert.Heading>
            }
          <p>
            {props.text}
         </p>
            {
                props.gameover ?
                <Row className="d-flex justify-content-center">
                    {
                        props.s1 ? 
                            
                            <Col xs={3}>
                                <h5>Meme 1</h5>
                                <img src={`../../${props.m1.path}`} style={{width: '100px', height: '100px'}} alt="Meme 1" />
                                <p>Correct caption: {props.s1}</p>
                            </Col>
                            : null
                    }

                    {
                        props.s2 ?
                            
                                <Col xs={3}>
                                    <h5>Meme 2</h5>
                                    <img src={`../../${props.m2.path}`} style={{width: '100px', height: '100px'}} alt="Meme 2" />
                                    <p>Correct caption: {props.s2}</p>
                                </Col>
                            : null
                    }

                    {
                        props.s3 ?
                          
                                <Col xs={3}>
                                    <h5>Meme 3</h5>
                                    <img src={`../../${props.m3.path}`} style={{width: '100px', height: '100px'}} alt="Meme 3" />
                                    <p>Correct caption: {props.s3}</p>
                                </Col>
                           : null
                    }

                </Row> : null
            }
          
          <hr />

          <div className="d-flex justify-content-center">
          {props.gameover ?
            <div className="d-flex flex-row">
            <Link to="/"><Button variant="outline-primary me-2">Exit Game</Button></Link>
            <Link to="/game"><Button variant="outline-primary" onClick={() => {props.handleRestart(); props.handleShow(false)}}>Restart game</Button></Link>
            </div>
            :
            <Button onClick={() => {
                props.handleShow(false);
                props.handleRound();
            }} variant="outline-primary">
                Next Round
            </Button>
          }
          </div>

        </Alert>
  
      </>
    );
  }
  


export default GameComponent;
