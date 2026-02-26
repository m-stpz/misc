/**
 * Functions to perform shortcuts operations
 */
var evalRPN = function (tokens) {
  const operators = new Set(["+", "-", "*", "/"]); // s: O(1)

  // t: O(n)
  for (let char of tokens) {
    // t: O(1)
    if (operators.has(char) && stack.length >= 2) {
      const firstElement = Number(stack.pop()); // t: O(1)
      const secondElement = Number(stack.pop());

      const result = calculateResult(firstElement, secondElement, char);
      stack.push(result); // t: O(1)
    } else {
      stack.push(char);
    }
  }
};

/*  */
// arimethcs, no increase time | space
function calculateResult(firstElement, secondElement, char) {
  switch (char) {
    case "+":
      return secondElement + firstElement;
    case "-":
      return secondElement - firstElement;
    case "*":
      return secondElement * firstElement;
    case "/":
      const result = secondElement / firstElement;

      if (result >= 0) {
        return Math.floor(result);
      } else {
        return Math.ceil(result);
      }
  }
}

evalRPN(["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]);
