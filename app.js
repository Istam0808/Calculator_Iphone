// DOM Elements
const hourEl = document.querySelector('.hour');
const minuteEl = document.querySelector('.minute');
const valueEl = document.querySelector('.value');

const acEl = document.querySelector('.ac');
const pmEl = document.querySelector('.pm');
const percentEl = document.querySelector('.percent');

const additionEl = document.querySelector('.addition');
const subtractionEl = document.querySelector('.subtraction');
const multiplicationEl = document.querySelector('.multiplication');
const divisionEl = document.querySelector('.division');
const equalEl = document.querySelector('.equal');

const decimalEl = document.querySelector('.decimal');
const number0El = document.querySelector('.number-0');
const number1El = document.querySelector('.number-1');
const number2El = document.querySelector('.number-2');
const number3El = document.querySelector('.number-3');
const number4El = document.querySelector('.number-4');
const number5El = document.querySelector('.number-5');
const number6El = document.querySelector('.number-6');
const number7El = document.querySelector('.number-7');
const number8El = document.querySelector('.number-8');
const number9El = document.querySelector('.number-9');
const numberElArray = [
  number0El, number1El, number2El, number3El, number4El,
  number5El, number6El, number7El, number8El, number9El
];

const operatorElArray = [additionEl, subtractionEl, multiplicationEl, divisionEl];

// variables
let valueStrInMemory = null;
let operatorInMemory = null;
let waitingForNewValue = false;


// Functions
const getValueAsStr = () => valueEl.textContent.split(',').join('');

const getValueAsNum = () => {
  return parseFloat(getValueAsStr());
};

const setStrAsValue = (valueStr) => {
  if (valueStr[valueStr.length - 1] === '.') {
    valueEl.textContent += '.';
    return;
  }

  const [wholeNumStr, decimalStr] = valueStr.split('.');
  if (decimalStr) {
    valueEl.textContent =
      parseFloat(wholeNumStr).toLocaleString() + '.' + decimalStr;
  } else {
    valueEl.textContent = parseFloat(wholeNumStr).toLocaleString();
  }
  
  // Динамическое изменение размера шрифта для длинных чисел
  const displayLength = valueEl.textContent.length;
  if (window.innerWidth < 768) {
    // Мобильные устройства
    if (displayLength > 9) {
      valueEl.style.fontSize = '10vw';
    } else if (displayLength > 7) {
      valueEl.style.fontSize = '12vw';
    } else {
      valueEl.style.fontSize = '15vw';
    }
  } else {
    // Десктоп
    if (displayLength > 9) {
      valueEl.style.fontSize = '50px';
    } else if (displayLength > 7) {
      valueEl.style.fontSize = '65px';
    } else {
      valueEl.style.fontSize = '80px';
    }
  }
};

const clearActiveOperator = () => {
  operatorElArray.forEach(el => {
    if (el) el.classList.remove('active');
  });
};

const setActiveOperator = (operation) => {
  clearActiveOperator();
  if (operation === 'addition') additionEl.classList.add('active');
  else if (operation === 'subtraction') subtractionEl.classList.add('active');
  else if (operation === 'multiplication') multiplicationEl.classList.add('active');
  else if (operation === 'division') divisionEl.classList.add('active');
};

const handleNumberClick = (numStr) => {
  const currentValueStr = getValueAsStr();
  
  if (waitingForNewValue) {
    setStrAsValue(numStr);
    waitingForNewValue = false;
  } else if (currentValueStr === '0') {
    setStrAsValue(numStr);
  } else {
    setStrAsValue(currentValueStr + numStr);
  }
};

const getResultOfOperationAsStr = () => {
  const currentValueNum = getValueAsNum();
  const valueNumInMemory = parseFloat(valueStrInMemory);
  let newValueNum;
  
  if (operatorInMemory === 'addition') {
    newValueNum = valueNumInMemory + currentValueNum;
  } else if (operatorInMemory === 'subtraction') {
    newValueNum = valueNumInMemory - currentValueNum;
  } else if (operatorInMemory === 'multiplication') {
    newValueNum = valueNumInMemory * currentValueNum;
  } else if (operatorInMemory === 'division') {
    if (currentValueNum === 0) {
      return 'Error';
    }
    newValueNum = valueNumInMemory / currentValueNum;
  }

  return newValueNum.toString();
};

const handleOperatorClick = (operation) => {
  const currentValueStr = getValueAsStr();

  if (!valueStrInMemory) {
    valueStrInMemory = currentValueStr;
    operatorInMemory = operation;
    waitingForNewValue = true;
    setActiveOperator(operation);
    return;
  }
  
  if (!waitingForNewValue) {
    const result = getResultOfOperationAsStr();
    if (result === 'Error') {
      setStrAsValue('Error');
      valueStrInMemory = null;
      operatorInMemory = null;
      clearActiveOperator();
      waitingForNewValue = true;
      return;
    }
    valueStrInMemory = result;
    setStrAsValue(result);
  } else {
    valueStrInMemory = currentValueStr;
  }
  
  operatorInMemory = operation;
  waitingForNewValue = true;
  setActiveOperator(operation);
};




// Add Event Listeners to functions
acEl.addEventListener('click', () => {
  setStrAsValue('0');
  valueStrInMemory = null;
  operatorInMemory = null;
  waitingForNewValue = false;
  clearActiveOperator();
});
pmEl.addEventListener('click', () => {
  const currentValueNum = getValueAsNum();
  const currentValueStr = getValueAsStr();

  if (currentValueStr === '-0') {
    setStrAsValue('0');
    return;
  }
  if (currentValueNum >= 0) {
    setStrAsValue('-' + currentValueStr);
  } else {
    setStrAsValue(currentValueStr.substring(1));
  }
});
percentEl.addEventListener('click', () => {
  const currentValueNum = getValueAsNum();
  const newValueNum = currentValueNum / 100;
  setStrAsValue(newValueNum.toString());
  waitingForNewValue = false;
});


// add event listeners to operators
additionEl.addEventListener('click', () => {
  handleOperatorClick('addition');
});
subtractionEl.addEventListener('click', () => {
  handleOperatorClick('subtraction');
});
multiplicationEl.addEventListener('click', () => {
  handleOperatorClick('multiplication');
});
divisionEl.addEventListener('click', () => {
  handleOperatorClick('division');
});
equalEl.addEventListener('click', () => {
  if (valueStrInMemory && !waitingForNewValue) {
    const result = getResultOfOperationAsStr();
    if (result === 'Error') {
      setStrAsValue('Error');
    } else {
      setStrAsValue(result);
    }
    valueStrInMemory = null;
    operatorInMemory = null;
    waitingForNewValue = true;
    clearActiveOperator();
  }
});


// Add Event Listeners to numbers and decimal
for (let i=0; i < numberElArray.length; i++) {
  const numberEl = numberElArray[i];
  numberEl.addEventListener('click', () => {
    handleNumberClick(i.toString());
  });
}
decimalEl.addEventListener('click', () => {
  const currentValueStr = getValueAsStr();
  
  if (waitingForNewValue) {
    setStrAsValue('0.');
    waitingForNewValue = false;
  } else if (!currentValueStr.includes('.')) {
    setStrAsValue(currentValueStr + '.');
  }
});


// Set up the time
const updateTime = () => {
  const currentTime = new Date();

  let currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  if (currentHour > 12) {
    currentHour -= 12;
  }
  hourEl.textContent = currentHour.toString();
  minuteEl.textContent = currentMinute.toString().padStart(2, '0');
}
setInterval(updateTime, 1000);
updateTime();

