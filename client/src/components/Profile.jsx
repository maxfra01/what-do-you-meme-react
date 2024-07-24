import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Container, Row, Alert, Button, Col } from 'react-bootstrap';
import { Routes, Route, Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import API from '../API.mjs';
import { ClockHistory } from 'react-bootstrap-icons';

function Profile(props) {

    const navigate = useNavigate();
    const user = props.userInfo;
    const [memes, setMemes] = useState([]);
    const [games, setGames] = useState([]);
    const [totalScore, setTotalScore] = useState(0);

    useEffect(() => {
        const fetchGames = async () => {
          if (!user) return;
          const response = await API.fetchGames(user.id);
          setGames(response);
            let score = 0;
            response.forEach(game => score += game.score);
            setTotalScore(score);
        }
        const fetchMeme = async () => {
          const response = await API.fetchAllMemes();
          setMemes(response);
        }
        fetchGames();
        fetchMeme();
      }, [user]);

    return (
        <Row className='mt-5'>
                <Col xs={3} className='d-flex flex-column align-items-center'>
                    <h2>Profile Info</h2>
                    <img src='../futurama.jpg' className='rounded-circle' style={{ height: '200px', width: '200px' }} />
                    <p className='mt-3 fw-bold'>Username: {user.username}</p>
                    <p className='fw-bold'>Name: {user.name}</p>
                    <p className='fw-bold'>Surname: {user.surname}</p>
                    <p className='fw-bold fs-5'> Total Score: {totalScore}</p>
                </Col>
                <Col xs={7} className='me-3'>
                    <h2><ClockHistory className='me-2'/> Game history </h2>
                    <Row className='border-bottom p-2'>
                        <Col xs={1} className='fw-bold d-flex justify-content-center'>#</Col>
                        <Col xs={1} className='fw-bold d-flex justify-content-center'>Score</Col>
                        <Col xs={3} className='fw-bold d-flex justify-content-center'>Meme 1</Col>
                        <Col xs={3} className='fw-bold d-flex justify-content-center'>Meme 2</Col>
                        <Col xs={3} className='fw-bold d-flex justify-content-center'>Meme 3</Col>
                    </Row>                    
                    
                        {
                         games.length == 0 ? 
                        <p className='d-flex justify-content-center mt-4 fw-bold'>No games played yet</p> 
                        :  
                        games.map(game => <GameHistoryElement key={game.id} game={game} memes={memes} />)
                        }
                        
                  
                </Col>
        </Row>
    )
}

function GameHistoryElement(props) {
    const game = props.game;
    const memes = props.memes;
    const meme1 = memes.find(m => m.id === game.idMeme1);
    const meme2 = memes.find(m => m.id === game.idMeme2);
    const meme3 = memes.find(m => m.id === game.idMeme3);


return (
    <div>
        <Row className='p-2 border-bottom'>
            <Col xs={1} className='d-flex justify-content-center align-items-center'>
                {`${game.id}`}
            </Col>
            <Col xs={1} className='d-flex justify-content-center align-items-center'>{`${game.score}`}</Col>
            <Col xs={3} className='d-flex justify-content-center align-items-center pt-4'>
                {meme1 ? (
                    game.correct1 ? 
                        <div>
                            <img src={`../../${meme1.path}`} style={{width: '100px', height: '100px', border: '6px solid green'}} alt="Meme 1" />
                            <p className='text-center'>+5</p>
                        </div>
                        : 
                        <div>
                            <img src={`../../${meme1.path}`} style={{width: '100px', height: '100px', border: '6px solid red'}} alt="Meme 1" />
                            <p className='text-center'>+0</p>
                        </div>
                ) : null}
            </Col>
            <Col xs={3} className='d-flex justify-content-center align-items-center pt-4'>
                {meme2 ? (
                    game.correct2 ? 
                        <div>
                            <img src={`../../${meme2.path}`} style={{width: '100px', height: '100px', border: '6px solid green'}} alt="Meme 2" />
                            <p className='text-center'>+5</p>
                        </div>
                        : 
                        <div>
                            <img src={`../../${meme2.path}`} style={{width: '100px', height: '100px', border: '6px solid red'}} alt="Meme 2" />
                            <p className='text-center'>+0</p>
                        </div>
                ) : null}
            </Col>
            <Col xs={3} className='d-flex justify-content-center align-items-center pt-4'>
                {meme3 ? (
                    game.correct3 ? 
                        <div>
                            <img src={`../../${meme3.path}`} style={{width: '100px', height: '100px', border: '6px solid green'}} alt="Meme 3" />
                            <p className='text-center'>+5</p>
                        </div>
                        : 
                        <div>
                            <img src={`../../${meme3.path}`} style={{width: '100px', height: '100px', border: '6px solid red'}} alt="Meme 3" />
                            <p className='text-center'>+0</p>
                        </div>
                ) : null}
            </Col>
        </Row>
    </div>
);
}

export default Profile;