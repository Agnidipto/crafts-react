import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { Modal, Button, Form, Image, Input, Icon } from "semantic-ui-react";
import addPicture from "../../Utility/Pictures/addPicture.png";
import "./NewPost.css";
import { post } from "./newpostservice.js";

function NewPost(props) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [files, setFiles] = useState({
    file1: null,
    file2: null,
    file3: null,
  });

  const [postSaving, setPostSaving] = useState(false);

  const [text, setText] = useState({ name: "", desc: "" });

  const [error, setError] = useState({ open: false, content: "" });

  function errorModalClose(e) {
    setError({ open: false });
  }
  function shiftLeft(number) {
    switch (number) {
      case "file1": {
        setFiles({
          ...files,
          file1: files.file2,
          file2: files.file3,
          file3: null,
        });
        break;
      }
      case "file2": {
        setFiles({ ...files, file2: files.file3, file3: null });
        break;
      }
      case "file3":
        setFiles({ ...files, file3: null });
    }
  }

  function removeImage(event) {
    console.log(event.target.id);
    shiftLeft(event.target.id);
  }

  function handleFileChange(event) {
    // Assuming only image
    var file = event.target.files[0];

    if (file instanceof Blob) {
      var type = file.type;
      if (
        type === "image/png" ||
        type === "image/jpeg" ||
        type === "image/jpg"
      ) {
        var reader = new FileReader();
        var url = reader.readAsDataURL(file);
        console.log(event.target.id);
        reader.onloadend = function (e) {
          setFiles({ ...files, [event.target.id]: reader.result });
        };
      } else {
        setError({
          open: true,
          content:
            "Invalid File Type! Please upload .jpg, .jpeg or .png files only.",
        });
      }
    } else {
      setError({
        open: true,
        content:
          "Invalid File Type! Please upload .jpg, .jpeg or .png files only.",
      });
    }
  }

  function handleTextChange(event, { name, value }) {
    setText({ ...text, [name]: value });
  }

  function handleCancel() {
    setText({ name: "", desc: "" });
    setFiles({ file1: null, file2: null, file3: null });
    props.onClose();
  }

  function handleSubmit() {
    setPostSaving(true);

    post(files, text, user)
      .then((res) => {
        console.log(res.data);
        setPostSaving(false);
        setText({ name: "", desc: "" });
        setFiles({ file1: null, file2: null, file3: null });
        props.onClose();
      })
      .catch((err) => {
        setError({
          open: true,
          content: "Error submitting post. Try again later!",
        });
      });
  }

  const imageStyle = {
    backgroundColor: "rgb(36, 35, 35)",
    height: "100px",
  };

  function renderOtherInput(id) {
    return (
      <div
        style={{
          display: "inline-block",
          width: "fit-content",
          margin: "0 5px",
        }}
      >
        {files[id] ? (
          <>
            <label for={id} style={{ display: "inline-block" }}>
              <Image
                style={imageStyle}
                rounded
                src={files[id] ? files[id] : addPicture}
              />
              <Button
                style={{ marginTop: "5px", padding: 0 }}
                circular
                color='black'
                id={id}
                onClick={removeImage}
                className='remove-image-icon'
              >
                <Icon
                  fitted
                  circular
                  color='teal'
                  name='delete'
                  id={id}
                  onClick={removeImage}
                />
              </Button>
            </label>
          </>
        ) : (
          <label for={id}>
            <i className='fas fa-plus-square add-image-icon'></i>
          </label>
        )}
        <input
          type='file'
          id={id}
          onChange={handleFileChange}
          style={{
            display: "none",
            width: 0,
            height: 0,
            visibility: "hidden",
          }}
        />
      </div>
    );
  }

  const renderImages = (
    <div style={{ marginBottom: "10px" }}>
      {renderOtherInput("file1")}
      {files.file1 && renderOtherInput("file2")}
      {files.file2 && renderOtherInput("file3")}
    </div>
  );

  const ModalContentStyle = {
    backgroundColor: "rgb(36, 35, 35)",
    color: "white",
  };

  const ModalHeaderStyle = {
    backgroundColor: "rgb(36, 35, 35)",
    color: "white",
    borderColor: "#4d4c4c",
  };
  return (
    <Modal
      open={props.confirmOpen}
      size='fullscreen'
      dimmer={true}
      onClose={handleCancel}
      style={{ marginLeft: "2.5%" }}
    >
      <Modal.Header style={ModalHeaderStyle}>New Post</Modal.Header>
      <Modal.Content style={ModalContentStyle}>
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <Input
            placeholder='Name of the Post'
            size='large'
            style={{ width: "400px" }}
            name='name'
            value={text.name}
            onChange={handleTextChange}
          />
        </div>
        <Form style={{ textAlign: "center" }}>
          {renderImages}
          <Form.TextArea
            placeholder='Add a description...'
            name='desc'
            value={text.desc}
            onChange={handleTextChange}
          />
        </Form>

        <Modal open={error.open} size='small' onClose={errorModalClose}>
          <Modal.Header style={ModalHeaderStyle}>{error.content}</Modal.Header>
          <Modal.Actions style={ModalContentStyle}>
            <Button color='teal' onClick={errorModalClose}>
              Ok
            </Button>
          </Modal.Actions>
        </Modal>
      </Modal.Content>
      <Modal.Actions style={ModalContentStyle}>
        <Button color='black' onClick={handleCancel}>
          Cancel
        </Button>
        {postSaving ? (
          <Button color='teal' loading onClick={handleSubmit}>
            Save Post
          </Button>
        ) : (
          <Button color='teal' onClick={handleSubmit}>
            Save Post
          </Button>
        )}
      </Modal.Actions>
    </Modal>
  );
}

export default withRouter(NewPost);
