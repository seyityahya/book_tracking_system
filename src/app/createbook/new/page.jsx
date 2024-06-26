"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from "./newBook.module.css";
import "react-quill/dist/quill.snow.css";
import { GrSearch } from "react-icons/gr";
import Image from "next/image";
import { AiFillStar } from "react-icons/ai";
import { getBook, fetchBookPost, fetchSearchCreateBook } from "../../api";
import PulseLoader from "react-spinners/PulseLoader";
import dynamic from "next/dynamic";
import ReactStars from "react-rating-stars-component";
import SelectGenres from "@/components/selectGenres/SelectGenres";
import CreateImage from "@/components/createImage/CreateImage";
import Loading from "@/components/loading/Loading";
import ProductCard from "@/components/productCard/ProductCard";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const CreateBookNew = () => {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState();
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genres, setGenres] = useState([]);
  const [pages, setPages] = useState("");
  const [language, setLanguage] = useState("");
  const [years, setYears] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [allBook, setAllBook] = useState([]);

  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    const data = {
      title: title,
      bookImage: croppedImage ? URL.createObjectURL(croppedImage) : "",
      rating: rating,
      author: author,
      description: description,
    };
    setAllBook(data);
  }, [title, rating, author, description, croppedImage]);

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    return <p className={classes.accessDenied}>Access Denied</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    if (
      !croppedImage ||
      !title ||
      !rating ||
      !author ||
      !genres ||
      !pages ||
      !years ||
      !language ||
      !description
    ) {
      toast.error("All fields are required");
      setDisabled(false);
      return;
    }

    try {
      const processedGenres = genres.map((genre) => genre.toLowerCase());
      const formData = new FormData();
      const formComment = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("genres", processedGenres);
      formData.append("pages", pages);
      formData.append("years", years);
      formData.append("language", language);
      formData.append("croppedImage", croppedImage);
      formData.append("user", session?.user?._id);

      formComment.append("rating", rating);
      formComment.append("description", description);
      formComment.append("user", session?.user?._id);

      const token = session?.user?.accessToken;

      const response = await fetch(`/api/book`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: formData,
      });

      const bookId = await response.json();
      if (bookId) {
        formComment.append("book", bookId);
        const res = await fetch(`/api/bookComment`, {
          method: "POST",
          body: formComment,
        });

        if (res) {
          router.push(`/book/${bookId}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setDisabled(false);
  };

  return (
    <div className={classes.container}>
      <h2>Kitap Paylaş</h2>
      <div className={classes.wrapper}>
        <div className={classes.formBox}>
          <div className={classes.inputBox}>
            <ul>
              <li>
                <p>Kitap İsmi:</p>
                <input
                  value={title}
                  type="text"
                  placeholder="Kitap ismi giriniz"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </li>
              <li>
                <p>Kitap Yazarı:</p>
                <input
                  value={author}
                  type="text"
                  placeholder="Kitap Yazarı..."
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </li>
              <li>
                <p>Sayfa Sayısı:</p>
                <input
                  value={pages}
                  type="number"
                  placeholder="Sayfa Sayısı giriniz"
                  onChange={(e) => setPages(e.target.value)}
                />
              </li>
              <li>
                <p>Kitap Dili:</p>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="">Kitap Dili Seçiniz</option>
                  <option value="Türkçe">Türkçe</option>
                  <option value="English">English</option>
                </select>
              </li>
              <li>
                <p>Çıkış Yılı:</p>
                <input
                  type="date"
                  placeholder="Yıl giriniz"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                />
              </li>
              <li>
                <p>Puanınız:</p>
                <div className={classes.starPuan}>
                  <ReactStars
                    size={40}
                    count={5}
                    value={rating}
                    isHalf={true}
                    onChange={(newValue) => setRating(newValue)}
                  />
                </div>
              </li>
              <li>
                <p>Tür:</p>
                {/* <input
                      value={genres}
                      type="text"
                      placeholder="Tür (virgül koymayı unutma)..."
                      onChange={(e) => setGenres(e.target.value.split(","))}
                    /> */}
                <SelectGenres
                  selectedGenres={genres}
                  setSelectedGenres={setGenres}
                />
              </li>
              <li>
                <p>Resim Seç:</p>
                <CreateImage
                  aspect1={2}
                  aspect2={3}
                  croppedImage={croppedImage}
                  setCroppedImage={setCroppedImage}
                />
              </li>
            </ul>
          </div>
          <ReactQuill
            value={description}
            onChange={(e) => setDescription(e)}
            placeholder="Hikayeni yaz"
            className={classes.yourStory}
          />
        </div>
        <ProductCard book={allBook} profile={false} />
      </div>
      <button
        disabled={disabled}
        className={classes.createBlog}
        onClick={handleSubmit}
      >
        Paylaş
      </button>
      <ToastContainer />
    </div>
  );
};

export default CreateBookNew;
