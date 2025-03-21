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
    btc: 7,
    lvl: 1,
}

const upgrades = [
    {name: "upgradeHp", price: 5, tier: 0, maxTier: 10},
    {name: "upgradeRam", price: 5, tier: 0, maxTier: 10},
    {name: "firewall", price: 5, tier: 0, maxTier: 10},
    {name: "device", price: 5, tier: 1, maxTier: 5},
]

const maxConsumables = 5
const consumables = [
    {name: "systemclean", current: 0, effect: 10, price: 5, resource: "ram"},
    {name: "botban", current: 0, effect: 15, price: 5, resource: "hp"} 
]

const abilities = [
    {name: "ddos",       power: 17, cost: 5},
    {name: "sql",        power: 12, cost: 3},
    {name: "bruteforce", power: 4,  cost: 2},
    {name: "ransomware", power: 6,  cost: 2, price: 1},
]

const enemies = [
    {name: "igor", health: 100, multiplier: 1, lvl: 1},
    {name: "zlatan", health: 120, multiplier: 1.5, lvl: 2},
    {name: "ivan", health: 160, multiplier: 2, lvl: 3},
    {name: "vladimir", health: 200, multiplier: 2.5, lvl: 4}
]

const enemyAbillities = [
    {name: "propaganda", power: 10},
    {name: "fakenews", power: 10},
    {name: "trolling", power: 15},
    {name: "censorship", power: 5}
]
document.getElementById("lvlDisplay").innerHTML = player.lvl

document.getElementById("arrowEnemySelection").addEventListener("click", () => {
    document.getElementById("enemySelectionContainer").style.display="none"
    document.getElementById("homeSettings").style.display="flex"
    document.getElementById("characterImageContainer").style.display="block"
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
        document.getElementById("characterImageContainer").style.display="none";   
        actionText.innerHTML = `What will ${player.name} do?`
        updateHud()
    }
})

//Shop

