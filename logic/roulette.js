
// General model containg logic for "spinning" a roulette wheel. 

function spin(array) {
  const randomNumber = getRandomNumber(array.length);
  return array[randomNumber];
}

function getRandomNumber(upperBound) {
  return Math.floor(Math.random() * upperBound);
}

module.exports.spin = array => spin(array);
