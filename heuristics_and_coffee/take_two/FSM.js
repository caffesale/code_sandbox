class FSMCoffeeMaker {
    constructor() {
        this.states = {
            IDLE: "IDLE",
            ERROR: "ERROR",
            BREWING: "BREWING",
            DRIPPING: "DRIPPING",
            PAUSED_DURING_BREW: "PAUSED_DURING_BREW",
            COMPLETE: "COMPLETE",
            PAUSED_AFTER_COMPLETE: "PAUSED_AFTER_COMPLETE",
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
                    this.changeState(this.states.BREWING);
                    this.startHeatingWater();
                } else if (event === "BREW_BUTTON_PRESSED") {
                    this.reportError(this.states.ERROR);
                }
                break;

            case this.states.BREWING:
                if (event === "WATER_HOT") {
                    this.changeState(this.states.DRIPPING);
                    this.startBrewing();
                } else if (event === "POT_REMOVED") {
                    this.changeState(this.states.PAUSED_DURING_BREW);
                    this.stopHeating();
                    this.reportError("ㅊ추출중");
                }
                break;

            case this.states.DRIPPING:
                if (event === "BREW_COMPLETE") {
                    this.changeState(this.states.COMPLETE);
                    this.startBrewing();
                } else if (event === "POT_REMOVED") {
                    this.changeState(this.states.PAUSED_DURING_BREW);
                    this.stopHeating();
                    this.reportError("추출중");
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

function mainLoop() {
    const sensorHardware = new sensorHardware();
    const POLLING_INTERVAL = 10;

    function pollSensors() {
        try {
            // 예시 코드
            const currentState = {
                waterLevel: sensorHardware.readWaterLevel(),
                brewButtonPressed: sensorHardware.readBrewButton(),
                potPresent: sensorHardware.readPotPresent(),
                waterHot: sensorHardware.readWaterTemperature(),
                brewComplete: sensorHardware.readBrewComplete(),
                pourButtonPressed: sensorHardware.readPourButton(),
            };

            coffeeMaker.updateSensors(currentState);
        } catch (error) {
            console.error("An error occurred:", error);
            coffeeMaker.transition("ERROR");
        }
        setTimeout(pollSensors, POLLING_INTERVAL);
    }

    pollSensors();

    process.on("SIGINT", () => {
        process.exit();
    });
}
