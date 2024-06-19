import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabase("preferences.db");

export const setUpDatabase = async () => {
  db.transaction((tx) => {
    // tx.executeSql(
    //   "CREATE TABLE IF NOT EXISTS favMovie (id INTEGER PRIMARY KEY AUTOINCREMENT, favMovieId INTEGER NOT NULL, name TEXT NOT NULL,  posterImageUrl TEXT, releaseDate TEXT)",
    //   [],
    //   () => console.log("favMovie table created successfully"),
    //   (_, error) => console.error("Error creating favMoive table", error)
    // );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS recentMovie (id INTEGER PRIMARY KEY AUTOINCREMENT, movieId INTEGER NOT NULL, name TEXT NOT NULL,  posterImageUrl TEXT, releaseDate TEXT, popularity FLOAT NOT NULL)",
      [],
      () => console.log("recentMovie table created successfully"),
      (_, error) => console.error("Error creating recentMovie table", error)
    );

    // tx.executeSql(
    //   "CREATE TABLE IF NOT EXISTS ratedMovie (id INTEGER PRIMARY KEY AUTOINCREMENT, ratedMovieId INTEGER NOT NULL, name TEXT NOT NULL, posterImageUrl TEXT, releaseDate TEXT, ratedValue REAL NOT NULL)",
    //   [],
    //   () => console.log("ratedMovie table created successfully"),
    //   (_, error) => console.error("Error creating ratedMovie table", error)
    // );

    // tx.executeSql(
    //   "CREATE TABLE IF NOT EXISTS genreScore (id INTEGER PRIMARY KEY AUTOINCREMENT, genreId INTEGER NOT NULL, genreName TEXT NOT NULL, score INTEGER NOT NULL)",
    //   [],
    //   () => {
    //     console.log("genreScore table created successfully");
    //   },
    //   (_, error) => console.error("Error creating genreScore table", error)
    // );
  });
  return true;
};
export const fetchRecentMovie = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM recentMovie ",
        [],
        (_, { rows }) => {
          // Retrieve the settings data
          const recentMovie = rows._array;
          // Resolve the Promise with the settings data
          resolve(recentMovie);
          //console.log("Actors list:", actors);
        },
        (error) => {
          // Reject the Promise with the error
          reject(error);
          console.log("Error fetching recentMovie:", error);
        }
      );
    });
  });
};

export const insertRecentMovie = (
  movieId,
  posterImageUrl,
  name,
  releaseDate,
  popularity
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Check if entry already exists
      tx.executeSql(
        "SELECT * FROM recentMovie WHERE movieId = ?",
        [movieId],
        (_, { rows }) => {
          const count = rows._array.length;
          if (count > 0) {
            // Entry already exists, cancel transaction
            //console.error("Entry already exists in recentMovie");
            reject();
            return;
          }

          // Entry does not exist, execute insert statement
          tx.executeSql(
            "INSERT INTO recentMovie (movieId, posterImageUrl, name, releaseDate, popularity) VALUES (?,?,?,?,?)",
            [movieId, posterImageUrl, name, releaseDate, popularity],
            (_, result) => resolve(result.insertId),
            (_, error) => reject(error)
          );
        },
        (_, error) => reject(error)
      );
    });
  });
};
export const getGenreScore = (genreId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM genreScore WHERE genreId = ?",
        [genreId],
        (_, { rows }) => {
          const score = rows._array;
          if (score.length == 1) {
            resolve(score);
          } else {
            reject(new Error(`No score found for genreId: ${genreId}`));
          }
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};
export const fetchFavMovie = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM favMovie ",
        [],
        (_, { rows }) => {
          // Retrieve the settings data
          const favMovie = rows._array;
          // Resolve the Promise with the settings data
          resolve(favMovie);
          //console.log("Actors list:", actors);
        },
        (error) => {
          // Reject the Promise with the error
          reject(error);
          console.log("Error fetching favMovie:", error);
        }
      );
    });
  });
};

