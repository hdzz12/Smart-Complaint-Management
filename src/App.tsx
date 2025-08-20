import NavBar from "./components/NavBar";

function App() {
  return (
    <div>
      <NavBar />
      <main className="pt-20 text-center">
        <h1 className="text-4xl font-bold">Smart Complaint Management</h1>
        <p className="mt-4 text-gray-600">This is your landing page.</p>
      </main>
    </div>
  );
}

export default App;