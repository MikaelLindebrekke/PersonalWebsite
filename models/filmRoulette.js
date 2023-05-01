
function spin(allFilms) {
  try {
    const randomNumber = getRandomNumber(allFilms.length);
    return allFilms[randomNumber];
  } catch {
    console.log('Failed to get films.');
  }
}

function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}


exports.spin = allFilms => spin(allFilms);
