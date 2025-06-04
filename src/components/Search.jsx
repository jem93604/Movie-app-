const search = ({ searchTerm, setSearchTerm }) => {
  setSearchTerm("wow");
  return (
    <div className="text-white">
      Search <p>{searchTerm}</p>
    </div>
  );
};

export default search;
