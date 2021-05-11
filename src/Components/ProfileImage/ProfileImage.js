import React, { useState, useRef, useCallback } from "react";
import Menubar from "../../Containers/Menubar/Menubar";
import Cropper from "react-easy-crop";
import { withRouter } from "react-router-dom";
import postImage, { getUserInfo } from "./profileimageservice";
import axios from "axios";
import {
  Form,
  Button,
  Segment,
  Divider,
  Image,
  Modal,
} from "semantic-ui-react";
import "./ProfileImage.css";
import getCroppedImg from "../../Utility/cropImage";

function ProfileImage(props) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user === null) {
    props.history.push("/loginsignup");
  }
  const [imgSrc, setImgSrc] = useState(
    user.profileImage ? "data:image/png;base64," + user.profileImage.file : null
  );
  const [showCrop, setShowCrop] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(
    user.profileImage ? "data:image/png;base64," + user.profileImage.file : null
  );
  const [formLoading, setFormLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fileRef = useRef(null);

  const cropstyle = {
    position: "relative",
    width: "50%",
    height: 200,
    background: "#333",
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imgSrc,
        croppedAreaPixels,
        rotation
      );
      setCroppedImage(croppedImage);
      setShowCrop(false);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation]);

  function handleFileChange(event) {
    // Assuming only image
    var file = fileRef.current.files[0];

    if (file instanceof Blob) {
      var type = file.type;
      if (
        type === "image/png" ||
        type === "image/jpeg" ||
        type === "image/jpg"
      ) {
        var reader = new FileReader();
        var url = reader.readAsDataURL(file);

        reader.onloadend = function (e) {
          setImgSrc(reader.result);
          setShowCrop(true);
        };
      } else {
        setOpen(true);
      }
    }
  }

  function handleSubmit(e) {
    setFormLoading(true);
    const config = { responseType: "blob" };
    axios.get(croppedImage, config).then((response) => {
      const file = new File([response.data], user.userId + "/profileImage", {
        type: response.data.type,
      });
      postImage(file)
        .then((res) => {
          getUserInfo(res.data.userId).then((res) => {
            setFormLoading(false);
            localStorage.setItem("user", JSON.stringify(res.data));
            props.history.push("/profile");
          });
        })
        .catch((err) => {
          setFormLoading(false);
          console.log("Exception :" + err.message);
        });
    });
  }

  const form = formLoading ? (
    <Form inverted loading>
      <label for='file-upload'>
        <h1 class='custom-file-upload' style={{ color: "#00b5ad" }}>
          Upload Profile Picture
        </h1>

        <Divider inverted />

        <Image
          src={
            croppedImage
              ? croppedImage
              : "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png"
          }
          className='profileImageDisp'
          rounded
          centered
          onClick={() => setShowCrop(true)}
        />
      </label>
      <input
        id='file-upload'
        ref={fileRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        type='file'
        accept='image/*'
      />
    </Form>
  ) : (
    <Form inverted style={{ zIndex: "3" }}>
      <label for='file-upload'>
        <h1 class='custom-file-upload' style={{ color: "#00b5ad" }}>
          Upload Profile Picture
        </h1>

        <Divider inverted />

        <Image
          src={
            croppedImage
              ? croppedImage
              : "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png"
          }
          className='profileImageDisp'
          rounded
          centered
          onClick={() => setShowCrop(true)}
        />
      </label>
      <input
        id='file-upload'
        ref={fileRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        type='file'
      />
    </Form>
  );
  return (
    <>
      <Menubar text='Profile' toggleSideBar={props.toggleSideBar} />

      {showCrop ? (
        <div style={{ zIndex: "-1", marginTop: "85px" }}>
          <div
            style={{
              height: "400px",
              position: "relative",
              background: "#333",
              margin: "20px 100px 0",
              zIndex: "0",
            }}
          >
            <Cropper
              image={imgSrc}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={1 / 1}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZ
              zoomChange={setZoom}
            />
          </div>
          <div className='controls'>
            <Form inverted style={{ width: "60%", margin: "20px 20%" }}>
              <div className='sliderContainer'>
                <Form.Input
                  label='Zoom'
                  min={1}
                  max={3}
                  name='zoom'
                  onChange={(e, { value }) => setZoom(value)}
                  step={0.1}
                  type='range'
                  value={zoom}
                />
              </div>
              <div className='sliderContainer'>
                <Form.Input
                  label='Rotation'
                  min={0}
                  max={360}
                  name='rotation'
                  onChange={(e, { value }) => setRotation(value)}
                  step={1}
                  type='range'
                  value={rotation}
                />
              </div>
              <Button onClick={showCroppedImage} primary className='cropButton'>
                Submit
              </Button>
            </Form>
          </div>
        </div>
      ) : (
        <div className='profile-disp'>
          <Segment
            inverted
            className='profile-picture-segment'
            style={{
              marginTop: "20px",
              width: "60%",
              marginLeft: "20%",
              marginBottom: "5%",
            }}
          >
            {form}
            <Modal
              onClose={() => setOpen(false)}
              dimmer={true}
              size='tiny'
              open={open}
            >
              <Modal.Header
                style={{
                  backgroundColor: "rgb(36, 35, 35)",
                  color: "white",
                  borderColor: "#4d4c4c",
                }}
              >
                Invalid Image
              </Modal.Header>
              <Modal.Content
                style={{
                  backgroundColor: "rgb(36, 35, 35)",
                  color: "white",
                }}
              >
                <p>
                  The file type is invalid. Please select a .jpg, .jpeg or .png
                  file.
                </p>
              </Modal.Content>
              <Modal.Actions
                style={{
                  backgroundColor: "rgb(36, 35, 35)",
                  color: "white",
                }}
              >
                <Button color='teal' onClick={() => setOpen(false)}>
                  Try Again!
                </Button>
              </Modal.Actions>
            </Modal>
            <Button color='teal' type='submit' onClick={handleSubmit}>
              Save
            </Button>
          </Segment>
        </div>
      )}
    </>
  );
}

export default withRouter(ProfileImage);
