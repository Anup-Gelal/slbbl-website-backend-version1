import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { SectionWrapper } from "@/hoc";

const ITEMS_PER_PAGE = 6;
const PROVINCE = "Gandaki"; 

const GandakiBranch = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBranchesByProvince();
  }, []);

  const fetchBranchesByProvince = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/branches/${PROVINCE}`);
      setBranches(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Failed to load branches for province");
    } finally {
      setLoading(false);
    }
  };

  const filteredBranches = branches.filter((branch) =>
    branch.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBranches.length / ITEMS_PER_PAGE);

  const next = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const prev = () => {
    if (page > 0) setPage(page - 1);
  };

  const paginatedBranches = filteredBranches.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      {/* Search Bar */}
      <div className="flex gap-2 mb-6 items-center">
        <Input
          placeholder="Search branch..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0); // Reset pagination on new search
          }}
          className="p-3 w-full border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
        />
        <Button variant="outline" className="px-4 py-3">
          <Search size={18} />
        </Button>
      </div>

      {/* Error or Loading */}
      {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}
      {loading && <p className="text-center">Loading branches...</p>}

      {/* Branch Cards */}
      {!loading && paginatedBranches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center items-center">
          {paginatedBranches.map((branch) => (
            <Card
              key={branch.id}
              className="p-4 bg-white shadow-lg rounded-lg border border-gray-200 transition-all hover:shadow-xl hover:scale-105"
            >
              <CardContent>
                <h2 className="text-lg font-bold text-green-700">{branch.name}</h2>
                <p className="text-sm text-green-700">{branch.address}</p>
                <p className="text-sm text-green-700">Manager: {branch.manager}</p>
                <p className="text-sm text-green-700">Contact: {branch.contact}</p>
                <p className="text-sm text-green-700">Email: {branch.email}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        !loading && <p className="text-center text-gray-600">No results found</p>
      )}

      {/* Pagination Buttons */}
      {totalPages > 1 && (
        <div className="flex gap-4 mt-6 justify-center">
          <Button variant="outline" onClick={prev} disabled={page === 0}>
            <ChevronLeft size={24} />
          </Button>
          <span className="text-lg font-medium text-gray-700">
            Page {page + 1} of {totalPages}
          </span>
          <Button variant="outline" onClick={next} disabled={page === totalPages - 1}>
            <ChevronRight size={24} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SectionWrapper(GandakiBranch, "gandakibranch");


{/*
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { gandakiBranches } from "../constants";
import { SectionWrapper } from "@/hoc";

const ITEMS_PER_PAGE = 6; 

const GandakiBranch = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filteredBranches = gandakiBranches.filter((branch) =>
    branch.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBranches.length / ITEMS_PER_PAGE);

  const next = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const prev = () => {
    if (page > 0) setPage(page - 1);
  };

  const paginatedBranches = filteredBranches.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
    
      <div className="flex gap-2 mb-6 items-center">
        <Input
          placeholder="Search branch..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0); // Reset pagination on new search
          }}
          className="p-3 w-full border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
        />
        <Button variant="outline" className="px-4 py-3">
          <Search size={18} />
        </Button>
      </div>

     
      {paginatedBranches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center items-center">
          {paginatedBranches.map((branch, idx) => (
            <Card
              key={idx}
              className="p-4 bg-white shadow-lg rounded-lg border border-gray-200 transition-all hover:shadow-xl hover:scale-105"
            >
              <CardContent>
                <h2 className="text-lg font-bold text-blue-700">{branch.name}</h2>
                <p className="text-sm text-gray-700">{branch.address}</p>
                <p className="text-sm text-gray-700">Manager: {branch.manager}</p>
                <p className="text-sm text-gray-700">Contact: {branch.contact}</p>
                <p className="text-sm text-gray-700">Email: {branch.email}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No results found</p>
      )}

     
      {totalPages > 1 && (
        <div className="flex gap-4 mt-6 justify-center">
          <Button variant="outline" onClick={prev} disabled={page === 0}>
            <ChevronLeft size={24} />
          </Button>
          <span className="text-lg font-medium text-gray-700">
            Page {page + 1} of {totalPages}
          </span>
          <Button variant="outline" onClick={next} disabled={page === totalPages - 1}>
            <ChevronRight size={24} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SectionWrapper(GandakiBranch, "gandakibranch");
*/}