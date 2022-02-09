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
    console.log(gridSize);
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
    console.log(gameObj);
    return gameObj;
}

export { rowClues, colClues, gameArray, createGameObject };

// def col_clue_summer(answer):
//     ans_col_index = []
//     for col in range(0,len(answer)):
//         consecutive = 0
//         col_index = []
//         for i,row in enumerate(answer):
//             if row[col] == 1 and i+1 < len(answer):
//                 consecutive += 1
//             elif row[col] == 1 and i+1 == len(answer):
//                 consecutive += 1
//                 col_index.append(str(consecutive))
//                 break
//             elif row[col]==0 and consecutive==0:
//                 pass
//             else:
//                 col_index.append(str(consecutive))
//                 consecutive = 0
//         if col_index == []:
//             col_index = [' ']
//         ans_col_index.append(col_index)
//     return ans_col_index


// def clue_summer(answer):
//     # Row, if [index+1]==1, sum else, append & set zero
    
//     clue_row_index = row_clue_summer(answer)
//     clue_col_index = col_clue_summer(answer)
    
//     return clue_row_index, clue_col_index 

// def col_render(col_clues):
//     max_clue_length = 0
//     for clue in col_clues:
//         if len(clue) > max_clue_length:
//             max_clue_length = len(clue)       
    
//     for clue_row in range(0, max_clue_length):
//         print('\t    ', end='')
//         for col in range(0,len(answer)):
//             if len(col_clues[col]) == 0:
//                 print('   |',end = '')
//             if clue_row < len(col_clues[col]):
//                 print(f' {col_clues[col][clue_row-1]} |',end = '')
//             else:
//                 print('   |',end = '')
//         print('')