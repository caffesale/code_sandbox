class FSMCoffeeMaker {
    constructor() {
        this.states = {
            IDLE: "IDLE",
            BREWING_READY: "BREWING_READY",
            BREWING: "BREWING",
            HEATING_WATER: "HEATING_WATER",
            READY_TO_POUR: "READY_TO_POUR",
            POURING: "POURING",
            ERROR: "ERROR",
        };

        this.currentState = this.states.IDLE;

        this.sensors = {
            waterLevel: false,
            brewButtonPressed: false,
            potPresent: false,
            waterHot: false,
            brewComplete: false,
            pourButtonPressed: false,
        };
    }

    transition(event) {
        switch (this.currentState) {
            case this.states.IDLE:
                if (
                    event === "BREW_BUTTON_PRESSED" &&
                    this.sensors.waterLevel &&
                    this.sensors.potPresent
                ) {
                    this.changeState(this.states.BREWING_READY);
                    this.startHeatingWater();
                } else if (event === "BREW_BUTTON_PRESSED") {
                    this.reportError(this.states.ERROR);
                }
                break;

            case this.states.BREWING_READY:
                if (event === "START_BREWING") {
                    this.changeState(this.states.HEATING_WATER);
                }
                break;

            case this.states.HEATING_WATER:
                if (event === "WATER_HOT") {
                    this.changeState(this.states.BREWING);
                    this.startBrewing();
                } else if (event === "POT_REMOVED") {
                    this.changeState(this.states.ERROR);
                    this.stopHeating();
                    this.reportError("ㅊ추출중");
                }
                break;

            case this.states.BREWING:
                if (event === "BREW_COMPLETE") {
                    this.changeState(this.states.READY_TO_POUR);
                    this.startBrewing();
                } else if (event === "POT_REMOVED") {
                    this.changeState(this.states.ERROR);
                    this.stopHeating();
                    this.reportError("추출중");
                }
                break;

            case this.states.READY_TO_POUR:
                if (event === "POUR_BUTTON_PRESSED") {
                    this.changeState(this.states.POURING);
                    this.startPouring();
                }
                break;

            case this.states.ERROR:
                if (event === "RESET") {
                    this.changeState(this.states.IDLE);
                    this.reset();
                }
                break;
        }
    }

    changeState(newState) {
        this.currentState = newState;
        console.log(`State changed to: ${newState}`);
    }

    updateSensors(sensorData) {
        Object.assign(this.sensors, sensorData);

        if (
            this.sensors.brewButtonPressed &&
            this.currentState === this.states.IDLE
        ) {
            this.transition("BREW_BUTTON_PRESSED");
            this.sensors.brewButtonPressed = false; // Reset the sensor after processing
        }

        if (
            this.sensors.waterHot &&
            this.currentState === this.states.HEATING_WATER
        ) {
            this.transition("WATER_HOT");
        }

        if (
            this.sensors.brewComplete &&
            this.currentState === this.states.BREWING
        ) {
            this.transition("BREW_COMPLETE");
        }

        if (
            !this.sensors.potPresent &&
            (this.currentState === this.states.BREWING ||
                this.currentState === this.states.HEATING_WATER)
        ) {
            this.transition("POT_REMOVED");
        }

        if (
            this.sensors.pourButtonPressed &&
            this.currentState === this.states.READY_TO_POUR
        ) {
            this.transition("POUR_BUTTON_PRESSED");
            this.sensors.pourButtonPressed = false;
        }
    }

    startHeatingWater() {
        this.transition("START_BREWING");
    }

    startBrewing() {
        setTimeout(() => {
            this.sensors.brewComplete = true;
            this.updateSensors({});
        }, 3000);
    }

    stopHeating() {}
    stopBrewing() {}
    indicateReady() {}
    startPouring() {
        setTimeout(() => {
            this.transition("POUR_COMPLETE");
        }, 2000);
    }

    reportError(message) {
        console.error(`Error: ${message}`);
    }

    reset() {}
}

function main(coffeeMaker) {
    coffeeMaker.updateSensors(
        {
            waterLevel: true,
            brewButtonPressed: true,
            potPresent: true,
        },
        1000
    );

    setTimeout(() => {
        coffeeMaker.updateSensors({
            waterHot: true,
        });
    }, 2500);

    setTimeout(() => {
        coffeeMaker.updateSensors({
            pourButtonPressed: true,
        });
    }, 6000);
}

const coffeeMaker = new FSMCoffeeMaker();
main(coffeeMaker);