export const updateScore = (genreId, currentScore, value, isAdding) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      if (isAdding) {
        tx.executeSql(
          "UPDATE genreScore SET score = ? WHERE genreId = ?",
          [currentScore + value, genreId],
          (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
              resolve(rowsAffected);
            } else {
              reject(console.error(`No rows updated for genreId: ${genreId}`));
            }
          },
          (_, error) => {
            reject(error);
          }
        );
      } else {
        tx.executeSql(
          "UPDATE genreScore SET score = ? WHERE genreId = ?",
          [currentScore - value, genreId],
          (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
              resolve();
            } else {
              reject(console.error(`No rows updated for genreId: ${genreId}`));
            }
          },
          (_, error) => {
            reject(error);
          }
        );
      }
    });
  });
};

export const insertDefaultGenreData = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO genreScore (genreId, genreName, score) VALUES (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?)",
        [
          28,
          "Action",
          2,
          12,
          "Adventure",
          2,
          16,
          "Animation",
          2,
          35,
          "Comedy",
          2,
          80,
          "Crime",
          2,
          99,
          "Documentary",
          2,
          18,
          "Drama",
          2,
          10751,
          "Family",
          2,
          14,
          "Fantasy",
          2,
          36,
          "History",
          2,
          27,
          "Horror",
          2,
          10402,
          "Music",
          2,
          9648,
          "Mystery",
          2,
          10749,
          "Romance",
          2,
          878,
          "Science Fiction",
          2,
          10770,
          "TV Movie",
          2,
          53,
          "Thriller",
          2,
          37,
          "Western",
          2,
          10752,
          "War",
          2,
        ],
        () => console.log("Default genre data inserted successfully"),
        (_, error) => console.error("Error inserting default genre data", error)
      );
    });
  });
};
// export const checkExistedInFavMovie = (id) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT COUNT(*) FROM favMovie WHERE favMovieId = ?",
//         [id],
//         (_, { rows }) => {
//           resolve(rows.item(0)["count(*)"] > 0);
//         },
//         (_, error) => {
//           reject(error);
//         }
//       );
//     });
//   });
// };

export const checkExistedInFavMovie = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM favMovie WHERE favMovieId = ?",
        [id],
        (_, { rows }) => {
          const list = rows._array;
          resolve(list.length > 0);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

export const fetchGenreScore = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM genreScore",
        [],
        (_, { rows }) => {
          // Retrieve the settings data
          const score = rows._array;
          // Resolve the Promise with the settings data
          resolve(score);
          //console.log("Actors list:", actors);
        },
        (error) => {
          // Reject the Promise with the error
          reject(error);
          console.log("Error fetching genreScore:", error);
        }
      );
    });
  });
};

// export const checkIfAllZeroes = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT * FROM genreScore",
//         [],
//         (_, { rows }) => {
//           // Retrieve the settings data
//           const arr = rows._array;
//           // // Resolve the Promise with the settings data
//           // let isAllZeroes = true;
//           // for (let item of rows._array) {
//           //   if (item.score != 0) {
//           //     isAllZeroes = false;
//           //     break;
//           //   }
//           // }
//           resolve(arr);
//           //console.log("Actors list:", actors);
//         },
//         (error) => {
//           // Reject the Promise with the error
//           reject(error);
//           console.log("Error fetching genreScore:", error);
//         }
//       );
//     });
//   });
// };
export const checkIfAllTwos = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM genreScore where score != 2",
        [],
        (_, { rows }) => {
          // Retrieve the genreScore data
          const genreScoreList = rows._array;
          // Check if all scores are zero
          // Resolve the Promise with the isAllZeroes flag
          resolve(genreScoreList);
        },
        (error) => {
          // Reject the Promise with the error
          reject(error);
          console.log("Error fetching genreScore:", error);
        }
      );
    });
  });
};

export const getGenreScoreTableRows = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM genreScore",
        [],
        (_, { rows }) => {
          // Retrieve the settings data
          const score = rows._array;
          // Resolve the Promise with the settings data
          resolve(score);
          //console.log("Actors list:", actors);
        },
        (error) => {
          // Reject the Promise with the error
          reject(error);
          console.log("Error fetching genreScore:", error);
        }
      );
    });
  });
};

