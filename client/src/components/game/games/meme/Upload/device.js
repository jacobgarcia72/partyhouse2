import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { sendInput } from '../../../../../functions/index';
import Crop from '../Crop';
import { totalImages } from '../helpers';

const buildFileSelector = () => {
  const fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('accept', 'image/*');
  return fileSelector;
}

//select four indices for images
function selectIntegers(amount, max) {
  let res = [];
  while (res.length < amount) {
    const rndX = Math.floor(Math.random() * (max + 1));
    if (!res.includes(rndX)) {
      res.push(rndX);
    }
  }
  return res;
}

let fileSelector;

const UploadDevice = (props) => {
  const [imageIndices, setImageIndices] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [currentImg, setCurrentImg] = useState(null);

  const openFile = () => {
    const file = fileSelector.files[0];
    let reader  = new FileReader();
    reader.addEventListener("load", () => {
      setCurrentImg(reader.result);
    }, false);
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  useEffect(() => {
    setImageIndices(selectIntegers(8, totalImages - 1));
    fileSelector = buildFileSelector();
    fileSelector.addEventListener('change', openFile);    
  }, []);

  const handleFileSelect = (e) => {
    e.preventDefault();
    fileSelector.click();
  }

  const handleSubmit = (image) => {
    const { code, playerIndex } = props;
    const newUploads = uploads.slice();
    newUploads.push(image);
    setUploads(newUploads);
    sendInput(code, playerIndex, newUploads);
  }

  const handleNewImage = (img) => {
    window.scrollTo(0, 0);
    setCurrentImg(null);
    if (img || img === 0) {
      handleSubmit(img);
    }
  }

  const renderImages = () => {
    const uploadCount = uploads.length;
    const start = !uploadCount ? 0 : 4;
    const end = !uploadCount ? 4 : 8;
    const imageIndicesToShow = imageIndices.slice(start, end);
    return imageIndicesToShow.map((index) => <img alt="meme" key={index} src={`/assets/img/meme/templates/${index}.jpg`} onClick={() => setCurrentImg(index)} />);
  };

  const renderPage = () => {
    if (uploads.length === 2) {
      return <div className="center-screen upload">
        <div className="column">
          <h2>Done. Still waiting for:</h2>
          <div className="waiting-for-list">
            {(props.gameState.waitingFor || [])
              .filter(p => p.index !== props.playerIndex)
              .map((p, i) => <div key={i}>{p.name}</div>)}
          </div>
        </div>
      </div>
    }
    const settings = props.gameState.settings || {};
    return <div>
      <div className="step">
        <div className="impact">Step 1:</div>
        <div className="impact large-font">Select Images</div>
      </div>
      {(currentImg || currentImg === 0) ? <Crop img={currentImg} returnImage={handleNewImage} /> : null}
      <div className="row">
        <h2>{`Image ${uploads.length + 1} / 2`}</h2>
      </div>
      {settings.allowUpload ? (
        <React.Fragment>
          <div className="row">
            <button type="submit" onClick={handleFileSelect}>Upload Image</button>
          </div>
          <h2>
            Or select:
          </h2>
        </React.Fragment>
      ) : null}
      <div className="images">
        {renderImages()}
      </div>
    </div>
  }
  return renderPage();
}

function mapStateToProps({ playerIndex, code, gameState }) {
  return { playerIndex, code, gameState };
}

export default connect(mapStateToProps, null)(UploadDevice);
