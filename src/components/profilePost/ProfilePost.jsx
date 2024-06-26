"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import classes from "./profilePost.module.css";
import { BiDotsVerticalRounded } from "react-icons/bi";
import colors from "../../lib/color";
import {
  AiOutlineLike,
  AiFillStar,
  AiOutlineComment,
  AiFillLike,
} from "react-icons/ai";
import { useSession } from "next-auth/react";
import { fetchComment } from "@/app/api";
import { ProfileImageControl } from "../imageUndefined/ImageUndefined";

const ProfilePost = ({ book }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState(book?.user);
  const [color, setColor] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [bookLikes, setBookLikes] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    async function fetchComments() {
      const data = await fetchComment(book._id);

      const comments = data.commentCount;

      setCommentCount(comments);
    }
    fetchComments();
  }, [book]);

  useEffect(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setColor(randomColor);
  }, []);

  useEffect(() => {
    session && book && setIsLiked(book.likes.includes(session?.user?._id));
    session && book && setBookLikes(book.likes.length);
  }, [book, session]);

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/bookComment/${book._id}/like`, {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        method: "PUT",
      });

      if (res.ok) {
        if (isLiked) {
          setIsLiked((prev) => !prev);
          setBookLikes((prev) => prev - 1);
        } else {
          setIsLiked((prev) => !prev);
          setBookLikes((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   async function fetchUser() {
  //     const res = await fetch(`/api/profile/${book.user}`, {
  //       cache: "no-store",
  //     });
  //     const user = await res.json();

  //     setUser(user);
  //   }
  //   fetchUser();
  // }, [book]);

  return (
    <div className={classes.container}>
      <div className={classes.person}>
        <div className={classes.personLeft}>
          <ProfileImageControl
            altImage="profilPerson"
            imageName={user?.profilImage}
            widthImage="45"
            heightImage="45"
            className={classes.profilPerson}
            person={true}
          />
          <span>
            <h2>{user.name}</h2>
            <h3>@{user.username}</h3>
          </span>
        </div>
        <div className={classes.personRight}>
          <p>3s</p>
          <BiDotsVerticalRounded />
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.profilePost}>
          <div
            style={{ border: `5px solid ${color}` }}
            className={classes.postImageContainer}
          >
            <ProfileImageControl
              altImage="coverImage"
              imageName={book.book.bookImage}
              widthImage="300"
              heightImage="180"
              className={classes.bookImage}
              person={false}
            />
          </div>
        </div>
        <div className={classes.postInformation}>
          <h1>{book.book.title}</h1>
          <h2>{book.book.author}</h2>
          <div
            className={classes.desc}
            dangerouslySetInnerHTML={{ __html: book.description }}
          />
          <div className={classes.rateLike}>
            <div className={classes.rate}>
              <AiFillStar className={classes.icon} />
              <span>{book.rating}</span>
            </div>
            <div className={classes.rate}>
              <AiOutlineComment className={classes.icon} />
              <span>{commentCount}</span>
            </div>
            <div className={classes.rate}>
              {isLiked ? (
                <AiFillLike
                  className={classes.icon}
                  onClick={handleLike}
                  size={20}
                />
              ) : (
                <AiOutlineLike
                  className={classes.icon}
                  onClick={handleLike}
                  size={20}
                />
              )}
              <span>{bookLikes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePost;
