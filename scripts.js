//dom variables for hud
let playerHp = document.getElementById("playerHp");
let playerRam = document.getElementById("playerRam");
let btc = document.getElementById("btc");
let enemyHp = document.getElementById("enemyHp");
const actionText = document.getElementById("actionText");
const playerName = document.getElementById("playerName");
const enemyName = document.getElementById("enemyName");
const gameOverContainer = document.getElementById("gameOverContainer");

//stored values
const player = {
    name: '',
    health: 100,
    ram: 25,
    firewall: 0,
    device: 1,
    btc: 1500,
}

const upgrades = [
    {name: "upgradeHp", price: 5, tier: 0, maxTier: 10},
    {name: "upgradeRam", price: 5, tier: 0, maxTier: 10},
    {name: "firewall", price: 5, tier: 0, maxTier: 10},
    {name: "device", price: 5, tier: 1, maxTier: 5},
]

const maxConsumables = 5
const consumables = [
    {name: "systemclean", current: 0, effect: 10, price: 5},
    {name: "botban", current: 0, effect: 5, price: 5} 
]

const abilities = [
    {name: "ddos",       power: 200, cost: 2},
    {name: "sql",        power: 15, cost: 2},
    {name: "bruteforce", power: 2,  cost: 2},
    {name: "ransomware", power: 5,  cost: 2, price: 1}
]

const enemies = [
    {name: "igor", health: 100, multiplier: 1},
    {name: "zlatan", health: 120, multiplier: 1.5},
    {name: "ivan", health: 160, multiplier: 2},
    {name: "vladimir", health: 200, multiplier: 2.5}
]

const enemyAbillities = [
    {name: "propaganda", power: 10},
    {name: "fakenews", power: 10},
    {name: "trolling", power: 10},
    {name: "censorship", power: 10}
]

document.getElementById("arrowEnemySelection").addEventListener("click", () => {
    document.getElementById("enemySelectionContainer").style.display="none"
    document.getElementById("homeSettings").style.display="flex"
})

document.getElementById("arrowShop").addEventListener("click", () => {
    document.getElementById("shopContainer").style.display="none"
    document.getElementById("homeSettings").style.display="flex"
    document.getElementById("arrowShop").style.display="none";
})

//homepage 
const input = document.getElementById("nameField")
document.getElementById("startButton").addEventListener("click", () => {
    player.name = input.value
    if (player.name === '' || player.name.length <= 1){
        window.alert("You must enter a name!")
    } else {
        playerName.innerHTML = player.name
        currentHealth = player.health
        document.getElementById("homeSettings").style.display="none";
        document.getElementById("enemySelectionContainer").style.display="block";
        document.getElementById("characterImage").style.display="none";   
        actionText.innerHTML = `What will ${player.name} do?`
        updateHud()
    }
})

//Shop
const shopInitIds = ["shopBtc", "shopHp", "shopRam", "shopFirewall", "shopDevice"]
const shopInitAttributes = [player.btc, player.health, player.ram, player.firewall, player.device]

for (let i = 0; i < shopInitIds.length; i++) {
    document.getElementById(shopInitIds[i]).innerHTML = shopInitAttributes[i]
}

document.getElementById("shopButton").addEventListener("click", () => {
    document.getElementById("shopContainer").style.display="block";
    document.getElementById("homeSettings").style.display="none";
    document.getElementById("arrowShop").style.display="block";
})

const tierIds = ["hpTier", "ramTier", "firewallTier", "deviceTier"]
const priceIds = ["hpPrice", "ramPrice", "firewallPrice", "devicePrice"]
for (let i = 0; i < tierIds.length; i++) {
    document.getElementById(tierIds[i]).innerHTML = upgrades[i].tier
    document.getElementById(priceIds[i]).innerHTML = upgrades[i].price
}

function buyUpgrade(upgradeIndex) {
    if (upgrades[upgradeIndex].price <= player.btc && upgrades[upgradeIndex].tier < upgrades[upgradeIndex].maxTier) {
        upgrades[upgradeIndex].tier ++;
        player.btc -= upgrades[upgradeIndex].price;
        switch(upgradeIndex) {
            case 0: 
                player.health += 10
                break;
            case 1:
                player.ram += 10
                break;
            case 2:
                player.firewall += 10
                break;
            case 3:
                player.device += 1
                break;
        }
        document.getElementById(tierIds[upgradeIndex]).innerHTML = upgrades[upgradeIndex].tier
        document.getElementById("shopBtc").innerHTML = player.btc
        document.getElementById("shopHp").innerHTML = player.health
        document.getElementById("shopRam").innerHTML = player.ram
        document.getElementById("shopFirewall").innerHTML = player.firewall
        document.getElementById("shopDevice").innerHTML = player.device
    }
}

const consumablesId = ["sysCleanup", "botban"]

for (let i = 0; i < consumables.length; i++) {
    document.getElementById(consumablesId[i]).innerHTML = consumables[i].current
}

function buyConsumable(index) {
    if (consumables[index].price <= player.btc && consumables[index].current < maxConsumables) {
        player.btc -= consumables[index].price
        consumables[index].current ++
        document.getElementById(consumablesId[index]).innerHTML = consumables[index].current
        document.getElementById("shopBtc").innerHTML = player.btc
    }
}
//Enemy selectionscreen
const enemyImageSource = ["./animations/igor/igor.gif", "./animations/zlatan/zlatan.gif", "./animations/ivan/ivan.gif" ,"./animations/vladimir/vladimir.gif"]
let globalEnemyIndex = 0

