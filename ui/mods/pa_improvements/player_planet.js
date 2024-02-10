
var commanderIds = {}
var counter = 0
function checkPlayerPlanet(){
    var primaryColor = model.player().color;
    var commanders = model.player().commanders;
    var armyId = undefined;
    for(var i = 0;i<model.players().length;i++){
        if(commanderIds[i] == undefined){commanderIds[i] = []}
        if(model.players()[i].name == model.player().name){
            armyId = i
        }
    }


    if(model.isSpectator()){
        for(var i = 0;i<model.players().length;i++){
            if(commanderIds[i] == undefined){commanderIds[i] = []}
            primaryColor = model.players()[i].color;
            commanders = model.players()[i].commanders;
            armyId = i;
            sendPlayerComData(armyId, primaryColor, commanders)
        }
    }
    else{
        sendPlayerComData(armyId, primaryColor, commanders)
    }
   
    
    _.delay(function(){ api.Panel.message('planets', 'playerCommander', finalMessage); finalMessage = [];}, 500)
    _.delay(checkPlayerPlanet, 1000)
}

checkPlayerPlanet()

var finalMessage = [];

function sendPlayerComData(armyId, armyColor, commanders){
    commanderIds[armyId] = [];
    var planets = model.planetListState().planets;
    for(var i = 0;i<planets.length;i++){
                api.getWorldView(0).getArmyUnits(armyId,i).then(function(result){
                    _.map(commanders, function(commander){
                        if(result[commander] !== undefined){
                            commanderIds[armyId] = _.uniq(commanderIds[armyId].concat(result[commander]))
                        }
                    })
                  
                })
    }       
    _.delay(finishSendingComData, 200, armyId, armyColor)
}

function finishSendingComData(armyId, armyColor){
    api.getWorldView(0).getUnitState(commanderIds[armyId]).then(function(result){
        var message = []
        _.forEach(result,function(unitState){
            message.push({
                planet: unitState.planet,
                color: armyColor
            })
        })
        finalMessage = finalMessage.concat(message)
    })
}