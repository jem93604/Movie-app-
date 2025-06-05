const MovieCard = ({
  movie: { title, vote_average, poster_path, original_language, release_date },
}) => {
  return (
    <div className="movie-card">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500${poster_path}`
            : "/no-movie.png"
        }
      />

      <div className="mt-4">
        <h2 className="text-white">{title}</h2>
        <div className="content">
          <div className="rating">
            <img
              width="48"
              height="48"
              src="https://img.icons8.com/emoji/48/star-emoji.png"
              alt="star-emoji"
            />
            <p>{vote_average}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
