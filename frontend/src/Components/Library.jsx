import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import jwtDecode from "jwt-decode";
import PlaylistPlayOutlinedIcon from "@mui/icons-material/PlaylistPlayOutlined";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import ReactLoading from "react-loading";
import { useState, useEffect } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import "../Css/library.css";

function generateRandomColors(count) {
  const transparency = 0.5; // Adjust transparency as needed (0 to 1)
  const colors = [];

  for (let i = 0; i < count; i++) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    colors.push(`rgba(${r}, ${g}, ${b}, ${transparency})`);
  }

  return colors;
}

function Library() {
  const [watchlater, setWatchLater] = useState([]);
  const [PlaylistData, setPlaylistData] = useState([]);
  const [playlistColors, setPlaylistColors] = useState([]);
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const token = localStorage.getItem("userToken");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setEmail(jwtDecode(token).email);
  }, [token]);

  useEffect(() => {
    const colors = generateRandomColors(Math.max(1, PlaylistData.length));
    setPlaylistColors(colors);
  }, [PlaylistData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    const getPlaylistData = async () => {
      try {
        if (email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getplaylistdata/${email}`
          );
          const playlistData = await response.json();
          setPlaylistData(playlistData);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getPlaylistData();
  }, [email]);

  useEffect(() => {
    const getWatchLater = async () => {
      try {
        if (email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getwatchlater/${email}`
          );
          const savedData = await response.json();
          setWatchLater(savedData);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(getWatchLater, 100);

    return () => clearInterval(interval);
  }, [email]);

  const watchLaterArray =
    watchlater && watchlater.length > 0
      ? watchlater.slice(0, 4) // Get the first four elements if available
      : [];

  const PlaylistArray =
    PlaylistData && PlaylistData.length > 0
      ? PlaylistData.slice(0, 4) // Get the first four elements if available
      : [];

  if (loading === true) {
    return (
      <>
        <Navbar />
        <LeftPanel />
        <div className="main-trending-section">
          <div className="spin2" style={{ height: "auto" }}>
            <ReactLoading
              type={"spin"}
              color={"white"}
              height={50}
              width={50}
            />
            <p style={{ marginTop: "15px" }}>
              Fetching the data, Hang tight...{" "}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <LeftPanel />
      <div className="library-section">
        <div className="watchlater-library">
          <div className="top-watchlater-library">
            <WatchLaterOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
            <p>Watch later</p>
            <p>{watchlater && watchlater.length}</p>
            {watchLaterArray && watchLaterArray.length >= 4 ? (
              <p className="see-all">See all</p>
            ) : (
              ""
            )}
          </div>
          <div className="watchlater-library-videos">
            {watchLaterArray &&
              watchLaterArray.map((element, index) => {
                return (
                  <div
                    className="thiswatchlater-videoss"
                    key={index}
                    onClick={() => {
                      navigate(`/video/${element.savedVideoID}`);
                      window.location.reload();
                    }}
                  >
                    <img
                      src={element.thumbnailURL}
                      alt="thumbnail"
                      className="thiswatch-thumbnail"
                    />
                    <p className="thislibrary-duration">
                      {Math.floor(element.videoLength / 60) +
                        ":" +
                        (Math.round(element.videoLength % 60) < 10
                          ? "0" + Math.round(element.videoLength % 60)
                          : Math.round(element.videoLength % 60))}
                    </p>
                    <div className="thislibrary-video-details">
                      <p>
                        {element.Title && element.Title.length <= 46
                          ? element.Title
                          : `${element.Title.slice(0, 46)}..`}
                      </p>
                      <div className="thisvideo-extra-daataa">
                        <div className="thisvide-oneliner-1">
                          <p>{element.uploader}</p>
                          <Tooltip
                            TransitionComponent={Zoom}
                            title="Verified"
                            placement="right"
                          >
                            <CheckCircleIcon
                              fontSize="100px"
                              style={{
                                color: "rgb(138, 138, 138)",
                                marginLeft: "4px",
                              }}
                            />
                          </Tooltip>
                        </div>
                        <div className="thisvide-oneliner-2">
                          <p>
                            {element.views >= 1e9
                              ? `${(element.views / 1e9).toFixed(1)}B`
                              : element.views >= 1e6
                              ? `${(element.views / 1e6).toFixed(1)}M`
                              : element.views >= 1e3
                              ? `${(element.views / 1e3).toFixed(1)}K`
                              : element.views}{" "}
                            views
                          </p>
                          <p className="thisvideo-uploaddate">
                            &#x2022;{" "}
                            {(() => {
                              const timeDifference =
                                new Date() - new Date(element.uploaded_date);
                              const minutes = Math.floor(
                                timeDifference / 60000
                              );
                              const hours = Math.floor(
                                timeDifference / 3600000
                              );
                              const days = Math.floor(
                                timeDifference / 86400000
                              );
                              const weeks = Math.floor(
                                timeDifference / 604800000
                              );
                              const years = Math.floor(
                                timeDifference / 31536000000
                              );

                              if (minutes < 1) {
                                return "just now";
                              } else if (minutes < 60) {
                                return `${minutes} mins ago`;
                              } else if (hours < 24) {
                                return `${hours} hours ago`;
                              } else if (days < 7) {
                                return `${days} days ago`;
                              } else if (weeks < 52) {
                                return `${weeks} weeks ago`;
                              } else {
                                return `${years} years ago`;
                              }
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <hr className="seperate" />
        <div className="playlists-library">
          <div className="topplaylist-section">
            <PlaylistPlayOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
            <p>Playlists</p>
            {PlaylistArray && PlaylistArray.length >= 4 ? (
              <p className="see-all">See all</p>
            ) : (
              ""
            )}
          </div>
          <div className="thischannel-playlists2">
            {PlaylistArray &&
              PlaylistArray.map((element, index) => {
                const backgroundColor =
                  playlistColors[index] || playlistColors[0];

                return (
                  <div className="created-all-playlistss2" key={index}>
                    <img
                      src={element.playlist_videos[0].thumbnail}
                      alt=""
                      className="playlist-thumbnail"
                      onClick={() => {
                        navigate(
                          `/video/${element.playlist_videos[0].videoID}`
                        );
                      }}
                    />
                    <div
                      className="playy-all-btn2"
                      onClick={() => {
                        navigate(
                          `/video/${element.playlist_videos[0].videoID}`
                        );
                      }}
                    >
                      <PlayArrowIcon
                        fontSize="medium"
                        style={{ color: "white" }}
                      />
                      <p>PLAY ALL</p>
                    </div>
                    <div
                      className="playlist-element"
                      style={{ backgroundColor }}
                      onClick={() => {
                        navigate(
                          `/video/${element.playlist_videos[0].videoID}`
                        );
                      }}
                    >
                      <PlaylistPlayIcon
                        fontSize="medium"
                        style={{ color: "white" }}
                      />
                      <p>{element.playlist_videos.length} videos</p>
                    </div>
                    <div className="playlistt-details">
                      <p>{element.playlist_name}</p>
                      <p className="playlist-ownner">
                        {element.playlist_owner}
                      </p>

                      <div
                        className="private-privacyy"
                        style={
                          element.playlist_privacy === "Private"
                            ? { display: "flex" }
                            : { display: "none" }
                        }
                      >
                        <LockOutlinedIcon
                          fontSize="small"
                          style={{ color: "#aaa" }}
                        />
                        <p>Private</p>
                      </div>
                      <p
                        onClick={() => navigate(`/playlist/${element._id}`)}
                        className="view-playlist"
                      >
                        View full playlist
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <hr className="seperate" />

        <div className="likedvideos-library"></div>
      </div>
    </>
  );
}

export default Library;