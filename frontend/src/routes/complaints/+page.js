// Fetch complaints from Flask backend
export async function load({ fetch }) {
  const res = await fetch('http://localhost:5000/complaints');
  const complaints = await res.json();

  return {
    complaints
  };
}
