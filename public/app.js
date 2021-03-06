var movementTimerStart = new Date();

const mapData = {
  minX: 2,
  maxX: 26,
  minY: 4,
  maxY: 12,
  blockedSpaces: {
    "2x4": true,
    "5x10": true,
    "5x7": true,
    "3x11": true,
    "8x11": true,
    "11x7": true,
    "11x10": true,
    "16x7": true,
    "16x10": true,
    "19x11": true,
    "22x7": true,
    "22x10": true,
    "24x11": true,
    "25x4": true
  },
};


//Misc Helpers
function randomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function getKeyString(x, y) {
  return `${x}x${y}`;
}

function createName() {
  const prefix = randomFromArray([
    "COOL",
    "SUPER",
    "HIP",
    "SMUG",
    "COOL",
    "SILKY",
    "GOOD",
    "SAFE",
    "DEAR",
    "DAMP",
    "WARM",
    "RICH",
    "LONG",
    "DARK",
    "SOFT",
    "BUFF",
    "DOPE",
  ]);
  const animal = randomFromArray([
    "BEAR",
    "DOG",
    "CAT",
    "FOX",
    "LAMB",
    "LION",
    "BOAR",
    "GOAT",
    "VOLE",
    "SEAL",
    "PUMA",
    "MULE",
    "BULL",
    "BIRD",
    "BUG",
  ]);
  return `${prefix} ${animal}`;
}

function isSolid(x, y) {

  const blockedNextSpace = mapData.blockedSpaces[getKeyString(x, y)];
  return (
    blockedNextSpace ||
    x >= mapData.maxX ||
    x < mapData.minX ||
    y >= mapData.maxY ||
    y < mapData.minY
  )
}

function getRandomSafeSpot() {
  //We don't look things up by key here, so just return an x/y
  return randomFromArray([
    { x: 2, y: 6 },
    { x: 2, y: 9 },
    { x: 4, y: 8 },
    { x: 5, y: 5 },
    { x: 5, y: 8 },
    { x: 5, y: 11 },
    { x: 12, y: 7 },
    { x: 12, y: 11 },
    { x: 16, y: 11 },
    { x: 18, y: 9 },
    { x: 19, y: 10 },
    { x: 21, y: 5 },
    { x: 25, y: 8 },
    { x: 19, y: 7 },
    { x: 13, y: 7 },
    { x: 13, y: 6 },
    { x: 13, y: 8 },
    { x: 16, y: 8 },
    { x: 16, y: 6 },
    { x: 17, y: 6 },
    { x: 21, y: 6 },
    { x: 7, y: 6 },
    { x: 14, y: 4 },
    { x: 19, y: 4 },
    { x: 23, y: 4 },
    { x: 24, y: 9 },
    { x: 22, y: 11 },
    { x: 24, y: 6 },
    { x: 14, y: 9 },
    { x: 21, y: 8 },
    { x: 7, y: 7 },
    { x: 7, y: 8 },
    { x: 8, y: 8 },
    { x: 10, y: 8 },
    { x: 8, y: 8 },
    { x: 11, y: 4 },
  ]);
}

function cleanChildren(node) {// cleans children of a node from random #text from html-styling
  node.childNodes.forEach(function (x) {
      if (x.nodeName == '#text') {
          node.removeChild(x)
      }
  })
}