export const checkExistedInRatedMovie = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM ratedMovie WHERE ratedMovieId = ?",
        [id],
        (_, { rows }) => {
          const list = rows._array;
          resolve(list);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

export const deleteRatedMovie = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM ratedMovie WHERE ratedMovieId = ?",
        [id],
        (_, result) => resolve(result.rowsAffected),
        (_, error) => reject(error)
      );
    });
  });
};

export const insertRatedMovie = (
  movieId,
  posterImageUrl,
  name,
  releaseDate,
  value
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Check if entry already exists
      tx.executeSql(
        "SELECT COUNT(*) FROM ratedMovie WHERE ratedMovieId = ?",
        [movieId],
        (_, result) => {
          const count = result.rows.item(0)["COUNT(*)"];
          if (count > 0) {
            // Entry already exists, cancel transaction
            console.error("Entry already exists in ratedMovie");
            reject();
            return;
          }

          // Entry does not exist, execute insert statement
          tx.executeSql(
            "INSERT INTO ratedMovie (ratedMovieId, posterImageUrl, name, releaseDate, ratedValue) VALUES (?,?,?,?,?)",
            [movieId, posterImageUrl, name, releaseDate, value],
            (_, result) => resolve(result.insertId),
            (_, error) => reject(error)
          );
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const fetchRatedMovie = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM ratedMovie ",
        [],
        (_, { rows }) => {
          // Retrieve the settings data
          const ratedMovie = rows._array;
          // Resolve the Promise with the settings data
          resolve(ratedMovie);
          //console.log("Actors list:", actors);
        },
        (error) => {
          // Reject the Promise with the error
          reject(error);
          console.log("Error fetching ratedMovie:", error);
        }
      );
    });
  });
};

export const updateRatedMovie = (movieId, value) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Check if entry exists
      tx.executeSql(
        "UPDATE ratedMovie SET ratedValue = ? WHERE ratedMovieId = ?",
        [value, movieId],
        (_, result) => resolve(result.rowsAffected),
        (_, error) => reject(error)
      );
    });
  });
};

export const deleteFavMovie = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM favMovie WHERE favMovieId = ?",
        [id],
        (_, result) => resolve(result.rowsAffected),
        (_, error) => reject(error)
      );
    });
  });
};

// export const insertFavMovie = (movieId, posterImageUrl, name, releaseDate) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "INSERT INTO favMovie (favMovieId, posterImageUrl, name, releaseDate) VALUES (?,?,?,?)",
//         [movieId, posterImageUrl, name, releaseDate],
//         (_, result) => resolve(result.insertId),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };
export const insertFavMovie = (movieId, posterImageUrl, name, releaseDate) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Check if entry already exists
      tx.executeSql(
        "SELECT COUNT(*) FROM favMovie WHERE favMovieId = ?",
        [movieId],
        (_, result) => {
          const count = result.rows.item(0)["COUNT(*)"];
          if (count > 0) {
            // Entry already exists, cancel transaction
            console.error("Entry already exists in favMovie");
            reject();
            return;
          }

          // Entry does not exist, execute insert statement
          tx.executeSql(
            "INSERT INTO favMovie (favMovieId, posterImageUrl, name, releaseDate) VALUES (?,?,?,?)",
            [movieId, posterImageUrl, name, releaseDate],
            (_, result) => resolve(result.insertId),
            (_, error) => reject(error)
          );
        },
        (_, error) => reject(error)
      );
    });
  });
};

// export const insertRatedMovie = (
//   movieId,
//   posterImageUrl,
//   name,
//   releaseDate,
//   value
// ) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "INSERT INTO ratedMovie (ratedMovieId, posterImageUrl, name, releaseDate, ratedValue) VALUES (?,?,?,?,?)",
//         [movieId, posterImageUrl, name, releaseDate, value],
//         (_, result) => resolve(result.insertId),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };
