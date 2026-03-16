import type { Dispatch, SetStateAction } from "react";

interface LoginParams {
  userId: string;
  region: string;
  setUserId: Dispatch<SetStateAction<string>>;
  setRegion: Dispatch<SetStateAction<string>>;
  handleSubmit: () => void;
}

export default function Login({
  userId, region, setUserId, setRegion, handleSubmit,
}: LoginParams) {
  return <section id="center">
    <div>
      <h2>Get started</h2>
      <p>Enter your moderator details below.</p>
    </div>

    <div className="input-grid">
      <label className="input-field" htmlFor="user_id">
        <span>user_id</span>
        <input
          id="user_id"
          type="text"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          placeholder="Enter moderator ID"
        />
      </label>

      <label className="input-field" htmlFor="region">
        <span>region</span>
        <input
          id="region"
          type="text"
          value={region}
          onChange={(event) => setRegion(event.target.value)}
          placeholder="Enter region"
        />
      </label>
    </div>

    <button
      className="counter"
      onClick={handleSubmit}
    >
      Submit
    </button>
  </section>;
}