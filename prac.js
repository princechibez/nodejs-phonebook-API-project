async function tester() {
    const numbers = {
        one: 1,
        two: 2,
        three: 3,
    };
    let arrFromObj = Object.entries(numbers)
    
    let objFromArr = Object.fromEntries(arrFromObj)
    console.log(arrFromObj)
    console.log(objFromArr)
    console.log(newObj)
}

tester()