import Image from "next/image";
import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import classes from "./search.module.css";
import { useRouter } from "next/navigation";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState([]);
  const [search, setSearch] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function searchControl() {
      const res = await fetch(`http://localhost:3000/api/book`);
      if (!res.ok) {
        throw new Error("Error occurred");
      }

      const books = await res.json();

      const searchResult = books.filter((book) =>
        book.title.toLowerCase().includes(search)
      );

      const similarSearch = searchResult.slice(0, 3);

      setSearchTerm(similarSearch);
    }

    searchControl();
  }, [search]);

  const onSearch = (event) => {
    event.preventDefault();
    router.push(`/search?q=${search}`);
    setSearch("");
  };

  return (
    <div className={classes.container}>
      <div className={classes.search}>
        <form onSubmit={onSearch}>
          <input
            type="text"
            value={search}
            placeholder="Kitap Ara..."
            onChange={(event) => setSearch(event.target.value)}
          />
        </form>
        <AiOutlineSearch className={classes.icons} />
      </div>
      {search.length > 0 && (
        <div className={classes.searchBox}>
          {searchTerm.map((book) => (
            <div className={classes.searchBook}>
              <Image alt="" src={book.coverImage} width="50" height="80" />
              <span>
                <h2>{book.title}</h2>
                <h3>{book.author}</h3>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
