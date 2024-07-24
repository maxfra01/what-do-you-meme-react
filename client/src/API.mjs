const SERVER_URL = "http://localhost:3001";

const logIn = async (credentials) => {
    const response = await fetch(SERVER_URL + "/api/sessions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

// NEW
const getUserInfo = async () => {
    const response = await fetch(SERVER_URL + "/api/sessions/current", {
        credentials: "include",
    });
    const user = await response.json();
    if (response.ok) {
        return user;
    } else {
        throw user; // an object with the error coming from the server
    }
};


const logOut = async () => {
    const response = await fetch(SERVER_URL + "/api/sessions/current", {
        method: "DELETE",
        credentials: "include",
    });
    if (response.ok) return null;
};

const fetchAllMemes = async () => {
    try {
        const response = await fetch(SERVER_URL + "/api/memes");
        const memes = await response.json();
        if (response.ok) {
            return memes;
        } else {
            throw memes; 
        }
    } catch (error) {
        throw error;
    }
}

const fetchRandomMeme = async (pastMemes) => {

    try {
        const response = await fetch(`${SERVER_URL}/api/memes/random?pastMemes=${pastMemes.join(",")}`);
        const meme = await response.json();
        
        if (response.ok) {
            return meme;
        } else {
            throw meme; 
        }
    } catch (error) {
        throw error;
    }
}

const fetchCaptions = async (idMeme) => {
    try {
        const response = await fetch(SERVER_URL + "/api/captions/" + idMeme);
        const captions = await response.json();
        if (response.ok) {
            return captions;
        } else {
            throw captions; 
        }
    } catch (error) {
        throw error;
    }
}

const fetchSolutions = async (idMeme) => {
    try {
        const response = await fetch(SERVER_URL + "/api/memes/solution/" + idMeme);
        if (response.ok) {
            const solutions = await response.json();
            return solutions;
        } else {
            throw response; 
        }
    } catch (error) {
        throw error;
    }
}

const validateSolution = async (idMeme, idCaption) => {
    try {
        const response = await fetch(SERVER_URL + "/api/memes/solution/" + idMeme, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ idCaption }),
        });
        const valid = await response.json();
        if (response.ok) {
            console.log(valid);
            return valid;
        } else {
            throw new Error("Invalid validate request");
        }
    } catch (error) {
        throw error;
    }
};

const fetchGames = async (idUser) => {
    try {
        const response = await fetch(SERVER_URL + "/api/games/" + idUser, {
            credentials: "include",
        });
        const games = await response.json();
        if (response.ok) {
            return games;
        } else {
            throw games; 
        }
    } catch (error) {
        throw error;
    }
}

const saveGame = async (idUser, score, idMeme1, idMeme2, idMeme3, correct1, correct2, correct3) => {
    try {
        const game = {idUser, score, idMeme1, idMeme2, idMeme3, correct1, correct2, correct3};
        const response = await fetch(SERVER_URL + "/api/games", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(game),
            credentials: "include",
        });
        if (response.ok) {
            return null;
        } else {
            const errMessage = await response.text();
            throw errMessage;
        }
    } catch (error) {
        throw error;
    }
}

const API = {logIn, getUserInfo, logOut, fetchAllMemes, fetchRandomMeme, fetchCaptions, fetchSolutions, validateSolution, fetchGames, saveGame};
export default API;