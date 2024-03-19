/* 
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * Lab 1 - Exercise 0 - 2024
 */

function resizeString(str) {
    let newStr;
    if(str.length < 2)
        newStr = "";
    else 
        newStr =  str.substring(0,2) + str.substring(str.length -2,  str.length);
    return newStr;
}

const words = ["spring", "summer", "a", "ab", "abc", "autumn", "winter", "Web App"];
console.log("Orginal set of strings: ", words)

console.log("***Formatted strings***")
for(let i=0; i< words.length; i ++) {
    let str = resizeString(words[i]);
    console.log(str);  // Printing one string per line
}
