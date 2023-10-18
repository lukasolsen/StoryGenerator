const MAIN_URI = "http://127.0.0.1:8000/";

const getStories = async () => {
  // get all stories
  const response = await fetch(`${MAIN_URI}stories/`);
  const data = await response.json();
  return data;
};

const generateStory = async (prompt: string) => {
  // generate story
  const response = await fetch(`${MAIN_URI}stories/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });
  const responseData = await response.json();
  return responseData;
};

const deleteStory = async (id: number) => {
  // delete story
  const response = await fetch(`${MAIN_URI}stories/${id}/delete`, {
    method: "POST",
  });
  const responseData = await response.json();
  return responseData;
};

const likeStory = async (id: number) => {
  // like story
  const response = await fetch(`${MAIN_URI}stories/${id}/like`, {
    method: "POST",
  });
  const responseData = await response.json();
  return responseData;
};

export { getStories, generateStory, deleteStory, likeStory };
