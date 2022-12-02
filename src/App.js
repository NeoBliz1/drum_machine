import React, { useState, useEffect } from "react";
import { Button, Container, Col, Card } from "react-bootstrap";

import "./styles.css";

//********************************drum_button_component
const DrumButton = (props) => {
  //console.log("DrumButton component rendered");
  const {
    id,
    keyCode,
    keyTrigger,
    urlAudio,
    powerState,
    setCurrentKeyId,
    volumeValue,
    keyPressedCount,
    setKeyPressedCount
  } = props;

  const btnBasicStyle = {
    backgroundColor: powerState ? "#007bff" : "#ccc",
    border: "none",
    boxShadow: "6px 3px 2px gray",
    height: "50px",
    width: "50px"
  };
  const btnDisableStyle = {
    backgroundColor: "#ccc"
  };
  const btnEnableStyle = {
    backgroundColor: "#007bff"
  };
  const btnActiveStyle = {
    backgroundColor: "yellow",
    boxShadow: "none"
  };

  const [buttonStateStyle, setButtonStyle] = useState(btnBasicStyle);

  const [keySound] = useState(new Audio(urlAudio));
  keySound.volume = volumeValue;
  //console.log(keySound.volume);
  const padPressed = () => {
    if (powerState) {
      setKeyPressedCount(keyPressedCount + 1);
      //console.log(keyPressedCount);
      setCurrentKeyId(id);
      keySound.pause();
      keySound.currentTime = 0;
      keySound.play();
      setButtonStyle(btnActiveStyle);
      setTimeout(() => setButtonStyle(btnEnableStyle), 150);
    }
  };
  //console.log(keyTrigger + " button rendered");
  const handelKeyPress = (e) => {
    let keyPressCode = e.keyCode;
    if (keyPressCode === keyCode) {
      padPressed();
      //console.log(keyPressCode + " = " + keyCode);
    }
  };

  useEffect(() => {
    //console.log("useEffect DumButton component executed");
    if (powerState) {
      setButtonStyle(btnEnableStyle);
      //console.log("enable style active");
      document.addEventListener("keydown", handelKeyPress);
      //console.log("listner added");
    } else {
      setButtonStyle(btnDisableStyle);
      //console.log("disables style active");
    }
    return () => {
      document.removeEventListener("keydown", handelKeyPress);
      //console.log("listner removed");
    };
  }, [powerState]);
  return (
    <Button
      className="m-1 btn-lg flex-fill"
      id={id}
      style={{ ...btnBasicStyle, ...buttonStateStyle }}
      onClick={padPressed}
    >
      {keyTrigger}
    </Button>
  );
};
//********************************drum_pad_control_panel_component
const ControlPanel = (props) => {
  //console.log("ControlPanel component rendered");
  const [displayLabel, setDisplayLabel] = useState(" ");
  const {
    powerState,
    setPowerState,
    currentKeyId,
    setCurrentKeyId,
    volumeValue,
    setVolumeValue,
    currentSoundBank,
    setCurrentSoundBank,
    keyPressedCount,
    setKeyPressedCount
  } = props;
  const powerToggle = () => {
    if (powerState) {
      setPowerState(false);
      setKeyPressedCount(0);
    } else {
      setPowerState(true);
    }
  };
  const soundBankToggle = () => {
    //console.log("click");
    currentSoundBank === 1 ? setCurrentSoundBank(2) : setCurrentSoundBank(1);
  };
  const volumeHandleChange = (e) => {
    setVolumeValue(e.target.value / 20);
  };
  //console.log(powerState);
  let timer;
  const labelDisplayHandler = (valForDisplay) => {
    //console.log(valForDisplay);
    if (powerState) {
      setDisplayLabel(valForDisplay);
      timer = setTimeout(() => setDisplayLabel(" "), 1000);
    } else {
      setCurrentKeyId(" ");
      setDisplayLabel("Power OFF");
    }
  };
  useEffect(() => {
    labelDisplayHandler(currentKeyId);
    return () => {
      clearTimeout(timer);
    };
  }, [currentKeyId, powerState, keyPressedCount]);
  useEffect(() => {
    labelDisplayHandler("Vol " + Math.round(volumeValue * 100) + "%");
    return () => {
      clearTimeout(timer);
    };
  }, [volumeValue]);
  return (
    <div className="d-flex align-items-center justify-content-center flex-column">
      <p
        className="mb-0"
        style={{
          transform: "scale(1.2)"
        }}
      >
        Power switch
      </p>
      <div className="form-check form-switch pl-0">
        <label className="switch">
          <input type="checkbox" onClick={powerToggle} />
          <span className="slider round"></span>
        </label>
      </div>
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          width: "100px",
          height: "20px",
          backgroundColor: "gray",
          color: "aquamarine"
        }}
      >
        <p className="mb-0 font-weight-bold">{displayLabel}</p>
      </div>
      <label htmlFor="volume" className="mb-0 mt-2">
        Volume
      </label>
      <input
        type="range"
        id="volume"
        name="volume"
        min="0"
        max="20"
        value={volumeValue * 20}
        onChange={volumeHandleChange}
        disabled={powerState ? false : true}
      />
      <p className="mb-0 font-weight-bold">
        {"Sound bank " + currentSoundBank}
      </p>
      <div className="form-check form-switch pl-0">
        <label className="switch">
          <input
            type="checkbox"
            onClick={soundBankToggle}
            disabled={powerState ? false : true}
          />
          <span
            className="sliderBank round"
            style={{ backgroundColor: !powerState && "#ccc" }}
          ></span>
        </label>
      </div>
    </div>
  );
};
//*********************************main_app*********************************
const App = () => {
  //console.log("App rendered");
  const cardStyle = {
    maxWidth: "550px",
    border: "0.3rem solid #0848A3",
    borderRadius: "0.5rem"
  };

  // coded by @no-stack-dub-sack (github) / @no_stack_sub_sack (codepen)
  const bankOne = [
    {
      keyCode: 81,
      keyTrigger: "Q",
      id: "Heater-1",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3"
    },
    {
      keyCode: 87,
      keyTrigger: "W",
      id: "Heater-2",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3"
    },
    {
      keyCode: 69,
      keyTrigger: "E",
      id: "Heater-3",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3"
    },
    {
      keyCode: 65,
      keyTrigger: "A",
      id: "Heater-4",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3"
    },
    {
      keyCode: 83,
      keyTrigger: "S",
      id: "Clap",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3"
    },
    {
      keyCode: 68,
      keyTrigger: "D",
      id: "Open-HH",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3"
    },
    {
      keyCode: 90,
      keyTrigger: "Z",
      id: "Kick-n'-Hat",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3"
    },
    {
      keyCode: 88,
      keyTrigger: "X",
      id: "Kick",
      url: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3"
    },
    {
      keyCode: 67,
      keyTrigger: "C",
      id: "Closed-HH",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3"
    }
  ];

  const bankTwo = [
    {
      keyCode: 81,
      keyTrigger: "Q",
      id: "Chord-1",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3"
    },
    {
      keyCode: 87,
      keyTrigger: "W",
      id: "Chord-2",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3"
    },
    {
      keyCode: 69,
      keyTrigger: "E",
      id: "Chord-3",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3"
    },
    {
      keyCode: 65,
      keyTrigger: "A",
      id: "Shaker",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3"
    },
    {
      keyCode: 83,
      keyTrigger: "S",
      id: "Open-HH",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3"
    },
    {
      keyCode: 68,
      keyTrigger: "D",
      id: "Closed-HH",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3"
    },
    {
      keyCode: 90,
      keyTrigger: "Z",
      id: "Punchy-Kick",
      url: "https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3"
    },
    {
      keyCode: 88,
      keyTrigger: "X",
      id: "Side-Stick",
      url: "https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3"
    },
    {
      keyCode: 67,
      keyTrigger: "C",
      id: "Snare",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3"
    }
  ];
  //console.log("component App rendered");
  const [bgColor] = useState("aliceblue");
  const [currentSoundBank, setCurrentSoundBank] = useState(1);
  const [drumBoardProps, setDrumBoardProps] = useState(bankOne);
  const [powerState, setPowerState] = useState(false);
  const [volumeValue, setVolumeValue] = useState(0.5);
  const [currentKeyId, setCurrentKeyId] = useState(" ");
  const [keyPressedCount, setKeyPressedCount] = useState(0);
  //create arr based on the properies banks
  let drumBoardRollout = drumBoardProps.map((el) => {
    //console.log(el);
    return (
      <DrumButton
        id={el.id}
        keyCode={el.keyCode}
        keyTrigger={el.keyTrigger}
        urlAudio={el.url}
        powerState={powerState}
        setCurrentKeyId={setCurrentKeyId}
        volumeValue={volumeValue}
        keyPressedCount={keyPressedCount}
        setKeyPressedCount={setKeyPressedCount}
        key={el.id}
      />
    );
  });
  //console.log(drumBoardRollout);
  useEffect(() => {
    //console.log('useEffect DumButton component executed')
    if (currentSoundBank === 1) {
      //console.log(currentSoundBank);
      setDrumBoardProps(bankOne);
    } else {
      //console.log(currentSoundBank);
      setDrumBoardProps(bankTwo);
    }
  }, [currentSoundBank]);
  return (
    <div>
      <Container
        id="quote-box"
        fluid
        className="vh-100 d-flex align-items-center uniqueContainer"
        style={{ backgroundColor: bgColor, minWidth: "250px" }}
      >
        <div className="w-100 d-flex justify-content-center">
          <Card style={cardStyle} className="inner-container">
            <Card.Title id="text" className="text-right mr-2 mb-0">
              FCC
              <i className="inner-logo fa fa-free-code-camp ml-1" />
            </Card.Title>
            <Card.Body className="d-flex flex-wrap align-items-center justify-content-center pt-0">
              <Col
                className="d-flex align-items-center justify-content-center flex-wrap"
                style={{ minWidth: "250px" }}
              >
                {drumBoardRollout}
              </Col>
              <Col
                className="d-flex align-items-center justify-content-center flex-wrap"
                style={{ minWidth: "250px" }}
              >
                <ControlPanel
                  powerState={powerState}
                  setPowerState={setPowerState}
                  currentKeyId={currentKeyId}
                  setCurrentKeyId={setCurrentKeyId}
                  volumeValue={volumeValue}
                  setVolumeValue={setVolumeValue}
                  currentSoundBank={currentSoundBank}
                  setCurrentSoundBank={setCurrentSoundBank}
                  keyPressedCount={keyPressedCount}
                  setKeyPressedCount={setKeyPressedCount}
                />
              </Col>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default App;
