//Create game object
// Want to take answer array and turn it into a game object to render and use

const rowClues = (answer) => {
    let rowClueArray = [];
    answer.forEach(row => {
        let consecutive = 0;
        let rowIndex = [];
        row.forEach((cell, index) => {
            if ((cell === 1) && (index+1 < row.length)){
                consecutive += 1;
            } else if ((cell === 1) && (index+1 === row.length)){
                consecutive+=1;
                rowIndex.push(consecutive.toString());
                return;
            } else if ((cell === 0) && (consecutive === 0)){
                // Pass
            } else {
                rowIndex.push(consecutive.toString())
                consecutive = 0;
            }
            if (rowIndex === []) {
                rowIndex = [' ']
            }
        })   
        rowClueArray.push(rowIndex);        
    })
    return rowClueArray;
}

const colClues = (answer) => {
    let colClueArray = [];
    for (let col in [...Array(answer.length).keys()]){
        let consecutive = 0;
        let colIndex = [];
        answer.forEach((row, index) => {
            if ((row[col] === 1) && (index+1 < row.length)){
                consecutive += 1;
            } else if ((row[col] === 1) && (index+1 === row.length)){
                consecutive+=1;
                colIndex.push(consecutive.toString());
                return;
            } else if ((row[col] === 0) && (consecutive === 0)){
                // Pass
            } else {
                colIndex.push(consecutive.toString())
                consecutive = 0;
            }
            if (colIndex === []) {
                colIndex = [' ']
            }
        })
        while(colIndex.length < 4){
            colIndex.unshift('')
        }  
        colClueArray.push(colIndex); 
    } 
    return colClueArray;
}

const gameArray = (answer) => {
    // Need value 
    const flatArr = [];
    answer.forEach(row => {
        row.forEach(cell => {
            if (cell===1){
                flatArr.push(true);
            } else {
                flatArr.push(false);
            }

        })
    })
    // console.log(flatArr);
    return flatArr;
}

const createGameObject = (answer) => {
    const rowClue = rowClues(answer);
    const colClue = colClues(answer);
    const gameArr = gameArray(answer);
    const gridSize = answer.length + 2;
    const gameArrLength = gridSize*(gridSize-1)-1;
    let gameObj = [];
    let offsetter = 0;
    [...Array(gameArrLength+1).keys()].map((item, index) => {
        if(index === 0 || index === 1) {
          gameObj.push('');
        } else if(parseInt(index/gridSize) === 0){
            gameObj.push(colClue[index-2])
        } else if(index%gridSize === 0){
            gameObj.push(rowClue[parseInt(index/gridSize)-1])
        } else if(index%gridSize === 1){
            gameObj.push('')
            offsetter+=2;
        } else {
            gameObj.push(gameArr[index-(gridSize)-offsetter])
        }
    })
    return gameObj;
}

const maxColClueLength = (answer) => {
    let colClueArray = [];
    for (let col in [...Array(answer.length).keys()]){
        let consecutive = 0;
        let colIndex = [];
        answer.forEach((row, index) => {
            if ((row[col] === 1) && (index+1 < row.length)){
                consecutive += 1;
            } else if ((row[col] === 1) && (index+1 === row.length)){
                consecutive+=1;
                colIndex.push(consecutive.toString());
                return;
            } else if ((row[col] === 0) && (consecutive === 0)){
                // Pass
            } else {
                colIndex.push(consecutive.toString())
                consecutive = 0;
            }
            if (colIndex === []) {
                colIndex = [' ']
            }
        })
        colClueArray.push(colIndex); 
    } 

    let maxClueLength = 0;
    colClueArray.forEach(clues => {
       if(clues.length > maxClueLength){
        maxClueLength = clues.length
       }
    })

    return maxClueLength;
}

const maxRowClueLength = (answer) => {
    let rowClueArray = [];
    answer.forEach(row => {
        let consecutive = 0;
        let rowIndex = [];
        row.forEach((cell, index) => {
            if ((cell === 1) && (index+1 < row.length)){
                consecutive += 1;
            } else if ((cell === 1) && (index+1 === row.length)){
                consecutive+=1;
                rowIndex.push(consecutive.toString());
                return;
            } else if ((cell === 0) && (consecutive === 0)){
                // Pass
            } else {
                rowIndex.push(consecutive.toString())
                consecutive = 0;
            }
            if (rowIndex === []) {
                rowIndex = [' ']
            }
        })   
        rowClueArray.push(rowIndex);        
    })

    let maxClueLength = 0;
    rowClueArray.forEach(clues => {
       if(clues.length > maxClueLength){
        maxClueLength = clues.length
       }
    })

    return maxClueLength;
}

export { maxRowClueLength, maxColClueLength, gameArray, createGameObject };