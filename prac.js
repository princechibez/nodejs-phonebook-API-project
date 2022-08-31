const findTwoThatSum = (number) => {
    let numberList = [1, 3, 2, 4, 5, 6, 8, 12, 9, 7, 3];
    let theTwoNumbers = [];
    numberList.forEach((num, index) => {
        for (const currentNum of numberList) {
            if (currentNum === num) continue
            if ((currentNum + num) === number) {
                theTwoNumbers.push([numberList.indexOf(currentNum), index])
            }
        }
    })
    if(theTwoNumbers.length === 0) {
        theTwoNumbers = [-1, -1]
        return console.log({
            allMatches: "No matches",
            selectedMatch: theTwoNumbers
        })
    }
    const randomSelector = Math.floor(Math.random() * theTwoNumbers.length)
    return console.log({
        indicesOfAllMatches: theTwoNumbers,
        selectedMatch: theTwoNumbers[randomSelector]
    })
}

findTwoThatSum(10)