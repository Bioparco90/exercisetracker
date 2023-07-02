// if (new Date('pippo') === 'Invalid Date') console.log('Hey');
// else console.log('error');

const date = "22-11-1990";
let checkedDate;

if (isNaN(Date.parse(date))) {
  checkedDate = new Date().toDateString();
} else {
  checkedDate = new Date(date).toDateString();
}

console.log(checkedDate);