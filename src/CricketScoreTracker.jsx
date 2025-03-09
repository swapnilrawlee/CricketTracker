import { useState } from "react";

function Toss({ onTossComplete }) {
  const [tossWinner, setTossWinner] = useState(null);
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [overs, setOvers] = useState(5);

  const handleToss = () => {
    if (!team1 || !team2) {
      alert("Please enter both team names.");
      return;
    }
    if (team1 === team2) {
      alert("Team names must be different.");
      return;
    }
    const winner = Math.random() < 0.5 ? team1 : team2;
    setTossWinner(winner);
  };

  const handleChoice = (choice) => {
    onTossComplete(tossWinner, choice, team1, team2, overs);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-xl font-bold text-gray-800">Enter Team Names</h2>
      <input
        type="text"
        placeholder="Team 1"
        value={team1}
        onChange={(e) => setTeam1(e.target.value)}
        className="mt-2 p-2 border rounded w-full"
      />
      <input
        type="text"
        placeholder="Team 2"
        value={team2}
        onChange={(e) => setTeam2(e.target.value)}
        className="mt-2 p-2 border rounded w-full"
      />
      <h2 className="text-xl font-bold text-gray-800 mt-4">Select Overs</h2>
      <select
        value={overs}
        onChange={(e) => setOvers(Number(e.target.value))}
        className="mt-2 p-2 border rounded w-full"
      >
        {[1,3,5, 10, 15, 20].map((o) => (
          <option key={o} value={o}>{o} Overs</option>
        ))}
      </select>
      <h2 className="text-xl font-bold text-gray-800 mt-4">Toss Time!</h2>
      {!tossWinner ? (
        <button
          onClick={handleToss}
          className="mt-4 p-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          Flip Coin
        </button>
      ) : (
        <div>
          <p className="mt-4 text-lg font-semibold">{tossWinner} won the toss!</p>
          <p className="text-sm text-gray-600">Choose to bat or bowl:</p>
          <div className="mt-2 flex justify-center gap-4">
            <button
              onClick={() => handleChoice("Batting")}
              className="p-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
            >
              Bat
            </button>
            <button
              onClick={() => handleChoice("Bowling")}
              className="p-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
            >
              Bowl
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Scoreboard({ battingTeam, score, extras, wickets, currentOver, overs, balls }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <p className="text-lg font-semibold text-blue-600">Batting: {battingTeam}</p>
      <p className="text-lg font-semibold text-gray-800">Total Runs: {score} (Extras: {extras})</p>
      <p className="text-lg font-semibold text-red-600">Wickets: {wickets} / 10</p>
      <p className="text-sm text-gray-600">Overs: {currentOver} / {overs}</p>
      <p className="text-sm text-gray-600">Balls: {balls.join(" | ")}</p>
    </div>
  );
}

function BallTracker({ onBallClick }) {
  return (
    <div className="grid grid-cols-4 gap-2 p-4 bg-white rounded-lg shadow-md">
      {[0, 1, 2, 3, 4, 6, "W", "WD", "NB", "LB"].map((run) => (
        <button
          key={run}
          onClick={() => onBallClick(run)}
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          {run}
        </button>
      ))}
    </div>
  );
}

export default function CricketScoreTracker() {
  const [gameStarted, setGameStarted] = useState(false);
  const [battingFirst, setBattingFirst] = useState(null);
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState([]);
  const [overs, setOvers] = useState(5);
  const [currentOver, setCurrentOver] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [extras, setExtras] = useState(0);
  const [secondInnings, setSecondInnings] = useState(false);
  const [team1Score, setTeam1Score] = useState(null);
  const [battingTeam, setBattingTeam] = useState("");

  const startGame = (tossWinner, choice, team1, team2, overs) => {
    setBattingFirst(`${tossWinner} (${choice})`);
    setTeam1(team1);
    setTeam2(team2);
    setOvers(overs);
    setGameStarted(true);
    setBattingTeam(choice === "Batting" ? tossWinner : tossWinner === team1 ? team2 : team1);
  };

  const resetGame = () => {
    setGameStarted(false);
    setBattingFirst(null);
    setTeam1("");
    setTeam2("");
    setScore(0);
    setBalls([]);
    setOvers(5);
    setCurrentOver(0);
    setWickets(0);
    setExtras(0);
    setSecondInnings(false);
    setTeam1Score(null);
    setBattingTeam("");
  };

  const handleBallClick = (run) => {
    setBalls([...balls, run]);
    if (run === "W") setWickets(wickets + 1);
    else if (["WD", "NB", "LB"].includes(run)) setExtras(extras + 1);
    else setScore(score + run);

    // Check if the batting team has won in the second innings
    if (secondInnings && score + (typeof run === "number" ? run : 0) > team1Score) {
      const winningTeam = battingTeam;
      const margin = score + (typeof run === "number" ? run : 0) - team1Score;
      const summary = `${winningTeam} wins by ${margin} runs!`;

      // Open a new tab with the match summary
      const newTab = window.open("", "_blank");
      newTab.document.write(`
        <html>
          <head><title>Match Summary</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h1>Match Summary</h1>
            <p>${summary}</p>
            <p>${team1}: ${team1Score}</p>
            <p>${team2}: ${score + (typeof run === "number" ? run : 0)}</p>
          </body>
        </html>
      `);
      newTab.document.close();

      // Reset the page after 30 seconds
      setTimeout(() => {
        resetGame();
      }, 30000);

      return; // Stop further execution
    }

    // Check if the over is complete
    if (balls.length + 1 === 6) {
      setCurrentOver(currentOver + 1);
      setBalls([]);
    }

    // Check if the innings is over (all overs bowled or all wickets lost)
    if (currentOver >= overs || wickets >= 10) {
      if (!secondInnings) {
        // First innings ends, start second innings
        setTeam1Score(score);
        setScore(0);
        setBalls([]);
        setCurrentOver(0);
        setWickets(0);
        setExtras(0);
        setSecondInnings(true);
        setBattingTeam(battingTeam === team1 ? team2 : team1);
      } else {
        // Second innings ends, determine the winner
        const winningTeam = score > team1Score ? battingTeam : battingTeam === team1 ? team2 : team1;
        const margin = Math.abs(score - team1Score);
        const summary =
          score > team1Score
            ? `${winningTeam} wins by ${margin} runs!`
            : `${winningTeam} wins by ${10 - wickets} wickets!`;

        // Open a new tab with the match summary
        const newTab = window.open("", "_blank");
        newTab.document.write(`
          <html>
            <head><title>Match Summary</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
              <h1>Match Summary</h1>
              <p>${summary}</p>
              <p>${team1}: ${team1Score}</p>
              <p>${team2}: ${score}</p>
            </body>
          </html>
        `);
        newTab.document.close();

        // Reset the page after 30 seconds
        setTimeout(() => {
          resetGame();
        }, 3000);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md flex flex-col gap-4">
      {!gameStarted ? (
        <Toss onTossComplete={startGame} />
      ) : (
        <>
          <h1 className="text-2xl font-bold text-center text-gray-800">{team1} vs {team2}</h1>
          <Scoreboard
            battingTeam={battingTeam}
            score={score}
            extras={extras}
            wickets={wickets}
            currentOver={currentOver}
            overs={overs}
            balls={balls}
          />
          <BallTracker onBallClick={handleBallClick} />
        </>
      )}
    </div>
  );
}