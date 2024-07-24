function Meme(id, path){
    this.id = id;
    this.path = path;
}

function Caption(id, text){
    this.id = id;
    this.text = text;
}

function Game(id, idUser, score, idMeme1, idMeme2, idMeme3, correct1, correct2, correct3){
    this.id = id;
    this.idUser = idUser;
    this.score = score;
    this.idMeme1 = idMeme1;
    this.idMeme2 = idMeme2;
    this.idMeme3 = idMeme3;
    this.correct1 = correct1;
    this.correct2 = correct2;
    this.correct3 = correct3;
}


export { Meme, Caption, Game };