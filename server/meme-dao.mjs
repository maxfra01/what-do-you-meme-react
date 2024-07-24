import { db } from './db.mjs';
import { Meme, Game, Caption } from './Models.mjs';

export const getMemes = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM meme';
        db.all(sql, [], (err, rows) => {
        if (err) {
            reject(err);
        } else {
            const result = rows.map(row => new Meme(row.id, row.path));
            resolve(result);
        }
        });
    });
}

export const getCaptions = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM caption';
        db.all(sql, [], (err, rows) => {
        if (err) {
            reject(err);
        } else {
            const result = rows.map(row => new Caption(row.id, row.text));
            resolve(result);
        }
        });
    });
}

export const getMemeSolutions = (idMeme) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM captionMeme, caption WHERE captionMeme.idMeme = ? AND captionMeme.idCaption = caption.id';
        db.all(sql, [idMeme], (err, rows) => {
        if (err) {
            reject(err);
        } else {
            const result = rows.map(row => new Caption(row.id, row.text));
            resolve(result);
        }
        });
    });

}

export const getGamesOfUser = (idUser) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM game WHERE idUser = ? ';
        db.all(sql, [idUser], (err, rows) => {
        if (err) {
            reject(err);
        } else {
            const result = rows.map(row => new Game(row.id, row.idUser, row.score, row.idMeme1, row.idMeme2, row.idMeme3, row.correct1, row.correct2, row.correct3));
            resolve(result);
        }
        });
    });
}

export const saveGame = (idUser, score, idMeme1, idMeme2, idMeme3, correct1, correct2, correct3) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO game (idUser, score, idMeme1, idMeme2, idMeme3, correct1, correct2, correct3) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.run(sql, [idUser, score, idMeme1, idMeme2, idMeme3, correct1, correct2, correct3], (err) => {
        if (err) {
            console.log(err);
            reject(err);
        } else {
            resolve();
        }
        });
    });
}
