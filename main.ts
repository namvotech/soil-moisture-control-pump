let soilMoisture = 0
let setSoilMoisture = EEPROM.readw(0)
// For Display
basic.forever(function () {
    serial.writeLine("Soil Moisture: " + soilMoisture + " %")
    serial.writeLine("Set Soil Moisture: " + setSoilMoisture)
    lcd.displayText("Moisture:" + ("" + soilMoisture) + " %   ", 1, 1)
    lcd.displayText("Set Moisture:" + ("" + setSoilMoisture) + "  ", 1, 2)
    if (soilMoisture > setSoilMoisture) {
        lcd.displayText(" ", 16, 1)
    } else {
        lcd.displayText(lcd.displaySymbol(lcd.Symbols.sym10), 16, 1)
    }
    basic.pause(500)
})
// For read button state
basic.forever(function () {
    if (input.buttonIsPressed(Button.A)) {
        setSoilMoisture += -1
        if (setSoilMoisture < 0) {
            setSoilMoisture = 100
        }
        basic.showLeds(`
            . . . . .
            . . . . .
            . # # # .
            . . . . .
            . . . . .
            `)
    } else if (input.buttonIsPressed(Button.B)) {
        setSoilMoisture += 1
        if (setSoilMoisture > 100) {
            setSoilMoisture = 0
        }
        basic.showLeds(`
            . . . . .
            . . # . .
            . # # # .
            . . # . .
            . . . . .
            `)
    } else if (input.logoIsPressed()) {
        while (input.logoIsPressed()) {
            basic.showIcon(IconNames.Yes)
        }
        EEPROM.writew(0, setSoilMoisture)
        basic.pause(2000)
    }
})
// For control output
basic.forever(function () {
    if (soilMoisture > setSoilMoisture) {
        basic.showIcon(IconNames.Happy)
        music.stopAllSounds()
        basic.pause(200)
        l9110.pauseMotor(l9110.Motor.MotorA)
        l9110.pauseMotor(l9110.Motor.MotorB)
    } else {
        basic.showIcon(IconNames.Sad)
        l9110.controlMotor(l9110.Motor.MotorA, l9110.Rotate.Forward, 100)
        l9110.controlMotor(l9110.Motor.MotorB, l9110.Rotate.Forward, 100)
        music.play(music.tonePlayable(880, music.beat(BeatFraction.Eighth)), music.PlaybackMode.UntilDone)
    }
})
// For read Sensor
basic.forever(function () {
    soilMoisture = Math.round(pins.map(
    pins.analogReadPin(AnalogPin.P0),
    0,
    1023,
    100,
    0
    ))
})
