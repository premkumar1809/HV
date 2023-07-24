import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import nothing from "../img/nothing.png";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import jwtDecode from "jwt-decode";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import "../Css/likevideos.css";

function Playlists() {
  const { id } = useParams();
  const [menuClicked, setMenuClicked] = useState(() => {
    const menu = localStorage.getItem("menuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const [Email, setEmail] = useState();
  const [playlistsVideos, setPlaylistsVideos] = useState([]);
  const [playlistDetails, setplaylistDetails] = useState();
  const [isEditmode, setIsEditmode] = useState(false);
  const [privacyClicked, setprivacyClicked] = useState(false);
  const [channelID, setChannelID] = useState();
  const [PlaylistName, setPlaylistName] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    if (token) {
      setEmail(jwtDecode(token).email);
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem("menuClicked", JSON.stringify(menuClicked));
  }, [menuClicked]);

  useEffect(() => {
    const getPlaylists = async () => {
      try {
        if (id !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getplaylists/${id}`
          );
          const { playlistVideos, myPlaylists } = await response.json();
          setPlaylistsVideos(playlistVideos);
          setplaylistDetails(myPlaylists);
          setPlaylistName(myPlaylists.playlist_name);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    getPlaylists();
  }, [id]);

  useEffect(() => {
    const handleMenuButtonClick = () => {
      setMenuClicked((prevMenuClicked) => !prevMenuClicked);
    };

    const menuButton = document.querySelector(".menu");
    menuButton.addEventListener("click", handleMenuButtonClick);

    return () => {
      menuButton.removeEventListener("click", handleMenuButtonClick);
    };
  }, []);

  const updateViews = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/updateview/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      await response.json();
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const getChannelID = async () => {
      try {
        if (playlistDetails.owner_email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getchannelid/${playlistDetails.owner_email}`
          );
          const { channelID } = await response.json();
          setChannelID(channelID);
        }
      } catch (error) {
        // console.log("Error fetching user data:", error.message);
      }
    };

    const interval = setInterval(getChannelID, 100);

    return () => clearInterval(interval);
  });

  //POST REQUEST

  const saveEditData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/saveplaylist/${id}`, {
        method: "POST",
        body: JSON.stringify({ playlist_name: PlaylistName }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      await response.json();
    } catch (error) {
      console.log(error.message);
    }
  };

  const DeletePlaylist = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/deleteplaylist/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        alert("Link Copied!");
      })
      .catch((error) => {
        console.log("Error copying link to clipboard:", error);
      });
  };

  const setPrivacy = async (privacy) => {
    try {
      const response = await fetch(
        `http://localhost:3000/saveplaylistprivacy/${id}`,
        {
          method: "POST",
          body: JSON.stringify({ privacy }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
    } catch (error) {
      console.log(error.message);
    }
  };

  if (playlistsVideos === "No Playlists Found") {
    return (
      <>
        <Navbar />
        <LeftPanel />
        <div className="searched-content">
          <img src={nothing} alt="no results" className="nothing-found" />
          <p className="no-results">No videos found!</p>
        </div>
      </>
    );
  }

  if (
    playlistDetails &&
    playlistDetails.owner_email !== Email &&
    playlistsVideos !== "No Playlists Found" &&
    playlistDetails.playlist_privacy === "Private"
  ) {
    return (
      <>
        <Navbar />
        <LeftPanel />
        <div className="searched-content">
          <img src={nothing} alt="no results" className="nothing-found" />
          <p className="no-results">This playlist is private!</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <LeftPanel />
      <div className="liked-video-data">
        {playlistsVideos && playlistsVideos.length > 0 ? (
          <div
            className="like-video-sections"
            style={
              menuClicked === false
                ? { left: "80px", width: "100%" }
                : { left: "255px" }
            }
          >
            <div
              className="like-left-section"
              style={{
                backgroundImage: `url(${playlistsVideos[0]?.thumbnail})`,
              }}
            >
              <div className="page-cover">
                {playlistsVideos && (
                  <div
                    className="firstvideo-thumbnail"
                    onClick={() => {
                      if (token) {
                        updateViews(playlistsVideos[0].videoID);
                        setTimeout(() => {
                          navigate(`/video/${playlistsVideos[0].videoID}`);
                          window.location.reload();
                        }, 400);
                      } else {
                        navigate(`/video/${playlistsVideos[0].videoID}`);
                        window.location.reload();
                      }
                    }}
                  >
                    <img
                      src={playlistsVideos[0].thumbnail}
                      alt="first-like-thumbnail"
                      className="first-thumbnail"
                      loading="lazy"
                    />
                    <p className="sample-play">&#9654; PLAY ALL</p>
                  </div>
                )}
                <div className="last-like-section">
                  <div
                    className="like-div"
                    style={
                      isEditmode === false
                        ? { display: "flex" }
                        : { display: "none" }
                    }
                  >
                    <p className="like-head">
                      {/* {playlistDetails.playlist_name.length <= 15
                          ? playlistDetails.playlist_name
                          : `${playlistDetails.playlist_name.slice(0, 15)}..`} */}
                      {playlistDetails.playlist_name}
                    </p>
                    <Tooltip
                      TransitionComponent={Zoom}
                      title="Edit"
                      placement="bottom"
                    >
                      <EditOutlinedIcon
                        className="edit-name-btn"
                        fontSize="medium"
                        style={
                          playlistDetails.owner_email === Email
                            ? { color: "white" }
                            : { display: "none" }
                        }
                        onClick={() => {
                          if (token) {
                            setIsEditmode(true);
                          }
                        }}
                      />
                    </Tooltip>
                  </div>
                  <div
                    className="like-div"
                    style={
                      isEditmode === true
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    <input
                      type="text"
                      name="playlist-name"
                      className="like-head like-head2"
                      value={PlaylistName}
                      maxLength={50}
                      onChange={(e) => setPlaylistName(e.target.value)}
                    />
                    <div className="two-main-btns">
                      <button
                        className="cancel-edit"
                        onClick={() => setIsEditmode(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="save-edit"
                        onClick={() => {
                          saveEditData();
                          setTimeout(() => {
                            window.location.reload();
                          }, 300);
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  <div
                    className="last-like2"
                    style={
                      isEditmode === true
                        ? { marginTop: "65px" }
                        : { marginTop: "15px" }
                    }
                  >
                    <p
                      className="like-username"
                      onClick={() => navigate(`/channel/${channelID}`)}
                    >
                      {playlistDetails.playlist_owner}
                    </p>

                    <div
                      className="update-privacy"
                      style={
                        playlistDetails && playlistDetails.owner_email === Email
                          ? { display: "block" }
                          : { display: "none" }
                      }
                    >
                      <div
                        className="updateit-one"
                        onClick={() => {
                          if (privacyClicked === false) {
                            setprivacyClicked(true);
                          } else {
                            setprivacyClicked(false);
                          }
                        }}
                      >
                        <p>{playlistDetails.playlist_privacy}</p>
                        <KeyboardArrowDownIcon
                          fontSize="medium"
                          style={
                            playlistDetails.owner_email === Email
                              ? { color: "white" }
                              : { display: "none" }
                          }
                        />
                      </div>
                      <div
                        className="choose-privacy2"
                        style={
                          privacyClicked === true
                            ? { display: "block" }
                            : { display: "none" }
                        }
                      >
                        <div
                          className="first-privacy"
                          onClick={() => {
                            setprivacyClicked(false);
                            setPrivacy("Public");
                            setTimeout(() => {
                              window.location.reload();
                            }, 200);
                          }}
                        >
                          <PublicOutlinedIcon
                            fontSize="medium"
                            style={{ color: "white" }}
                          />
                          <div className="right-privacy">
                            <p>Public</p>
                            <p>Anyone can view</p>
                          </div>
                        </div>
                        <div
                          className="second-privacy"
                          onClick={() => {
                            setprivacyClicked(false);
                            setPrivacy("Private");
                            setTimeout(() => {
                              window.location.reload();
                            }, 200);
                          }}
                        >
                          <LockOutlinedIcon
                            fontSize="medium"
                            style={{ color: "white" }}
                          />
                          <div className="right-privacy">
                            <p>Private</p>
                            <p>Only you can view</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="like-total-videos">
                      {playlistsVideos.length} videos
                    </p>
                  </div>

                  <div className="playlist-btns">
                    <Tooltip
                      TransitionComponent={Zoom}
                      title="Share"
                      placement="bottom"
                    >
                      <ReplyOutlinedIcon
                        className="share-playlist"
                        fontSize="medium"
                        style={{ color: "white" }}
                        onClick={handleCopyLink}
                      />
                    </Tooltip>
                    <Tooltip
                      TransitionComponent={Zoom}
                      title="Delete"
                      placement="bottom"
                    >
                      <DeleteIcon
                        className="delete-playlist"
                        fontSize="medium"
                        style={
                          playlistDetails.owner_email === Email
                            ? { color: "white" }
                            : { display: "none" }
                        }
                        onClick={() => {
                          DeletePlaylist();
                          setTimeout(() => {
                            navigate("/");
                            window.location.reload();
                          }, 300);
                        }}
                      />
                    </Tooltip>
                  </div>
                </div>
                <div
                  className="playvideo-btn"
                  onClick={() => {
                    if (token) {
                      updateViews(playlistsVideos[0].videoID);
                      setTimeout(() => {
                        navigate(`/video/${playlistsVideos[0].videoID}`);
                        window.location.reload();
                      }, 400);
                    } else {
                      navigate(`/video/${playlistsVideos[0].videoID}`);
                      window.location.reload();
                    }
                  }}
                >
                  <PlayArrowIcon fontSize="medium" style={{ color: "black" }} />
                  <p className="play-all">Play all</p>
                </div>
              </div>
            </div>
            <div className="like-right-section">
              {playlistsVideos.length > 0
                ? playlistsVideos.map((element, index) => {
                    return (
                      <div className="liked-all-videos" key={index}>
                        <p style={{ color: "#aaa" }}>{index + 1}</p>
                        <div
                          className="liked-videos-all-data"
                          onClick={() => {
                            if (token) {
                              updateViews(element.videoID);
                              setTimeout(() => {
                                navigate(`/video/${element.videoID}`);
                                window.location.reload();
                              }, 400);
                            } else {
                              navigate(`/video/${element.videoID}`);
                              window.location.reload();
                            }
                          }}
                        >
                          <img
                            src={element.thumbnail}
                            alt="first-like-thumbnail"
                            loading="lazy"
                          />
                          <div className="its-content">
                            <p>{element.title}</p>
                            <p>{element.video_uploader}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </>
  );
}

export default Playlists;
