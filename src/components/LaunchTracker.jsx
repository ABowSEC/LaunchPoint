import { useEffect, useState } from "react";

function LaunchTracker() {
  const [launches, setLaunches] = useState([]);

  useEffect(() => {
    fetch("https://ll.thespacedevs.com/2.2.0/launch/upcoming/")
      .then(res => res.json())
      .then(data => {
        setLaunches(data.results.slice(0, 5)); // Get top 5 upcoming launches
      });
  }, []);

  return (
    <div>
      <h2>Upcoming Launches</h2>
      <ul>
        {launches.map((launch) => (
          <li key={launch.id}>
            <strong>{launch.name}</strong> – {new Date(launch.window_start).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LaunchTracker;
