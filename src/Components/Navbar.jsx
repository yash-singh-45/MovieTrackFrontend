import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar';
import { ChevronDown } from 'lucide-react';
import { SearchContext } from './SearchContext';

const storage_key = 'search_history';

const Navbar = () => {
  const [searchBox, setSearchBox] = useState("");
  const [recent, setRecent] = useState([]);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestion, setSuggestion] = useState([]);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const {searchOption, setSearchOption} = useContext(SearchContext);
  const [optionOpen, setOptionOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storage_key)) || [];
    setRecent(data);
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (optionOpen === false) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOptionOpen(false);
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };

  }, [optionOpen])

  function handleKeyDown(e) {
    if (!showDropdown || suggestion.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev =>
        prev < suggestion.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev =>
        prev > 0 ? prev - 1 : suggestion.length - 1
      );
    }

    if (e.key === "Enter") {
      if (activeIndex >= 0) {
        e.preventDefault();
        handleSuggestionClick(suggestion[activeIndex]);
      }
    }

    if (e.key === "Escape") {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  }


  function handleChange(e) {
    setActiveIndex(-1);
    const value = e.target.value;
    setSearchBox(value);


    if (!value.trim()) {
      const latest = recent.map(item => item.query).slice(0, 5);
      setSuggestion(latest);
      setShowDropdown(latest.length > 0);
      return;
    }

    const filtered = recent
      .filter(item => item.query.toLowerCase().includes(value.toLowerCase()))
      .map(item => item.query)
      .slice(0, 5);

    setSuggestion(filtered);
    setShowDropdown(filtered.length > 0);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!searchBox.trim()) {
      return;
    }

    navigate(`/search?query=${encodeURIComponent(searchBox)}&type=${searchOption}`);
  }

  function handleSuggestionClick(q) {
    setSearchBox(q);
    setShowDropdown(false);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

  }


  return (
    <div className='sticky top-0 z-50 bg-[#0F1115] shadow-md'>
      <nav className=" flex items-center justify-between pt-2 md:pt-4 px-5 py-4 md:px-8 md:py-1 shadow-md">
        <h1 onClick={() => navigate("/")} className="text-cyan-400 text-1xl md:text-3xl font-bold cursor-pointer">🎬 CineTrack</h1>

        <div className='relative w-3/5 md:w-1/2 lg:w-2/5 flex gap-1 md:gap-3'>

          <form ref={wrapperRef} onSubmit={handleSubmit} className="relative  gap-1 md:gap-3 items-center flex w-full">
            <ChevronDown onClick={() => {
              setOptionOpen(optionOpen === true ? false : true);
              setShowDropdown(false);
            }
            } size={23} className='cursor-pointer' />

            {
              optionOpen && (
                <div ref={menuRef} className="absolute top-15 left-0 w-36 rounded-lg bg-gray-800 shadow-lg border border-gray-700">
                  <button onClick={(e) => {
                    e.stopPropagation();
                    setSearchOption("movies");
                    setOptionOpen(false);
                  }} className="w-full text-left px-4 py-2 hover:bg-gray-700">Search Movies</button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchOption("personalities");
                      setOptionOpen(false);
                    }} className="w-full text-left px-4 py-2  hover:bg-gray-700">Search Celebs</button>

                </div>
              )
            }
            <input
              type="search"
              placeholder={`Search ${searchOption}...`}
              value={searchBox}
              onKeyDown={handleKeyDown}
              ref={inputRef}
              onChange={handleChange}
              onFocus={() => {
                if (!searchBox.trim()) {
                  const latest = recent.map(item => item.query).slice(0, 5);
                  setSuggestion(latest);
                  setShowDropdown(latest.length > 0);
                } else if (suggestion.length > 0) {
                  setShowDropdown(true);
                }
              }}
              className="w-full hover:border-2 text-sm md:text-2xl  px-2 py-1 md:px-4 md:py-2 rounded-full bg-[#1C1F26] border overflow-hidden whitespace-nowrap text-ellipsis border-cyan-500 text-white focus:outline-none"
            />

            {showDropdown && (
              <div className="absolute top-10 md:top-15 mt-2 w-full bg-[#1A1C22] border border-cyan-500 rounded-lg shadow-lg z-50">
                {suggestion.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSuggestionClick(item)}
                    className={`px-2 py-2 md:px-4 md:py-2 cursor-pointer hover:bg-cyan-500/10 text-xs md:text-lg overflow-hidden whitespace-nowrap 
                    ${idx === activeIndex ? "bg-cyan-500/20" : "hover:bg-cyan-500/10"} text-ellipsis`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </form>

          <button
            onClick={() => setSideBarOpen(true)}
            className="text-white text-2xl md:text-3xl hover:text-cyan-400 transition cursor-pointer"
          >
            ☰
          </button>

        </div>
      </nav>

      <Sidebar
        isOpen={sideBarOpen}
        onClose={() => setSideBarOpen(false)}
      />

    </div >
  )
}

export default Navbar