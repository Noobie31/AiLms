import React, { useEffect, useState } from 'react';
import Card from "../components/Card.jsx";
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import ai from '../assets/SearchAi.png'
import { useSelector } from 'react-redux';
import { HiSearch, HiX, HiFilter } from 'react-icons/hi';

const CATEGORIES = [
  'App Development', 'AI/ML', 'AI Tools', 'Data Science',
  'Data Analytics', 'Ethical Hacking', 'UI UX Designing', 'Web Development', 'Others'
];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

function AllCourses() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [filterCourses, setFilterCourses] = useState([]);
  const { courseData } = useSelector(state => state.course);

  const toggleCategory = (val) => {
    setCategories(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]);
  };

  const toggleLevel = (val) => {
    setLevels(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]);
  };

  const applyFilter = () => {
    let result = [...courseData];
    if (categories.length > 0) result = result.filter(c => categories.includes(c.category));
    if (levels.length > 0) result = result.filter(c => levels.includes(c.level));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'price-asc') result.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === 'price-desc') result.sort((a, b) => (b.price || 0) - (a.price || 0));
    setFilterCourses(result);
  };

  const clearFilters = () => {
    setCategories([]);
    setLevels([]);
    setSearchQuery('');
    setSortBy('default');
  };

  useEffect(() => { setFilterCourses(courseData); }, [courseData]);
  useEffect(() => { applyFilter(); }, [categories, levels, searchQuery, sortBy, courseData]);

  const activeFilterCount = categories.length + levels.length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Nav />

      {/* Mobile overlay */}
      {isSidebarVisible && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsSidebarVisible(false)} />
      )}

      {/* Sidebar */}
      <aside className={`w-72 min-h-screen bg-white fixed top-0 left-0 border-r border-gray-200 z-30 transition-transform duration-300 flex flex-col
        ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>

        <div className="p-6 border-b border-gray-200 mt-[70px]">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-black text-lg text-black">Filters</h2>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-black flex items-center gap-1 transition-colors">
                <HiX size={12} /> Clear all
              </button>
            )}
          </div>
          {activeFilterCount > 0 && (
            <p className="text-xs text-black font-medium">{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active</p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-7">
          {/* AI Search */}
          <button
            onClick={() => navigate("/searchwithai")}
            className="w-full flex items-center gap-3 bg-black text-white rounded-xl py-3 px-4 font-bold text-sm hover:bg-gray-800 transition-colors"
          >
            <img src={ai} className="w-5 h-5 rounded-full" alt="" />
            Search with AI
          </button>

          {/* Category */}
          <div>
            <h3 className="font-black text-sm text-black mb-3 uppercase tracking-wider">Category</h3>
            <div className="space-y-2">
              {CATEGORIES.map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${categories.includes(cat) ? 'bg-black border-black' : 'border-gray-300 group-hover:border-gray-500'}`}>
                    {categories.includes(cat) && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                  </div>
                  <input type="checkbox" className="hidden" value={cat} checked={categories.includes(cat)} onChange={() => toggleCategory(cat)} />
                  <span className={`text-sm transition-colors ${categories.includes(cat) ? 'text-black font-semibold' : 'text-gray-600 group-hover:text-black'}`}>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Level */}
          <div>
            <h3 className="font-black text-sm text-black mb-3 uppercase tracking-wider">Level</h3>
            <div className="space-y-2">
              {LEVELS.map(level => (
                <label key={level} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${levels.includes(level) ? 'bg-black border-black' : 'border-gray-300 group-hover:border-gray-500'}`}>
                    {levels.includes(level) && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                  </div>
                  <input type="checkbox" className="hidden" value={level} checked={levels.includes(level)} onChange={() => toggleLevel(level)} />
                  <span className={`text-sm transition-colors ${levels.includes(level) ? 'text-black font-semibold' : 'text-gray-600 group-hover:text-black'}`}>{level}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="w-full md:pl-72 pt-[70px] min-h-screen">
        <div className="p-6">
          {/* Top bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-black">All Courses</h1>
              <p className="text-sm text-gray-500 mt-1">{filterCourses.length} courses found</p>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors bg-white"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                    <HiX size={16} />
                  </button>
                )}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black bg-white font-medium"
              >
                <option value="default">Sort by</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setIsSidebarVisible(p => !p)}
                className="md:hidden flex items-center gap-2 bg-black text-white rounded-xl px-4 py-2.5 text-sm font-bold"
              >
                <HiFilter size={16} />
                {activeFilterCount > 0 && <span className="bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-black">{activeFilterCount}</span>}
              </button>
            </div>
          </div>

          {/* Active filter tags */}
          {(categories.length > 0 || levels.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-5">
              {[...categories, ...levels].map(tag => (
                <span key={tag} className="flex items-center gap-1.5 bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  {tag}
                  <button onClick={() => {
                    if (categories.includes(tag)) toggleCategory(tag);
                    else toggleLevel(tag);
                  }} className="hover:text-gray-300"><HiX size={12} /></button>
                </span>
              ))}
            </div>
          )}

          {/* Course Grid */}
          {filterCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-black text-black mb-2">No courses found</h3>
              <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search query</p>
              <button onClick={clearFilters} className="bg-black text-white rounded-xl px-6 py-3 font-bold text-sm hover:bg-gray-800 transition-colors">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filterCourses.map((item, index) => (
                <Card key={item._id || index} thumbnail={item.thumbnail} title={item.title} price={item.price} category={item.category} id={item._id} reviews={item.reviews} level={item.level} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AllCourses;