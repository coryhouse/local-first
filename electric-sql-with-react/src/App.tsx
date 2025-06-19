import { useShape } from "@electric-sql/react";
import type { Score } from "./types/score";

export default function App() {
  const { data: scores } = useShape<Score>({
    url: `http://localhost:3000/v1/shape`,
    params: {
      table: `scores`,
    },
  });

  return (
    <ul>
      {scores.map((score) => (
        <li key={score.id}>
          {score.name}: {score.value}
        </li>
      ))}
    </ul>
  );
}
