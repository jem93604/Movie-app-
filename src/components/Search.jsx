const search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img
          src="https://img.icons8.com/sf-black/128/FFFFFF/search.png"
          alt="search logo but replaced by react log for now "
        />
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default search;
