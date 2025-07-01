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
    <main className="p-8 flex flex-col gap-8 max-w-3xl">
      <ul>
        {scores.map((score) => (
          <li key={score.id}>
            {score.name}: {score.value}
          </li>
        ))}
      </ul>
    </main>
  );
}