(function () {
  // Firebase variables
  let playerId;
  let playerRef;
  let players = {};
  let playerElements = {};
  let coins = {};
  let coinElements = {};
  let item;
  let movementSpeed;
  let hasShades = 0;
  // Constants
  const coffeeCost = 5;
  const teaCost = 2;
  const chowmeinCost = 8;
  const friedRiceCost = 8;
  const shadesCost = 15;

  const gameContainer = document.querySelector(".game-container");
  const playerNameInput = document.querySelector("#player-name");
  const playerNameButton = document.querySelector("#player-name-button");
  // Chat input & button
  const playerChatInput = document.querySelector("#player-chat-text");
  const playerChatButton = document.querySelector("#player-chat-button");
  // Store buttons
  const coffeeButton = document.querySelector("#coffee-button");
  const teaButton = document.querySelector("#tea-button");
  const chowmeinButton = document.querySelector("#chowmein-button");
  const friedRiceButton = document.querySelector("#fried-rice-button");
  const shadesButton = document.querySelector("#shades-button");
  //Generates coins
  function placeCoin() {
    const { x, y } = getRandomSafeSpot();
    const coinRef = firebase.database().ref(`coins/${getKeyString(x, y)}`);
    coinRef.set({
      x,
      y,
    })
    const coinTimeouts = [2000, 3000, 4000, 5000];
    setTimeout(() => {
      placeCoin();
    }, randomFromArray(coinTimeouts));
  }
  //Adds chat to chat log
  function addChat(text) {
    var chatBox = document.getElementById('chat-box')
    var newChat = document.createElement('p1')
    newChat.className = 'chatbox-text'
    newChat.textContent = text;
    chatBox.appendChild(newChat)
  }

  function checkChat(text) {
    var result = true
    var chatBox = document.getElementById('chat-box')
    cleanChildren(chatBox)
    var previousChat = chatBox.lastChild
    var previousChatText = chatBox.lastChild.textContent

    for (var i = 0; i < 4; i++) {
      if (text == previousChatText) {
        result = false;
      }
      else {
        previousChat = previousChat.previousSibling
        if (!previousChat) {// if there isn't a previous child, cuts for loop
          break
        }
        previousChatText = previousChat.textContent

        
      }
    }

    return result
  }

  // Clears chat after 8 seconds
  function startChat() {
    setTimeout(() => {
      playerRef.update({
        chat_text: ""
      })
    }, 8000);
  }
  // Checks if player can grab a coin
  function attemptGrabCoin(x, y) {
    const key = getKeyString(x, y);
    if (coins[key]) {
      // Remove this key from data, then uptick Player's coin count
      firebase.database().ref(`coins/${key}`).remove();
      playerRef.update({
        coins: players[playerId].coins + 1,
      })
    }
  }
  // Coffee effects
  function useCoffee() {
    playerRef.update({
      movementSpeed: players[playerId].movementSpeed * 2,
      chat_text: "COFFEE!!!",
    })
    startChat();
  }
  // Tea effects
  function useTea() {
    playerRef.update({
      movementSpeed: 1,
      chat_text: "ahh, tea...",
    })
    startChat();
  }
  // Chowmein effects
  function useChowmein() {
    playerRef.update({
      chat_text: "yummy, chowmein",
    })
    startChat();
  }
  // Fried rice effects
  function useFriedRice() {
    playerRef.update({
      chat_text: "yummy, rice",
    })
    startChat();
  }
  // Checks what item is being used
  function useItem() {
    if (players[playerId].item === "coffee") {
      useCoffee();
    }
    if (players[playerId].item === "tea") {
      useTea();
    }
    if (players[playerId].item === "chowmein") {
      useChowmein();
    }
    if (players[playerId].item === "fried-rice") {
      useFriedRice();
    }
    playerRef.update({
      item: "nothing",
    })
  }
  // Grabs an item
  function grabItem(item_tag) {
    playerRef.update({
      item: item_tag,
    })
  }
  // Interacting with shops
  function attemptUseShop(x, y) {
    if ((players[playerId].y >= 4 && players[playerId].y <= 5) && (players[playerId].x >= 3 && players[playerId].x <= 7)) {
      coffeeButton.classList.remove("hidden");
      teaButton.classList.remove("hidden");
    } else {
      coffeeButton.classList.add("hidden");
      teaButton.classList.add("hidden");
    }
    if ((players[playerId].y >= 4 && players[playerId].y <= 5) && (players[playerId].x >= 11 && players[playerId].x <= 15)) {
      chowmeinButton.classList.remove("hidden");
      friedRiceButton.classList.remove("hidden");
    } else {
      chowmeinButton.classList.add("hidden");
      friedRiceButton.classList.add("hidden");
    }
    if ((players[playerId].y >= 4 && players[playerId].y <= 5) && (players[playerId].x >= 19 && players[playerId].x <= 24)) {
      shadesButton.classList.remove("hidden");
    } else {
      shadesButton.classList.add("hidden");
    }
  }
  // Handles movement
  function handleArrowPress(xChange = 0, yChange = 0) {
    const newX = players[playerId].x + xChange;
    const newY = players[playerId].y + yChange;
    var movementTimerEnd = new Date();
    if (!isSolid(newX, newY) && (movementTimerEnd - movementTimerStart) * players[playerId].movementSpeed >= 250) {
      //move to the next space
      players[playerId].x = newX;
      players[playerId].y = newY;
      if (xChange === 1) {
        players[playerId].direction = "right";
      }
      if (xChange === -1) {
        players[playerId].direction = "left";
      }
      //console.log("== x: ", players[playerId].x);
      //console.log("== y: ", players[playerId].y);
      playerRef.set(players[playerId]);
      attemptGrabCoin(newX, newY);
      attemptUseShop(newX, newY);
      movementTimerStart = new Date();
    }
  }

  function getTime() {
    var now = new Date()
    var time = '[' + now.getHours() + ":" + now.getMinutes() + '] '
    return time
  }

  function initGame() {
    // Watches for user input
    new KeyPressListener("ArrowUp", () => handleArrowPress(0, -1))
    new KeyPressListener("ArrowDown", () => handleArrowPress(0, 1))
    new KeyPressListener("ArrowLeft", () => handleArrowPress(-1, 0))
    new KeyPressListener("ArrowRight", () => handleArrowPress(1, 0))
    new KeyPressListener("ShiftRight", () => useItem())

    const allPlayersRef = firebase.database().ref(`players`);
    const allCoinsRef = firebase.database().ref(`coins`);
    // Updates the clients document to show database data
    allPlayersRef.on("value", (snapshot) => {
      players = snapshot.val() || {};
      Object.keys(players).forEach((key) => {
        const characterState = players[key];
        let el = playerElements[key];
        el.querySelector(".Character_name").innerText = characterState.name;
        el.querySelector(".Character_coins").innerText = characterState.coins;
        el.setAttribute("data-direction", characterState.direction);
        el.querySelector(".Character_hand").classList.replace(el.querySelector(".Character_hand").classList.item(2), characterState.item);
        let chatBubble = el.querySelector("#chat-bubble");
        if (characterState.chat_text === "") {
          chatBubble.style.display = "none";
        } else {
          // el.appendChild(getChatBubbleElement(characterState.chat_text));
          chatBubble.style.display = "block";
          chatBubble.innerText = characterState.chat_text;
          var chatText = getTime() + characterState.name + " : " + characterState.chat_text
          if (checkChat(chatText)) {
            addChat(chatText)
            chatBox.scrollBy(0, 20)
          }
        }

        const left = 16 * characterState.x + "px";
        const top = 16 * characterState.y - 4 + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;

        var shades_sp = el.querySelector(".Character_shades_sprite");
        if (characterState.hasShades == 1) {
          shades_sp.classList.remove("hidden");
          //el.style.animation = "none";
          setTimeout(function () {
            //el.style.animation ="ghostFloat 1.5s linear infinite alternate-reverse";
          }, 1);
        } else {
          shades_sp.classList.add("hidden");
        }
      })
    })
    // Handles a new player joining the game
    allPlayersRef.on("child_added", (snapshot) => {
      const addedPlayer = snapshot.val();
      const characterElement = document.createElement("div");
      characterElement.classList.add("Character", "grid-cell");
      if (addedPlayer.id === playerId) {
        characterElement.classList.add("you");
      }
      characterElement.innerHTML = (`
        <div class="Character_shadow grid-cell"></div>
        <div class="Character_sprite grid-cell"></div>
        <div id="cool" class="Character_shades_sprite grid-cell hidden"></div>
        <div class="Character_name-container">
          <span class="Character_name"></span>
          <span class="Character_coins">0</span>
        </div>
        <div class="Character_hand grid-cell nothing"></div>
        <div class="Character_you-arrow"></div>
        <div id="chat-bubble" class="bubble bubble-bottom-left" style="display: none;"></div>
      `);
      playerElements[addedPlayer.id] = characterElement;

      characterElement.querySelector(".Character_name").innerText = addedPlayer.name;
      characterElement.querySelector(".Character_coins").innerText = addedPlayer.coins;
      characterElement.setAttribute("data-direction", addedPlayer.direction);
      const left = 16 * addedPlayer.x + "px";
      const top = 16 * addedPlayer.y - 4 + "px";
      characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;
      gameContainer.appendChild(characterElement);
    })
    // Hanldes a player leaving the game
    allPlayersRef.on("child_removed", (snapshot) => {
      const removedKey = snapshot.val().id;
      gameContainer.removeChild(playerElements[removedKey]);
      delete playerElements[removedKey];
    })
    // Removes coins from local state when Firebase `coins` value updates
    allCoinsRef.on("value", (snapshot) => {
      coins = snapshot.val() || {};
    });

    allCoinsRef.on("child_added", (snapshot) => {
      const coin = snapshot.val();
      const key = getKeyString(coin.x, coin.y);
      coins[key] = true;

      // Creates the coins for the client
      const coinElement = document.createElement("div");
      coinElement.classList.add("Coin", "grid-cell");
      coinElement.innerHTML = `
        <div class="Coin_shadow grid-cell"></div>
        <div class="Coin_sprite grid-cell"></div>
      `;

      // Positions the Element
      const left = 16 * coin.x + "px";
      const top = 16 * coin.y - 4 + "px";
      coinElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      // Keeps a reference for removal later and add to DOM
      coinElements[key] = coinElement;
      gameContainer.appendChild(coinElement);
    })
    allCoinsRef.on("child_removed", (snapshot) => {
      const { x, y } = snapshot.val();
      const keyToRemove = getKeyString(x, y);
      gameContainer.removeChild(coinElements[keyToRemove]);
      delete coinElements[keyToRemove];
    })


    // Updates player name with text input
    playerNameInput.addEventListener("change", (e) => {
      const newName = e.target.value || createName();
      playerNameInput.value = newName;
      playerRef.update({
        name: newName
      })
    })

    // Updates player name on button click
    playerNameButton.addEventListener("click", () => {
      const newName = e.target.value || createName();
      playerNameInput.value = newName;
      playerRef.update({
        name: newName
      })
    })
    // Purchase coffee button
    coffeeButton.addEventListener("click", () => {
      if (players[playerId].coins >= coffeeCost) {
        playerRef.update({
          coins: players[playerId].coins - coffeeCost,
        })
        grabItem("coffee");
      }
    })
    // Purchase tea button
    teaButton.addEventListener("click", () => {
      if (players[playerId].coins >= teaCost) {
        playerRef.update({
          coins: players[playerId].coins - teaCost,
        })
        grabItem("tea");
      }
    })
    // Purchase chowmein button
    chowmeinButton.addEventListener("click", () => {
      if (players[playerId].coins >= chowmeinCost) {
        playerRef.update({
          coins: players[playerId].coins - chowmeinCost,
        })
        grabItem("chowmein");
      }
    })
    // Purchase fried rice button
    friedRiceButton.addEventListener("click", () => {
      if (players[playerId].coins >= friedRiceCost) {
        playerRef.update({
          coins: players[playerId].coins - friedRiceCost,
        })
        grabItem("fried-rice");
      }
    })
    // Purchase shades button
    shadesButton.addEventListener("click", () => {
      var player_sprite = document.getElementsByClassName('Character_sprite');
      var player = playerElements[playerId];
      var shades = document.getElementsByClassName("Character_shades_sprite");
      var oc = parseInt(player.querySelector('.Character_coins').innerText);
      // Toggles shades sprites
      if (hasShades == 0) {
        if (oc >= shadesCost) { //Buy shades
          shades[0].classList.remove("hidden");
          hasShades = 1;
          player_sprite[0].style.animation = "none";
          setTimeout(function () {
            player_sprite[0].style.animation = "ghostFloat 1.5s linear infinite alternate-reverse";
          }, 1);
          //Change database data
          playerRef.update({
            hasShades: 1,
            coins: players[playerId].coins - shadesCost,
          })
        }
      } else {
        shades[0].classList.add("hidden");
        hasShades = 0;
        playerRef.update({
          hasShades: 0,
        })
      }
    })

    // Update player chat bubble on button click
    playerChatButton.addEventListener("click", () => {
      sendChat();
    })

    playerChatInput.addEventListener("keypress", function (event) {
      // If the user presses the "Enter" key on the keyboard
      if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        playerChatButton.click();
      }
    });
    //Place my first coin
    placeCoin();

  }
  function sendChat() {
    playerRef.update({
      chat_text: playerChatInput.value
    })
    playerChatInput.value = "";
    //Start chat timeout
    startChat();
  }

  firebase.auth().onAuthStateChanged((user) => {
    console.log(user)
    if (user) {
      //You're logged in!
      playerId = user.uid;
      playerRef = firebase.database().ref(`players/${playerId}`);

      const name = createName();
      const chat_text = "";
      playerNameInput.value = name;

      const { x, y } = getRandomSafeSpot();


      playerRef.set({
        id: playerId,
        name,
        direction: "right",
        x,
        y,
        coins: 0,
        chat_text,
        item: "nothing",
        movementSpeed: 1,
        hasShades: 0,
      })

      //Remove me from Firebase when I diconnect
      playerRef.onDisconnect().remove();

      //Begin the game now that we are signed in
      initGame();
    } else {
      //You're logged out.
    }
  })

  firebase.auth().signInAnonymously().catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    console.log(errorCode, errorMessage);
  });


})();

