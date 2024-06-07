import React, { createContext, useState, useEffect } from "react";
import {
  fetchActor,
  fetchFavMovieGenre,
  fetchFavTvGenre,
  fetchFlaggedMovie,
  fetchFlaggedTv,
} from "./Database";
export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState("");
  const [suggestedMovieList, setSuggestedMovieList] = useState([]);
  const [requestToken, setRequestToken] = useState("");
  const [approved, setApproved] = useState(false);
  const [accountDetail, setAccountDetail] = useState("");
  const [isResultChanged, setIsResultChanged] = useState(false);
  const [favActorList, setFavActorList] = useState([]);
  const [favMovieGenreList, setFavMovieGenreList] = useState([]);
  const [favTvGenreList, setFavTvGenreList] = useState([]);
  const [flaggedMovieList, setFlaggedMovieList] = useState([]);
  const [flaggedTvList, setFlaggedTvList] = useState([]);
  useEffect(() => {
    const fetchActorsFromDatabase = async () => {
      try {
        const actorsListFromDB = await fetchActor();

        setFavActorList(actorsListFromDB);
        console.log("fetched actor: ", actorsListFromDB);
      } catch (error) {
        console.log("Error fetching actors list:", error);
      }
    };
    // const fetchFlaggedTvFromDatabase = async () => {
    //   try {
    //     const flaggedTvListFromDB = await fetchFlaggedTv();

    //     setFlaggedTvList(flaggedTvListFromDB);
    //     console.log("fetched flaggedTv: ", flaggedTvListFromDB);
    //   } catch (error) {
    //     console.log("Error fetching flaggedTvlist:", error);
    //   }
    // };
    const fetchFavMovieGenreFromDatabase = async () => {
      try {
        const movieGenreListFromDB = await fetchFavMovieGenre();

        setFavMovieGenreList(movieGenreListFromDB);
        console.log("fetched favMovieGenre: ", movieGenreListFromDB);
      } catch (error) {
        console.log("Error fetching favMovieGenre list:", error);
      }
    };
    // const fetchFlaggedMovieFromDatabase = async () => {
    //   try {
    //     const flaggedMovieListFromDB = await fetchFlaggedMovie();

    //     setFlaggedMovieList(flaggedMovieListFromDB);
    //     console.log("fetched flaggedMovie: ", flaggedMovieListFromDB);
    //   } catch (error) {
    //     console.log("Error fetching actors list:", error);
    //   }
    // };
    const fetchFavTvGenreFromDatabase = async () => {
      try {
        const tvGenreListFromDB = await fetchFavTvGenre();

        setFavTvGenreList(tvGenreListFromDB);
        console.log("fetched favTvGenre: ", tvGenreListFromDB);
      } catch (error) {
        console.log("Error fetching favTvGenre list:", error);
      }
    };
    // fetchActorsFromDatabase();
    // fetchFavMovieGenreFromDatabase();
    // fetchFavTvGenreFromDatabase();
    // fetchFlaggedMovieFromDatabase();
    // fetchFlaggedTvFromDatabase();
  }, []);
  // useEffect(() => {
  //   "changed";
  // }, [favMovieGenreList, favTvGenreList]);
  return (
    <Context.Provider
      value={{
        sessionId,
        setSessionId,
        requestToken,
        setRequestToken,
        approved,
        setApproved,
        accountDetail,
        setAccountDetail,
        isResultChanged,
        setIsResultChanged,
        flaggedTvList,
        setFlaggedTvList,
        flaggedMovieList,
        setFlaggedMovieList,
        favMovieGenreList,
        setFavMovieGenreList,
        favTvGenreList,
        setFavTvGenreList,
        favActorList,
        setFavActorList,
        suggestedMovieList,
        setSuggestedMovieList,
      }}
    >
      {children}
    </Context.Provider>
  );
};
