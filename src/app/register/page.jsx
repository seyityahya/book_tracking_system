"use client";
import React, { useEffect, useState } from "react";
import classes from "./register.module.css";
import { signIn } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReactCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import ImageNext from "next/image";

const Register = () => {
  const initialCrop = {
    aspect: 1,
    unit: "px",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  };
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [birthday, setBirthday] = useState("");
  const [word, setWord] = useState("");
  const [story, setStory] = useState("");
  const [fileName, setFileName] = useState("");
  const [crop, setCrop] = useState(initialCrop);
  const [croppedImage, setCroppedImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (username === "" || name === "" || email === "" || password.length < 6) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [username, name, email, password]);

  const handleDeleteImage = () => {
    setOriginalImage(null);
    setCrop({ x: 0, y: 0 });
    setCroppedImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    if (username === "" || name === "" || email === "" || password === "") {
      toast.error("Fill all fields");
      setDisabled(false);
      return;
    }

    if (
      originalImage &&
      (croppedImage === null || croppedImage === undefined)
    ) {
      toast.error("Please image cropped");
      setDisabled(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setDisabled(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("location", location);
      formData.append("website", website);
      formData.append("birthday", birthday);
      formData.append("word", word);
      formData.append("story", story);
      formData.append("selectedImage", croppedImage);

      const res = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      console.log(await res.json());
      if (res.ok) {
        toast.success("Successfully registered the user");
        setTimeout(() => {
          signIn();
        }, 1000);
        return;
      } else {
        toast.error("Error occured while registering");
        setDisabled(false);
        return;
      }
    } catch (error) {
      console.log(error);
    }
    setDisabled(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const fileName = file?.name || "cropperImage";
    setFileName(fileName);
    if (originalImage) {
      URL.revokeObjectURL(originalImage);
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCroppedImage(null);
        setOriginalImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setOriginalImage(undefined);
    }
  };

  const handleCropComplete = (crop, percentCrop) => {
    const canvas = document.createElement("canvas");
    const imageObj = new Image();
    imageObj.src = originalImage;

    imageObj.onload = () => {
      const scaleX = imageObj.naturalWidth / 300;
      const scaleY = scaleX;

      const croppedAreaPixels = {
        x: Math.round(crop.x * scaleX),
        y: Math.round(crop.y * scaleY),
        width: Math.round(crop.width * scaleX),
        height: Math.round(crop.height * scaleY),
      };
      canvas.width = 250;
      canvas.height =
        (250 / croppedAreaPixels.width) * croppedAreaPixels.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        imageObj,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Canvas'tan Blob elde et
      canvas.toBlob((blob) => {
        const croppedFile = new File([blob], fileName, {
          type: "image/jpeg",
        });
        // Kırpılmış dosyayı state'e kaydet
        setCroppedImage(croppedFile);
      }, "image/jpeg");
    };
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.information}>
          <h1>BookWave</h1>
          <div className={classes.middle}>
            <h2>
              Kayıt Ol <br /> ve değişik kitap yorumlarını keşfet
            </h2>
            <h3>
              okuduğun kitapları paylaş, yorumları oku, yorum yap, topluluklara
              katıl.
            </h3>
          </div>
          <div className={classes.bottom}>
            <p>Okumadan geçen bir gün, yitirilmiş bir gündür.</p>
            <span>Paul Sartre</span>
          </div>
        </div>
        <div className={classes.register}>
          <h2>Kayıt Ol</h2>
          <h3>
            Hesabın var mı ?{" "}
            <button className={classes.register} onClick={() => signIn()}>
              Giriş Yap
            </button>
          </h3>
          <form onSubmit={handleSubmit}>
            <h4>İsim</h4>
            <input
              type="text"
              placeholder="İsim..."
              onChange={(e) => setName(e.target.value)}
            />
            <h4>Kullanıcı Adı</h4>
            <input
              type="text"
              placeholder="Kullanıcı adı..."
              onChange={(e) => setUsername(e.target.value)}
            />
            <h4>Email Adresi</h4>
            <input
              type="email"
              placeholder="Email..."
              onChange={(e) => setEmail(e.target.value)}
            />
            <h4>Şifre</h4>
            <input
              type="password"
              placeholder="Şifre..."
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className={classes.profileImageSelected}>
              <h4>Profil Resmini Seç</h4>
              {originalImage && (
                <button onClick={handleDeleteImage}>Resmi Sil</button>
              )}
            </div>
            <input
              type="file"
              name="myFile"
              id="file-upload"
              accept=".jpeg, .png, .jpg"
              onChange={handleFileUpload}
            />
            {originalImage && (
              <div className={classes.uploadImage}>
                <ReactCrop
                  aspect={1}
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={handleCropComplete}
                >
                  <ImageNext
                    src={originalImage}
                    alt={"kırma işlemi"}
                    style={{
                      maxWidth: "300px",
                      minWidth: "300px",
                      width: "300px",
                      height: "auto",
                    }}
                    width={300}
                    height={300}
                  />
                </ReactCrop>
              </div>
            )}
            {croppedImage && (
              <div
                style={{
                  position: "relative",
                  maxWidth: "150px",
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "grey",
                    margin: "5px 0",
                  }}
                >
                  Kaydedilecek Resim
                </p>
                <ImageNext
                  src={URL.createObjectURL(croppedImage)}
                  alt="Kırpılmış Resim"
                  width={250}
                  height={250}
                />
              </div>
            )}
            <button disabled={disabled} className={classes.submitButton}>
              Kayıt Ol
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;

// function convertToBase64(file) {
//   return new Promise((resolve, reject) => {
//     const fileReader = new FileReader();
//     fileReader.readAsDataURL(file);
//     fileReader.onload = () => {
//       resolve(fileReader.result);
//     };
//     fileReader.onerror = (error) => {
//       reject(error);
//     };
//   });
// }
