export const updateGenreScore = async (genreDict, username) => {
  axios
    .put(`${apiBaseUrl}/user/${username}/genre`, genreDict)
    .then(() => {
      console.log("update genre score successfully: ", genreDict);
      //console.log(response);
    })
    .catch((err) => {
      console.error("Error update genre score:", err);
    });
};
