var PlayerStatsComponent = (function () {
        
    function PlayerStatsComponent(theComponentSelector) {
        this.componentSelector = theComponentSelector;
        this.init(this.componentSelector);
        this.bindEvents(this.componentSelector);
    }

    PlayerStatsComponent.prototype.init = function (componentSelector) {
        const _self = this;
        const xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
               if (xmlhttp.status == 200) {
                   sessionStorage.setItem("playerStats", xmlhttp.responseText);
                   _self.playerData = xmlhttp.responseText;
                   _self.setDropdown(componentSelector);
                   console.log(xmlhttp.responseText);
               }
               else if (xmlhttp.status == 400) {
                  alert("Please put the data folder inside the dist folder.");
               }
               else {
                   console.log('Error loading the data.');
               }
            }
        };
    
        xmlhttp.open("GET", "/data/player-stats.json", true);
        xmlhttp.send();
    }; 

    PlayerStatsComponent.prototype.setDropdown = function(componentSelector) {
        const dropdown = componentSelector.querySelector('select');
        const playerData = JSON.parse(sessionStorage.getItem("playerStats"));

        for (x in playerData.players) {
            var option = document.createElement("option");
            option.value = x;
            option.text = playerData.players[x].player.name.first + " "+playerData.players[x].player.name.last;
            dropdown.appendChild(option);
        }
    }

    PlayerStatsComponent.prototype.bindEvents = function(componentSelector) {
        const dropdown = componentSelector.querySelector('select');
        const self = this;
        dropdown.addEventListener("change", function(){ 
            self.populateValues(componentSelector, this.value);
         });
    }

    PlayerStatsComponent.prototype.populateValues = function(componentSelector, index) {
        const playerData = JSON.parse(sessionStorage.getItem("playerStats"));
        const playerPhoto = componentSelector.querySelector('.js-pImage');
        const teamBatch = componentSelector.querySelector('#is-batch');
        const selectedPlayer = playerData.players[index];
        const firstname = componentSelector.querySelector('.js-firstname');
        const lastname = componentSelector.querySelector('.js-lastname');
        const appearance = componentSelector.querySelector('.js-appearance');
        const goals = componentSelector.querySelector('.js-goals');
        const assists = componentSelector.querySelector('.js-assists');
        const goalsPerMatch = componentSelector.querySelector('.js-goalsPerMatch');
        const passesPerMin = componentSelector.querySelector('.js-passesPerMin');

        this.getStat(selectedPlayer.stats);
        playerPhoto.src = '/assets/img/p'+selectedPlayer.player.id+'.png';
        teamBatch.className = "is-team-"+selectedPlayer.player.currentTeam.id;
        playerPhoto.style.display = 'block';
        firstname.innerHTML = selectedPlayer.player.name.first;
        lastname.innerHTML = selectedPlayer.player.name.last;
        appearance.innerHTML = selectedPlayer.stats[6].value;
        goals.innerHTML = selectedPlayer.stats[0].value;
        assists.innerHTML = selectedPlayer.stats[5].value;

        goalsPerMatch.innerHTML = (this.getStat("goals", selectedPlayer.stats) / (this.getStat("losses", selectedPlayer.stats) + this.getStat("wins", selectedPlayer.stats) + this.getStat("draws", selectedPlayer.stats))).toFixed(2);
        passesPerMin.innerHTML = ((this.getStat("fwd_pass", selectedPlayer.stats) + this.getStat("backward_pass", selectedPlayer.stats)) / this.getStat("mins_played", selectedPlayer.stats)).toFixed(2);

    }

    PlayerStatsComponent.prototype.getStat = function(statType, stats) {
        for (i in stats) {
            if (stats[i].name === statType) {
                return parseInt(stats[i].value);
            }
        }

        return 0;
    }

    return PlayerStatsComponent;
}());

var componentHolder = document.getElementsByClassName('c-player-stats-card');
for (var i = 0; i < componentHolder.length; ++i) {
    new PlayerStatsComponent(componentHolder[i]);
}; 
