import React from 'react';
import AvatarEditor from 'react-avatar-editor';
 
class MyEditor extends React.Component {

  constructor(props) {
    super(props);
    
    const src = Number.isInteger(props.img) ? `/assets/img/meme/templates/${props.img}.jpg` : null;

    this.state={height: 240, src, zoom: 1};
  }

  image = null;

  rotateImg = (image, clockwiseTurns, callback) => {
    
    // create an off-screen canvas
    var offScreenCanvas = document.createElement('canvas');
    let offScreenCanvasCtx = offScreenCanvas.getContext('2d');

    // set its dimension to rotated size
    if (clockwiseTurns===1 || clockwiseTurns===3) {
        offScreenCanvas.height = image.width;
        offScreenCanvas.width = image.height;
    } else {
        offScreenCanvas.height = image.height;
        offScreenCanvas.width = image.width;
    }

    // rotate and draw source image into the off-screen canvas:
    if (clockwiseTurns===1) { 
        offScreenCanvasCtx.rotate(90 * Math.PI / 180);
        offScreenCanvasCtx.translate(0, -offScreenCanvas.width);
    } else if (clockwiseTurns===3) {
        offScreenCanvasCtx.rotate(-90 * Math.PI / 180);
        offScreenCanvasCtx.translate(-offScreenCanvas.height, 0);
    } else {
        offScreenCanvasCtx.translate(image.width, image.height);
        offScreenCanvasCtx.rotate(Math.PI);
    }
    offScreenCanvasCtx.drawImage(image, 0, 0);

    // encode image to data-uri with base64
    const rotatedImg = offScreenCanvas.toDataURL("image/png", 100);
    callback(rotatedImg, offScreenCanvas.width, offScreenCanvas.height);
  }

  setImageView = (image, width, height)=> {
    this.setSize(image, width, height);
    this.setState({src: image.src});
  }

  setSize = (image, width, height)=> {
    const imgHeight = height || image.height;
    const scaledHeight = imgHeight * this.state.zoom;
    const imgWidth = width || image.width;
    const setHeight = 280 * Math.max(0.6, Math.min(0.9, (scaledHeight / imgWidth)));
    this.setState({height: setHeight});
  }

  componentDidMount =()=> {
    const EXIF = require('exif-js');
    let loaded = false;

    this.image = new Image(); 
    this.image.onload = ()=>{
      if (loaded) return;
      loaded = true; //only execute this once
      
      if (Number.isInteger(this.props.img)) {
        this.setState({height: (this.image.height / this.image.width * 280)});
        return;
      }

      EXIF.getData(this.image, ()=> {
        var orientation = EXIF.getTag(this.image, "Orientation");
        switch(orientation) {
          case 3: // upside down. Rotate twice to fix
            this.rotateImg(this.image, 2, rotatatedImg => {
              this.image.src = rotatatedImg;
              this.setImageView(this.image);
            });
            break;
          case 6: // upside left. Rotate clockwise to fix
            this.rotateImg(this.image, 1, (rotatatedImg, width, height) => {
              this.image.src = rotatatedImg;
              this.setImageView(this.image, width, height);
            });
            break;
          case 8: // upside right. Rotate c-clockwise to fix
            this.rotateImg(this.image, 3, (rotatatedImg, width, height) => {
              this.image.src = rotatatedImg;
              this.setImageView(this.image, width, height);
            });
            break;
          default:
            this.setImageView(this.image);
            break;
        }
      });
    };

    const {img} = this.props;
    this.image.src = Number.isInteger(img) ? `/assets/img/meme/templates/${img}.jpg` : img;
  }

  onClickSave = () => {
    if (Number.isInteger(this.props.img)) {
      this.props.returnImage(this.props.img);
    } else {
      const img = this.editor ? this.editor.getImageScaledToCanvas().toDataURL('image/jpeg', 0.65) : null;
      this.props.returnImage(img);
    }
  }
   
  setEditorRef = (editor) => this.editor = editor

  handleRotate = clockWise => {
    this.rotateImg(this.image, clockWise ? 1 : 3, (rotatatedImg, width, height) => {
      this.image.src = rotatatedImg;
      this.setImageView(this.image, width, height);
    });
  }

  handleZoom = zoomOut => {
    let { zoom } = this.state;
    zoom = zoomOut ? Math.max(1, zoom / 1.1) : Math.min(2, zoom * 1.1);
    this.setState({zoom}, () => this.setSize(this.image));
  }

  renderControls = () => {
    return ( 
      <div className="row adjust-img-buttons">
        <i className="fas fa-undo" onClick={() => this.handleRotate(false)}></i>
        <i className="fas fa-redo" onClick={() => this.handleRotate(true)}></i>
        <i className="fas fa-search-plus" onClick={() => this.handleZoom(false)}></i>
        <i className="fas fa-search-minus" onClick={() => this.handleZoom(true)}></i>
      </div>
    )
  }

  render() {
    const {height, src, zoom} = this.state;
    let renderDisplay = <p>Loading Image...</p>;
    if (src) renderDisplay = (
      <AvatarEditor
        onScroll={e => console.log(e)}
        ref={this.setEditorRef}
        image={src}
        width={280}
        height={height}
        border={10}
        color={[0, 0, 0, 0.6]} // RGBA
        scale={zoom}
        rotate={0}
      />
    )
    return (
      <div className="ImgCrop cover-screen">
        <div className="column">
          <div className="img-editor-container">
            {renderDisplay}
          </div>
          {Number.isInteger(this.props.img) ? null : this.renderControls()}
          {src ? <button type="submit" onClick={this.onClickSave}>Confirm</button> : <br/>}
          <div className="btn-link" onClick={()=>this.props.returnImage(null)}>Cancel</div>
        </div>
      </div>
    )
  }
}
 
export default MyEditor