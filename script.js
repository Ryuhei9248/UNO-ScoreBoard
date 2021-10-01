document.querySelector('.container-2').style.display = 'none';
let displayTable = document.querySelector('#match-history-table-div');
displayTable.style.display = 'none';
document.querySelector('#match-data').style.display = 'none';

document.querySelector('#add-player').addEventListener('click', addPlayer);
document.querySelector('#next-page').addEventListener('click', nextPage);
document.querySelector('#match-history').addEventListener('click', showMatchHistory);


let buttonClickCounter = 1;
let UNO = {};

function addPlayer(){

    if(buttonClickCounter < 9){
        let textarea = document.querySelector('#player-name');
        let playerName = textarea.value;

        UNO[`Player${buttonClickCounter}`] = { 'name': playerName, 'score': 0}

        //front end
        
        buttonClickCounter++;
        textarea.value = '';
        let player = document.createElement('li');
        player.className = "list-group-item";
        let div = document.querySelector('#players');

        player.textContent = `Player ${buttonClickCounter -1}: ${playerName}`;
        div.appendChild(player);

        if(buttonClickCounter >= 9){
            textarea.placeholder = 'Cannot add more players';
            textarea.value = '';
        }else{
            textarea.placeholder = `Player ${buttonClickCounter}`;
            textarea.value = '';
        }
    }else{
        alert('Cannot add player anymore');
    }
}

function nextPage(){
    document.querySelector('.container-1').style.display = 'none';
    document.querySelector('.container-2').style.display = 'block';

    //合計スコア用のテーブル
    let tableEl = document.createElement('table');
    tableEl.className = "table";
    let theadEl = tableEl.createTHead(); 
    let trEl = theadEl.insertRow();

    let cellIndexEl = document.createElement('th');
    cellIndexEl.scope = "row";
    cellIndexEl.appendChild(document.createTextNode('#'));
    trEl.appendChild(cellIndexEl);

    for(let key in UNO){

        let cellEl = document.createElement('th');
        cellEl.scope = "row";
        cellEl.appendChild(document.createTextNode(UNO[key]['name']));
        trEl.appendChild(cellEl);
    }

    let tbodyEl = tableEl.createTBody();
    tbodyEl.id = "table-body";
    let trBodyEl = tbodyEl.insertRow();

    //index: totalを追加
    let cellTotalIndexEl = document.createElement('th');
    cellTotalIndexEl.appendChild(document.createTextNode('Total Score'));
    trBodyEl.appendChild(cellTotalIndexEl);

    //playerの合計スコアを追加
    for(let key in UNO){
        let cellTotalEl = document.createElement('td');
        cellTotalEl.appendChild(document.createTextNode(UNO[key]['score']));
        trBodyEl.appendChild(cellTotalEl);
    }

    document.querySelector('#table').appendChild(tableEl);

    //勝者選択ボタン作成
    let select = document.querySelector('#winner');
    for(let key in UNO){
        let option = document.createElement('option');
        option.value = key;
        option.appendChild(document.createTextNode(UNO[key]['name']));
        select.appendChild(option);
    }

    //match-history用のテーブル作成
    let tableElm = document.createElement('table');
    tableElm.id = "match-history-table";
    tableElm.className = "table";
    let theadElm = tableElm.createTHead(); 
    let trElm = theadElm.insertRow();

    let cellIndexElm = document.createElement('th');
    cellIndexElm.scope = "row";
    cellIndexElm.appendChild(document.createTextNode('#'));
    trElm.appendChild(cellIndexElm);

    for(let key in UNO){

        let cellElm = document.createElement('th');
        cellElm.scope = "row";
        cellElm.appendChild(document.createTextNode(UNO[key]['name']));
        trElm.appendChild(cellElm);
    }
    document.querySelector('#match-history-table-div').appendChild(tableElm);
}

//勝者選択後のフォーム作成
function showForm(winner){
    
    playerWon = winner.value;
    let scoreForm = document.querySelector('#score-form-div');
    
    removeTag(scoreForm);

    //敗者用のフォーム作成
    copyUNO = {...UNO};
    let losers = removeKey(copyUNO, playerWon);

    for(let key in losers){
        let div = document.createElement('div');
        let label = document.createElement('label');
        label.className = "col-form-label";
        label.textContent = losers[key]['name'];
        div.appendChild(label);
    
        let input = document.createElement('input');
        input.setAttribute("type", "number");
        input.className = "form-control";
        input.placeholder = "points lost";
        input.id = key;
        div.appendChild(input);

        scoreForm.appendChild(div);
    }

    //勝者用のhiddenフォームを作成
    let winnerInput = document.createElement('input');
    winnerInput.setAttribute("type", "hidden");
    winnerInput.id = playerWon;
    winnerInput.value = 0;
    winnerInput.className = "winner";
    scoreForm.appendChild(winnerInput);

    //送信ボタンの作成
    document.querySelector('#match-data').style.display = 'block';
    document.querySelector('#match-data').addEventListener('click', storeData);
}

function removeKey(obj, key){

    delete obj[key];
    return obj;
}


let matchNumber = 0;

function storeData(){
    matchNumber++;
    let totalScore = 0;

    for(let key in UNO){
        let points = parseInt(document.querySelector(`#${key}`).value);
        UNO[key][`match${matchNumber}`] = -points;
        totalScore += points;
        document.querySelector(`#${key}`).value = '';
    }

    document.querySelector('.winner').value = 0;

    let winner = document.querySelector(".winner").id;
    UNO[winner][`match${matchNumber}`] = totalScore;

    for(let key in UNO){
        UNO[key]['score'] += UNO[key][`match${matchNumber}`];
    }

    console.log(totalScore);
    console.log(UNO);

    updateTotalScoreTable();
    updateMatchHistoryTable(matchNumber);


}

//Total Score tableの表示切り替え
function updateTotalScoreTable(){

    let tableBody = document.querySelector('#table-body');
    removeTag(tableBody);

    let trTotalScore = tableBody.insertRow();

    //index: totalを追加
    let cellTotalIndexEl = document.createElement('th');
    cellTotalIndexEl.appendChild(document.createTextNode('Total Score'));
    trTotalScore.appendChild(cellTotalIndexEl);

    //playerの合計スコアを追加
    for(let key in UNO){
        let cellTotalEl = document.createElement('td');
        cellTotalEl.appendChild(document.createTextNode(UNO[key]['score']));
        trTotalScore.appendChild(cellTotalEl);
    }

}

function removeTag(parent){
    while(parent.lastChild){
        parent.removeChild(parent.lastChild);
    }
}

//Match History tableに追加
function updateMatchHistoryTable(matchNumber){
    let table = document.querySelector('#match-history-table');

    let tbodyEl = table.createTBody();
    let trBodyEl = tbodyEl.insertRow();

    //index: match numberを追加
    let cellMatchNumberEl = document.createElement('th');
    cellMatchNumberEl.appendChild(document.createTextNode(matchNumber));
    trBodyEl.appendChild(cellMatchNumberEl);

    //各playerのスコアを表示
    for(let key in UNO){
        let cellEl = document.createElement('td');
        cellEl.appendChild(document.createTextNode(UNO[key][`match${matchNumber}`]));
        trBodyEl.appendChild(cellEl);
    }

}

function showMatchHistory(){
    if(displayTable.style.display === 'none'){
        displayTable.style.display = 'block';
    }else if(displayTable.style.display = 'block'){
        displayTable.style.display = 'none';
    }
}