let currentHealth = player.health
let currentRam = player.ram
let currentBtc = player.btc
let currentEnemyHp = enemies[globalEnemyIndex].health

function updateValues() {
    currentHealth = player.health
    currentRam = player.ram
    currentBtc = player.btc
}

function updateHud() {
    playerHp.value = currentHealth
    playerRam.innerHTML = currentRam
    btc.innerHTML = currentBtc
    enemyHp.value = currentEnemyHp / enemies[globalEnemyIndex].health * 100
}

function selectEnemy(enemyIndex) {
    globalEnemyIndex = enemyIndex
    enemyName.innerHTML = enemies[enemyIndex].name
    currentEnemyHp = enemies[enemyIndex].health
    updateValues()
    updateHud()
    document.getElementById("gameContainer").style.display="block" 
    document.getElementById("homepageContainer").style.display="none" 
    document.getElementById("enemyImage").src = enemyImageSource[enemyIndex];
    if (enemyIndex === 2) {
        document.getElementById("enemyHp").style.marginLeft="5vw"
        document.getElementById("enemyName").style.marginLeft="5vw"
    }
}

//fight logic
const buttonIds =["ddos", "sql", "bruteforce", "ransomware"]
function disableButtons() {
    for (let i = 0; i < buttonIds.length; i++) {
        document.getElementById(buttonIds[i]).setAttribute('disabled', '');
    }
}

function enableButtons() {
    for (let i = 0; i < buttonIds.length; i++) {
        document.getElementById(buttonIds[i]).removeAttribute('disabled', '');
        actionText.innerHTML = `What will ${player.name} do?`;
    }
}

//scallable button logic
//Abilities logic
let globalAbilityIndex = 0
function castAbility(abilityIndex) {
    globalAbilityIndex = abilityIndex
    if (currentRam < abilities[abilityIndex].cost) {
        actionText.innerHTML = "You dont have enough ram for this ability!"
    } else if (currentBtc <= 0) {
        actionText.innerHTML = "You have ran out of BTC!"
    } else {
        currentRam -= abilities[abilityIndex].cost
        currentEnemyHp -= abilities[abilityIndex].power
        if (abilityIndex === 2) {
            let counter = 0;
            const countInterval = setInterval(count, 1000)
            function count() {
                counter++
                currentEnemyHp -= abilities[2].power
                updateHud()
                if(counter === 5) {
                    clearInterval(countInterval)
                }
            }
        } else if (abilityIndex === 3) {
            currentBtc += abilities[abilityIndex].price
        }
    }

    actionText.innerHTML = `${player.name} casts: ${abilities[abilityIndex].name}! <br> It deals ${abilities[abilityIndex].power} damage!`
    disableButtons()

    if (currentEnemyHp <= 0) {
        setTimeout(() => {
            actionText.innerHTML = "You win!"
            gameOverContainer.style.display="block";
            document.getElementById("winLose").innerHTML = "Win"
        }, 2000)
    } else {
        setTimeout(() => {
            actionText.innerHTML = `What will ${enemies[globalEnemyIndex].name} do?`;
        }, 3000);
        let randomAbilityIndex = Math.floor(Math.random() * enemyAbillities.length)
        setTimeout(() => {
            let damage = enemyAbillities[randomAbilityIndex].power * enemies[globalEnemyIndex].multiplier
            currentHealth -= damage
            updateHud()
            actionText.innerHTML = `${enemies[globalEnemyIndex].name} casts ${enemyAbillities[randomAbilityIndex].name}! <br> It deals ${damage} damage`
            if (currentHealth <= 0) {
                setTimeout(() => {
                    actionText.innerHTML = "You lose!"
                    gameOverContainer.style.display="block";
                    document.getElementById("winLose").innerHTML = "Lose"
                }, 2000)
            } else {
                setTimeout(enableButtons, 7000)
            }
        }, 6000)
    }
    updateHud()
}

//Use consumables
function useConsumable(index) {
    if (index === 0 && currentRam < player.ram && consumables[0].current > 0) {
        currentRam += consumables[0].effect;
    }  else if (consumables[0].current === 0) {
        console.log("You don't have any consumables!")
    }  else if (currentRam >= player.ram) {
        console.log("You're full of ram!")
        console.log(`You're current ram is : ${currentRam}`)
        console.log(`You're player ram is : ${player.ram}`)
    }
    updateHud()
}

function restart() {
    document.getElementById("homepageContainer").style.display="flex"
    document.getElementById("homeSettings").style.display="flex"
    document.getElementById("gameContainer").style.display="none"
    document.getElementById("enemySelectionContainer").style.display="none"
    document.getElementById("characterImage").style.display="block"
    gameOverContainer.style.display="none";
    enableButtons()
}
document.getElementById("restartButton").addEventListener("click", restart)

//pause
document.getElementById("menuButton").addEventListener("click", () => {
    document.getElementById("menuContainer").style.display="grid";
    disableButtons()
})

document.getElementById("resumeButton").addEventListener("click", () => {
    document.getElementById("menuContainer").style.display="none";
    enableButtons()
})

document.getElementById("homeButton").addEventListener("click", () => {
    restart()
    document.getElementById("menuContainer").style.display="none";
})