import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Alert, Button, TextInput } from "flowbite-react";
import { storage } from "../firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const DashboardProfile = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(null);
  const [imageFileUploadingError, setImageFileUploadingError] = useState(null);

  const filePickerRef = useRef();

  const { currentUser } = useSelector((state) => state.user);
  //   console.log(currentUser);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  //   console.log(imageFile, imageFileUrl);

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = () => {
    setImageFileUploadingError(null);
    // console.log("uploading Image...");
    const storageRef = ref(storage, `portfolio/${Date.now()}${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadingProgress(progress.toFixed(0));
        // console.log("Upload is " + progress + "% done");
      },
      (error) => {
        // Handle unsuccessful uploads
        setImageFileUploadingError(
          "Could not upload the file. Upload only images less than 2MB."
        );
        setImageFileUploadingProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          //   console.log("File available at", downloadURL);
          setImageFileUrl(downloadURL);
          console.log(downloadURL);
        });
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          className="hidden"
        />

        <div
          className="w-32 h-32 cursor-pointer shadow-md overflow-hidden rounded-full relative"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadingProgress && (
            <CircularProgressbar
              value={imageFileUploadingProgress || 0}
              text={`${imageFileUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152, 199, ${
                    imageFileUploadingProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePhoto}
            alt="User profile"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadingProgress &&
              imageFileUploadingProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>

        {imageFileUploadingError && (
          <Alert color="failure">{imageFileUploadingError}</Alert>
        )}

        <div className="w-full flex flex-col gap-4 px-6">
          <TextInput
            type="text"
            id="username"
            placeholder="username"
            defaultValue={currentUser.username}
          />
          <TextInput
            type="email"
            id="email"
            placeholder="email"
            defaultValue={currentUser.email}
          />
          <TextInput type="password" id="password" placeholder="Password" />
          <Button
            type="submit"
            gradientDuoTone="purpleToBlue"
            className="w-full"
            outline
          >
            Update
          </Button>
        </div>
      </form>

      <div className="flex justify-between text-red-500 px-6 pt-4 ">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default DashboardProfile;
