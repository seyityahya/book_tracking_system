"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from "./login.module.css";
import { signIn } from "next-auth/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    setDisabled(true);
    e.preventDefault();

    if (password === "" || email === "") {
      toast.error("Fill all fields!");
      setDisabled(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setDisabled(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error == null) {
        router.push("/");
      } else {
        toast.error("Error occured while logging");
      }
    } catch (error) {
      console.log(error);
    }
    setDisabled(false);
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.information}>
          <h1>BookWave</h1>
          <div className={classes.middle}>
            <h2>
              Giriş Yap <br /> ve insanların neler okuduğunu gör
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
        <div className={classes.signIn}>
          <h2>Giriş Yap</h2>
          <h3>
            Hesabın yok mu ?{" "}
            <Link className={classes.register} href={"/register"}>
              Kayıt Ol
            </Link>
          </h3>
          <form onSubmit={handleSubmit}>
            <h4>Email Adresi :</h4>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <h4>Şifre :</h4>
            <input
              type="password"
              placeholder="Şifre"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button disabled={disabled} className={classes.submitButton}>
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
