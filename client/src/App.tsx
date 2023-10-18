import { useEffect, useState } from "react";
import {
  generateStory,
  getStories,
  deleteStory,
  likeStory,
} from "./service/api";
import { FaHeart, FaTrash } from "react-icons/fa"; // Import the icons you need

type Story = {
  id: number;
  content: string;
  likes: number;
};

function App() {
  const [stories, setStories] = useState<Story[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getStories()
      .then((data) => {
        setStories(data ?? []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const clickGenerate = () => {
    if (prompt.trim() === "") {
      return; // Don't generate if the prompt is empty
    }
    setLoading(true);
    generateStory(prompt)
      .then((data) => {
        setStories([...stories, data]);
        setPrompt(""); // Clear the input field
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (storyId: number) => {
    setLoading(true);
    deleteStory(storyId)
      .then(() => {
        setStories(stories.filter((story) => story.id !== storyId));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLike = (storyId: number) => {
    setLoading(true);
    likeStory(storyId)
      .then((data) => {
        console.log(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-r from-blue-400 to-purple-400 text-gray-800 dark:bg-slate-900 dark:text-white">
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Story Generator</h2>
        <p className="text-gray-400 text-sm mb-4">
          Generate your stories with ease.
        </p>

        <div className="flex space-x-4">
          <input
            placeholder="Hello World, how are you?"
            name="Prompt"
            className={`w-full rounded-md p-2 bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-white ${
              loading ? "animate-pulse" : ""
            }`}
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
          <button
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md ${
              loading ? "animate-pulse cursor-not-allowed" : ""
            }`}
            onClick={clickGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {loading && (
          <div className="text-center mt-4">
            <div className="spinner border-t-4 h-10 w-10 mx-auto"></div>
          </div>
        )}

        {stories.map((story) => (
          <div
            key={story.id}
            className="bg-white rounded-md p-4 mt-4 shadow-md dark:bg-slate-800"
          >
            <p>{story.content}</p>
            <div className="mt-2 flex items-center space-x-4">
              <button
                onClick={() => handleDelete(story.id)}
                className="text-red-600 hover:text-red-700 cursor-pointer"
              >
                <FaTrash size={20} />
              </button>
              {/* Add an edit button and its functionality here */}
              <button
                onClick={() => handleLike(story.id)}
                className={`${
                  story.likes < 0
                    ? "text-blue-600 hover:text-blue-700"
                    : "text-yellow-400 hover:text-yellow-500"
                } cursor-pointer`}
              >
                <FaHeart size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
