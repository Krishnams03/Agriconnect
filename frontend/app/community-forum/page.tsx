// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Leaf, Search } from "lucide-react";
// import Link from "next/link";
// import Footer from "@/components/Footer";
// import { motion } from "framer-motion";
// import axios from "axios";

// // Animation Variants
// const containerVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.6,
//       staggerChildren: 0.1,
//     },
//   },
// };
// type NewDiscussion = {
//   title: string;
//   content: string; // Add the content property
//   category: string;
//   tags: string[];
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0 },
// };

// // Type Definitions
// type Discussion = {
//   title: string;
//   author: string;
//   date: string;
//   category: string;
//   tags: string[];
// };



// export default function CommunityForumPage() {
//   // State Initialization
//   const [discussions, setDiscussions] = useState<Discussion[]>([]); // Provide type explicitly
//   const [newDiscussion, setNewDiscussion] = useState<NewDiscussion>({
//     title: "",
//     content: "", // Initialize content as an empty string
//     category: "",
//     tags: [],
//   });
  
//   const [searchQuery, setSearchQuery] = useState("");

//   // Fetch Discussions on Component Mount
//   useEffect(() => {
//     const fetchDiscussions = async () => {
//       try {
//         const response = await axios.get<Discussion[]>("http://localhost:5000/api/discussions");
//         setDiscussions(response.data); // Correctly assign response data
//       } catch (error) {
//         console.error("Error fetching discussions:", error);
//       }
//     };

//     fetchDiscussions();
//   }, []);

//   // Submit a New Discussion
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault(); // Prevent form reload
    
//     try {
//       // Add new discussion to the backend
//       const response = await axios.post<Discussion>("http://localhost:5000/api/discussions", {
//         title: newDiscussion.title,
//         content: newDiscussion.content, // Ensure content is sent
//         category: newDiscussion.category,
//         tags: newDiscussion.tags,
//         author: "CurrentUser", // Replace with actual user info in production
//         date: new Date().toLocaleString(), // Add the current date
//       });
  
//       // Update the local state with the new discussion
//       setDiscussions([response.data, ...discussions]);
  
//       // Reset the form state
//       setNewDiscussion({ title: "", content: "", category: "", tags: [] });
//     } catch (error) {
//       console.error("Error posting discussion:", error);
//     }
//   };
  

//   // Filter Discussions by Search Query
//   const handleSearch = () => {
//     return discussions.filter((discussion) =>
//       discussion.title.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-green-50">
//       {/* Navbar */}
//       <header className="bg-green-800 text-white">
//         <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
//           <Link href="/" className="text-2xl font-bold flex items-center">
//             <Leaf className="mr-2" />
//             AgriConnect
//           </Link>
//           <div className="space-x-4 hidden md:flex">
//             <Link href="/" className="hover:text-green-300">
//               Home
//             </Link>
//             <Link href="/community" className="hover:text-green-300">
//               Community
//             </Link>
//           </div>
//         </nav>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-12 flex-grow">
//         <motion.div variants={containerVariants} initial="hidden" animate="visible">
//           <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-8 text-green-800 text-center">
//             Community Forum
//           </motion.h1>

//           {/* Search Bar */}
//           <motion.div variants={itemVariants}>
//             <div className="mb-8 flex justify-center">
//               <div className="relative w-full max-w-md">
//                 <Input
//                   type="text"
//                   placeholder="Search discussions..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pr-10"
//                 />
//                 <Button className="absolute right-2 top-2 bg-green-600 hover:bg-green-700">
//                   <Search className="text-white" />
//                 </Button>
//               </div>
//             </div>
//           </motion.div>

