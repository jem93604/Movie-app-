import Search from "./components/Search";
import { useState } from "react";
const App = () => {
  const [searchTerm, setSearchTerm] = useState("I am bat man ");
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="/hero-img.png" alt="Hero-banner" className="Hero" />
          <h1>
            Find <span className="text-gradient">Movies</span> without hassle
          </h1>
        </header>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
    </main>
  );
};

export default App;
