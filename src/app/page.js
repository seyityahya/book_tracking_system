"use client";
import ProductCard from "@/components/productCard/ProductCard";
import SimpleSlider from "@/components/slider/SimpleSlider";
import React, { useEffect, useState } from "react";
import classes from "./page.module.css";
import { fetchProfilesAll, getBookPage } from "./api";
import { PropagateLoader } from "react-spinners";
import { set } from "mongoose";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchBooks() {

      const response = await getBookPage(currentPage);
      const fetchedBooks = response.books;
      const fetchedTotalPages = response.totalPages;
      const fetchedCurrentPages = response.currentPage;

      setCurrentPage(fetchedCurrentPages);
      setTotalPages(fetchedTotalPages);
      setBooks(fetchedBooks);
    }
    fetchBooks();
  }, []);

  async function fetchMoreBooks() {
    const response = await getBookPage(currentPage + 1);
    const fetchedBooks = response.books;
    const fetchedTotalPages = response.totalPages;
    const fetchedCurrentPages = response.currentPage;

    setCurrentPage(fetchedCurrentPages);
    setTotalPages(fetchedTotalPages);
    setBooks([...books, ...fetchedBooks]);
  }
  return (
    <div className={classes.container}>
      <SimpleSlider />
      <div className={classes.wrapper}>
        <div className={classes.product}>
          {books?.length > 0 ? (
            books.map((book) => <ProductCard key={book._id} book={book} />)
          ) : (
            <div className={classes.loadingAnimation}>
              <PropagateLoader size={30} color={"#bababa"} loading={true} />
            </div>
          )}
        </div>
      </div>
      {currentPage < totalPages ? <button
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded mx-auto mt-10 mb-0"
        onClick={fetchMoreBooks}>
        Daha fazla göster
      </button> : null}
    </div>
  );
};

export default Home;
