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


(function () {

  let playerId;
  let playerRef;
  let players = {};
  let playerElements = {};
  let coins = {};
  let coinElements = {};
  let item;
  let movementSpeed;
  const shadesCost = 30;
  var hasShades = 0;

  const gameContainer = document.querySelector(".game-container");
  const playerNameInput = document.querySelector("#player-name");
  const playerNameButton = document.querySelector("#player-name-button");
  // Chat Input & Button
  const playerChatInput = document.querySelector("#player-chat-text");
  const playerChatButton = document.querySelector("#player-chat-button");
  //costumization stuff
  const playerItemButton = document. querySelector("#player-item-button");

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

  function startChat() {
    setTimeout(() => {
      playerRef.update({
        chat_text: ""
      })
    }, 8000);
  }

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
/*

*** START OF GRABBING AND USING ITEMS BRANCH

*/

  function useRedCube(){
    console.log("THE RED CUBE HAS BEEN USED!!!");
  }

//
  function useItem() {
    if(players[playerId].item === "red_cube") {
      useRedCube();
    }
/* TEMPLATE FOR ADDING ITEMS
    if(item === "item tag"){
      useItemFunction(); //Implement above
    }
*/
    playerRef.update({
      item: "nothing",
    })
  }

  function grabItem(item_tag) {
    playerRef.update({
      item: item_tag,
    })
  }

  //Dixon interaction placeholder function
  function useDixon() {
    if(players[playerId].coins >= 2){
      playerRef.update({
        coins: players[playerId].coins - 2,
      })
      grabItem("red_cube");
      console.log("Item Grabbed!")
    }
  }

  //Interacting with shops
  function attemptUseShop(x, y) {
    const key = getKeyString(x, y);
    if(key === '5x4') {
      useDixon();
    }
/* TEMPLATE FOR ADDING BUILDINGS/SHOPS
    if(key === 'building location') {
      useBuildingFunction(); //Implement above
    }
*/
  }
  /*
  
  *** END OF GRABBING AND USING ITEMS BRANCH
  
  */
  function handleArrowPress(xChange = 0, yChange = 0) {
    const newX = players[playerId].x + xChange;
    const newY = players[playerId].y + yChange;
    var movementTimerEnd = new Date();
    if (!isSolid(newX, newY) && (movementTimerEnd - movementTimerStart) >= 250 * players[playerId].movementSpeed) {
      //move to the next space
      players[playerId].x = newX;
      players[playerId].y = newY;
      if (xChange === 1) {
        players[playerId].direction = "right";
      }
      if (xChange === -1) {
        players[playerId].direction = "left";
      }
      //check for beaverstore positioning
      var itemButton = document.getElementById("player-item-button");
      if ((players[playerId].y >= 4 && players[playerId].y <=5) && (players[playerId].x >= 19 && players[playerId].y <=24)) {
        itemButton.classList.remove("hidden");
      } else {
        itemButton.classList.add("hidden");
      }
      //console.log("== x: ", players[playerId].x);
      //console.log("== y: ", players[playerId].y);
      playerRef.set(players[playerId]);
      attemptGrabCoin(newX, newY);
      attemptUseShop(newX, newY);
      movementTimerStart = new Date();
    }
  }


  function initGame() {

    new KeyPressListener("ArrowUp", () => handleArrowPress(0, -1))
    new KeyPressListener("ArrowDown", () => handleArrowPress(0, 1))
    new KeyPressListener("ArrowLeft", () => handleArrowPress(-1, 0))
    new KeyPressListener("ArrowRight", () => handleArrowPress(1, 0))
    new KeyPressListener("ShiftRight", () => useItem())

    const allPlayersRef = firebase.database().ref(`players`);
    const allCoinsRef = firebase.database().ref(`coins`);

    allPlayersRef.on("value", (snapshot) => {
      //Fires whenever a change occurs
      players = snapshot.val() || {};
      Object.keys(players).forEach((key) => {
        const characterState = players[key];
        let el = playerElements[key];
        // Now update the DOM
        el.querySelector(".Character_name").innerText = characterState.name;
        el.querySelector(".Character_coins").innerText = characterState.coins;
        el.setAttribute("data-direction", characterState.direction);
        el.querySelector(".Character_hand").classList.replace(el.querySelector(".Character_hand").classList.item(2), characterState.item);
        let chatBubble = el.querySelector("#chat-bubble");
        let chatBox = document.getElementById('chat-box')
        if (characterState.chat_text === "") {
          chatBubble.style.display = "none";
        } else {
          // el.appendChild(getChatBubbleElement(characterState.chat_text));
          chatBubble.style.display = "block";
          chatBubble.innerText = characterState.chat_text;
          addChat(characterState.name+ ":" +characterState.chat_text)
          chatBox.scrollBy(0, 20)
        }

        const left = 16 * characterState.x + "px";
        const top = 16 * characterState.y - 4 + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
        
        var shades_sp = el.querySelector(".Character_shades_sprite");
        if(characterState.hasShades == 1) {
          shades_sp.classList.remove("hidden");
          //el.style.animation = "none";
          setTimeout(function() {
            //el.style.animation ="ghostFloat 1.5s linear infinite alternate-reverse";
          },1);
        } else {
          shades_sp.classList.add("hidden");
        }
      })
    })
    allPlayersRef.on("child_added", (snapshot) => {
      //Fires whenever a new node is added the tree
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

      //Fill in some initial state
      characterElement.querySelector(".Character_name").innerText = addedPlayer.name;
      characterElement.querySelector(".Character_coins").innerText = addedPlayer.coins;
      characterElement.setAttribute("data-direction", addedPlayer.direction);
      const left = 16 * addedPlayer.x + "px";
      const top = 16 * addedPlayer.y - 4 + "px";
      characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;
      gameContainer.appendChild(characterElement);
    })


    //Remove character DOM element after they leave
    allPlayersRef.on("child_removed", (snapshot) => {
      const removedKey = snapshot.val().id;
      gameContainer.removeChild(playerElements[removedKey]);
      delete playerElements[removedKey];
    })


    //New - not in the video!
    //This block will remove coins from local state when Firebase `coins` value updates
    allCoinsRef.on("value", (snapshot) => {
      coins = snapshot.val() || {};
    });
    //

    allCoinsRef.on("child_added", (snapshot) => {
      const coin = snapshot.val();
      const key = getKeyString(coin.x, coin.y);
      coins[key] = true;

      // Create the DOM Element
      const coinElement = document.createElement("div");
      coinElement.classList.add("Coin", "grid-cell");
      coinElement.innerHTML = `
        <div class="Coin_shadow grid-cell"></div>
        <div class="Coin_sprite grid-cell"></div>
      `;

      // Position the Element
      const left = 16 * coin.x + "px";
      const top = 16 * coin.y - 4 + "px";
      coinElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      // Keep a reference for removal later and add to DOM
      coinElements[key] = coinElement;
      gameContainer.appendChild(coinElement);
    })
    allCoinsRef.on("child_removed", (snapshot) => {
      const { x, y } = snapshot.val();
      const keyToRemove = getKeyString(x, y);
      gameContainer.removeChild(coinElements[keyToRemove]);
      delete coinElements[keyToRemove];
    })


    //Updates player name with text input
    playerNameInput.addEventListener("change", (e) => {
      const newName = e.target.value || createName();
      playerNameInput.value = newName;
      playerRef.update({
        name: newName
      })
    })

    //Update player name on button click
    playerNameButton.addEventListener("click", () => {
      const newName = e.target.value || createName();
      playerNameInput.value = newName;
      playerRef.update({
        name: newName
      })
    })

    //update player item costumization
    playerItemButton.addEventListener("click", () => {
      var player_sprite = document.getElementsByClassName('Character_sprite');
      var player = playerElements[playerId];
      var shades = document.getElementsByClassName("Character_shades_sprite");
      var oc = parseInt(player.querySelector('.Character_coins').innerText);
      //toggle shades sprites
      if(hasShades == 0) {
        if(oc >= shadesCost) { //buy shades
          shades[0].classList.remove("hidden");
          hasShades = 1;
          player_sprite[0].style.animation = "none";
          setTimeout(function() {
            player_sprite[0].style.animation ="ghostFloat 1.5s linear infinite alternate-reverse";
          },1);
          //change database data
          playerRef.update({
            hasShades : 1,
            coins: players[playerId].coins - shadesCost,
          })
        }
      } else {
        shades[0].classList.add("hidden");
        hasShades = 0;
        playerRef.update({
          hasShades : 0,
        })
      }
    })

    //Update player chat bubble on button click
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

  function addChat(text) {
    var chatBox = document.getElementById('chat-box')
    var newChat = document.createElement('p1')
    newChat.className = 'chatbox-text'
    newChat.textContent = text;
    chatBox.appendChild(newChat)
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