document.getElementById("shopButton").addEventListener("click", () => {
    const shopInitIds = ["shopBtc", "shopHp", "shopRam", "shopFirewall", "shopDevice"]
    const shopInitAttributes = [player.btc, player.health, player.ram, player.firewall, player.device]

    document.getElementById("shopContainer").style.display="block";
    document.getElementById("homeSettings").style.display="none";
    document.getElementById("arrowShop").style.display="block";
    
    for (let i = 0; i < shopInitIds.length; i++) {
        document.getElementById(shopInitIds[i]).innerHTML = shopInitAttributes[i]
    }
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
        console.log(player.firewall)
    } else {
        document.getElementById("shopMessage").innerHTML = "You don't have enough BTC!"
        setTimeout(() => {document.getElementById("shopMessage").style.display = "none"}, 1500);
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
    } else {
        document.getElementById("shopMessage").innerHTML = "You don't have enough BTC!"
        setTimeout(() => {document.getElementById("shopMessage").style.display = "none"}, 1500);
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
    if (player.lvl < enemies[enemyIndex].lvl) {
        document.getElementById("lvlPopUp").style.display = "block"
        setTimeout(() => {document.getElementById("lvlPopUp").style.display = "none"}, 1000)
    } else {
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
}

//fight logic
const buttonIds =["ddos", "sql", "bruteforce", "ransomware", "gameCons1", "gameCons2"]
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

function win() {
    actionText.innerHTML = "You win!"
    gameOverContainer.style.display="block";
    document.getElementById("winLose").innerHTML = "Win"
    currentBtc += 7
    player.btc = currentBtc
    if (player.lvl < 4){
        player.lvl += 1
    }
    updateHud()
    document.getElementById("lvlDisplay").innerHTML = player.lvl
}

function lose() {
    disableButtons()
    actionText.innerHTML = "You lose!"
    gameOverContainer.style.display="block";
    document.getElementById("winLose").innerHTML = "Lose"
    currentBtc -= 4
    player.btc = currentBtc
    updateHud()  
}

//door ai gegenereerd
const propagandaArray = [
    "Russia stands strong!",
    "United, we are invincible!",
    "Beware the Western threat!",
    "Our homeland, our pride!",
    "Defend Russia's honor!",
    "Victory is ours!",
    "Together, we prevail!",
    "Russia's might is unmatched!",
    "Stand firm, comrades!",
    "Our future is bright!",
    "Enemies tremble before us!",
    "Russia leads the way!",
    "Patriotism is our strength!",
    "United against adversity!",
    "Our resolve is unbreakable!",
    "Russia's spirit never falters!",
    "We are the true defenders!",
    "Our nation, our destiny!",
    "Strength through unity!",
    "Russia's glory shines eternal!"
  ];

  const fakenewsArray = [
    "The West plans secret invasion!",
    "Russia's economy stronger than ever!",
    "Ukraine plots against its own people!",
    "NATO soldiers spotted near Russian borders!",
    "Sanctions only boost Russian prosperity!",
    "Global warming is a Western hoax!",
    "Europe crumbles under American influence!",
    "Russian scientists discover miracle cure!",
    "The West fears Russian technology!",
    "Foreign agents spread anti-Russian lies!",
    "Russia protects traditional family values!",
    "Enemies conspire to divide Russia!",
    "Western media hides the truth!",
    "Russia's military is invincible!",
    "Secret weapons program secures peace!",
    "The dollar is collapsing soon!",
    "Russia's allies grow stronger daily!",
    "Foreign NGOs corrupt Russian youth!",
    "Western culture threatens Russian identity!",
    "Victory is certain for Russia!"
];
// tot hier

function enemyCast() {
    setTimeout(() => {
        actionText.innerHTML = `What will ${enemies[globalEnemyIndex].name} do?`;
    }, 3000);
    let randomAbilityIndex = Math.floor(Math.random() * enemyAbillities.length)
    console.log(randomAbilityIndex)
    setTimeout(() => {
        let mitigation = 1 - (player.firewall / 100 / 2)
        let enemyDamage = Math.round(enemyAbillities[randomAbilityIndex].power * enemies[globalEnemyIndex].multiplier * mitigation) 
        currentHealth -= enemyDamage
        updateHud()
        if (randomAbilityIndex === 3) {
            actionText.innerHTML = `${enemies[globalEnemyIndex].name} casts ${enemyAbillities[randomAbilityIndex].name}! <br> It deals ${enemyDamage} damage and he can cast again!`
            if (currentHealth <= 0) {setTimeout(lose, 2000)}
            enemyCast()
        } else {
            if (randomAbilityIndex === 0) {
                document.getElementById("speech-bubble").style.display = "block"
                document.getElementById("bubbleText").innerHTML = propagandaArray[Math.floor(Math.random() * propagandaArray.length)]
                setTimeout(() => {document.getElementById("speech-bubble").style.display = "none"}, 3000)
            } else if (randomAbilityIndex === 1) {
                document.getElementById("speech-bubble").style.display = "block"
                document.getElementById("bubbleText").innerHTML = fakenewsArray[Math.floor(Math.random() * fakenewsArray.length)]
                setTimeout(() => {document.getElementById("speech-bubble").style.display = "none"}, 3000)
            }
            actionText.innerHTML = `${enemies[globalEnemyIndex].name} casts ${enemyAbillities[randomAbilityIndex].name}! <br> It deals ${enemyDamage} damage`
        }
        if (currentHealth <= 0) {
            setTimeout(lose, 2000)
        } else {
            setTimeout(enableButtons, 3000)
        }
    }, 3000)
    updateHud()
    }

//scallable button logic
//Abilities logic
let globalAbilityIndex = 0
let playerDamage = null
function castAbility(abilityIndex) {
    globalAbilityIndex = abilityIndex
    if (abilities[abilityIndex].cost <= currentRam) {
        const misCalc = Math.floor(Math.random * 50)
        currentRam -= abilities[abilityIndex].cost
        playerDamage = Math.round(abilities[abilityIndex].power + player.device * 5) 
        if (misCalc === 1) {
            actionText.innerHTML = `${player.name} casts: ${abilities[abilityIndex].name}! <br> It misses and deals 0 damage!`
        } else {
            currentEnemyHp -= playerDamage
            if (abilityIndex === 2) {
                let counter = 0;
                const countInterval = setInterval(count, 1000)
                function count() {
                    if (currentEnemyHp <= 0) {
                        win()
                        clearInterval(countInterval)
                        return
                    } else {
                        counter++
                        currentEnemyHp -= abilities[2].power
                        updateHud()
                        if(counter === 5) {
                            clearInterval(countInterval)
                        }
                    }
                }
            } else if (abilityIndex === 3) {
                currentBtc += abilities[abilityIndex].price
            }
            if (abilityIndex === 2) {
                actionText.innerHTML = `${player.name} casts: ${abilities[abilityIndex].name}! <br> It deals ${playerDamage} damage every second!`
            } else {
                actionText.innerHTML = `${player.name} casts: ${abilities[abilityIndex].name}! <br> It deals ${playerDamage} damage!`
            }
        }
        updateHud()
        disableButtons()
        if (currentEnemyHp <= 0) {
            setTimeout(win, 2000)
        } else {
            enemyCast()
        }
    } else {
        actionText.innerHTML = "You dont have enough ram for this ability!"
    }
}

function useConsumable(consIndex) {
    let resourcesCompare = [currentRam, currentHealth]
    let playerCompare = [player.ram, player.health]
    if (resourcesCompare[consIndex] === playerCompare[consIndex]) {
        actionText.innerHTML = `You're ${consumables[consIndex].resource} is full!`
        setTimeout(() => {
        actionText.innerHTML = `What will ${player.name} do?`;
        }, 1000)
    } else if (consumables[consIndex].current === 0) {
        actionText.innerHTML = "You don't have any consumables of this sort!"
        setTimeout(() => {
            actionText.innerHTML = `What will ${player.name} do?`;
            }, 1000)
    } else {
        let gain = 0
        switch (consIndex) {
            case 0: 
                if ((currentRam + consumables[0].effect) >= player.ram) {
                    gain = player.ram - currentRam
                } else {
                    gain = consumables[0].effect
                }
                currentRam += gain
                break;
                case 1:
                    if ((currentHealth + consumables[1].effect) >= player.health) {
                        gain = player.health - currentHealth
                    } else {
                        gain = consumables[1].effect
                    }
                    currentHealth += gain
                    break;
                }
        actionText.innerHTML = `${player.name} uses ${consumables[consIndex].name}! He gains ${gain} ${consumables[consIndex].resource}.`
        updateHud()
        disableButtons()
        enemyCast()
    }
}

function restart() {
    document.getElementById("homepageContainer").style.display="flex"
    document.getElementById("homeSettings").style.display="flex"
    document.getElementById("gameContainer").style.display="none"
    document.getElementById("enemySelectionContainer").style.display="none"
    document.getElementById("characterImageContainer").style.display="block"
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