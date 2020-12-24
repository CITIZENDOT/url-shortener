import { React, useState } from "react";
import ClipboardJS from "clipboard";
import Header from "./Header";

import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Alert from 'react-bootstrap/Alert'


import axios from "axios";

import './App.css';
import "animate.css/animate.css";


function App() {

  let [Url, setUrl] = useState("");
  let [ErrorAlert, setErrorAlert] = useState("");
  let [response, setResponse] = useState({});

  const isValidHttpUrl = () => {
    let url;
    try {
      url = new URL(Url);
    } catch (err) {
      return false;
    }
    return true;
  }

  const handleSubmit = () => {
    animateCSS(".anim", "wobble");
    if (!isValidHttpUrl()) {
      setErrorAlert("Please enter a Valid URL");
      setResponse({});
      return;
    }
    axios.post("/postUrl", {
      fullUrl: Url
    })
      .then(response => {
        setResponse(response.data);
      })
      .catch(error => {
        console.log(error, error.response);
      });
  }



  const animateCSS = (element, animation, prefix = 'animate__') => {
    // We create a Promise and return it
    return new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`;
      const node = document.querySelector(element);

      node.classList.add(`${prefix}animated`, animationName);

      // When the animation ends, we clean the classes and resolve the Promise
      function handleAnimationEnd() {
        node.classList.remove(`${prefix}animated`, animationName);
        resolve('Animation ended');
      }

      node.addEventListener('animationend', handleAnimationEnd, { once: true });
    })
  };



  


  return (
    <div className="App">
      <Header />
      <Jumbotron>
        <h1>Paste your long URL here!</h1>
        <InputGroup size="lg">
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-lg">URL</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            aria-label="Large"
            aria-describedby="inputGroup-sizing-sm"
            type="url"
            value={Url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.google.com"
          />
        </InputGroup>
      </Jumbotron>
      <div className="shorten-button">
        <Button
          variant="outline-primary"
          size="lg"
          block
          onClick={handleSubmit}
        >
          Shorten!
        </Button>
      </div>

      <div className="display-alert">
        {(ErrorAlert && !Object.keys(response).length)
          ? <Alert variant="danger" className="anim">{ErrorAlert}</Alert>
          : null
        }
        {
          Object.keys(response).length
            ? (
              <Alert variant="success" className="anim">
                <Alert.Heading>
                  Short and Cute URL
              </Alert.Heading>
                <p> Your long URL <a href={response.fullUrl}> {response.fullUrl} </a> is shortened as below. </p>
                <p>
                  <a href={"http://localhost:8000/" + response.shortUrl}>
                    {"http://localhost:8000/" + response.shortUrl}
                  </a>
                </p>
              </Alert>
            )
            : null
        }
      </div>

    </div>
  );
}

export default App;
