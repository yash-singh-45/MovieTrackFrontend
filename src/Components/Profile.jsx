import React, { useContext, useRef } from 'react';
import { useState, useEffect } from 'react';
import { replace, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProfileSkeleton from './ProfileSkeleton';
import { AuthContext } from './AuthContext';
import { MoreVertical, MoreHorizontal } from 'lucide-react';
import { X } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);
  const [openCollectionMenu, setOpenCollectionMenu] = useState(null);
  const baseurl = import.meta.env.VITE_BASE_URL;
  const [collections, setCollections] = useState([]);
  const [collectionSideBar, setCollectionSideBar] = useState(false);
  const [createCollectionBtn, setCreateCollectionBtn] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionBio, setNewCollectionBio] = useState("");
  const [newCollectionVisibility, setNewCollectionVisibility] = useState("PUBLIC");
  const [collectionLoading, setCollectionLoading] = useState(true);
  const [creatingCollection, setCreatingCollection] = useState(false);
  const [deletingCollection, setDeletingCollection] = useState(false);

  const menuRef = useRef(null);
  const collectionSideBarRef = useRef(null);

  async function getCollections() {
    const token = localStorage.getItem('token');

    if (!token || !user) {
      return;
    }

    try {
      setCollectionLoading(true);
      const res = await fetch(`${baseurl}/collection/get`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const response = await res.json();
      setCollections(response);
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setCollectionLoading(false);
    }
  }

  // Function to delete Collection
  async function deleteCollections(id) {

    const token = localStorage.getItem('token');
    if (!token || !user) return;

    try {
      setDeletingCollection(true);
      const result = await fetch(`${baseurl}/collection/delete`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: id
      });


      if (!result.ok) {
        const error = await result.json();
        toast.error(error.error);
        console.log("Error: ", error.error);
        return;
      }

      const respone = await result.json();
      toast.success("Collection deleted successfully!!");
      getCollections();

    } catch (err) {
      toast.error("Error deleting collections!!");
      console.log("Error:", err);
    } finally {
      setDeletingCollection(false);
    }
  }

  //Function to create Collection
  async function createCollection(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token || !user) return;

    const collectionDto = {
      "name": newCollectionName,
      "bio": newCollectionBio ? newCollectionBio : null,
      "isPrivate": newCollectionVisibility === "PUBLIC" ? false : true
    }
    try {
      setCreatingCollection(true);

      const result = await fetch(`${baseurl}/collection/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(collectionDto)
      })

      const response = await result.json();
      toast.success("Collection created succesfully!!");
      getCollections();
    } catch (error) {
      toast.error("Error creating collection!!");
      console.log("Error:", error);
    } finally {
      setNewCollectionName("");
      setNewCollectionBio("");
      setNewCollectionVisibility("PUBLIC");
      setCreatingCollection(false);
      setCreateCollectionBtn(false);
    }
  }

  useEffect(() => {
    if (loading) return;

    if (!user) {
      toast.error("Session expired. Please log in again.");
      navigate("/", {
        replace: true
      });
    }

    getCollections();
  }, [user, loading, navigate]);


  // UseEffect to handle openCollectionMenu
  useEffect(() => {
    if (openCollectionMenu === null) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenCollectionMenu(null);
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };

  }, [openCollectionMenu])


  // UseEffect to handle CollectionSideBar
  useEffect(() => {
    if (collectionSideBar === false) return;

    const handleClickOutside = (e) => {
      if (collectionSideBarRef.current && !collectionSideBarRef.current.contains(e.target)) {
        setCollectionSideBar(false);
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };

  }, [collectionSideBar])


  //Function to share collections
  async function handleShare(collection) {
    const url = `${window.location.origin}/collections/${collection.publicId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: collection.name,
          text: `Check out my movie collection "${collection.name}"`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error(err);
    }
  }


  if (loading) return <ProfileSkeleton />;

  const userData = user;

  return (
    <div className="bg-[#0F1117] min-h-screen text-white px-4 sm:px-10 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-white text-black font-bold text-2xl w-16 h-16 flex items-center justify-center rounded-full border-4 border-[#00FFD1]">
            <img className='h-15 w-15' src={"https://avatarapi.runflare.run/public/boy"} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{userData.username}</h2>
          </div>
        </div>
        <button className="mt-4 sm:mt-0 border border-[#00FFD1] text-[#00FFD1] px-4 py-2 rounded hover:bg-[#00FFD1] hover:text-black transition">
          Edit Profile
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-8">
        <div className="bg-[#1A1C22] p-4 rounded">
          <p className="text-2xl font-bold">120</p>
          <p className="text-sm text-gray-400">Movies Watched</p>
        </div>
        <div className="bg-[#1A1C22] p-4 rounded">
          <p className="text-2xl font-bold">55</p>
          <p className="text-sm text-gray-400">TV Shows Watched</p>
        </div>
        <div className="bg-[#1A1C22] p-4 rounded">
          <p className="text-2xl font-bold">30</p>
          <p className="text-sm text-gray-400">Total Reviews</p>
        </div>
        <div className="bg-[#1A1C22] p-4 rounded">
          <p className="text-2xl font-bold">45</p>
          <p className="text-sm text-gray-400">Watchlist Items</p>
        </div>
      </div>


      {/* Collections Section */}
      {
        collectionLoading ? <CollectionSectionSkeleton /> : (
          <div className="mb-8">
            <div className="flex justify-between items-center relative mb-4">
              <h3 className="text-xl font-semibold">Your Collections</h3>
              <button onClick={() => setCollectionSideBar(collectionSideBar ? false : true)} className="cursor-pointer absolute top-1 z-20 right-2 text-[#00FFD1] hover:underline text-sm ">
                <MoreHorizontal size={20} />
              </button>

              {
                collectionSideBar && (
                  <div ref={collectionSideBarRef} className="absolute top-8 z-10 right-0 w-36 rounded-lg bg-gray-800 shadow-lg border border-gray-700">
                    <button onClick={() => setCreateCollectionBtn(true)} className=" cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-700">Create New</button>
                    <button className=" cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-700">View All</button>
                  </div>
                )
              }

              {
                createCollectionBtn && (
                  <div ref={collectionSideBarRef} className="absolute top-8 z-20 w-70 right-5  md:right-15 md:w-100 rounded-lg bg-gray-800 shadow-lg border border-gray-700">
                    <form onSubmit={createCollection} className='flex flex-col px-2 py-2 gap-2' action="">
                      <button onClick={() => setCreateCollectionBtn(false)} className='mb-2'>
                        <X size={15} className='absolute top-1 right-2' />
                      </button>
                      <input required type="text"
                        id='collectionName'
                        placeholder='Enter Collection Name'
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                        className=' border-[#00FFD1] border rounded-lg px-2 h-10' />
                      <input type="text" placeholder='Enter Bio (Optional)'
                        id='collectionBio'
                        value={newCollectionBio}
                        onChange={(e) => setNewCollectionBio(e.target.value)}
                        className=' border-[#00FFD1] border rounded-lg px-2 h-10' />
                      <div className='flex gap-4 items-center border border-[#00FFD1] h-10 rounded-lg px-2 text-gray-400'>

                        <label htmlFor="private">Private</label>
                        <input
                          type="radio"
                          id="private"
                          name="visibility"
                          value="PRIVATE"
                          checked={newCollectionVisibility === "PRIVATE"}
                          onChange={(e) => setNewCollectionVisibility(e.target.value)}
                        />
                        <label htmlFor="public">Public</label>
                        <input
                          type="radio"
                          id="public"
                          name="visibility"
                          value="PUBLIC"
                          checked={newCollectionVisibility === "PUBLIC"}
                          onChange={(e) => setNewCollectionVisibility(e.target.value)}
                        />
                      </div>
                      <button disabled={creatingCollection} type='submit' className='bg-[#00FFD1] w-20 mt-2 mx-auto disabled:cursor-not-allowed disabled:opacity-70 text-gray-800 font-semibold hover:bg-cyan-400 rounded-lg p-1 cursor-pointer'>
                        {
                          creatingCollection ? (
                            <div className="flex justify-center items-center">
                              <div className="h-5 w-5 border-2 border-gray-500 border-t-[#00FFD1] rounded-full animate-spin" />
                            </div>
                          ) : ("Create")
                        }
                      </button>
                    </form>
                  </div>
                )
              }
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2" style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}>
              {collections.length === 0 ? (
                <div className=" mb-8">
                  <div className=" border-gray-700 rounded-xl p-10 text-center bg-gray-700/30">

                    <h4 className="text-xl font-semibold text-white mb-2">
                      No Collections Yet
                    </h4>

                    <p className="text-gray-400 max-w-md mx-auto mb-6">
                      Organize your favorite movies into collections like
                      <span className="text-[#00FFD1]"> Sci-Fi</span>,
                      <span className="text-[#00FFD1]"> Watch Later</span>, or
                      <span className="text-[#00FFD1]"> Top Rated</span>.
                    </p>

                    <button
                      onClick={() => setCreateCollectionBtn(true)}
                      className="bg-[#00FFD1] text-gray-900 px-5 py-2 rounded-lg font-semibold hover:bg-cyan-400 transition cursor-pointer"
                    >
                      Create Your First Collection
                    </button>
                  </div>
                </div>
              ) : collections.map((item, idx) => (
                <div
                  key={idx}
                  className="relative flex-shrink-0 w-[200px] md:w-[260px] lg:w-[300px] rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/collections/${item.publicId}`)}
                >
                  <div className="absolute top-2 right-2 z-20">
                    <button onClick={(e) => {
                      e.stopPropagation()
                      setOpenCollectionMenu(openCollectionMenu === idx ? null : idx)
                    }}
                      className="p-1 cursor-pointer">
                      <MoreVertical className='text-gray-800' size={18} />
                    </button>

                    {openCollectionMenu === idx && (
                      <div ref={menuRef} className="absolute top-8 right-0 w-36 rounded-lg bg-gray-800 shadow-lg border border-gray-700">
                        <button onClick={(e) => {
                          e.stopPropagation();
                          handleShare(item);
                        }} className="w-full text-left px-4 py-2 hover:bg-gray-700">Share</button>

                        {deletingCollection ? (
                          <div className="flex items-center justify-center py-2">
                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          </div>
                        ) : (<button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCollections(item.id);
                          }} className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700">Delete</button>)}

                      </div>
                    )}
                  </div>

                  <div className="w-full h-30 md:h-40 border bg-amber-100 flex items-center justify-center p-4">
                    <p className="font-semibold text-gray-600 text-lg md:text-2xl text-center break-words line-clamp-3">
                      {item.name}
                    </p>
                  </div>

                  <div className="px-2 md:px-3 md:py-2 py-1 bg-gray-700">
                    <p className="font-bold truncate">{item.name}</p>
                    <p className="text-xs text-gray-300">{item.movieCount} movies</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }


      {/* Recently Watched */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Recently Watched</h3>
        <div className="flex flex-wrap gap-2">
          {["Sci-Fi", "Drama", "Action", "Comedy", "Thriller", "Fantasy"].map((genre, idx) => (
            <span
              key={idx}
              className="bg-[#00FFD1] text-black px-3 py-1 rounded-full text-sm font-medium"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>

      {/* Account Settings */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
        <ul className="space-y-2">
          <li className="hover:underline cursor-pointer">Change Password</li>
          <li className="hover:underline cursor-pointer">Manage Subscriptions</li>
          <li className="hover:underline cursor-pointer">Privacy Settings</li>
        </ul>
      </div>
    </div >
  );
};

export default Profile;


const CollectionSectionSkeleton = () => {
  return (
    <div className="mb-8 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-7 w-44 bg-gray-700 rounded"></div>
        <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
      </div>

      {/* Collection Cards */}
      <div
        className="flex gap-4 overflow-x-auto pb-2"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-[200px] md:w-[260px] lg:w-[300px] rounded-lg overflow-hidden"
          >
            {/* Cover */}
            <div className="w-full h-30 md:h-40 bg-gray-700 relative">
              <div className="absolute top-2 right-2 h-6 w-6 bg-gray-600 rounded-full"></div>
            </div>

            {/* Bottom Info */}
            <div className="bg-gray-800 px-3 py-3 space-y-2">
              <div className="h-5 w-3/4 bg-gray-700 rounded"></div>
              <div className="h-4 w-1/3 bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};