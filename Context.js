import React, { createContext, useState } from "react";
export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
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
        username,
        setUsername,
      }}
    >
      {children}
    </Context.Provider>
  );
};
