"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AiFillBook } from "react-icons/ai";
import { FaBirthdayCake } from "react-icons/fa";
import { BiCurrentLocation } from "react-icons/bi";
import { TbNetwork } from "react-icons/tb";
import { BsFillPostcardFill } from "react-icons/bs";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import classes from "./profile.module.css";
import Image from "next/image";
import ProfilePost from "@/components/profilePost/ProfilePost";
import person from "../../../../public/person.jpg";
import background from "../../../../public/background2.jpg";
import { fetchProfileBook, fetchProfile, fetchAllProfile } from "@/app/api";
import Suggestion from "@/components/suggestion/Suggestion";
import { PropagateLoader } from "react-spinners";

const Profile = (ctx) => {
  const [suggestion, setSuggestion] = useState([]);
  const [user, setUser] = useState("");
  const [books, setBooks] = useState("");
  const [navbarSelect, setNavbarSelect] = useState("yayınlar");

  const { data: session } = useSession(false);

  const router = useRouter();
  let userBirthday = "";

  useEffect(() => {
    async function fetchUser() {
      const user = await fetchProfile(ctx.params.id);

      setUser(user);
    }
    async function fetchBooks() {
      const book = await fetchProfileBook(ctx.params.id);
      setBooks(book);
    }
    async function fetchSuggestion() {
      const users = await fetchAllProfile();
      const filteredUser = users.filter(
        (user) => user._id !== session?.user?._id
      );
      const shuffledData = filteredUser.sort(() => Math.random() - 0.5);
      const randomUsers = shuffledData.slice(0, 3);
      setSuggestion(randomUsers);
    }
    fetchUser();
    fetchBooks();
    fetchSuggestion();
  }, [ctx, session]);

  const handleButtonClick = (buttonName) => {
    setNavbarSelect(buttonName);
  };

  if (user.birthday) {
    userBirthday = user.birthday.split("T")[0];
  }

  return (
    <div className={classes.container}>
      <div className={classes.imageContainer}>
        <div className={classes.profileNavbar}>
          <Image
            className={classes.backgroundImage}
            alt="background"
            src={background}
            heigh={100}
          />
          <div className={classes.navbar}>
            <div className={classes.navbarLeft}>
              <button
                className={navbarSelect === "yayınlar" ? classes.active : ""}
                onClick={() => handleButtonClick("yayınlar")}
              >
                Yayınlar
              </button>
              <button
                className={navbarSelect === "yorumlar" ? classes.active : ""}
                onClick={() => handleButtonClick("yorumlar")}
              >
                Yorumlar
              </button>
            </div>
            <div className={classes.navbarRight}>
              {session?.user?._id !== user._id && <button>Takip Et</button>}
            </div>
          </div>
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.personAndStory}>
          <div className={classes.personProfile}>
            <div className={classes.top}>
              <div className={classes.profileImageContainer}>
                <Image
                  className={classes.profileImage}
                  alt="profilePerson"
                  src={`https://bookwave-profile-image.s3.eu-central-1.amazonaws.com/profileImage/${user?.profilImage}`}
                  width={150}
                  height={150}
                />
              </div>
              <h2>
                {user.name}
                <AiFillBook />
              </h2>
              <h3>@{user.username}</h3>
            </div>
            <div className={classes.bottom}>
              <p>{user.word}</p>
              <a>@Twitter</a>
              <div className={classes.information}>
                <div className={classes.info}>
                  <BiCurrentLocation /> <span>{user.location}</span>
                </div>
                <div className={classes.link}>
                  <TbNetwork />
                  <a>{user.website}</a>
                </div>
                <div className={classes.info}>
                  <FaBirthdayCake /> <span>{userBirthday}</span>
                </div>
                <div className={classes.link}>
                  <BsFillPostcardFill />
                  <a>28 post - 150 comment</a>
                </div>
              </div>
            </div>
          </div>
          <div className={classes.personStoryProfile}>
            <p>{user.story}</p>
          </div>
        </div>
        <div className={classes.post}>
          {navbarSelect === "yayınlar" ? (
            <div className={classes.postAndStory}>
              {books === "dont" ? (
                <div>kitap yok</div>
              ) : books?.length > 0 ? (
                books.map((book) => <ProfilePost key={book._id} book={book} />)
              ) : (
                <PropagateLoader size={30} color={"#bababa"} loading={true} />
              )}
            </div>
          ) : (
            ""
          )}
          {navbarSelect === "yorumlar" ? <div>yorumlar</div> : ""}
        </div>

        {/* Takip önerisi kısmı */}

        <div className={classes.right}>
          <h2>Takip Önerisi</h2>
          {suggestion?.length > 0 ? (
            suggestion.map((user) => (
              <Suggestion key={suggestion._id} user={user} />
            ))
          ) : (
            <div>öneriler yükleniyor...</div>
          )}
          <a>daha fazla</a>
        </div>
      </div>
    </div>
  );
};

export default Profile;
