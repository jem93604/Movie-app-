import { Client, Databases, ID, Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const endpoint = "https://cloud.appwrite.io/v1";

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(APPWRITE_PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (SearchTerm, movie) => {
  // Input validation
  if (!SearchTerm || !movie) {
    console.error("Missing required parameters for updateSearchCount");
    return {
      success: false,
      error: "Missing search term or movie data",
    };
  }

  if (!movie.id) {
    console.error("Invalid movie object - missing ID");
    return {
      success: false,
      error: "Invalid movie data",
    };
  }

  try {
    // Construct a valid poster_url if poster_path exists
    let poster_url = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "";
    const results = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", [SearchTerm]),
    ]);

    if (results.documents.length > 0) {
      const doc = results.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
        poster_url: poster_url, // update poster_url on update
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        count: 1,
        searchTerm: SearchTerm,
        movie_id: movie.id,
        poster_url: poster_url, // add poster_url on create
      });
    }

    return { success: true };
  } catch (error) {
    // Detailed error logging
    console.error("Appwrite error:", error);

    // Check for specific error types
    if (error.code === 401 || error.code === 403) {
      console.error("Authentication/authorization error with Appwrite");
      return {
        success: false,
        error: "Authentication failed with database service",
      };
    } else if (error.code === 404) {
      console.error("Resource not found in Appwrite");
      return {
        success: false,
        error: "Database or collection not found",
      };
    } else {
      return {
        success: false,
        error: "Database operation failed",
      };
    }
  }
};

export const getTrendingMovies = async () => {
  try {
    const results = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);
    return results.documents;
  } catch (e) {
    console.log(e);
  }
};
