document.addEventListener("DOMContentLoaded", function () {
  const balanceElement = document.getElementById("balance");
  const spinButton = document.getElementById("spin-btn");
  const linesSelect = document.getElementById("lines");
  const betInput = document.getElementById("bet");
  const resultElement = document.getElementById("result");
  const playAgainButton = document.getElementById("play-again-btn");

  let balance = 0;

  function startGame() {
    balance = prompt("Please enter your initial balance:");
    balance = parseFloat(balance);

    if (isNaN(balance) || balance <= 0) {
      alert("Invalid initial balance. Please enter a valid amount.");
      startGame();
    } else {
      balanceElement.textContent = balance;
    }
  }

  startGame();

  spinButton.addEventListener("click", function () {
    const betPerLine = parseInt(betInput.value);
    const numberOfLines = parseInt(linesSelect.value);

    if (isNaN(betPerLine) || isNaN(numberOfLines)) {
      resultElement.textContent = "Please enter valid bet and lines.";
      return;
    }

    const totalBet = betPerLine * numberOfLines;

    if (totalBet > balance) {
      resultElement.textContent = "Insufficient balance.";
      return;
    }

    const reels = spin();
    displayReels(reels);
    const winnings = getWinnings(reels, betPerLine, numberOfLines);
    balance -= totalBet;

    const randomNum = Math.random();
    const losingRate = 0.75;
    const winningRate = 0.35;

    if (randomNum <= losingRate) {
      resultElement.textContent = "Sorry, you didn't win this time.";
    } else if (randomNum <= losingRate + winningRate) {
      balance += winnings;
      resultElement.textContent = "Congratulations! You won $" + winnings + ".";
    } else {
      resultElement.textContent = "You didn't win or lose anything.";
    }

    balanceElement.textContent = balance;

    if (balance <= 0) {
      resultElement.textContent = "You ran out of money!";
      spinButton.disabled = true;
      playAgainButton.style.display = "block";
    }
  });

  playAgainButton.addEventListener("click", function () {
    startGame();
    resultElement.textContent = "";
    spinButton.disabled = false;
    playAgainButton.style.display = "none";
  });

  function spin() {
    const symbols = ["A", "B", "C", "D"];
    const reels = [];

    for (let i = 0; i < 3; i++) {
      reels.push([]);
      for (let j = 0; j < 3; j++) {
        const randomIndex = Math.floor(Math.random() * symbols.length);
        reels[i].push(symbols[randomIndex]);
      }
    }

    return reels;
  }

  function displayReels(reels) {
    const reelElements = document.querySelectorAll(".reel");
    for (let i = 0; i < reels.length; i++) {
      reelElements[i].innerHTML = "";
      for (let j = 0; j < reels[i].length; j++) {
        const img = document.createElement("img");
        img.src = getImageUrl(reels[i][j]);
        reelElements[i].appendChild(img);
      }
    }
  }

  function getImageUrl(symbol) {
    return "https://via.placeholder.com/120x160.png?text=" + symbol;
  }

  function getWinnings(reels, betPerLine, numberOfLines) {
    const winningSymbols = ["A", "B", "C", "D"];
    let winnings = 0;

    for (let i = 0; i < numberOfLines; i++) {
      const symbols = reels[i];
      const uniqueSymbols = new Set(symbols);
      let matchingSymbols = 0;

      winningSymbols.forEach((symbol) => {
        if (uniqueSymbols.has(symbol)) {
          matchingSymbols++;
        }
      });

      winnings += matchingSymbols * betPerLine;
    }

    return winnings;
  }
});
