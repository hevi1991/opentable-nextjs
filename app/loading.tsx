import Header from "./components/Header";

export default function Loading() {
  return (
    <main>
      <Header />
      <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
        {Array(12).map((_, index) => (
          <div
            key={index}
            className="bg-slate-200 animate-pulse w-64 h-72 m-3 rounded overflow-hidden border cursor-pointer"
          ></div>
        ))}
      </div>
    </main>
  );
}
