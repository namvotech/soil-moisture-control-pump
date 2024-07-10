soilMoisture = 0
setSoilMoisture = EEPROM.readw(0)

def on_forever():
    global soilMoisture
    soilMoisture = Math.round(pins.map(pins.analog_read_pin(AnalogPin.P0), 0, 1023, 100, 0))
basic.forever(on_forever)

def on_forever2():
    serial.write_line("Soil Moisture: " + str(soilMoisture) + " %")
    serial.write_line("Set Soil Moisture: " + str(setSoilMoisture))
    lcd.display_text("Moisture:" + ("" + str(soilMoisture)) + " %   ", 1, 1)
    lcd.display_text("Set Moisture:" + ("" + str(setSoilMoisture)) + "  ", 1, 2)
    if soilMoisture > setSoilMoisture:
        lcd.display_text(" ", 16, 1)
    else:
        lcd.display_text(lcd.display_symbol(lcd.Symbols.SYM10), 16, 1)
    basic.pause(100)
basic.forever(on_forever2)

def on_forever3():
    global setSoilMoisture
    if input.button_is_pressed(Button.A):
        setSoilMoisture += -1
        if setSoilMoisture < 0:
            setSoilMoisture = 100
        basic.show_leds("""
            . . . . .
            . . . . .
            . # # # .
            . . . . .
            . . . . .
            """)
    elif input.button_is_pressed(Button.B):
        setSoilMoisture += 1
        if setSoilMoisture > 100:
            setSoilMoisture = 0
        basic.show_leds("""
            . . . . .
            . . # . .
            . # # # .
            . . # . .
            . . . . .
            """)
    elif input.logo_is_pressed():
        while input.logo_is_pressed():
            basic.show_icon(IconNames.YES)
        EEPROM.writew(0, setSoilMoisture)
        basic.pause(2000)
basic.forever(on_forever3)

def on_forever4():
    if soilMoisture > setSoilMoisture:
        basic.show_icon(IconNames.HAPPY)
        basic.pause(100)
        l9110.pause_motor(l9110.Motor.MOTOR_A)
        l9110.pause_motor(l9110.Motor.MOTOR_B)
    else:
        basic.show_icon(IconNames.SAD)
        basic.pause(100)
        l9110.control_motor(l9110.Motor.MOTOR_A, l9110.Rotate.FORWARD, 100)
        l9110.control_motor(l9110.Motor.MOTOR_B, l9110.Rotate.FORWARD, 100)
basic.forever(on_forever4)
