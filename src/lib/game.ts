const rowClues = (answer: number[][]): string[][] => {
    
    let rowClueArray: string[][] = [];
    answer.forEach((row: number[]) => {
        let consecutive: number = 0;
        let rowIndex: string[] = [];
        row.forEach((cell: number, index: number) => {
            if ((cell === 1) && (index+1 < row.length)){
                consecutive += 1;
            } else if ((cell === 1) && (index+1 === row.length)){
                consecutive+=1;
                rowIndex.push(consecutive.toString());
                return;
            } else if ((cell === 0 || cell === 2) && (consecutive === 0)){
                // Pass
            } else {
                rowIndex.push(consecutive.toString())
                consecutive = 0;
            }
            if (!rowIndex.length) {
                rowIndex = [' ']
            }
        })   
        rowClueArray.push(rowIndex);        
    })

    if(rowClueArray.length === 0){
        rowClueArray.push([' '])
    }

    return rowClueArray;
}

const colClues = (answer: number[][]): string[][] => {

    let colClueArray: string[][] = [];
    for (let col in [...Array(answer.length).keys()]){
        let consecutive: number = 0;
        let colIndex: string[] = [];
        answer.forEach((row: string | any[], index: number) => {
            if ((row[col] === 1) && (index+1 < row.length)){
                consecutive += 1;
            } else if ((row[col] === 1) && (index+1 === row.length)){
                consecutive+=1;
                colIndex.push(consecutive.toString());
                return;
            } else if ((row[col] === 0) && (consecutive === 0)){
                // Pass
            } else if (consecutive !==0) {
                colIndex.push(consecutive.toString())
                consecutive = 0;
            } else {
                consecutive = 0;
            }
            if (!colIndex.length) {
                colIndex = [' ']
            }
        })
        while(colIndex.length < 4){
            colIndex.unshift('')
        }  
        colClueArray.push(colIndex); 
    } 

    if(colClueArray.length === 0){
        colClueArray.push([' '])
    }

    return colClueArray;
}

const gameArray = (answer: any[]) => {

    // Need value 
    const flatArr: number[] = [];
    answer.forEach((row: any[]) => {
        row.forEach((cell: number) => {
            if (cell===1){
                flatArr.push(1);
            } else if (cell===2){
                flatArr.push(2);
            } else if (cell === 0){
                flatArr.push(0);
            }

        })
    })
    // console.log(flatArr);
    return flatArr;
}

const maxColClueLength = (answer: any[]) => {
    let colClueArray = [];
    for (let col in [...Array(answer.length).keys()]){
        let consecutive = 0;
        let colIndex: string[] = [];
        answer.forEach((row: string | any[], index: number) => {
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
            if (!colIndex.length) {
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

const maxRowClueLength = (answer: any[]) => {
    let rowClueArray: any[][] = [];
    answer.forEach((row: any[]) => {
        let consecutive = 0;
        let rowIndex: string[] = [];
        row.forEach((cell: number, index: number) => {
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
            if (!rowIndex.length) {
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

const createGameObject = (answer: number[][]) => {
    const rowClue: string[][] = rowClues(answer);
    const colClue: string[][] = colClues(answer);
    const gameArr: number[] = gameArray(answer);
    const gridSize: number = answer.length + 2;
    const gameArrLength: number = gridSize*(gridSize-1)-1;
    let gameObj: any[] = [];
    let offsetter = 0;
    [...Array(gameArrLength+1).keys()].map((item, index: number) => {
        if(index === 0 || index === 1) {
          return gameObj.push('');
        } else if(Math.floor(index/gridSize) === 0){
            console.log(colClue[index-2])
            return gameObj.push(colClue[index-2])
        } else if(index%gridSize === 0){
            return gameObj.push(rowClue[index/gridSize-1])
        } else if(index%gridSize === 1){
            offsetter+=2;
            return gameObj.push('')
        } else {
            return gameObj.push(gameArr[index-(gridSize)-offsetter])
        }
    })
    console.log(gameObj)
    return gameObj;
}

export { maxRowClueLength, maxColClueLength, gameArray, createGameObject };