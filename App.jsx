import { useState } from "react"; 
import { Groq } from "groq-sdk";
import './App.css';

export const GROQ_API = import.meta.env.VITE_GROQ;

const groq = new Groq({
  apiKey: GROQ_API,
  dangerouslyAllowBrowser: true,  // Pertimbangkan untuk menghindari ini di produksi
});

const requestToGroqAI = async (content) => {
  try {
    const reply = await groq.chat.completions.create({
      messages: [{ role: "user", content }],
      model: "llama3-8b-8192",
    });
    return reply.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching from Groq API:", error);
    return "Ada kesalahan, coba lagi nanti.";
  }
};

function App() {
  const [data, setData] = useState("");
  const [content, setContent] = useState("");  // For controlled input
  const [isLoading, setIsLoading] = useState(false);  // State untuk loading
  const [error, setError] = useState(null);  // State untuk error

  const handleSubmit = async (event) => {
    event.preventDefault();  // Prevent form submission
    setIsLoading(true);  // Aktifkan loading
    setError(null);  // Reset error

    try {
      const aiResponse = await requestToGroqAI(content);
      setData(aiResponse);
    } catch (err) {
      setError("Terjadi kesalahan, coba lagi nanti.");
    } finally {
      setIsLoading(false);  // Nonaktifkan loading
    }
  };

  return (
    <main className="flex flex-col min-h-[80vh] justify-center items-center">
      <h1 className="text-4xl text-indigo-500">REACT | ABUDI AI</h1>
      
      <form className="flex flex-col gap-4 py-4" onSubmit={handleSubmit}>
        <input
          placeholder="Ketik permintaan di sini"
          className="py-2 px-4 text-md rounded-md"
          value={content}
          onChange={(e) => setContent(e.target.value)} // Controlled input
          type="text"
        />
        <button
          type="submit"
          className="bg-indigo-500 py-2 px-4 font-bold text-white rounded-md"
          disabled={isLoading} // Disable button saat loading
        >
          {isLoading ? "Loading..." : "Kirim"}
        </button>
      </form>

      {/* Tampilkan error jika ada */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Tampilkan data hasil dari API dengan syntax highlighting */}
      {data && (
        <div className="text-white">{data}</div>
        
      )}
    </main>
  );
}

export default App;