//           <div className="grid gap-6 md:grid-cols-2">
//             {/* Recent Discussions */}
//             <motion.div variants={itemVariants}>
//               <Card className="shadow-lg">
//                 <CardHeader>
//                   <CardTitle className="text-2xl text-green-800">Recent Discussions</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <ul className="space-y-4">
//                     {handleSearch().map((discussion, index) => (
//                       <li key={index} className="border-b pb-4 last:border-b-0">
//                         <h3 className="text-lg font-medium text-green-700">{discussion.title}</h3>
//                         <p className="text-sm text-gray-600">
//                           Started by {discussion.author}, {discussion.date}
//                         </p>
//                         <div className="flex space-x-2 text-sm text-gray-500">
//                           <span className="bg-green-200 px-2 py-1 rounded-full">{discussion.category}</span>
//                           {discussion.tags.map((tag, idx) => (
//                             <span key={idx} className="bg-gray-200 px-2 py-1 rounded-full">{tag}</span>
//                           ))}
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             {/* Start a New Discussion */}
//             <motion.div variants={itemVariants}>
//               <Card className="shadow-lg">
//                 <CardHeader>
//                   <CardTitle className="text-2xl text-green-800">Start a New Discussion</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     <Input
//                       placeholder="Discussion Title"
//                       value={newDiscussion.title}
//                       onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
//                       required
//                     />
//                     <Textarea
//                       placeholder="What's on your mind?"
//                       rows={4}
//                       value={newDiscussion.content || ""}
//                       onChange={(e) =>
//                         setNewDiscussion({ ...newDiscussion, content: e.target.value })
//                       }
//                       required
//                     />
//                     <Input
//                       placeholder="Category (e.g., Organic Farming)"
//                       value={newDiscussion.category}
//                       onChange={(e) => setNewDiscussion({ ...newDiscussion, category: e.target.value })}
//                       required
//                     />
//                     <div className="flex space-x-2">
//                       <Input
//                         placeholder="Tag (e.g., soil health)"
//                         value={newDiscussion.tags[0] || ""}
//                         onChange={(e) =>
//                           setNewDiscussion({ ...newDiscussion, tags: [e.target.value] })
//                         }
//                       />
//                       <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
//                         Post Discussion
//                       </Button>
//                     </div>
//                   </form>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </div>
//         </motion.div>
//       </main>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// }






"use client";

import React, { useState } from "react";
import { Discussion } from "@/types/Discussion";
import Link from "next/link";
import { Leaf, Info, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

// DiscussionList Component
interface DiscussionListProps {
  discussions?: Discussion[];
}

const DiscussionList: React.FC<DiscussionListProps> = ({ discussions = [] }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold mb-6 text-center text-green-800">Recent Discussions</h2>
      {discussions.length === 0 ? (
        <p className="text-center text-gray-500">No discussions yet</p>
      ) : (
        discussions.map((discussion) => (
          <div
            key={discussion._id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold text-gray-800">{discussion.title}</h3>
              <span className="text-sm text-gray-500">{discussion.category}</span>
            </div>
            <p className="text-gray-700 mb-4 line-clamp-3">{discussion.content}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>By {discussion.author}</span>
              <span>
                {discussion.createdAt
                  ? new Date(discussion.createdAt).toLocaleDateString()
                  : "Date unavailable"}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// DiscussionForm Component
interface DiscussionFormProps {
  onSubmit: (discussion: Omit<Discussion, "_id" | "createdAt">) => void;
}

const DiscussionForm: React.FC<DiscussionFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General Agriculture");
  const [author, setAuthor] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, category, author });

    // Reset form fields
    setTitle("");
    setContent("");
    setAuthor("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Start a New Discussion</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Author</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        >
          <option>General Agriculture</option>
          <option>Crop Management</option>
          <option>Soil Health</option>
          <option>Plant Diseases</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Discussion Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
          className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
      >
        Post Discussion
      </button>
    </form>
  );
};

// Page Component
const Page: React.FC = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile menu toggle

  const addDiscussion = (newDiscussion: Omit<Discussion, "_id" | "createdAt">) => {
    const discussionWithId: Discussion = {
      _id: Math.random().toString(36).substr(2, 9), // Generate a random ID
      createdAt: new Date().toISOString(),
      ...newDiscussion,
    };

    setDiscussions((prev) => [discussionWithId, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-green-100">
      {/* Navbar */}
      <header className="bg-green-800 text-white sticky top-0 z-10 shadow-lg">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center max-w-7xl">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <Leaf className="mr-2" />
            AgriConnect
          </Link>
          <div className="space-x-8 hidden md:flex">
            <Link href="/" className="hover:text-green-300">
              Home
            </Link>
          </div>
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-green-800 text-white shadow-lg absolute top-16 left-0 right-0 p-4"
          >
            <div className="flex flex-col space-y-4">
              <Link href="/" className="hover:text-green-300">
                Home
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-7xl space-y-8">
        <DiscussionForm onSubmit={addDiscussion} />
        <DiscussionList discussions={discussions} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Page;
